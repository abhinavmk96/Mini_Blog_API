from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from schemas import UserCreate, UserLogin
from models import User
from security import hash_password, verify_password, create_access_token
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()


@router.post("/register")
def register_user(user_in: UserCreate, db=Depends(get_db)):
    user = db.query(User).filter(User.username == user_in.username).first()
    if user is not None:
        raise HTTPException(409, "username already exists")
    password_hash = hash_password(user_in.password)
    user = User(username=user_in.username, password_hash=password_hash)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "user registered successfully"}


@router.post("/login")
def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db=Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()

    if user is None:
        raise HTTPException(401, "Invalid login credentials")

    if not verify_password(form_data.password, user.password_hash):
        raise HTTPException(401, "Invalid login credentials")

    token = create_access_token(user.id)

    return {"access_token": token, "token_type": "bearer"}
