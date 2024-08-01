// index.js
import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import axios from "axios";
import multer from 'multer';

import { Thread, Post, Like } from "./classes.js";
import { genres } from "./settings.js";
import { validateTitleAndContent } from "./validation.js";
import { AppError } from "./classes.js";
import {createTables, pool} from './pgTables.js'
import { addPost, addThreadToDB, deleteThread, editPost, editThreadById, getAllThreads, getPostsByThreadId, getThreadById, getUserAuthFromDB } from "./apiCalls.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;
const ProxyUrl = "http://localhost:8081";

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Ensure tables are created on server start
async function initializeDatabase() {
  try {
      await createTables();
      console.log("Database setup complete");
  } catch (err) {
      console.error("Error setting up database:", err);
  }
}

initializeDatabase();

// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "someKeY",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());


// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error(`[ERROR] ${statusCode} - ${message} - ${err.stack}`);
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
  });
};

//_____________________________________________________

// Google OAuth routes
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "consent",
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:8081/login",
  }),
  (req, res) => {
    res.redirect("http://localhost:8081");
  }
);

app.get("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      res.redirect("/");
    } else {
      req.session.destroy(() => {
        res.redirect("/auth/google");
      });
    }
  });
});


app.post("/add_like", async (req, res, next) => {
  if (req.isAuthenticated()) {
    try {
      const { threadId, action } = req.body;

      // Determine whether we're dealing with a thread
      const id = threadId;
      const type = "thread";

      // Fetch the appropriate data based on type
      const response = await axios.get("http://localhost:8085/threads");
      const threads = response.data;
      let likedThread = threads.find(
        (thread) => thread.thread_id === parseInt(id)
      );

      // If the item is not found, return an error
      if (!likedThread) {
        return res
          .status(404)
          .send(`${type.charAt(0).toUpperCase() + type.slice(1)} not found`);
      }

      // Check if the user has already liked/disliked the item
      const existingLike = likedThread.likes.find(
        (like) => like.userId === req.user.id
      );

      if (!existingLike) {
        // Add the like/dislike
        let newLike = new Like(
          req.user.id,
          likedThread.thread_id,
          null,
          action
        );
        let resp = await axios.post("http://localhost:8085/add_like", newLike);
        console.log(resp.data);
      } else {
        // User has already liked/disliked the thread
        if (existingLike.type === action) {
          // Remove the like/dislike if user clicks the same action again
          let resp = await axios.post(
            "http://localhost:8085/remove_like",
            existingLike
          );
          console.log(resp.data);
        } else {
          // User switches from like to dislike or vice versa
          // First, remove the existing like/dislike
          let respRemove = await axios.post(
            "http://localhost:8085/remove_like",
            existingLike
          );
          console.log(respRemove.data);

          // Then, add the new like/dislike
          let newLike = new Like(
            req.user.id,
            likedThread.thread_id,
            null,
            action
          );
          let respAdd = await axios.post(
            "http://localhost:8085/add_like",
            newLike
          );
          console.log(respAdd.data);
        }
      }

      res.redirect("/");
    } catch (err) {
      next(err);
    }
  } else {
    res.redirect("/auth/google");
  }
});

app.post("/delete_post/:id", async (req, res) => {
  if (req.isAuthenticated()) {
    const postId = req.params.id;
    try {
      const response = await axios.delete(`http://localhost:8085/delete_post/${postId}`);
      res.status(response.status).redirect(`/thread/${req.body.threadId}`);
    } catch (err) {
      next(err);
    }
  } else {
    res.redirect("/auth/google");
  }
});

app.post("/edit_post", async (req, res, next) => {
  if (req.isAuthenticated()) {
    try {
      console.log(".....edit post..\n", req.body);
      const user = req.user;

      // Send the Axios POST request to the API server
      const response = await editPost(req.body.postId, req.body.content );
      // Log the API server's response
      console.log("API server response:", response);

      // Send the API server's response back to the client
      // res.status(response.status).json(response.data);
      res.status(response.status).redirect(`/thread/${req.body.threadId}`);
    } catch (err) {
      next(err);
    }
  } else {
    res.redirect("/auth/google");
  }
});

app.get("/edit_thread/:id", async (req, res, next) => {
  if (req.isAuthenticated()) {
    try {
      const id = parseInt(req.params.id);
      const thread = await getThreadById(id);
      const user = req.user;
      res.status(200).render("editThread.ejs", { thread, user, genres });
    } catch (err) {
      next(err);
    }
  } else {
    res.redirect("/auth/google");
  }
});

app.post("/edit_thread/:id", async (req, res, next) => {
  if (req.isAuthenticated()) {
    const id = parseInt(req.params.id);
    const { title, content } = req.body;
    const genres = Array.isArray(req.body.genres)
      ? req.body.genres
      : [req.body.genres];

    try {
      // Construct the updated thread object
      const updatedThread = {
        title,
        content,
        genres,
      };

      // Send an Axios request to the API to replace the thread
      const response = await editThreadById(id, updatedThread);
      console.log(response);
      // Redirect to the thread page or send a success response
      res.redirect(`/thread/${id}`);
    } catch (err) {
      next(err); // Pass the error to the error handler middleware
    }
  } else {
    res.redirect("/auth/google");
  }
});

