from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import SessionLocal
from crud import (
    get_businesses,
    get_city_count,
    get_category_count,
    get_source_count,
)

app = FastAPI(title="Business Listings Dashboard API")

# Enable CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def home():
    return {"message": "Business Listings Dashboard API is Running!"}


# Get all businesses
@app.get("/businesses")
def businesses(db: Session = Depends(get_db)):
    return get_businesses(db)


# City-wise business count
@app.get("/city-count")
def city_count(db: Session = Depends(get_db)):
    return get_city_count(db)


# Category-wise business count
@app.get("/category-count")
def category_count(db: Session = Depends(get_db)):
    return get_category_count(db)


# Source-wise business count
@app.get("/source-count")
def source_count(db: Session = Depends(get_db)):
    return get_source_count(db)