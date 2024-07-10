import dotenv from "dotenv";
import express from "express";
import OpenAI from "openai";
dotenv.config();
// Authenticate with our api keys
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_SECRET_KEY,
});
const app = express();
//! Pass ing incoming json data
app.use(express.json());

const PORT = process.env.PORT || 9090;

//! Global variable to hold the conversation history
let conversationHistory = [
  { role: "system", content: "you are a helpful assistant" },
];
//! Routes
app.post("/ask", async (req, res) => {
  const userMessage = req.body.message;
  //! Update the conversation history with the user's message
  conversationHistory.push({ role: "user", content: userMessage });
  try {
    const completion = await openai.chat.completions.create({
      messages: conversationHistory,
      model: "gpt-3.5-turbo",
    });
    //! Extract the response
    const botsResponse = completion.choices[0].message.content;
    //! send the response
    res.json({ message: botsResponse });
  } catch (error) {
    res.status(500).send("Error generating response from OpenAI");
  }
});

//! Run the server
app.listen(PORT, console.log(`server is running on ${PORT}`));
