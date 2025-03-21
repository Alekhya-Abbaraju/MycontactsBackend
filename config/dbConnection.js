//dbConnection.js
const mongoose = require("mongoose");
const connectDb = async () => {
    try {
        const connect = await mongoose.connect("mongodb://localhost:27017/", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connected:", connect.connection.host, connect.connection.name);
    } catch (err) {
        console.error("Error connecting to the database", err);
        process.exit(1);
    }
};
module.exports = connectDb;