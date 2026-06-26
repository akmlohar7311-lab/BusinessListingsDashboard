from sqlalchemy.orm import Session
from sqlalchemy import func
from models import ListingMaster


def get_businesses(db: Session):
    return db.query(ListingMaster).all()


def get_city_count(db: Session):
    result = (
        db.query(
            ListingMaster.city,
            func.count(ListingMaster.id)
        )
        .group_by(ListingMaster.city)
        .all()
    )

    return [
        {"city": city, "count": count}
        for city, count in result
    ]


def get_category_count(db: Session):
    result = (
        db.query(
            ListingMaster.category,
            func.count(ListingMaster.id)
        )
        .group_by(ListingMaster.category)
        .all()
    )

    return [
        {"category": category, "count": count}
        for category, count in result
    ]


def get_source_count(db: Session):
    result = (
        db.query(
            ListingMaster.source,
            func.count(ListingMaster.id)
        )
        .group_by(ListingMaster.source)
        .all()
    )

    return [
        {"source": source, "count": count}
        for source, count in result
    ]