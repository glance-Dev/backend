CREATE TABLE users (
    user_Id varchar(255) PRIMARY KEY,
    user_name varchar(255),
    user_Email varchar(255)
);
CREATE TABLE course (
    course_Id varchar(255) PRIMARY KEY,
    course_name varchar(255)
);
CREATE TABLE user_course (
    user_Id varchar(255),
    course_Id varchar(255),
    completed BOOLEAN DEFAULT false,
    PRIMARY KEY (user_Id, course_Id),
    FOREIGN KEY (user_Id) REFERENCES users(user_Id),
    FOREIGN KEY (course_Id) REFERENCES course(course_Id)
);
CREATE TABLE course_review (
    review_ID SERIAL PRIMARY KEY,
    user_Id VARCHAR(255) REFERENCES users(user_Id),
    course_Id VARCHAR(255) REFERENCES course(course_Id),
    comment TEXT
);









