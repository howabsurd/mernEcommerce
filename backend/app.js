const express = require("express");
const app = express() ;
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser())
// Route imports 
const product= require("./routes/productRoute");
const user = require("./routes/userRoute");

app.use((req,res,next)=>{
    console.log(req.method, req.path);
    next();
})

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use(errorMiddleware);

module.exports = app;