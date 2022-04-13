# FastAPI + React boilerplate

This is a, fairly opinionated, minimal boilerplate of FastAPI backend, React frontend and SQLAlchemy setup organized within docker-compose for convenient local development and deployment. Think https://github.com/tiangolo/full-stack-fastapi-postgresql with **way** less bells and whistles.

#### Why?

I wanted to have a setup that I'll fully understand and that will be flexible, and no project out there was doing just the things I wanted. It does things I've found myself doing repetitively and as little of everything else as possible. Maybe it happens to do the things you want.

### Features rundown

Aside from already mentioned tools it comes with:

* **FastAPI-users + basic 'Items' objects.** It's everything you find in https://github.com/fastapi-users/fastapi-users and a simple many-to-many relationship on top to get started.
* **React ProtectedRoutes setup.** Simple starting point to manage user access to pages.
* **Traefik + Let's Encrypt.** Non-obtrusive for development (see Usage) and fully functional for production under your domain.

## Usage

Setup your (Postgres) database and adjust .env/.env.dev parts that describe databse connection. You may keep your data in /data, but be sure to add the folder to gitignore. You probably want to take a look at .env and .env.dev files in general, but that's the minimum.

Following instruction assumes Compose V2, but you *should* be able to run in 1.3+ with little to no changes to the repo itself.

**For development**  `docker compose --env-file .env.dev up` should start your project. In order to avoid rebuilding everything after every change point your IDE to frontend and app containers.

**For production**  Edit .env to attach your domain. You may want to uncomment `#- "--certificatesresolvers.myresolver.acme.email={EMAIL}@${DOMAIN}.com"
` in docker-compose.yml and edit EMAIL var for Let's Encrypt notifications.`docker compose --env-file .env up` should start your project.

## That's all

The project is intentionally miminal. It does however welcome contributions, especially from less frontend challenged developers, extra especially from those with any aesthetic sense, as both capabilities are severely missing in original creator.
