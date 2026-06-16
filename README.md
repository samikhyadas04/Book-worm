# Book-worm
# 📚 Book Recommendation API

A RESTful Book Recommendation System built with Node.js and Express.js. This project provides APIs to manage books and generate recommendations based on available book data.

## 🚀 Features

* Get all books
* Get a book by ID
* Add a new book
* Delete a book
* Generate book recommendations
* Modular Express routing

## 🛠️ Tech Stack

* Node.js
* Express.js
* JavaScript
* REST API

## 📂 Project Structure

```text
book-recommender/
│
├── data/
│   └── books.json
│
├── routes/
│   ├── books.js
│   └── recommendations.js
│
├── middleware/
│   └── index.js
│
├── server.js
├── package.json
└── README.md
```

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/your-username/book-recommender.git
```

Navigate to the project directory:

```bash
cd book-recommender
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

or

```bash
node server.js
```

## 🌐 API Endpoints

### Get All Books

```http
GET /books
```

### Get Book By ID

```http
GET /books/:id
```

### Add a Book

```http
POST /books
```

Example Request:

```json
{
  "title": "The Hobbit",
  "author": "J.R.R. Tolkien",
  "genre": "Fantasy"
}
```

### Delete a Book

```http
DELETE /books/:id
```

### Get Recommendations

```http
GET /recommendations
```

## 📜 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built as a Node.js learning project to explore REST API development and recommendation systems.
