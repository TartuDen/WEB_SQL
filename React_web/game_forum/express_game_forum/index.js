// index.js
import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import multer from "multer";
import axios from "axios";

// Importing custom modules
import { Thread, Post, Like, AppError } from "./classes.js";
import { genres } from "./settings.js";
import { validateTitleAndContent } from "./validation.js";
import { createTables, pool } from "./pgTables.js";
import {
  addLIke,
  addPost,
  addThreadToDB,
  deletePost,
  deleteThread,
  editPost,
  editThreadById,
  getAllThreads,
  getPostsByThreadId,
  getThreadById,
  getUser,
  getUserAuthFromDB,
  regUser,
  removeLike,
} from "./apiCalls.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;

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

// Session middleware configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "someKeY",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 }, // 1-hour session duration
  })
);

// Initialize Passport.js for authentication
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth 2.0 strategy for authentication
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
        let apiResp = await getUser(profile.emails[0].value);
        if (!apiResp.email) {
          const newUser = await regUser({
            user_name: profile.name.givenName,
            email: profile.emails[0].value,
            ava: profile.photos[0].value,
          });
          cb(null, newUser.data);
        } else {
          cb(null, apiResp); // User already exists
        }
      } catch (err) {
        console.error("Error during fetching user: ", err.message);
        cb(new AppError("Error during fetching user", 500));
      }
    }
  )
);

// Session management
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

// Error handling middleware
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
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect("/");
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

// Routes for managing threads, posts, and likes
app.post("/add_like", async (req, res, next) => {
  if (req.isAuthenticated()) {
    try {
      const { threadId, action } = req.body;
      const id = threadId;
      const type = "thread";

      const threads = await getAllThreads();
      let likedThread = threads.find(
        (thread) => thread.thread_id === parseInt(id)
      );

      if (!likedThread) {
        return res
          .status(404)
          .send(`${type.charAt(0).toUpperCase() + type.slice(1)} not found`);
      }

      const existingLike = likedThread.likes.find(
        (like) => like.userId === req.user.id
      );

      if (!existingLike) {
        let newLike = new Like(
          req.user.id,
          likedThread.thread_id,
          null,
          action
        );
        let resp = await addLIke(newLike);
        console.log(resp);
      } else {
        if (existingLike.type === action) {
          let resp = await removeLike(existingLike);
          console.log(resp);
        } else {
          let respRemove = await removeLike(existingLike);
          console.log(respRemove);

          let newLike = new Like(
            req.user.id,
            likedThread.thread_id,
            null,
            action
          );
          let respAdd = await addLIke(newLike);
          console.log(respAdd);
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

app.post("/delete_post/:id", async (req, res, next) => {
  if (req.isAuthenticated()) {
    const postId = req.params.id;
    try {
      const response = await deletePost(postId);
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
      const response = await editPost(req.body.postId, req.body.content);
      console.log("API server response:", response);
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
      res.status(200).render("editThread.ejs", {
        thread,
        user: req.user,
        genres,
      });
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
      const updatedThread = { title, content, genres };
      const response = await editThreadById(id, updatedThread);
      console.log(response);
      res.redirect(`/thread/${id}`);
    } catch (err) {
      next(err);
    }
  } else {
    res.redirect("/auth/google");
  }
});

app.post("/delete_thread/:id", async (req, res, next) => {
  if (req.isAuthenticated()) {
    const threadId = parseInt(req.params.id);
    try {
      await deleteThread(threadId);
      res.redirect("/");
    } catch (err) {
      next(err);
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

      if (!Array.isArray(genres)) {
        genres = [genres];
      }

      const authorEmail = req.user.email;
      let apiResp = await getUserAuthFromDB(authorEmail);
      const author = parseInt(apiResp.id);

      const newThread = {
        title,
        genres,
        author,
        created: new Date(),
        content,
      };

      const response = await addThreadToDB(newThread);

      if (response.title) {
        res.redirect(`/`);
      } else {
        throw new Error("Failed to add the thread to the database");
      }
    } catch (err) {
      next(err);
    }
  } else {
    res.redirect("/auth/google");
  }
});

app.get("/thread/:id", async (req, res, next) => {
  if (req.isAuthenticated()) {
    const id = parseInt(req.params.id);
    if (!isNaN(id)) {
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
          next(new AppError("Thread not found", 404));
        }
      } catch (err) {
        console.error(`Error fetching thread with ID ${id}:`, err.message);
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
    next(err);
  }
});

// Register the error handler middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server is running on port ${PORT}`);
});
