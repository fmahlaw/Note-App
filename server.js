// Import required packages
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

// Define the port the server will listen on
const port = 3000;

// Connect to MongoDB using Mongoose
mongoose.connect("mongodb://localhost/note-app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the Note schema and model using Mongoose
const NoteSchema = new mongoose.Schema({
  title: String,
  content: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Note = mongoose.model("Note", NoteSchema);

// Define the User schema and model using Mongoose
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
});

UserSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt();
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.generateAuthToken = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "mysecretkey");
  return token;
};

const User = mongoose.model("User", UserSchema);

// Initialize the Express app
const app = express();

// Use body-parser and cors middleware
app.use(bodyParser.json());
app.use(cors());

// Define the routes for user registration,
//authentication, and note CRUD operations

// User registration route
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new User({ email, password });
    await user.save();
    const token = user.generateAuthToken();
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// User login route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }
    const token = user.generateAuthToken();
    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Middleware to verify user's authentication token
const auth = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, "mysecretkey");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Please authenticate" });
  }
};

// Note CRUD routes
app.get("/notes", auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/notes", auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = new Note({ title, content, user: req.user._id });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/notes/:id", auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, content },
      { new: true }
    );
    if (!note) {
      throw new Error("Note not found");
    }
    res.status(200).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/notes/:id", auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!note) {
      throw new Error("Note not found");
    }
    res.status(200).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log("Server started on port ${port}");
});
