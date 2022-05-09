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

    class Config:
        orm_mode = True


class ItemWithOwners(Item):
    owners: Optional[List['UserRead']] = []


class UserRead(schemas.BaseUser[uuid.UUID]):

    class Config:
        orm_mode = True


class UserWithItems(UserRead):
    items: Optional[List['Item']] = []


class UserCreate(schemas.BaseUserCreate):
    pass


class UserUpdate(schemas.BaseUserUpdate):
    pass


UserWithItems.update_forward_refs()
ItemWithOwners.update_forward_refs()
