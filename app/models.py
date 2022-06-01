from pydantic import BaseModel
from typing import List, Optional
from fastapi_users import schemas
import uuid


class ItemBase(BaseModel):
    title: str


class ItemCreate(ItemBase):
    pass


class Item(ItemBase):
    id: int
    time_created:  Optional[datetime]
    time_updated: Optional[datetime]

    class Config:
        orm_mode = True


class ItemOwned(Item):
    owners: Optional[List['UserRead']] = []


class ItemAvailable(Item):
    accessible_to: Optional[List['UserRead']] = []


class UserRead(schemas.BaseUser[uuid.UUID]):

    class Config:
        orm_mode = True


class UserWithItems(UserRead):
    items_owned: Optional[List['Item']] = []
    items_available: Optional[List['Item']] = []


class UserCreate(schemas.BaseUserCreate):
    pass


class UserUpdate(schemas.BaseUserUpdate):
    pass


UserWithItems.update_forward_refs()
ItemOwned.update_forward_refs()
ItemAvailable.update_forward_refs()

