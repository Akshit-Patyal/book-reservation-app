import { useState } from "react";
import Header from "../Components/Header";
import "./Profile.scss";
import { Button, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const AddBook = () => {
  const propData = useLocation();
  var userObj = JSON.parse(sessionStorage.userDetails);
  const [bookName, setBookName] = useState(propData?.state?.editFlag ? propData?.state?.updatedBookData?.title : "");
  const [bookGenre, setBookGenre] = useState(propData?.state?.editFlag ? propData?.state?.updatedBookData?.genre : "");
  const [bookAuthor, setBookAuthor] = useState(propData?.state?.editFlag ? propData?.state?.updatedBookData?.author : "");
  const [location, setLocation] = useState(propData?.state?.editFlag ? propData?.state?.updatedBookData?.location : "");
  const [bookCondition, setBookCondition] = useState(propData?.state?.editFlag ? propData?.state?.updatedBookData?.bookCondition : "");
  const [availability, setAvailability] = useState(propData?.state?.editFlag ? propData.state?.updatedBookData?.available : true);

  const navigate = useNavigate();

  const addBookHandler = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    try {
      const result = await axios.post(
        "http://localhost:8080/api/v1/book-mgmt/book",
        {
          userId: userObj.id,
          title: bookName,
          author: bookAuthor,
          genre: bookGenre,
          condition: bookCondition,
          location: location,
          available: availability,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${sessionStorage.token}`,
          },
        }
      );
      console.log(result);
      navigate("/bookList");
    } catch (error) {
      console.error(error);
    }
  };

  const updateBookHandler = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    try {
      const result = await axios.put(
        `http://localhost:8080/api/v1/book-mgmt/book/${propData?.state?.updatedBookData?.id}`,
        {
          userId: userObj.id,
          title: bookName,
          author: bookAuthor,
          genre: bookGenre,
          condition: bookCondition,
          location: location,
          available: availability,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${sessionStorage.token}`,
          },
        }
      );
      console.log(result);
      navigate("/bookList");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Header />
      <div className="profile-container">
        <h1 className="mb-5"> Add Your Book! </h1>
        <Form>
          <div className="get-start">
            <Form.Group className="form-floating mb-4">
              <Form.Control
                type="input"
                placeholder="addBookName"
                id="floatingName"
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
                required
              />
              <Form.Label>Enter Book Name</Form.Label>
            </Form.Group>
            <Form.Group className="form-floating mb-4">
              <Form.Control
                type="input"
                placeholder="addBookGenre"
                id="floatingGenre"
                value={bookGenre}
                onChange={(e) => setBookGenre(e.target.value)}
                required
              />
              <Form.Label>Enter Book Genre</Form.Label>
            </Form.Group>
            <Form.Group className="form-floating mb-4">
              <Form.Control
                type="input"
                placeholder="addBookAuthor"
                id="floatingAuthor"
                value={bookAuthor}
                onChange={(e) => setBookAuthor(e.target.value)}
                required
              />
              <Form.Label>Enter Book Author</Form.Label>
            </Form.Group>
            <Form.Group className="form-floating mb-4">
              <Form.Control
                type="input"
                placeholder="addLocation"
                id="floatingLocation"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
              <Form.Label>Enter Book Location</Form.Label>
            </Form.Group>
            <Form.Group className="form-floating mb-4">
              <Form.Control
                type="input"
                placeholder="addCondition"
                id="floatingCondition"
                value={bookCondition}
                onChange={(e) => setBookCondition(e.target.value)}
                required
              />
              <Form.Label>Enter Book Condition</Form.Label>
            </Form.Group>
            <div className="form-floating mb-4">
              <p style={{ color: "white" }}>Availability</p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
              >
                <div>
                  <label style={{ color: "white" }}>
                    <input
                      type="radio"
                      value="true"
                      onChange={() => setAvailability(!availability)}
                      checked={availability}
                    />
                    Yes
                  </label>
                </div>
                <div>
                  <label style={{ color: "white" }}>
                    <input
                      type="radio"
                      value="false"
                      onChange={() => setAvailability(!availability)}
                      checked={!availability}
                    />
                    No
                  </label>
                </div>
              </div>
            </div>
          </div>
          <Button
            className="btnAdd"
            onClick={propData?.state?.editFlag ? updateBookHandler :addBookHandler}
            disabled={bookAuthor === "" || bookGenre === "" || bookName === "" || location === "" || bookCondition===""}
            variant="danger"
            style={{ width: "400px" }}
          >
           {propData?.state?.editFlag ? "Update" : "Add"}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default AddBook;
