const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const DATA_PATH = path.join(__dirname, "../data/books.json");

function readBooks() {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

/**
 * Score a candidate book based on how well it matches liked books.
 * - +2 for each matching genre
 * - +3 if the author matches any liked book's author
 */
function scoreBook(candidate, likedBooks) {
  let score = 0;
  const likedGenres = likedBooks.flatMap((b) => b.genres);
  const likedAuthors = likedBooks.map((b) => b.author.toLowerCase());

  for (const genre of candidate.genres) {
    if (likedGenres.includes(genre)) score += 2;
  }

  if (likedAuthors.includes(candidate.author.toLowerCase())) score += 3;

  return score;
}

// GET /recommendations?ids=1,3,5
// Pass comma-separated book IDs that the user liked
router.get("/", (req, res) => {
  const { ids } = req.query;

  if (!ids) {
    return res.status(400).json({
      error: "Provide liked book IDs as ?ids=1,3,5",
    });
  }

  const likedIds = ids.split(",").map((id) => id.trim());
  const allBooks = readBooks();
  const likedBooks = allBooks.filter((b) => likedIds.includes(b.id));

  if (likedBooks.length === 0) {
    return res.status(404).json({ error: "None of the provided IDs were found" });
  }

  // Exclude books the user already liked
  const candidates = allBooks.filter((b) => !likedIds.includes(b.id));

  const scored = candidates
    .map((book) => ({ ...book, score: scoreBook(book, likedBooks) }))
    .filter((b) => b.score > 0)
    .sort((a, b) => b.score - a.score);

  res.json({
    based_on: likedBooks.map((b) => ({ id: b.id, title: b.title })),
    recommendations: scored,
  });
});

// GET /recommendations/genre/:genre — recommend by genre directly
router.get("/genre/:genre", (req, res) => {
  const genre = req.params.genre.toLowerCase();
  const allBooks = readBooks();

  const matches = allBooks
    .filter((b) => b.genres.map((g) => g.toLowerCase()).includes(genre))
    .sort((a, b) => (b.rating || 0) - (a.rating || 0));

  if (matches.length === 0) {
    return res.status(404).json({ error: `No books found for genre: ${genre}` });
  }

  res.json({ genre, count: matches.length, books: matches });
});

module.exports = router;
