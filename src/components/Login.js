import React, { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
    Button,
    DialogTitle,
    DialogContentText,
    DialogContent,
    DialogActions,
    Dialog,
} from "@mui/material";

import "../css/login.css";

import axios from "../api/axios";
const LOGIN_URL = "/api/v2/people/authenticate";
const RESET_URL = "/api/v2/people/reset_password";
const EMAIL_REGEX =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const Login = () => {
    const { setAuth } = useAuth();

    const navigate = useNavigate();

    const userRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [resetResp, setResetResp] = useState("");
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg("");
    }, [email, pwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                LOGIN_URL,
                JSON.stringify({ email, password: pwd }),
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            const accessToken = response?.data?.authentication_token;
            const personDetails = response?.data?.person;

            setAuth({ email, pwd, personDetails, accessToken });
            setEmail("");
            setPwd("");
            navigate(`/${personDetails.role.key}`, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg("No Server Response");
            } else if (err.response?.status === 400) {
                setErrMsg("Missing Username or Password");
            } else {
                setErrMsg("Login Failed");
            }
            errRef.current.focus();
        }
    };
    const resetpwd = () => {
        const v1 = EMAIL_REGEX.test(email);
        if (email === "") {
            setErrMsg("Please enter an Email address first");
        } else if (!v1) {
            setErrMsg("Please enter a valid Email address");
        } else {
            handleReset();
        }
    };

    const handleReset = async (e) => {
        try {
            const response = await axios.post(
                RESET_URL,
                JSON.stringify({ email: email }),
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            setResetResp(response.data.message);
            setEmail("");
        } catch (err) {
            if (!err?.response) {
                setResetResp("No Server Response");
            } else {
                setResetResp("Reset Request Failed");
            }
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setResetResp("");
    };

    const togglePwd = () => {
        setShowPwd((prevState) => !prevState);
    };
    return (
        <div className="logincomp">
            <h1 className="logincomp_heading">
                Welcome!
                <br />
                Please login to continue.
            </h1>
            <section className="logincomp_section">
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        id="email"
                        ref={userRef}
                        autoComplete="on"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        required
                        placeholder="Email"
                    />

                    <input
                        type={showPwd ? "text" : "password"}
                        id="password"
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                        placeholder="Password"
                    />
                    <div onClick={togglePwd} className="showPwd">
                        {showPwd ? (
                            <>
                                <VisibilityOffOutlinedIcon color="primary" />
                                <span>Hide Password</span>
                            </>
                        ) : (
                            <>
                                <VisibilityOutlinedIcon color="primary" />
                                <span>Show Password</span>
                            </>
                        )}
                    </div>

                    <p
                        ref={errRef}
                        className={
                            errMsg ? "errmsg" : "offscreen" && "errorpara-login"
                        }
                        aria-live="assertive"
                    >
                        {errMsg}
                    </p>
                    <div className="forgotpwd">
                        <span onClick={resetpwd}>Forgot Password?</span>
                    </div>

                    <div className="pbtnslogin">
                        <button className="pbtnslogin--login">Login</button>
                        <button
                            onClick={() => {
                                navigate("/register");
                            }}
                            className="pbtnslogin--signup"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
            </section>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Password Reset"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {resetResp}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Login;
