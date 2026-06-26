from pydantic import BaseModel
from datetime import datetime


class Business(BaseModel):
    id: int
    business_name: str
    category: str
    city: str
    address: str
    phone: str | None = None
    source: str
    created_at: datetime

    class Config:
        from_attributes = True