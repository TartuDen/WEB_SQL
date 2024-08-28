# My Web App

## Overview
This web application allows users to create, view, edit, and delete discussion threads and posts. The application also supports Google OAuth for user authentication and manages user sessions with Passport.js.

## Features
- **User Authentication:** Secure login with Google OAuth 2.0.
- **Thread Management:** Users can create, edit, and delete threads on various topics.
- **Post Management:** Users can add, edit, and delete posts within threads.
- **Likes System:** Users can like or dislike threads, with state persistence.

## Setup

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL

### Installation
1. Clone the repository:
   git clone https://github.com/yourusername/yourrepository.git
   cd yourrepository
2. Install dependencies:
    npm install
3. Set up environment variables: Create a .env file in the root directory with the following variables:
    PORT=8081
    SESSION_SECRET=your-session-secret
    GOOGLE_CLIENT_ID=your-google-client-id
    GOOGLE_CLIENT_SECRET=your-google-client-secret
    DATABASE_URL=your-database-url
4. Initialize the database:
    npm run init-db
5. Start the server:
    npm start
### Usage
    Visit http://localhost:8081 in your browser.
    Log in with your Google account to access the full functionality of the app.
    Create, view, edit, and delete threads and posts.
### Contributing
    Feel free to open issues and submit pull requests to improve the app!
### License
    MIT