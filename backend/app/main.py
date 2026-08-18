from fastapi import FastAPI

from app.routes.auth import router as auth_router
from app.routes.health import router as health_router
from app.routes.users import router as users_router


app = FastAPI(
    title="Sports Injury Risk Detection API",
    version="1.0.0",
)


@app.get("/")
def home():
    return {
        "message": "Sports Injury Risk Detection API is running"
    }


app.include_router(users_router)
app.include_router(auth_router)
app.include_router(health_router)