# Manage Task TypeScript

This is a task management application built with TypeScript, Express, and MongoDB.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [License](#license)

## Demo
Link https://manage-task-ui.vercel.app/

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/Thach45/manage-task-typescript.git
    cd manage-task-typescript
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:
    ```env
    PORT=3000
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.hgcnpf3.mongodb.net/manage-task
    ```

4. Build the project:
    ```sh
    npm run build
    ```

## Usage

1. Start the development server:
    ```sh
    npm run dev
    ```

2. The server will be running at `http://localhost:3000`.

3. URl deploy https://manage-task-six.vercel.app/

## API Endpoints

### User

- **Register User**
    - `POST /api/v1/user/register`
    - Request Body:
        ```json
        {
            "username": "string",
            "password": "string",
            "email": "string"
        }
        ```

### Task

- **Get All Tasks**
    - `GET /api/v1/tasks`

- **Get Task Detail**
    - `GET /api/v1/tasks/detail/:id`

- **Create Task**
    - `POST /api/v1/tasks/create`
    - Request Body:
        ```json
        {
            "title": "string",
            "status": "string",
            "content": "string",
            "timeStart": "Date",
            "timeEnd": "Date"
        }
        ```

- **Edit Task**
    - `PATCH /api/v1/tasks/edit/:id`
    - Request Body:
        ```json
        {
            "title": "string",
            "status": "string",
            "content": "string",
            "timeStart": "Date",
            "timeEnd": "Date"
        }
        ```

- **Delete Task**
    - `DELETE /api/v1/tasks/delete/:id`

## Environment Variables

- `PORT`: The port number on which the server will run.
- `MONGODB_URI`: The MongoDB connection string.

## Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the project.
- `npm run ts.check`: TypeScript type checking.
- `npm run add-build`: Add the build files to git.

## License

This project is licensed under the ISC License.
