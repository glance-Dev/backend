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
const port = process.env.PORT 

//Database connection
const { Client } = require('pg')
// const url = 'postgres://xdtvgqoy:71NeQMRSLW8Yqb4PFdPi2PgejzTCpsNH@balarama.db.elephantsql.com/xdtvgqoy' /* Makarm's's DB */
const url =process.env.DB_URL  //the server is connecting with Abdelrahman DB
const client = new Client(url)

//Routes
app.get('/user',getAllusers)
app.post('/user', addUser)
app.put('/user/:id', updateUser)
app.delete('/user/:id', deleteUser)

app.get('/cousre',getAllCorses)
app.post('/course', addCourse)

app.get('/regCourse', getRegCourses)
app.post("/regCourse", addRegCourse)
app.put('/regCourse/:id',updateRegCourse)
app.delete('/regCourse/:id', removeRegCourse)

app.get('/review', getReviews)
app.post('/review', postReview)
app.put('/review/:id', updateReview)
app.delete('/review/:id', deleteReview)

//APIs Routes
app.get('/quizes',getQuizes)
app.get('/video',getVideo)

//Handlers
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


  
//fixed categories

//   function getQuizes(req, res) {
//     const languages = ["javascript", "html", "react", "css"];
//     const promises = [];

//     for (let i = 0; i < languages.length; i++) {
//         const url = `https://quiz.integritygrove.tech/api/v1/questions?cat=${languages[i]}`;
//         promises.push(axios.get(url));
//     }

//     Promise.all(promises)
//         .then(results => {
//             const responseData = results.map(result => result.data);
//             res.json(responseData); 
//         })
//         .catch(error => {
//             console.error(error);
//             res.status(500).send('Internal Server Error');
//         });
// }

//categories passed by front end as a parameter
function getQuizes(req, res, category) {
  const url = `https://quiz.integritygrove.tech/api/v1/questions?cat=${category}`;

  axios.get(url)
      .then(result => {
          res.json(result.data); 
      })
      .catch(error => {
          console.error(error);
          res.status(500).send('Internal Server Error');
      });
}

function getVideo(req,res,category){
  
  let url =`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${category}%20tutorials&type=video&key=AIzaSyBF0Wn6ymwPScEGakDBSemYmGs9is4TfbU`
  axios.get(url)
  .then(result=>{
    const videoIds = result.data.items.map(item => item.id.videoId);
            res.json(videoIds);
      })
      .catch(error=>{
      console.log(error)
      res.status(500).send('Internal Server Error');
  })
}

client.connect().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })
}
).catch()