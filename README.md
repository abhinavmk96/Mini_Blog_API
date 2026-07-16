# Mini Blog API

A RESTful Blog API built using **FastAPI**, **PostgreSQL**, and **SQLAlchemy**.

The project implements user authentication using **OAuth2 + JWT**, allowing authenticated users to create blog posts, comment on posts, and like or unlike posts. A minimal frontend is included to demonstrate and interact with the API.

---

## Features

- User Registration
- User Login
- OAuth2 + JWT Authentication
- Create, Read, Update and Delete Blog Posts
- Comment on Posts
- Delete Comments
- Like and Unlike Posts
- PostgreSQL Database
- SQLAlchemy ORM Relationships
- Password Hashing with bcrypt
- Interactive Swagger API Documentation
- Minimal frontend for testing the API

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Python | Programming Language |
| FastAPI | Backend Framework |
| PostgreSQL | Relational Database |
| SQLAlchemy | ORM |
| Pydantic | Request & Response Validation |
| OAuth2 + JWT | Authentication |
| Passlib (bcrypt) | Password Hashing |
| Uvicorn | ASGI Server |

---

## Project Structure

```text
mini-blog-api/
│
├── mini_blog/
│   ├── blog-frontend/
│   │
│   ├── routers/
│   │   ├── auth.py
│   │   └── tasks.py
│   │
│   ├── config.py
│   ├── crud.py
│   ├── database.py
│   ├── dependencies.py
│   ├── hashing.py
│   ├── main.py
│   ├── models.py
│   ├── oauth2.py
│   ├── schemas.py
│   └── ...
│
├── screenshots/
│   ├── swagger-overview.png
│   ├── create-post.png
│   └── frontend-login.png
│
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/signup` | Register a new user |
| POST | `/login` | Login and receive JWT token |

### Posts

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/posts` | Get all posts |
| GET | `/posts/{post_id}` | Get a specific post |
| POST | `/posts` | Create a post |
| PUT | `/posts` | Update a post |
| DELETE | `/posts/{post_id}` | Delete a post |

### Comments

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/posts/{post_id}/comments` | Create a comment |
| GET | `/posts/{post_id}/comments` | View comments |
| DELETE | `/posts/comments/{comment_id}` | Delete a comment |

### Likes

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/posts/{post_id}/likes` | Like a post |
| DELETE | `/posts/{post_id}/likes` | Remove a like |

---

## Installation

Clone the repository

```bash
git clone https://github.com/<your-username>/mini-blog-api.git
cd mini-blog-api
```

Create a virtual environment

```bash
python -m venv venv
```

Activate it

**Windows**

```bash
venv\Scripts\activate
```

**Linux/macOS**

```bash
source venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

---

## Environment Variables

Create a `.env` file in the project root.

```env
DATABASE_URL=postgresql://username:password@localhost:5432/blog_db
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## Running the Project

Start the FastAPI server

```bash
uvicorn mini_blog.main:app --reload
```

Open Swagger Documentation

```
http://127.0.0.1:8000/docs
```

Open ReDoc

```
http://127.0.0.1:8000/redoc
```

---

## Screenshots

### Swagger API Overview

![Swagger Overview](screenshots/swagger-overview.png)

---

### Create Post Endpoint

![Create Post](screenshots/create-post.png)

---

### Frontend Login

![Frontend](screenshots/frontend-login.png)

---

## Future Improvements

- Pagination
- Search posts
- Image uploads
- User profiles
- Refresh Tokens
- Unit Tests
- Docker Support
- CI/CD Pipeline

---

## What I Learned

This project helped me gain practical experience with:

- REST API design
- FastAPI routing
- Dependency Injection
- SQLAlchemy ORM
- Database Relationships
- JWT Authentication
- Password Hashing
- PostgreSQL Integration
- Environment Variable Management
- API Documentation with Swagger

---

## License

This project is licensed under the MIT License.