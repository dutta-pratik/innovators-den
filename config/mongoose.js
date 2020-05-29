const mongoose = require("mongoose");
//making DB
mongoose.connect("mongodb://localhost/QnA");
//making connection
const db = mongoose.connection;
//run if error while connecting
db.on("error", console.error.bind(console, "Error connecting to DB"));
//if DB connects
db.once("open", function(){
    console.log("Connected to DB");
    
});
// exporting DB
module.exports = db;