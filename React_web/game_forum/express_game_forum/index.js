// index.js
import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import axios from "axios";

import { fetchThreads, fetchPostsByThreadID } from "./apiMOCK.js";
import { Thread, Post, Like } from "./classes.js";
import { genres } from "./settings.js";
import { validateTitleAndContent } from "./validation.js";
import { AppError } from "./classes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;
const ProxyUrl = "http://localhost:8081";
const ExpressApiServer = "http://localhost:8082";
let threads = await fetchThreads();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

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

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

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
    prompt: "consent", //for development keep this line, to ask user to log in
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: `${ProxyUrl}/login` }),
  (req, res) => {
    // Successful authentication, redirect to home
    res.redirect(`${ProxyUrl}`);
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

// Handler to add a like
app.post("/add_like", async (req, res, next) => {
  try {
    const { email, threadId, postId } = req.body;

    // Determine whether we're dealing with a thread or a post
    const id = threadId || postId;
    const type = threadId ? "thread" : "post";

    // Fetch the appropriate data based on type
    let item;
    if (type === "thread") {
      item = threads.find((thread) => thread.id === parseInt(id));
    } else {
      const posts = await fetchPosts(); // Assuming you have a fetchPosts function
      item = posts.find((post) => post.id === parseInt(id));
    }

    // If the item is not found, return an error
    if (!item) {
      return res
        .status(404)
        .send(`${type.charAt(0).toUpperCase() + type.slice(1)} not found`);
    }

    // Check if the user has already liked the item
    const existingLike = item.likes.find((like) => like.email === email);
    if (!existingLike) {
      // Add the like
      item.likes.push({ userId: email, type: "like" });
      threads = threads.map(thread => thread.id === item.id ? item : thread)
    }


    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

app.post("/add_dislike", async (req, res, next) => {
  try {
    console.log("......dislike...\n", req.body);
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});



app.get("/edit_thread/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const response = await axios.get(`http://localhost:8085/thread/${id}`);
    const thread = response.data;
    const user = req.user;
    res.status(200).render("editThread.ejs", { thread, user, genres });
  } catch (err) {
    next(err);
  }
});

app.post("/edit_thread/:id", async (req, res, next) => {
  const threadId = parseInt(req.params.id);
  const { title, content } = req.body;
  const genres = Array.isArray(req.body.genres)
    ? req.body.genres
    : [req.body.genres];

  try {
    // Retrieve the existing thread index
    const threadIndex = threads.findIndex((thread) => thread.id === threadId);

    if (threadIndex === -1) {
      return res.status(404).send("Thread not found");
    }

    // Update the thread with the new data
    threads[threadIndex] = {
      ...threads[threadIndex],
      title,
      genres,
      content,
    };
    // Redirect to the thread page or send a success response
    res.redirect(`/thread/${threadId}`);
  } catch (err) {
    next(err); // Pass the error to the error handler middleware
  }
});


app.post("/delete_thread/:id", async (req, res, next) => {
  const threadId = parseInt(req.params.id);

  try {
       // Send a delete request to the API
       await axios.delete(`http://localhost:8085/threads/${threadId}`);

    // Redirect to the main page or send a success response
    res.redirect("/");
  } catch (err) {
    next(err); // Pass the error to the error handler middleware
  }
});


// Handler to add a new thread
app.post("/add_thread", async (req, res, next) => {
  try {
    let { title, genres, content } = req.body;

    validateTitleAndContent(title, content);

    // Check if genre is not an array
    if (!Array.isArray(genres)) {
      // If it's not, make it an array
      genres = [genres];
    }

    const author = req.user.email;

    // Create a new Thread object
    const newThread = {
      title,
      genres,
      author,
      created: new Date(),
      content
    };
    // Add the new thread to the database via Axios request
    const response = await axios.post('http://localhost:8085/add_thread_to_db', newThread);

    // Check if the request was successful
    if (response.status === 200) {
      // Add the new thread to the local threads array
      threads.push(newThread);
      // Send a response back to the client
      res.redirect(`/`);
    } else {
      throw new Error('Failed to add the thread to the database');
    }
  } catch (err) {
    next(err); // Pass the error to the error handler middleware
  }
});

app.get("/thread/:id", async (req, res, next) => {
  if (req.isAuthenticated()) {
    const id = parseInt(req.params.id);

    try {
      // Send a request to the backend to fetch the specific thread by ID
      const threadResponse = await axios.get(`http://localhost:8085/thread/${id}`);
      const thread = threadResponse.data;

      // Send a request to fetch posts associated with the thread
      const postsResponse = await axios.get(`http://localhost:8085/posts?threadId=${id}`);
      const postsFromThread = postsResponse.data;
      if (thread) {
        res.status(200).render("thread.ejs", {
          thread,
          postsFromThread,
          user: req.user,
          genres,
        });
      } else {
        next(new AppError("Thread not found", 404)); // Pass the error to the error handler middleware
      }
    } catch (err) {
      console.error("Error fetching thread:", err.message);
      next(new AppError("Error fetching thread", 500)); // Pass the error to the error handler middleware
    }
  } else {
    res.redirect("/auth/google");
  }
});



app.get("/", async (req, res, next) => {
  try {
      const response = await axios.get('http://localhost:8085');
      const threads = response.data;
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
      callbackURL: `${ProxyUrl}/auth/google/callback`,
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        // let apiResp = await axios.post("http://localhost:8082/get_user_auth", { email: profile.email });
        let apiResp = {
          data: {
            user_name: profile.name.givenName,
            email: profile.emails[0].value,
            ava: profile.photos[0].value,
          },
        };
        if (!apiResp.data.email) {
          const newUser = await axios.post(`${ProxyUrl}/reg_user`, {
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
