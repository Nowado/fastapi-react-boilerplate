from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from ..database import  ItemTable, UserTable,  get_async_session
from .users import current_user
from ..models import ItemCreate, Item, User, ItemWithOwners
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
import copy

router = APIRouter()


@router.post("/users/items/", response_model=Item)
async def create_item_for_user(
    item: ItemCreate, db: Session = Depends(get_async_session), user: User = Depends(current_user)
):
    current_usertable = await db.execute(select(UserTable).filter(UserTable.id == user.id))
    current_usertable = current_usertable.scalars().first()
    db_item = ItemTable(**item.dict())
    db.add(db_item)
    current_usertable.items.append(db_item)
    db.add(current_usertable)
    await db.commit()
    return db_item


@router.get("/items/", response_model=List[ItemWithOwners])
async def read_items(db: Session = Depends(get_async_session)):
    response = await db.execute(select(ItemTable))
    return response.scalars().all()

