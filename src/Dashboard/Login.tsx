import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import "./Login.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();


    /**
     * @method userNameValidation
     * @description userName validations requirements: name must not be empty. name should have email like format...eg- akshit@123.com or akshit.patyal@123.com.
     * @param {React.ChangeEvent<HTMLInputElement>} ev 
     */
    const userNameHandler = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const val = ev.target.value;
        setUserName(val);
    };

    /**
     * @method passwordValidation
     * @description password validation requirements: Minimum six characters, at least one uppercase letter, one lowercase letter, one number and one special character.
     * @param {React.ChangeEvent<HTMLInputElement>} ev 
     */
    const passwordHandler = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const val = ev.target.value;
        setPassword(val);
    };


    const loginHandler = async(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        try {
            const result = await axios.post(
              "http://localhost:8080/api/v1/auth/signin",
              {
                username: userName,
                password: password,
              }
            );
            sessionStorage.setItem("token", result.data.accessToken);
            sessionStorage.setItem("userDetails", JSON.stringify(result.data.userResponse));
            navigate('/profile', {replace: true});
          } catch {
           alert('Wrong username or password');
          }
    };

    return (
        <div className="login-container">
            <div className="form-container">
                <div className="form-comp">
                    <h1>Sign In</h1>
                    <Form className="form-data">
                        <Form.Group className="form-floating mb-3">
                            <Form.Control type="input" placeholder="UserName" id="floatingName" value={userName} onChange={userNameHandler} />
                            <Form.Label htmlFor="floatingName">UserName</Form.Label>
                        </Form.Group>
                        <Form.Group className="form-floating mb-3">
                            <Form.Control type="password" placeholder="Password" id="floatingPassword" value={password} onChange={passwordHandler} />
                            <Form.Label htmlFor="floatingPassword">Password</Form.Label>
                        </Form.Group>
                        <Button onClick={loginHandler} className="mt-4">
                            Login
                        </Button>
                    </Form>
                    <div className="login-txt mt-3 text-center">
                        <p className="guest-txt">Don't have an account? <Button size="sm" variant="danger"  onClick={() => navigate("/signup")}>SignUp</Button></p>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Login;