# API Documentation

## 1. Overview

The backend provides REST APIs using FastAPI.

The API currently supports:

- Health checking
- User registration
- User login
- JWT authentication
- Video upload
- Video listing
- Individual video retrieval

The interactive API documentation is available through FastAPI Swagger UI.

---

## 2. Base URL

During local development:

```text
http://127.0.0.1:8000   

Swagger UI:
http://127.0.0.1:8000/docs

Authorization: Bearer <access_token>

POST /auth/register

{
  "username": "narendra",
  "email": "narendra@example.com",
  "password": "your-password"
}

POST /auth/login

{
  "username": "narendra",
  "password": "your-password"
}

{
  "access_token": "<JWT_TOKEN>",
  "token_type": "bearer"
}

GET /health/

{
  "status": "healthy"
}

POST /videos/upload
.mp4
.avi
.mov
.mkv

file = athletes_sample_video.mp4

201
{
  "message": "Video uploaded successfully",
  "video_id": 1,
  "filename": "athletes_sample_video.mp4",
  "status": "uploaded"
}

GET /videos/
200
[
  {
    "id": 1,
    "original_filename": "athletes_sample_video.mp4",
    "stored_filename": "89818b8b-6e70-4a79-a24f-3879e5c97fae.mp4",
    "file_path": "uploads\\videos\\89818b8b-6e70-4a79-a24f-3879e5c97fae.mp4",
    "status": "uploaded",
    "created_at": "2026-08-18T17:39:25.040496"
  }
]

GET /videos/{video_id}
GET /videos/1
video_id
AND
current_user.id
200
{
  "id": 1,
  "original_filename": "athletes_sample_video.mp4",
  "stored_filename": "89818b8b-6e70-4a79-a24f-3879e5c97fae.mp4",
  "file_path": "uploads\\videos\\89818b8b-6e70-4a79-a24f-3879e5c97fae.mp4",
  "status": "uploaded",
  "created_at": "2026-08-18T17:39:25.040496"
}
401 Unauthorized
403
400
404
{
  "detail": "Video not found"
}

API Security Flow
Client
  |
  v
Login
  |
  v
JWT Access Token
  |
  v
Authorization Header
  |
  v
FastAPI
  |
  v
JWT Validation
  |
  v
Current User
  |
  v
Protected Resource
Current API Status
Endpoint	Method	Auth	Status
/health/	GET	No	Implemented
/auth/register	POST	No	Implemented
/auth/login	POST	No	Implemented
/videos/upload	POST	Yes	Implemented
/videos/	GET	Yes	Implemented
/videos/{video_id}	GET	Yes	Implemented

 Planned APIs

Additional APIs will be added as the project develops.

Potential future endpoints include:

POST /analysis/{video_id}
GET  /analysis/{video_id}
GET  /predictions/{video_id}

