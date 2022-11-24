const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "moviesData.db");
let Database = null;

const initializeBDAndServer = async () => {
  try {
    Database = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};

initializeBDAndServer();

// Get Data
const changeNameFormat = (obj) => {
  return {
    movieName: obj.movie_name,
  };
};

app.get("/movies/", async (request, response) => {
  const sqlQuery = `
   SELECT * 
   FROM movie;
   `;
  const Result = await Database.all(sqlQuery);
  const listOfMovies = Result.map((eachItem) => changeNameFormat(eachItem));
  response.send(listOfMovies);
  console.log(listOfMovies);
});

// post Data
app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const sqlQuery = `
    INSERT INTO 
        movie (director_id, movie_name, lead_actor)
    VALUES
       (
           '${directorId}',
           '${movieName}',
           '${leadActor}'
       )`;
  const result = await Database.run(sqlQuery);
  response.send("Movie Successfully Added");
  console.log(result);
});

// Get movie
const changeFormat = (obj) => {
  return {
    movieId: obj.movie_id,
    directorId: obj.director_id,
    movieName: obj.movie_name,
    leadActor: obj.lead_actor,
  };
};
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getBookQuery = `
    SELECT
      *
    FROM
      movie
    WHERE
      movie_id = ${movieId};`;
  const result = await Database.get(getBookQuery);
  const movie = changeFormat(result);
  response.send(movie);
});

//Update info
app.put("/movies/:movieId/", async (request, respond) => {
  const { movieId } = request.params;
  const { directorID, movieName, leadActor } = request.body;
  const sqlQuery = `
    UPDATE
        movie
    SET
        director_id = '${directorID}',
        movie_name = '${movieName}',
        lead_actor = '${leadActor}'
    WHERE 
        movie_id = '${movieId}';  `;
  await Database.run(sqlQuery);
  response.send("Movie Details Updated");
  console.log("Movie Details Updated");
});

//Delete data
app.delete("/movies/:movieID/", async (request, response) => {
  const { movieId } = request.params;
  const sqlQuery = `
       DELETE FROM
            movie
        WHERE
            movie_id = '${movieId}';    `;
  await Database.run(sqlQuery);
  response.send("Movie Removed");
  console.log("Movie removed");
});

// get info
let changeFormatdirectors = (obj) => {
  return {
    directorId: obj.director_id,
    directorName: obj.director_name,
  };
};

app.get("/directors/", async (request, response) => {
  const sqlQuery = `
        SELECT *
        FROM director;    `;
  const result = await Database.all(sqlQuery);
  const directors = result.map((each) => changeFormatdirectors(each));
  response.send(directors);
  console.log(directors);
});

// get data
const changeProperty = (obj) => {
  return {
    movieName: obj.movie_name,
  };
};
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  console.log(directorId);
  const sqlQuery = `
        SELECT movie_name
        FROM movie
        WHERE director_id = '${48}' ;   `;
  const result = await Database.all(sqlQuery);
  const moviess = result.map((each) => changeProperty(each));
  console.log(moviess);
  response.send(moviess);
});

module.exports = app;
