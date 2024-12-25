const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Books = require("./BooksSchema");

// Initialize express app
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json()); // Parse JSON data
app.use(cors()); // Enable cross-origin requests

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/booksdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ROUTES

// 1. Add a new book
app.post("/addbook", async (req, res) => {
  try {
    const { booktitle, author, formate, Topic, PubYear } = req.body;

    // Validate input
    if (!booktitle || !author || !formate || !Topic || !PubYear) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Create and save a new book
    const newBook = new Books({
      booktitle,
      author,
      formate,
      Topic,
      PubYear: parseInt(PubYear),
    });
    await newBook.save();

    res.status(201).json({ message: "Book added successfully!", book: newBook });
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ message: "Server error!" });
  }
});

// 2. Get all books
app.get("/allbooks", async (req, res) => {
  try {
    const books = await Books.find();
    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Server error!" });
  }
});

// 3. Update a book by ID
app.post("/updatebook/:id", async (req, res) => {
  try {
    const { booktitle, author, formate, Topic, PubYear } = req.body;

    // Validate input
    if (!booktitle || !author || !formate || !Topic || !PubYear) {
      return res.status(400).json({ message: "All fields are required for update!" });
    }

    const updatedBook = await Books.findByIdAndUpdate(
      req.params.id,
      { booktitle, author, formate, Topic, PubYear: parseInt(PubYear) },
      { new: true } // Return the updated document
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found!" });
    }

    res.status(200).json({ message: "Book updated successfully!", book: updatedBook });
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ message: "Server error!" });
  }
});

// 4. Delete a book by ID
app.post("/deleteBook/:id", async (req, res) => {
  try {
    const deletedBook = await Books.findByIdAndDelete(req.params.id);

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found!" });
    }

    res.status(200).json({ message: "Book deleted successfully!" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Server error!" });
  }
});

// 5. Get a single book by ID
app.get("/getbook/:id", async (req, res) => {
  try {
    const book = await Books.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found!" });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ message: "Server error!" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
