from pydantic import BaseModel
from typing import List, Optional
from fastapi_users import schemas
from datetime import datetime
import uuid


class ItemBase(BaseModel):
    pass


class ItemCreate(ItemBase):
    pass


class Item(ItemBase):
    id: uuid.UUID
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

