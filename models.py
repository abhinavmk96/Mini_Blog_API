from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy import (
    Column,
    Float,
    Integer,
    ForeignKey,
    String,
    DateTime,
    Boolean,
    UniqueConstraint,
)
from datetime import datetime

Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    password_hash = Column(String)
    comments = relationship("Comment", back_populates="user")
    posts = relationship("Post", back_populates="author")
    likes = relationship("Like", back_populates="user")

    created_at = Column(DateTime, default=datetime.utcnow)


class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True)
    title = Column(String)
    content = Column(String)
    author_id = Column(Integer, ForeignKey("users.id"))
    author = relationship("User", back_populates="posts")
    comments = relationship("Comment", back_populates="post")
    likes = relationship("Like", back_populates="post")
    created_at = Column(DateTime, default=datetime.utcnow)


class Comment(Base):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True)
    comment = Column(String)
    post_id = Column(Integer, ForeignKey("posts.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="comments")
    post = relationship("Post", back_populates="comments")
    created_at = Column(DateTime, default=datetime.utcnow)


class Like(Base):
    __tablename__ = "likes"
    id = Column(Integer, primary_key=True)
    post_id = Column(Integer, ForeignKey("posts.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    post = relationship("Post", back_populates="likes")
    user = relationship("User", back_populates="likes")
 
    __table_args__ = (UniqueConstraint("user_id", "post_id"),)
