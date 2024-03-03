//calling the packages
const express = require('express')
const app = express()
require('dotenv').config()
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const axios = require('axios');
const cors = require('cors');
app.use(cors())
const port = process.env.PORT;
vidAPI_KEY = process.env.videoAPI_KEY;

//Database connection
const { Client } = require('pg')
const url = process.env.DB_URL;
const client = new Client(url)

//Routes
app.get('/user', getAllusers)
app.post('/user', addUser)
app.put('/user/:id', updateUser)
app.delete('/user/:id', deleteUser)

app.get('/cousre', getAllCorses)
app.post('/course', addCourse)

app.get('/regCourse', getRegCourses)
app.post("/regCourse", addRegCourse)
app.put('/regCourse/:id', updateRegCourse)
app.delete('/regCourse/:id', removeRegCourse)

app.get('/review', getReviews)
app.post('/review', postReview)
app.put('/review/:id', updateReview)
app.delete('/review/:id', deleteReview)


app.get('/video', getVideoInfo) /* this route gives us a video about the topic */
app.get('/playlist', getPlayListVideos) /*this route gives us a playlist of videos */
app.get('/quiz', getQuizzes)

//Handlers
function getVideoInfo(req, res) {
  const queryParam = req.query.param;
  let url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${queryParam}%20tutorials&type=video&key=${vidAPI_KEY}`
  axios.get(url)
    .then(result => {
      let searchedMovies = result.data.items.map(movie => {
        return movie
      })
      res.json(searchedMovies);
    })
    .catch(error => {
      console.log(error);
    })
}

function getPlayListVideos(req, res) {
  const queryParam = req.query.param;
  let url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${queryParam}%20tutorials&key=${vidAPI_KEY}`
  axios.get(url)
    .then(result => {
      let searchedMovies = result.data.items.map(movie => {
        return movie
      })
      res.json(searchedMovies);
    })
    .catch(error => {
      console.log(error);
    })
}

function getQuizzes(req, res) {
  const queryParam = req.query.param;
  const url = `https://quiz.integritygrove.tech/api/v1/questions?cat=${queryParam}`;
  axios.get(url)
    .then(result => {
      let searchedQuizes = result.data.data.map(quiz => {
        return quiz
      })
      res.json(searchedQuizes);
    })
    .catch(error => {
      console.log(error);
    })
}
function getAllusers(req, res) {
  const sql = 'SELECT * FROM users;';
  client.query(sql).then(result => {
    res.json(result.rows);
  }).catch(error => {
    res.status(500).json({ error: 'Internal Server Error' });
  });
}

function addUser(req, res) {
  const { user_Id, user_name, user_Email } = req.body;
  const sql = 'INSERT INTO users VALUES ($1, $2, $3) RETURNING *;';
  const values = [user_Id, user_name, user_Email];

  client.query(sql, values).then(result => {
    res.status(201).json(result.rows);
  }).catch(error => {
    res.status(500).json({ error: 'Internal Server Error' });
  });
}

function updateUser(req, res) {
  const userId = req.params.id;
  const { user_name, user_Email } = req.body;
  const sql = 'UPDATE users SET user_name = $1, user_Email = $2 WHERE user_Id = $3 RETURNING *;';
  const values = [user_name, user_Email, userId];

  client.query(sql, values).then(result => {
    res.json(result.rows);
  }).catch(error => {
    res.status(500).json({ error: 'Internal Server Error' });
  });
}

function deleteUser(req, res) {
  const userId = req.params.id;
  const sql = 'DELETE FROM users WHERE user_Id = $1 RETURNING *;';
  const values = [userId];

  client.query(sql, values).then(result => {
    res.json(result.rows);
  }).catch(error => {
    res.status(500).json({ error: 'Internal Server Error' });
  });
}

// Courses
function getAllCorses(req, res) {
  const sql = 'SELECT * FROM course;';
  client.query(sql).then(result => {
    res.json(result.rows);
  }).catch(error => {
    res.status(500).json({ error: 'Internal Server Error' });
  });
}

function addCourse(req, res) {
  const { course_Id, course_name } = req.body;
  const sql = 'INSERT INTO course VALUES ($1, $2) RETURNING *;';
  const values = [course_Id, course_name];

  client.query(sql, values).then(result => {
    res.status(201).json(result.rows);
  }).catch(error => {
    res.status(500).json({ error: 'Internal Server Error' });
  });
}

// Registered Courses
function getRegCourses(req, res) {
  const sql = 'SELECT * FROM user_course;';
  client.query(sql).then(result => {
    res.json(result.rows);
  }).catch(error => {
    res.status(500).json({ error: 'Internal Server Error' });
  });
}

function addRegCourse(req, res) {
  const { user_Id, course_Id, completed } = req.body;
  const sql = 'INSERT INTO user_course VALUES ($1, $2, $3) RETURNING *;';
  const values = [user_Id, course_Id, completed];

  client.query(sql, values).then(result => {
    res.status(201).json(result.rows);
  }).catch(error => {
    res.status(500).json({ error: 'Internal Server Error' });
  });
}

function updateRegCourse(req, res) {
  const { user_Id, course_Id, completed } = req.body;
  const sql = 'UPDATE user_course SET completed = $1 WHERE user_Id = $2 AND course_Id = $3 RETURNING *;';
  const values = [completed, user_Id, course_Id];

  client.query(sql, values).then(result => {
    res.json(result.rows);
  }).catch(error => {
    res.status(500).json({ error: 'Internal Server Error' });
  });
}

function removeRegCourse(req, res) {
  const userId = req.params.id;
  const courseId = req.body.course_Id;
  const sql = 'DELETE FROM user_course WHERE user_Id = $1 AND course_Id = $2 RETURNING *;';
  const values = [userId, courseId];

  client.query(sql, values).then(result => {
    res.json(result.rows);
  }).catch(error => {
    res.status(500).json({ error: 'Internal Server Error' });
  });
}

// Reviews
function getReviews(req, res) {
  const sql = 'SELECT * FROM course_review;';
  client.query(sql).then(result => {
    res.json(result.rows);
  }).catch(error => {
    res.status(500).json({ error: 'Internal Server Error' });
  });
}

function postReview(req, res) {
  const { user_Id, course_Id, comment } = req.body;
  const sql = 'INSERT INTO course_review (user_Id, course_Id, comment) VALUES ($1, $2, $3) RETURNING *;';
  const values = [user_Id, course_Id, comment];

  client.query(sql, values).then(result => {
    res.status(201).json(result.rows);
  }).catch(error => {
    res.status(500).json({ error: 'Internal Server Error' });
  });
}

function updateReview(req, res) {
  const reviewId = req.params.id;
  const { comment } = req.body;
  const sql = 'UPDATE course_review SET comment = $1 WHERE review_ID = $2 RETURNING *;';
  const values = [comment, reviewId];

  client.query(sql, values).then(result => {
    res.json(result.rows);
  }).catch(error => {
    res.status(500).json({ error: 'Internal Server Error' });
  });
}

function deleteReview(req, res) {
  const reviewId = req.params.id;
  const sql = 'DELETE FROM course_review WHERE review_ID = $1 RETURNING *;';
  const values = [reviewId];

  client.query(sql, values).then(result => {
    res.json(result.rows);
  }).catch(error => {
    res.status(500).json({ error: 'Internal Server Error' });
  });
}



client.connect().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  })
}
).catch()