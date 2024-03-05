CREATE TABLE users (
    user_id varchar(255) PRIMARY KEY,
    user_name varchar(255),
    user_email varchar(255)
);
CREATE TABLE course (
    course_id varchar(255) PRIMARY KEY,
    course_name varchar(255)
);
CREATE TABLE user_course (
    user_id varchar(255),
    course_id varchar(255),
    completed BOOLEAN DEFAULT false,
    PRIMARY KEY (user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (course_id) REFERENCES course(course_id)
);
CREATE TABLE course_review (
    review_iD SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(user_id),
    course_id VARCHAR(255) REFERENCES course(course_id),
    comment TEXT
);








