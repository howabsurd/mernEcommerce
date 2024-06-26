const app = require("./app")
const dotenv = require("dotenv");


process.on("uncaughtException", (err)=>{
    console.log(`Error: ${err.message}`)
    console.log(`Shutting down the server due to Uncaught Exception`)
    process.exit(1);
})

dotenv.config()
const connectDatabase = require("./config/database");

// conneting the database 

connectDatabase()


const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is working on ${process.env.PORT}`);
})




// unhandled Promise rejection 
process.on("unhandledRejection", error=>{
    console.log(`Error :${err.message}`);
    console.log(`Shutting down the server due to unhandled Promise Rejection`);
    server.close(()=>{
        process.exit(1);
    })
})