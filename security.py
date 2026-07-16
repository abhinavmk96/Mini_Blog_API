from pwdlib import PasswordHash
from jose import jwt, JWTError
from fastapi import Depends, HTTPException
from database import get_db
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer
from models import User
from config import (
    SECRET_KEY,
    ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINS,
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
password_hasher = PasswordHash.recommended()


def hash_password(password: str):
    return password_hasher.hash(password)


def verify_password(plain_password, hashed_password):
    return password_hasher.verify(plain_password, hashed_password)


def create_access_token(user_id: int):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINS)
    payload = {"sub": str(user_id), "exp": expire}
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token


def get_current_user(token=Depends(oauth2_scheme), db=Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(401, "invalid authentication credentials")
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(401, "invalid authentication credentials")
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(401, "invalid authentication credentials")
    return user
