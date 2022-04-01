from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import SessionLocal, create_db_and_tables
from .routers import users, items
import os

# http vs https based on TLS setting
if os.environ['ENABLE_TLS'] == 'true':
    FRONT_DOMAIN = 'https://'+os.environ['DOMAIN']
else:
    FRONT_DOMAIN = 'http://'+os.environ['DOMAIN']


app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


origins = [
    FRONT_DOMAIN,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(items.router)


@app.on_event("startup")
async def on_startup():
    # Not needed if you setup a migration system like Alembic
    await create_db_and_tables()


@app.get("/")
async def root():
    return {"message": "Hello Bigger Applications!"}