// //server.js
// const express = require("express");
// const errorHandler = require("./middleware/errorHandler");
// const connectDb = require("./config/dbConnection");

// const dotenv = require("dotenv").config();
// const app = express();
// connectDb();

// const port = process.env.PORT || 5000;
// app.use(express.json());

// app.use("/api/contacts", require("./routes/contactRoutes"));
// app.use("/api/users", require("./routes/userRoutes"));
// app.use(errorHandler);
// app.listen(port, () => {
//     console.log(Server running on port ${port});
// });
const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const app = express();connectDb();
app.use(express.json());
app.get('/', (req, res) => {
    res.json({ message: "API is working" });
});

app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));  
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(` Server running on port ${port}`);
});