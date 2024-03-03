# backend

## Routes
- app.get('/user', getAllusers)
    - This route will give us all the info about all the users
- app.post('/user', addUser)
    - Will add a new user with (user_Id, user_name, user_Email) as fields
- app.put('/user/:id', updateUser)
    - Will update a user info using the same fields
- app.delete('/user/:id', deleteUser)
    - Delete a user
- app.get('/cousre', getAllCorses)
    - Returning  all courses in the database
- app.post('/course', addCourse)
    - Add acourse to DB using using (course_Id, course_name) as values

- app.get('/regCourse', getRegCourses)
    - Returns the all courses that are registered bu the users,
    note that it has also other functionalites like:
        - Returning (user_Id, course_Id, completed) which will help us
        to determain which course is taken by whom and it has a flag that indicate the compeltion of a course or not,
        Not to mention that we can use it to show a specific courses that a user subscribed to.
- app.post("/regCourse", addRegCourse)
    - Add a new relationship between a User and a Course using (user_Id, course_Id, completed)
- app.put('/regCourse/:id', updateRegCourse)
    - Updating that relation as we mainly will use this if a user decide to unsubsribe from a course or he completed it so we can use this route to change the flag value.
- app.delete('/regCourse/:id', removeRegCourse)
    - Delete  the relation between a User and a Course.

- app.get('/review', getReviews)
    - Getting all the reviews rom the DB with ( user_Id, course_Id, comment) if needed.
- app.post('/review', postReview)
    - posting A new review, note that when you want to use this route you have to make sure that these values ( user_Id, course_Id) are actual data in the DB and have corresponding users/courses as it will through an error if not filled in correctly.
- app.put('/review/:id', updateReview) 
    - Udpate the relation
- app.delete('/review/:id', deleteReview)
    - Delete a review 


## app.get('/video', getVideoInfo) 
    - This API route will return a json file that contains:
        - Json opening -> Items[-> id, snippet{title,description...etc}] 
        - This API will return a single video about the searched topic.
        - Please when making arequest follow this format:
            - URL/video?param=serchere
## app.get('/playlist', getPlayListVideos)
    - This route will return a playlist about the searched topic.
        - PLease follow the same format as the previous API.
            - URL/video?param=serchere
## app.get('/quiz', getQuizzes)
* This route will return a josn obj that contains a bunch of question about the serached subject.
    - PLease be very careful dealing with this API it does not have a wide range of question available and will sometimes not work.
        - Please be very strict with the request format as thie route will not take any wrong fomrat:
            - strictly follow this format:
                - https://projectserver-wxkm.onrender.com/quiz?param=css
                     - **Note that the serached topic (/quiz?param=css) can't and will not take anything else like "" or '' or any other syntax as it will cause errors**
