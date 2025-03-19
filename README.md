## Running the Application

## Approach
For this take-home my approach centered around creating a workable, clean solution for interacting with a chat bot over a web api. I had a bit more time, and therefore decided to support the creation of multiple threads with messsages attatched to each thread. This gives the user a bit more organization and is a real-world implementation. I tried to organize the code in a way that is scalable and structurally sound. 

## Required Software

1. Python
2. Node.js
3. Docker and Docker Compose
4. [Poetry](https://python-poetry.org/docs/#installation)
5. Postgres libpq header files (e.g. `apt install libpq-dev` on Ubuntu, `brew install postgresql` on macOS)

### First-Time Setup

1. `cd` into `backend` and run `poetry install`.
2. `cd` into `frontend` and run `npm install`.

### Running the Application

1. From the root directory, run `docker compose up`.
2. In a separate terminal, `cd` into `backend` and run `poetry run uvicorn main:app --reload`.
3. In a separate terminal, `cd` into `frontend` and run `npm run dev`.
