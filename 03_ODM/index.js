/* 

🧩 1. Data Modelling — “How data is structured and related”
Definition

Data modelling is the process of designing the structure of your database — deciding what data you’ll store, how it’s organized, and how different pieces of data relate to each other.

In Node.js backend development, data modelling usually means:

Designing collections and schemas in MongoDB (NoSQL), or

Designing tables and relations in SQL databases (like PostgreSQL or MySQL).

Example (MongoDB + Mongoose)

Let’s say you’re building a blogging platform.

You might define two data models:

User

Post

// user.model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.model("User", userSchema);

// post.model.js
import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Post", postSchema);


🧠 Here:

You’ve modelled how data is stored.

Defined relationships — each Post references a User (author field).

This schema helps MongoDB know how to store and validate your data.

*/

/*

🧱 2. Object Modelling — “How your code represents that data”
Definition

Object modelling is about how you represent that data in your application code — as JavaScript objects or classes that correspond to your database models.

In Node.js, libraries like Mongoose help you map JavaScript objects to database documents.
That’s why Mongoose is called an Object Data Modelling (ODM) library.

Example
import User from "./user.model.js";

// Create a new user object
const newUser = new User({
  username: "raj_nayak",
  email: "raj@example.com",
  password: "securePass123"
});

// Save to database
await newUser.save();


Here:

You created an object (newUser) in your Node.js code.

Mongoose maps it to a document in MongoDB.

That’s object modelling in action — bridging JavaScript objects ↔ database records.

⚖️ In short
Concept	What                 it means	                                                   Example tool in Node.js
Data Modelling	      Designing how data is structured and related in the database	    Defining Mongoose schemas / SQL tables
Object Modelling	  Representing and interacting with that data as JS objects	        Using Mongoose models / Sequelize models
💡 Tip

If you’re using SQL databases instead of MongoDB:

You’ll use Object-Relational Mapping (ORM) tools like Sequelize or Prisma instead of ODMs.

Concept remains the same — defining data models, mapping them to JavaScript objects.

*/

/*
🦦 What is Mongoose?
Definition

Mongoose is an ODM (Object Data Modelling) library for MongoDB and Node.js.

It helps you:

Define schemas (the structure of your data),

Create models (JavaScript representations of your collections),

And easily perform CRUD (Create, Read, Update, Delete) operations.

In short:

🧠 Mongoose acts as a bridge between your Node.js application and your MongoDB database.
*/

import express from "express";
const app = express();

const port = 8000;
app.listen(port, () => {
  console.log(`app is listening to the port ${port}`);
});
