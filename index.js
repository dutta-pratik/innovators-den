const port = 8000;
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const path = require("path");
const db = require("./config/mongoose");

const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
// const passportJWT = require("./config/passport-jwt");
const MongoStore = require("connect-mongo")(session);
const flashMiddleware = require("./config/flashmiddleware");
const flash = require("connect-flash");

const app = express();


app.use(express.urlencoded({extended: true}));
// app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static("assets"));

//using layout
app.use(expressLayout);

//extracting styles and script from sub-pages to layout 
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

app.set("view engine", "ejs");
app.set("views", "./views");

//mongo store is used to store session cookie in the db
app.use(session({
    name: "QnAforDevelopers",
    //TODO change it before production
    secret: "#q3%kGjx[/tC*a^2&L0",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore(
        {
            mongooseConnection: db,
            autoRemove: "disabled"
        },function(err){
            console.log(err || "mongostore setup OK");
        }
    )
}));

/******************USING PASSPORT PACKAGE****************************/
app.use(passport.initialize());
app.use(passport.session());

//set the user authentication
app.use(passport.setAuthenticatedUser);

//using flash
app.use(flash());
app.use(flashMiddleware.setFlash);

//using express router
app.use("/", require("./routes/index"));

app.listen(port, function(err){
    if(err){
        console.log("Server is not Listening due to", err);
    }
    console.log(`Server is up and running at ${port}`);
});