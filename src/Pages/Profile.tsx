import { useState } from "react";
import Header from "../Components/Header";
import "./Profile.scss";
import { Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  var userObj = JSON.parse(sessionStorage.userDetails);
  const [updatedEmail, setUpdatedEmail] = useState(userObj.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [updatedPassword, setUpdatedPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [isEditProfile, setIsEditProfile] = useState(false);

  const navigate = useNavigate();

  const setNewEmailHandler = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const val = ev.target.value;
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!isNaN(+val) && val.length === 10) {
      setIsEmailValid(true);
    } else if (val.length === 0) {
      setIsEmailValid(false);
    } else if (regex.test(val)) {
      setIsEmailValid(true);
    } else {
      setIsEmailValid(false);
    }
    setUpdatedEmail(val);
  };

  const setNewPasswordValidation = (
    ev: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = ev.target.value;
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (val.length === 0) {
      setPasswordValid(false);
    } else if (regex.test(val)) {
      setPasswordValid(true);
    } else {
      setPasswordValid(false);
    }
    setUpdatedPassword(val);
  };

  const passwordUpdateHandler = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (isEmailValid && passwordValid && currentPassword !== updatedPassword) {
      try {
        const result = await axios.put(
          "http://localhost:8080/api/v1/profile/update",
          {
            username: userObj.username,
            email: updatedEmail,
            currentPassword: currentPassword,
            newPassword: updatedPassword,
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
        navigate("/login");
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <Header />
      <div className="profile-container">
        <h1 className="mb-5"> Welcome {userObj.username}! </h1>
        <Button
          className="editBtn"
          onClick={() => setIsEditProfile(true)}
          variant="danger"
        >
          Edit Profile
        </Button>
        <Form>
          <div className="get-start">
            <Form.Group className="form-floating mb-4">
              <Form.Control
                type="input"
                placeholder="userName"
                id="floatingName"
                value={updatedEmail}
                onChange={setNewEmailHandler}
                readOnly={!isEditProfile}
              />
              {!isEmailValid && (
                <span className="valid">
                  Please enter a valid email address.
                </span>
              )}
              <Form.Label>Update your email address</Form.Label>
            </Form.Group>
            {isEditProfile && (
              <>
                <Form.Group className="form-floating mb-4">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    id="floatingCurrentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <Form.Label htmlFor="floatingCurrentPassword">
                    Enter Current Password
                  </Form.Label>
                </Form.Group>
                <Form.Group className="form-floating mb-4">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    id="floatingPassword"
                    value={updatedPassword}
                    onChange={setNewPasswordValidation}
                  />
                  <Form.Label htmlFor="floatingPassword">
                    Enter New Password
                  </Form.Label>
                  {!passwordValid && (
                    <span className="valid">Your password must be strong.</span>
                  )}
                </Form.Group>
              </>
            )}
          </div>
          <Button
            className="btnUpdate"
            onClick={passwordUpdateHandler}
            disabled={!isEditProfile}
            variant="danger"
          >
            Update
            <FontAwesomeIcon icon={faPenToSquare} className="edit-icon" />
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Profile;
