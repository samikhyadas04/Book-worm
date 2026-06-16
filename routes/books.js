const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const DATA_PATH = path.join(__dirname, "../data/books.json");

// Helper: read books from JSON
function readBooks() {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

// Helper: write books to JSON
function writeBooks(books) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(books, null, 2));
}

// GET /books — list all, with optional search & genre filter
// Query params: ?search=hobbit  ?genre=fantasy
router.get("/", (req, res) => {
  let books = readBooks();
  const { search, genre } = req.query;

  if (genre) {
    books = books.filter((b) =>
      b.genres.map((g) => g.toLowerCase()).includes(genre.toLowerCase())
    );
  }

  if (search) {
    const q = search.toLowerCase();
    books = books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
    );
  }

  res.json({ count: books.length, books });
});

// GET /books/:id — get a single book
router.get("/:id", (req, res) => {
  const books = readBooks();
  const book = books.find((b) => b.id === req.params.id);
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

// POST /books — add a new book
router.post("/", (req, res) => {
  const { title, author, genres, description, rating } = req.body;

  if (!title || !author || !genres) {
    return res
      .status(400)
      .json({ error: "title, author, and genres are required" });
  }

  if (!Array.isArray(genres) || genres.length === 0) {
    return res.status(400).json({ error: "genres must be a non-empty array" });
  }

  const books = readBooks();
  const newBook = {
    id: String(Date.now()),
    title,
    author,
    genres,
    description: description || "",
    rating: rating ? parseFloat(rating) : null,
  };

  books.push(newBook);
  writeBooks(books);
  res.status(201).json(newBook);
});

// DELETE /books/:id — remove a book
router.delete("/:id", (req, res) => {
  let books = readBooks();
  const index = books.findIndex((b) => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Book not found" });

  const [removed] = books.splice(index, 1);
  writeBooks(books);
  res.json({ message: "Book deleted", book: removed });
});

module.exports = router;
