const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  const userExists = users.find((user) => user.username === username);

  if (userExists) {
    return res.status(400).json({ message: "User already exists." });
  }

  const newUser = { username, password };
  users.push(newUser);

  return res.status(201).json({ message: "User registered successfully." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify({ books }, null, 2));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res
      .status(404)
      .send(JSON.stringify({ message: "Book not found." }, null, 2));
  }

  return res.status(200).send(JSON.stringify({ book }, null, 2));
});

// Get book details based on author
public_users.get("/author/:author", (req, res) => {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter((b) => b.author === author);

  if (booksByAuthor.length === 0) {
    return res
      .status(404)
      .send(
        JSON.stringify({ message: "No books found by this author." }, null, 2)
      );
  }

  return res
    .status(200)
    .send(JSON.stringify({ books: booksByAuthor }, null, 2));
});

// Get all books based on title
public_users.get("/title/:title", (req, res) => {
  const title = req.params.title.toLowerCase();
  const booksByTitle = Object.values(books).filter((b) =>
    b.title.toLowerCase().includes(title)
  );

  if (booksByTitle.length === 0) {
    return res
      .status(404)
      .send(
        JSON.stringify({ message: "No books found with this title." }, null, 2)
      );
  }

  return res.status(200).send(JSON.stringify({ books: booksByTitle }, null, 2));
});

//  Get book review
public_users.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res
      .status(404)
      .send(JSON.stringify({ message: "Book not found." }, null, 2));
  }

  return res
    .status(200)
    .send(JSON.stringify({ reviews: book.reviews }, null, 2));
});

module.exports.general = public_users;
