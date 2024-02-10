const z = require("zod");

const movieSchema = z.object({
  title: z.string(),
  director: z.string(),
  genre: z.array(z.enum(["action", "comedy", "drama", "horror"])),
  year: z.number().int().min(1900).max(2022),
  duration: z.number().int().min(1),
  rate: z.number().min(0).max(10),
  poster: z.string(),
});

function validateMovie(movie) {
  return movieSchema.safeParse(movie);
}

function validatePartialMovie (input) {
  return movieSchema.partial().safeParse(input)
}

module.exports = {
  validateMovie,
  validatePartialMovie
}