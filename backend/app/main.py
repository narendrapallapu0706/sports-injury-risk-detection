from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def home():
    return {"message": "Sports Injury Risk Detection API is running"}