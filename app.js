const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const PORT = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const readMovies = () => {
  const moviesPath = path.join(__dirname, "movies.json");
  try {
    const moviesData = fs.readFileSync(moviesPath);
    return JSON.parse(moviesData);
  } catch (error) {
    return [];
  }
};

const writeMovies = (movies) => {
  const moviesPath = path.join(__dirname, "movies.json");
  fs.writeFileSync(moviesPath, JSON.stringify(movies, null, 2));
};

app.get("/movies", (req, res) => {
  const movies = readMovies();
  res.json(movies);
});

app.post("/movies", (req, res) => {
  const { name, rating } = req.body;
  const movies = readMovies();
  const id = movies.length + 1;
  movies.push({ id, name, rating });
  writeMovies(movies);
  res.json({ success: true, message: "Movie added successfully." });
});

// Search Movie
app.get("/search", (req, res) => {
  const movies = readMovies();
  const id = parseInt(req.query.id, 10);
  const foundMovie = movies.find((movie) => movie.id === id);

  if (foundMovie) {
    res.json(foundMovie);
  } else {
    res.status(404).json({ error: "Movie not found." });
  }
});

// Update Movie
app.post("/update", (req, res) => {
  const movies = readMovies();
  const id = parseInt(req.body.id, 10);
  const foundIndex = movies.findIndex((movie) => movie.id === id);

  if (foundIndex !== -1) {
    movies[foundIndex].name = req.body.name;
    movies[foundIndex].rating = req.body.rating;
    writeMovies(movies);
    res.json({ success: true, message: "Movie updated successfully." });
  } else {
    res.status(404).json({ error: "Movie not found." });
  }
});

// Delete Movie
app.post("/delete", (req, res) => {
  const movies = readMovies();
  const id = parseInt(req.body.id, 10);
  const foundIndex = movies.findIndex((movie) => movie.id === id);

  if (foundIndex !== -1) {
    movies.splice(foundIndex, 1);
    writeMovies(movies);
    res.json({ success: true, message: "Movie deleted successfully." });
  } else {
    res.status(404).json({ error: "Movie not found." });
  }
});

app.use((req, res) => {
  res.status(404).send("404: Page not found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("500: Internal Server Error");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
