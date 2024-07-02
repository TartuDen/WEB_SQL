import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';


import { threads,posts } from './apiMOCK.js';
import { Thread, Post, Likes } from './classes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;
const ProxyUrl = "http://localhost:8081";
const ExpressApiServer = "http://localhost:8082"



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || "someKeY",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60
  }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: `${ProxyUrl}/login` }),
  (req, res) => {
    // Successful authentication, redirect to home
    res.redirect(`${ProxyUrl}`);
  }
);

app.get("/thread/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const thread = threads.find(thread => thread.id === id);
  const postsFromThread = posts.filter(post => post.threadID === thread.id);

  if (thread) {
      res.status(200).render("thread.ejs",{thread, postsFromThread});
  } else {
      res.status(404).send('Thread not found');
  }
});

// Protected route example
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).render("index.ejs",{threads});
  } else {
    res.redirect('/auth/google');
  }
});


// _______________ GOOGLE STRATEGY _________________
passport.use("google", new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${ProxyUrl}/auth/google/callback`,
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
}, async (accessToken, refreshToken, profile, cb) => {
  try {
      // let apiResp = await axios.post("http://localhost:8082/get_user_auth", { email: profile.email });
      let apiResp = {data: {
        user_name: "Den",
        email: 'den@ver.com',
        ava: null
      }}
      if (!apiResp.data.email) {
          const newUser = await axios.post(`${ProxyUrl}/reg_user`, { user_name: profile.given_name, email: profile.email, ava: profile.photos[0].value });
          cb(null, newUser.data);
      } else {
          //IF user already exist
          cb(null, apiResp.data);
      }
  } catch (err) {
      console.error("Error during fetching user: ", err.message);
      cb(err);
  }
}))

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


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
