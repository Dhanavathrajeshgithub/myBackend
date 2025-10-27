import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("<h1>Hello Welcome to the World!!!</h1>");
});

app.get("/jokes", async (req, res) => {
  console.log("Fetching joke ...");
  try {
    const response = await fetch("https://v2.jokeapi.dev/joke/Any");
    const data = await response.json();
    console.log("✅ Joke fetched successfully!");
    res.json(data);
  } catch (error) {
    console.error("❌ Error fetching joke:", error);
    res.status(500).json({ error: "Error fetching joke" });
  }
});

app.listen(port, () => {
  console.log(`🚀 App is listening on port ${port}`);
});
