// Simple request logger
function logger(req, res, next) {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.url}`);
  next();
}

// 404 handler
function notFound(req, res, next) {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
}

// Global error handler
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
}

module.exports = { logger, notFound, errorHandler };
