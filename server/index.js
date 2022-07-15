const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
dotenv.config();
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");

//connet to DB

mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connect to Mongo Altas");
  })
  .catch((e) => {
    console.log(e);
  });

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/user", authRoute);
app.use(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRoute
); //passport protect

app.listen(8080, () => {
  console.log("Server is running on the port");
});
