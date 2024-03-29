const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const QuizRouter = require("./routes/v1/quiz");
const UserRouter = require("./routes/v1/user");
const ProfileRouter = require("./routes/v1/profile");
const ResetRouter = require("./routes/v1/reset");
const { sessionStore } = require('./db/index')
const app = express();
// require("./db/index");

const { rateLimitChecker } = require("./lib/utils/rateLimiter");

// this does not work
//TODO: make cookies get saved in render

if (process.env.ENV === "dev") {
    app.use(
        cors({
            origin: "http://localhost:5173",
            credentials: true,
            methods: "*",
        }),
    );
}

app.use(express.json());
app.use(express.urlencoded());


app.use(cookieParser());
app.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 604_800_000_000_000, }, // seven days
        store: sessionStore
    }),
);

// NOTE: undo this after production
// app.use((req, res, next) => {
//     console.log(req.method, req.url, req.query);
//     next();
// });

// rate limit TODO:
app.use(rateLimitChecker);

app.use(express.static(path.join(__dirname, "..", "dist")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

app.use("/api/v1", QuizRouter);
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/profile", ProfileRouter);
app.use("/api/v1/reset", ResetRouter);

app.all("/*", (req, res) => {
    res.redirect("/");
});

module.exports = app;