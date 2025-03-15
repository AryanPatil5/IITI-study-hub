const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // ✅ Allow both
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(session({
    secret: 'studyhub-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true }
}));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:5002/auth/github/callback"
}, (accessToken, refreshToken, profile, done) => {
    console.log("GitHub Profile:", profile); // ✅ Debugging log
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user.id); // ✅ Store only the user ID in the session
});

passport.deserializeUser((id, done) => {
    // Fetch full user data from GitHub API or database if required
    done(null, { id }); // ✅ Retrieve full user object
});


// GitHub Authentication Routes
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('http://localhost:3000'); // Redirect to frontend after login
    }
);

// Logout Route (Fixed)
app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.session.destroy(() => {
            res.redirect('http://localhost:3000');
        });
    });
});

// Check User Authentication Status
app.get('/user', (req, res) => {
    console.log("Session Data:", req.session);
    console.log("User Data:", req.user);
    res.json(req.user || null);
});


// Start Server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
