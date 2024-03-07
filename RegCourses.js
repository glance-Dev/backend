import React, { useState, useEffect } from 'react';
import './RegCourses.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
function Courses() {
    const [allcourses, setAllcourses] = useState([]);
    const [comment, setComment] = useState("");
    const fetchCourses = async () => {
        try {
            const res = await fetch('https://projectserver-wxkm.onrender.com/regCourse');
            const data = await res.json();
            setAllcourses(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);
    const filteredCourses = allcourses.filter(course => course.user_id ==="auth0|65e7662c858d1fb60b75f2b2"  && course.completed==false);
    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const deleteComment = async (course_id) => {
        const serverURL = `https://projectserver-wxkm.onrender.com/review/1`;
        try {
            const res = await fetch(serverURL, { method: "DELETE" });
            console.log("deleted");
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    }
    const handleCommentUpdate = async (course_Id, comment) => {
        // setComment("");
        try {
            await fetch(`https://projectserver-wxkm.onrender.com/review/2`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ comment: comment })

            });
        } catch (error) {
            console.error("Error updating comment:", error);
        }
    }
    
    return (
        <>
       <center> <h2 className='title'>Registered Courses</h2></center>

       <Row xs={1} md={4} className="g-4">
            {filteredCourses.map((course) => {
                return <Col key={course.course_Id}>
                   <Card style={{ width: '22rem', backgroundColor: '#555',color:'black' }}>
                   
                        <Card.Body>
                            <Card.Title>Name : {course.course_name}</Card.Title>
                            <div>
                                <textarea rows="1" cols="30" onChange={handleCommentChange}  placeholder="Add your comment" value={comment} style={{ backgroundColor: 'gray', color:'black' , border: '1px solid black'  }}></textarea>
                            </div>
                            <Button variant="dark" onClick={() => { deleteComment(course.course_Id) }}>Delete Comment</Button> &nbsp;
                            <Button variant="dark" onClick={() => handleCommentUpdate(course.course_Id,comment)}>Update Comment</Button>
                        </Card.Body>
                    </Card>
                </Col>
            })}
            </Row>

            <div id="stars"></div>
            <div id="stars2"></div>
            <div id="stars3"></div>
            <div class="section">
                <div class="container">
                    <div class="row full-height justify-content-center">
                        <div class="col-12 text-center align-self-center py-5">
                            <div class="section pb-5 pt-5 pt-sm-2 text-center">

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            
            
        </>
    );
        }

export default Courses;
