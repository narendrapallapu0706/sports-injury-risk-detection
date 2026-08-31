# Sports Injury Risk Detection Platform

## 1. Project Overview

The Sports Injury Risk Detection Platform is an AI-powered application designed to analyze athlete movement data and identify biomechanical patterns that may be associated with an increased risk of sports injuries.

The system is being developed as a full-stack application consisting of:

- Frontend
- FastAPI backend
- PostgreSQL database
- Machine learning pipeline
- Video processing and pose estimation
- Dockerized application environment

The final system will allow an athlete or coach to upload a movement video and receive an injury-risk assessment based on extracted biomechanical features.

---

## 2. Project Goal

The main goal of the project is to build a system that can:

1. Accept athlete movement videos.
2. Store and manage uploaded videos securely.
3. Process athlete movement data.
4. Extract relevant biomechanical features.
5. Use a machine learning model to analyze movement patterns.
6. Predict the potential level of injury risk.
7. Store analysis results.
8. Present the results through a user-friendly frontend.

---

## 3. Current System

The backend foundation has currently been implemented using:

- Python
- FastAPI
- PostgreSQL
- SQLAlchemy
- Alembic
- JWT authentication

The current backend supports:

- User registration
- User login
- JWT-based authentication
- Health check
- Protected API endpoints
- Athlete video upload
- Video metadata storage
- Listing videos belonging to the authenticated user
- Retrieving a specific video belonging to the authenticated user

---

## 4. Current Backend Workflow

```text
Client
  |
  v
FastAPI Backend
  |
  +---- Authentication
  |       |
  |       +---- User Registration
  |       |
  |       +---- User Login
  |       |
  |       +---- JWT Token
  |
  +---- Video Management
          |
          +---- Upload Video
          |
          +---- Store Video File
          |
          +---- Store Video Metadata
          |
          +---- List User Videos
          |
          +---- Retrieve Video
                    |
                    v
              PostgreSQL