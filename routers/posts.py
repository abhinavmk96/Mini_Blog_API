from fastapi import APIRouter, Depends, HTTPException, Query
from models import User, Comment, Post, Like
from security import get_current_user
from schemas import UpdatePost, UploadPost, CreateComment
from database import get_db
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

router = APIRouter()


# * Posts
@router.post("/posts")
def create_post(
    post_in: UploadPost, db=Depends(get_db), user=Depends(get_current_user)
):
    post = Post(title=post_in.title, content=post_in.content, author_id=user.id)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.put("/posts")
def update_post(
    post_in: UpdatePost, db=Depends(get_db), user=Depends(get_current_user)
):
    post = db.query(Post).filter(Post.id == post_in.post_id).first()
    if not post:
        raise HTTPException(404, "post not found")
    if post.author_id != user.id:
        raise HTTPException(403, "not authorized ")
    update_data = post_in.model_dump(
        exclude_unset=True
    )  
    update_data.pop("id", None)

    for key, value in update_data.items():
        setattr(post, key, value)

    db.commit()
    db.refresh(post)
    return post


@router.delete("/posts/{post_id}")
def delete_post(post_id: int, db=Depends(get_db), user=Depends(get_current_user)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(404, "post not found")
    if post.author_id != user.id:
        raise HTTPException(403, "Unauthorized action")
    db.delete(post)
    db.commit()
    return {"message": "Post deleted successfully"}


@router.get("/posts/{post_id}")
def get_post_id(post_id: int, db=Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(404, "post not found")
    return post


@router.get("/posts")
def get_all_posts(
    page: int = Query(1, ge=1), size: int = Query(20, ge=1, le=100), db=Depends(get_db)
):
    offset = (page - 1) * size
    posts = db.query(Post).offset(offset).limit(size).all()
    return {"page": page, "size": size, "items": posts}


# * Comments
@router.post("/posts/{post_id}/comments")
def create_comment(
    post_id: int,
    comment_in: CreateComment,
    db=Depends(get_db),
    user=Depends(get_current_user),
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(404, "post not found")
    comment = Comment(comment=comment_in.comment, post_id=post_id, user_id=user.id)
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment


@router.delete("/posts/comments/{comment_id}")
def delete_comment(comment_id: int, db=Depends(get_db), user=Depends(get_current_user)):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(404, "comment not found")

    if comment.user_id != user.id:
        raise HTTPException(403, "unauthorized action")
    db.delete(comment)
    db.commit()
    return {"message": "comment deleted successfully"}


@router.get("/posts/{post_id}/comments")
def get_comments(post_id: int, db=Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(404, "post not found")
    return post.comments




# *Likes
@router.post("/posts/{post_id}/Likes")
def Like_post(post_id: int, db=Depends(get_db), user=Depends(get_current_user)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(404, "post not found")

    like = Like(post_id=post_id, user_id=user.id)
    db.add(like)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "already liked")

    return {"message": "post liked"}


@router.delete("/posts/{post_id}/Likes")
def remove_like(post_id: int, db=Depends(get_db), user=Depends(get_current_user)):
    like = (
        db.query(Like).filter(Like.post_id == post_id, Like.user_id == user.id).first()
    )
    if not like:
        raise HTTPException(404, "like not found")

    db.delete(like)
    db.commit()
    return {"message": "like removed"}



