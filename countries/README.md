# Country Quiz Web Application

This web application is a quiz game where users can test their knowledge about countries and flags. It includes both frontend and backend components.

## Features

- Allows users to choose between two types of quizzes: Countries and Flags.
- Provides a score counter to keep track of user performance.
- Renders questions dynamically and handles user submissions.
- Utilizes a PostgreSQL database to store flag data.

## Setup

1. Clone this repository to your local machine.
2. Ensure you have Node.js and npm installed.
3. Install dependencies using `npm install`.
4. Ensure PostgreSQL is installed and running.
5. Run the backend server using `npm start`.

## Usage

1. Visit `http://localhost:8080` in your web browser.
2. Select the desired quiz type: Countries or Flags.
3. Answer the questions presented and submit your answers.
4. View your score and continue playing.

## Technologies Used

- Express.js: Backend server framework
- EJS: Templating engine for frontend
- PostgreSQL: Database management system
- Axios: HTTP client for making requests
- Body-parser: Middleware for parsing request bodies

## Database Structure

The application assumes the existence of two tables in the PostgreSQL database:

### Capitals Table

| Column   | Type    | Description     |
|----------|---------|-----------------|
| id       | integer | Unique ID       |
| country  | text    | Country Name    |
| capital  | text    | Capital Name    |

### Flags Table

| Column   | Type    | Description     |
|----------|---------|-----------------|
| id       | integer | Unique ID       |
| name     | text    | Country Name    |
| flag     | text    | Country Flag    |

## Dependencies

- **Express**: Web application framework for Node.js.
- **pg**: PostgreSQL client for Node.js.


## License

This project is licensed under the [MIT License](LICENSE).
