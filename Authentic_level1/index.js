import pg from 'pg';
import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import session from 'express-session'; // Middleware for managing sessions in Express.
import passport from 'passport';//Authentication middleware for Node.js.
import { Strategy as LocalStrategy } from 'passport-local'; // Strategy for username and password authentication with Passport.

const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// First always goes session creation
app.use(session({ //Configures the Express session middleware with a secret key, which is used to sign the session ID cookie.
    secret: "someSECRETword",
    resave: false, //Determines whether the session should be saved back to the session store, even if it hasn't been modified during the request.
    saveUninitialized: true //saveUninitialized: Determines whether a session should be created for an uninitialized (new) session.
}));

// And only after that passport initialization!!!
app.use(passport.initialize());
app.use(passport.session());

app.post("/register", async (req, res) => {
    const { user_name, email, password } = req.body;

    try {
        let apiResp = await axios.post("http://localhost:8081/reg_user", { user_name, email, password });
        if (apiResp.data.message) {
            console.log(apiResp.data.message);
            res.redirect("/");
        } else if (apiResp) {
            console.log("successfully created");
            res.redirect("/secret_page");
        } else {
            console.log("try to log in");
            res.redirect("/");
        }
    } catch (err) {
        console.error("Failed to get data from ", err);
        res.redirect("/");
    }
});

// Handles the login form submission using Passport's local strategy.
// If authentication succeeds, redirects to the secrets page; otherwise, redirects back to the login page.
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret_page",
    failureRedirect: "/"
}));


// Checks if the user is authenticated using Passport's isAuthenticated() method.
// If authenticated, renders the secrets page; otherwise, redirects to the login page.
app.get("/secret_page", (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).render("secret_page.ejs");
    } else {
        res.redirect("/");
    }
});

app.get("/", (req, res) => {
    res.status(200).render("index.ejs");
});

// should be initialized right before server start
// Defines a new Passport local strategy for authenticating users.
// The strategy's verify function is called with the provided username and password.
// It queries the database to find the user by email and compares the hashed password.

// The Problem
// When using Passport's LocalStrategy, the default field names it expects in the request body are username and password. In your case, you were sending email and password, not username and password. As a result, Passport couldn't find the email field because it was looking for username by default.
// The Fix
// To fix this, you need to explicitly tell Passport to use email as the username field. This is done by passing an options object to the LocalStrategy constructor with the usernameField property set to 'email'.

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, cb) => {
    let user;
    try {
        let apiResp = await axios.post("http://localhost:8081/get_user", { email, password });
        user = apiResp.data;
        if (user) {
            console.log("User found: ", user);
            return cb(null, user);
        } else {
            console.log("No user found with given email and password");
            return cb(null, false);
        }
    } catch (err) {
        console.error("Error during fetching user: ", err.message);
        if (err.response) {
            return cb(`Failed to get data from /get_user: ${err.message}, Status Code: ${err.response.status}, Response Data: ${JSON.stringify(err.response.data)}`);
        } else if (err.request) {
            return cb(`Failed to get data from /get_user: ${err.message}, No response received`);
        } else {
            return cb(`Failed to get data from /get_user: ${err.message}`);
        }
    }
}));

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


// cb (short for callback) is a function provided by Passport to communicate the outcome of the authentication process back to Passport.
// if (valid) {   return cb(null, user); } else {   return cb(null, false); }
// cb(null, user) passes null (indicating no error) and the authenticated user object user to Passport, indicating a successful authentication.
// If the password is invalid, Passport needs to indicate that the authentication failed.
// cb(null, false) passes null (indicating no error) and false to Passport, indicating that the authentication failed.


app.listen(port, (err) => {
    if (err) throw err;
    console.log("Proxy server is running on port: ", port);
});
