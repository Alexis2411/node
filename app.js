const express = require("express");
const app = express();
const movies = require("./movies.json");
const crypto = require("crypto");
const cors = require('cors');
const { validateMovie, validatePartialMovie } = require('./moviesSchema')
app.disable("x-powered-by");
// const AllowedOrigins = ['http://localhost:3000', 'http://localhost:8080'];
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      'http://localhost:1234',
      'https://movies.com',
      'https://midu.dev'
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))
const port = 3001;
app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.get("/movies", (req, res) => {
  // const origin = req.header('origin');
  // if(AllowedOrigins.includes(origin) || !origin) {
  //   res.header('Access-Control-Allow-Origin', origin);
  // }
  const { genre } = req.query;
  if (genre) {
    const movie = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
    res.json(movie);
  }
  res.json(movies);
});

app.get("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id === id);
  if (!movie) {
    res.status(404).json({ message: "Movie not found" });
  }
  res.json(movie);
});

app.post("/movies", (req, res) => {
  const result = validateMovie(req.body);
  if(result.error) {
    res.status(400).json({error: result.error});
    return;
  }
  const newMovie = {
    id: crypto.randomUUID,
    ...result.data
  };
  movies.push(newMovie);
  res.status(201).json(newMovie);
});

// app.options("/movies/:id", (req, res) => {
//   const origin = req.header('origin');
//   if(AllowedOrigins.includes(origin) || !origin) {
//     res.header('Access-Control-Allow-Origin', origin);
//   }
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   res.send(200);
// });

app.delete("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);
  if (movieIndex === -1) {
    res.status(404).json({ message: "Movie not found" });
  }
  movies.splice(movieIndex, 1);
  res.status(204).send();
}
);


app.patch("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);
  if (movieIndex === -1) {
    res.status(404).json({ message: "Movie not found" });
  }
  const result = validatePartialMovie(req.body);
  if(result.error) {
    res.status(400).json({error: result.error});
    return;
  }
  updateMovie = {
    ...movies[movieIndex],
    ...result.data
  };
  res.json(updateMovie);
});

app.listen(port, () => {
  console.log(`Server is running on https://localhost:${port}`);
});
