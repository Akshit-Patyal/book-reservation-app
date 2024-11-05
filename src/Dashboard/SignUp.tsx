import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faCaretDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import "./SignUp.scss";
import axios from "axios";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isuserNameValid, setIsUserNameValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);

  const navigate = useNavigate();

  const userNameHandler = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const val = ev.target.value;
    const regex = /^[a-zA-Z0-9_]+$/;
    if (val.length === 0) {
        setIsUserNameValid(false);
    } else if (regex.test(val)) {
        setIsUserNameValid(true);
    } else {
        setIsUserNameValid(false);
    }
    setUserName(val);
  };

  const emailHandler = (ev: React.ChangeEvent<HTMLInputElement>) => {
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
    setEmail(val);
  };

  /**
   * @method passwordValidation
   * @description password validation requirements: Minimum six characters, at least one uppercase letter, one lowercase letter, one number and one special character.
   * @param {React.ChangeEvent<HTMLInputElement>} ev
   */
  const passwordValidation = (ev: React.ChangeEvent<HTMLInputElement>) => {
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
    setPassword(val);
  };

  const submitHandler = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (isEmailValid && passwordValid) {
      try {
        const result = await axios.post(
          "http://localhost:8080/api/v1/auth/signup",
          {
            username: userName,
            email: email,
            password: password,
            roles: ["user"],
            phone: "1234567890",
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
    <div className="signup-container">
      <div className="header-container">
        <div className="header-btn">
          <Button className="dropdown-btn">
            <FontAwesomeIcon icon={faGlobe} className="globe-icon" />
            English
            <FontAwesomeIcon icon={faCaretDown} className="down-icon" />
          </Button>
          <Button className="signIn-btn" onClick={() => navigate("/login")}>
            Sign In
          </Button>
        </div>
      </div>
      <center>
        <div className="body-container">
          <h1 className="mb-4">Like Reading Books?</h1>
          <h3 className="mb-3">Rent Or Exchange Books Anytime.</h3>
          <Form>
            <Form.Label className="mb-5">
              Enter your email to create or restart your membership.
            </Form.Label>
            <div className="get-start">
              <Form.Group className="form-floating mb-4">
                <Form.Control
                  type="input"
                  placeholder="userName"
                  id="floatingName"
                  value={userName}
                  onChange={userNameHandler}
                />
                {!isuserNameValid && (
                  <span className="valid">
                    Please enter a valid user name.
                  </span>
                )}
                <Form.Label>Enter your userName</Form.Label>
              </Form.Group>
              <Form.Group className="form-floating mb-4">
                <Form.Control
                  type="email"
                  placeholder="Email address"
                  id="floatingEmail"
                  value={email}
                  onChange={emailHandler}
                />
                {!isEmailValid && (
                  <span className="valid">
                    Please enter a valid email address or phone number.
                  </span>
                )}
                <Form.Label>Enter your email address</Form.Label>
              </Form.Group>
              <Form.Group className="form-floating mb-4">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  id="floatingPassword"
                  value={password}
                  onChange={passwordValidation}
                />
                <Form.Label htmlFor="floatingPassword">
                  Create Password
                </Form.Label>
                {!passwordValid && (
                  <span className="valid">
                    Your password must be strong.
                  </span>
                )}
              </Form.Group>
              <Button onClick={submitHandler}>
                Get Started
                <FontAwesomeIcon icon={faChevronRight} className="right-icon" />
              </Button>
            </div>
          </Form>
        </div>
      </center>
    </div>
  );
};

export default SignUp;
