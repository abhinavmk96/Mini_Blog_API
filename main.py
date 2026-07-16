from fastapi import FastAPI
from routers.auth import router as auth_routers
from routers.posts import router as posts_routers
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(auth_routers)
app.include_router(posts_routers)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/")
def welcome():
    return {"message": "welcome to the main"}
