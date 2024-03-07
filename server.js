//calling the packages
const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const axios = require('axios');
const cors = require('cors');
app.use(cors());
const port = process.env.PORT;
vidAPI_KEY = process.env.videoAPI_KEY;

//Database connection
const { Client } = require('pg');
const url = process.env.DB_URL;
const client = new Client(url);

//Routes
app.get('/user', getAllUsers);
app.post('/user', addUser);
app.put('/user/:id', updateUser);
app.delete('/user/:id', deleteUser);

app.get('/course', getAllCourses);
app.post('/course', addCourse);

app.get('/regCourse', getRegisteredCourses);
app.post('/regCourse', addRegisteredCourse);
app.put('/regCourse/:userId/:courseId', updateRegisteredCourse);
app.delete('/regCourse/:userId/:courseId', removeRegisteredCourse);

app.get('/review', getReviews);
app.post('/review', postReview);
app.patch('/review/:id', updateReview);
app.delete('/review/:id', deleteReview);

app.get('/video', getVideoInfo); /* this route gives us a video about the topic */
app.get('/playlist', getPlayListVideos); /* this route gives us a playlist of videos */
app.get('/quiz', getQuizzes);

//Handlers
function getVideoInfo(req, res) {
  const queryParam = req.query.param;
  let url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${queryParam}%20tutorials&type=video&key=${vidAPI_KEY}`;
  axios.get(url)
    .then(result => {
      res.json(result.data.items);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
}

function getPlayListVideos(req, res) {
  const queryParam = req.query.param;
  let url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${queryParam}%20tutorials&key=${vidAPI_KEY}`;
  axios.get(url)
    .then(result => {
      res.json(result.data.items);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
}

function getQuizzes(req, res) {
  const queryParam = req.query.param;
  const url = `https://quiz.integritygrove.tech/api/v1/questions?cat=${queryParam}`;
  axios.get(url)
    .then(result => {
      res.json(result.data.data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
}

// User Routes
function getAllUsers(req, res) {
  const sql = 'SELECT * FROM users;';
  client.query(sql)
    .then(result => {
      res.json(result.rows);
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
}

function addUser(req, res) {
  const { user_id, user_name, user_email } = req.body;
  const sql = 'INSERT INTO users VALUES ($1, $2, $3) RETURNING *;';
  const values = [user_id, user_name, user_email];
  client.query(sql, values)
    .then(result => {
      res.status(201).json(result.rows);
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
}
function updateUser(req, res) {
  const userId = req.params.id;
  const { user_id, user_name, user_email } = req.body;
  const sql = 'UPDATE users SET user_id =$1, user_name = $2, user_email = $3 WHERE user_id = $4 RETURNING *;';
  const values = [user_id, user_name, user_email, userId];
  client.query(sql, values)
    .then(result => {
      res.json(result.rows);
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
}
function deleteUser(req, res) {
  const userId = req.params.id;
  const sql = 'DELETE FROM users WHERE user_id = $1 RETURNING *;';
  const values = [userId];
  client.query(sql, values)
    .then(result => {
      res.json(result.rows);
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
}
// Course Routes
function getAllCourses(req, res) {
  const sql = 'SELECT * FROM course;';
  client.query(sql)
    .then(result => {
      res.json(result.rows);
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
}
function addCourse(req, res) {
  const { course_id, course_name } = req.body;
  const sql = 'INSERT INTO course VALUES ($1, $2) RETURNING *;';
  const values = [course_id, course_name];
  client.query(sql, values)
    .then(result => {
      res.status(201).json(result.rows);
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
}
// Registered Courses Routes
function getRegisteredCourses(req, res) {
  const sql = 'SELECT * FROM user_course;';
  client.query(sql)
    .then(result => {
      res.json(result.rows);
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
}
function addRegisteredCourse(req, res) {
  const { user_id, course_id, completed, course_name } = req.body;
  const sql = 'INSERT INTO user_course VALUES ($1, $2, $3, $4) RETURNING *;';
  const values = [user_id, course_id, completed, course_name];
  client.query(sql, values)
    .then(result => {
      res.status(201).json(result.rows);
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
}

function updateRegisteredCourse(req, res) {
  const { user_id, course_id, completed, course_name } = req.body;
  const sql = 'UPDATE user_course SET user_id = $1, course_id=$2, completed=$3,course_name=$4 WHERE user_id = $5 AND course_id = $6 RETURNING *;';
  const values = [user_id, course_id, completed, course_name, user_id, course_id];
  client.query(sql, values)
    .then(result => {
      res.json(result.rows);
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
}
function removeRegisteredCourse(req, res) {
  const userId = req.params.userId;
  const courseId = req.params.courseId;
  const sql = 'DELETE FROM user_course WHERE user_id = $1 AND course_id = $2 RETURNING *;';
  const values = [userId, courseId];
  client.query(sql, values)
    .then(result => {
      res.json(result.rows);
    })
    .catch(error => {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
}

// Reviews Routes


function getReviews(req, res) {
  const sqlGetReviews = 'SELECT * FROM course_review;';
  client.query(sqlGetReviews)
    .then(result => {
      res.json(result.rows);
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
}
function postReview(req, res) {
  const { user_id, course_id, comment } = req.body;
  const values = [user_id, course_id, comment];
  const sqlPostReview = 'INSERT INTO course_review (user_id, course_id, comment) VALUES ($1, $2, $3) RETURNING *;';
  client.query(sqlPostReview, values)
    .then(result => {
      res.status(201).json(result.rows);
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
}

function updateReview(req, res) {
  const reviewId = req.params.id;
  const { comment } = req.body;
  const sqlUpdateReview = 'UPDATE course_review SET comment = $1 WHERE review_id = $2 RETURNING *;';

  const values = [comment, reviewId];
  client.query(sqlUpdateReview, values)
    .then(result => {
      res.json(result.rows);
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
}

function deleteReview(req, res) {
  const reviewId = req.params.id;
  const values = [reviewId];
  const sqlDeleteReview = 'DELETE FROM course_review WHERE review_id = $1 RETURNING *;';
  client.query(sqlDeleteReview, values)
    .then(result => {
      res.json(result.rows);
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
}

client.connect().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(error => {
  console.error('Database connection error:', error);
});
