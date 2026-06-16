const express = require("express");
const { logger, notFound, errorHandler } = require("./middleware");
const booksRouter = require("./routes/books");
const recommendationsRouter = require("./routes/recommendations");

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────────────
app.use(express.json());
app.use(logger);

// ── Routes ─────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    message: "📚 Book Recommendation API",
    endpoints: {
      books: {
        "GET  /books": "List all books (optional: ?search=&genre=)",
        "GET  /books/:id": "Get a single book",
        "POST /books": "Add a new book",
        "DELETE /books/:id": "Delete a book",
      },
      recommendations: {
        "GET /recommendations?ids=1,2,3": "Recommend books based on liked IDs",
        "GET /recommendations/genre/:genre": "Browse books by genre",
      },
    },
  });
});

app.use("/books", booksRouter);
app.use("/recommendations", recommendationsRouter);

// ── Error handling ──────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start ───────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n📚 Book Recommender running at http://localhost:${PORT}`);
  console.log(`   Press Ctrl+C to stop\n`);
});