app.post("/delete_thread/:id", async (req, res, next) => {
  if (req.isAuthenticated()) {
    const threadId = parseInt(req.params.id);

    try {
      // Send a delete request to the API
      await deleteThread(threadId);

      // Redirect to the main page or send a success response
      res.redirect("/");
    } catch (err) {
      next(err); // Pass the error to the error handler middleware
    }
  } else {
    res.redirect("/auth/google");
  }
});

app.post("/add_post", async (req, res, next) => {
  if (req.isAuthenticated()) {
    try {
      const { threadId, content } = req.body;
      const newPost = {
        threadId: parseInt(threadId),
        authorId: req.user.id,
        authorEmail: req.user.email,
        content,
        created: new Date(),
      };
      let response = await addPost(newPost);
      console.log(response);
      res.redirect(`/thread/${threadId}`);
    } catch (err) {
      next(err);
    }
  } else {
    res.redirect("/auth/google");
  }
});

// Handler to add a new thread
app.post("/add_thread", async (req, res, next) => {
  if (req.isAuthenticated()) {
    try {
      let { title, genres, content } = req.body;

      validateTitleAndContent(title, content);

      // Check if genre is not an array
      if (!Array.isArray(genres)) {
        // If it's not, make it an array
        genres = [genres];
      }
      const authorEmail = req.user.email;
      let apiResp = await getUserAuthFromDB(authorEmail);
      const author = parseInt(apiResp.id);

      // Create a new Thread object
      const newThread = {
        title,
        genres,
        author,
        created: new Date(),
        content,
      };
      // Add the new thread to the database via Axios request
      const response = await addThreadToDB(newThread);

      // Check if the request was successful
      if (response.title) {
        // Send a response back to the client
        res.redirect(`/`);
      } else {
        throw new Error("Failed to add the thread to the database");
      }
    } catch (err) {
      next(err); // Pass the error to the error handler middleware
    }
  } else {
    res.redirect("/auth/google");
  }
});

app.get("/thread/:id", async (req, res, next) => {
  if (req.isAuthenticated()) {
    const id = parseInt(req.params.id);

    // Logging the Raw ID: First, log the raw value of req.params.id to understand its initial state.
    // Attempt to Parse: Use JSON.parse() to parse otherId. If it’s already a plain string number, parsing will fail, and it will be used as is.
    // Check and Convert to Number: After parsing, check if otherId is a number using parseInt(). If it’s not a number, handle the error.
    // Proceed with Valid ID: Once you have a valid number, proceed with your intended logic.

    if (isNaN(id)) {
      console.error("Invalid thread ID:", req.params.id);
      return next(new AppError("Invalid thread ID", 400));
    }

    try {
      const thread = await getThreadById(id);
      const postsFromThread = await getPostsByThreadId(id);
      if (thread) {
        res.status(200).render("thread.ejs", {
          thread,
          postsFromThread,
          user: req.user,
          genres,
        });
      } else {
        console.error(`Thread with ID ${id} not found.`);
        next(new AppError("Thread not found", 404)); // Pass the error to the error handler middleware
      }
    } catch (err) {
      console.error(`Error fetching thread with ID ${id}:`, err.message);

      // Differentiate between different types of errors
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        console.error("Response headers:", err.response.headers);
        next(
          new AppError(
            `Error fetching thread: ${err.response.statusText}`,
            err.response.status
          )
        );
      } else if (err.request) {
        console.error("Request data:", err.request);
        next(new AppError("No response received from the server", 500));
      } else {
        console.error("Error message:", err.message);
        next(new AppError("Error setting up request", 500));
      }
    }
  } else {
    res.redirect("/auth/google");
  }
});

app.get("/", async (req, res, next) => {
  try {
    const threads = await getAllThreads();
    if (req.isAuthenticated()) {
      res.status(200).render("index.ejs", { threads, user: req.user, genres });
    } else {
      res.redirect("/auth/google");
    }
  } catch (err) {
    // console.error("error", err.message);
    // res.status(500).send("Server error");
    next(err);
  }
});

// _______________ GOOGLE STRATEGY _________________
passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8081/auth/google/callback",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        let apiResp = await axios.post("http://localhost:8085/get_user_auth", {
          email: profile.emails[0].value,
        });
        if (!apiResp.data.email) {
          const newUser = await axios.post(`http://localhost:8085/reg_user`, {
            user_name: profile.name.givenName,
            email: profile.emails[0].value,
            ava: profile.photos[0].value,
          });
          cb(null, newUser.data);
        } else {
          //IF user already exist
          cb(null, apiResp.data);
        }
      } catch (err) {
        console.error("Error during fetching user: ", err.message);
        cb(new AppError("Error during fetching user", 500));
      }
    }
  )
);

// passport.serializeUser: is a function provided by Passport that determines which data of the user object should be stored in the session.
// Once you've determined what data to store, you call the callback cb with null (to indicate that there's no error) and the data you want to store.
passport.serializeUser((user, cb) => {
  cb(null, user);
});

// passport.deserializeUser: is a function provided by Passport that retrieves the data stored in the session and converts it into a user object.
// Once you've retrieved the user object, you call the callback cb with null (to indicate that there's no error) and the user object.
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

// Use the error handling middleware
// Place the error handler middleware registration after all your route handlers and other middleware, but before the app.listen call. This ensures that any errors occurring during request handling will be caught and handled by this middleware.
app.use(errorHandler);

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server is running on port ${PORT}`);
});
