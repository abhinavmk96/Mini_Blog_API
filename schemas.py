from pydantic import BaseModel


class UserCreate(BaseModel):
    username: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str




class UploadPost(BaseModel):
    title: str
    content: str


class UpdatePost(BaseModel):
    post_id: int
    title: str | None = None
    content: str | None = None


class CreateComment(BaseModel):
    comment: str
