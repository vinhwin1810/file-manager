import express from "express";
import bodyParser from "body-parser";
import mongoose, { mongo } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import helmet from "helmet";
import morgan, { token } from "morgan";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "./models/user.js";

/* Set up some configurations */
// boiler-plate code

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); //make cross-origin sharing requests.
app.use(morgan("common"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* JWT */

/* ROUTES */

const PORT = process.env.PORT || 9000;
app.get("/home", (req, res) => {
  res.json({
    name: "Bill",
    age: 99,
  });
});

app.post("/home", (req, res) => {
  console.log(req.body);
});

// MONGODB

const dbURL = process.env.MONGO_URL;

mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    app.listen(process.env.PORT, () => console.log("SERVER IS LIVE"));
  })
  .catch((err) => console.log(err));

//register the user:

app.post("/register", async (req, res) => {
  const user = req.body;

  const takenUsername = await User.findOne({ username: user.username });
  const takenEmail = await User.findOne({ email: user.email });

  if (takenUsername || takenEmail) {
    res.json({ message: "Username or Email has already been taken" });
  } else {
    user.password = await bcrypt.hash(req.body.password, 10);

    const dbUser = new User({
      username: user.username.toLowerCase(),
      email: user.email.toLowerCase,
      password: user.password,
    });

    dbUser.save();
    res.json({ message: "Success" });
  }
});

// Sign JSON Web Token / Login

app.post("/login", (req, res) => {
  const userLoggingIn = req.body;
  User.findOne({ username: userLoggingIn.username }).then((dbUser) => {
    if (!dbUser) {
      return res.json({
        message: "Invalid Username or Password",
      });
    }
    bcrypt
      .compare(userLoggingIn.password, dbUser.password)
      .then((isCorrect) => {
        if (isCorrect) {
          const payload = {
            id: dbUser._id,
            username: dbUser.username,
          };
          jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 86400 },
            (err, token) => {
              if (err) return res.json({ message: err });
              return res.json({
                message: "Success",
                token: "Bearer " + token,
              });
            }
          );
        } else {
          return res.json({
            message: "Invalid Username or Password",
          });
        }
      });
  });
});

// Verifying JWT token

const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"]?.split(" ")[1];

  if (token) {
    jwt.verify(token, process.env.PASSPORTSECRET, (err, decoded) => {
      if (err)
        return res.json({
          isLoggedIn: false,
          message: "Failed to Authenticate",
        });
      req.user = {};
      req.user.id = decoded.id;
      req.user.username = decoded.username;
      next();
    });
  } else {
    res.json({ message: "Incorrect Token Given", isLoggedIn: false });
  }
};

// Accessing the Current User
app.get("/getUsername", verifyJWT, (req, res) => {
  res.json({ isLoggedIn: true, username: req.user.username });
});
