import React, { useRef, useState, useEffect } from "react";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import "../css/register.css";
import { useNavigate } from "react-router-dom";

const USER_REGEX = /^[A-z][A-z0-9-_ ]{3,49}$/;
const EMAIL_REGEX =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,1024}$/;
const REGISTRATION_URL = "/api/v2/people/create";

const Register = () => {
    const { setAuth } = useAuth();

    const navigate = useNavigate();

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState("");
    const [validName, setValidName] = useState(false);
    // const [userFocus, setUserFocus] = useState(false);

    const [email, setEmail] = useState("");
    const [validEmail, setValidEmail] = useState(false);
    // const [emailFocus, setEmailFocus] = useState(false);

    const [pwd, setPwd] = useState("");
    const [validPwd, setValidPwd] = useState(false);
    // const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState("");
    const [validMatch, setValidMatch] = useState(false);
    // const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user]);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd]);

    useEffect(() => {
        setErrMsg("");
    }, [user, email, pwd, matchPwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v1 = USER_REGEX.test(user);
        const v2 = EMAIL_REGEX.test(email);
        const v3 = PWD_REGEX.test(pwd);
        if (!v1 || !v2 || !v3) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post(
                REGISTRATION_URL,
                JSON.stringify({ display_name: user, email, password: pwd }),
                {
                    headers: { "Content-Type": "application/json" },
                    // withCredentials: true,
                }
            );
            console.log(response.data);
            // console.log(JSON.stringify(response));
            // setSuccess(true);
            const accessToken = response?.data?.authentication_token;
            const personDetails = response?.data?.person;
            setAuth({ email, pwd, personDetails, accessToken });
            setUser("");
            setEmail("");
            setPwd("");
            setMatchPwd("");
            navigate(`/${personDetails.role.key}`, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg("No Server Response");
            } else if (err.response?.status === 400) {
                setErrMsg("Email Already Registered");
            } else {
                setErrMsg("Registration Failed");
            }
            errRef.current.focus();
        }
    };

    return (
        <div className="regcomp">
            <h1 className="regcomp_heading">
                Please tell us a little about you!
            </h1>
            <section className="regcomp_section">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        id="username"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setUser(e.target.value)}
                        value={user}
                        required
                        aria-invalid={validName ? "false" : "true"}
                        aria-describedby="uidnote"
                        // onFocus={() => setUserFocus(true)}
                        // onBlur={() => setUserFocus(false)}
                        placeholder="Display Name"
                    />
                    <p
                        id="uidnote"
                        className={
                            // userFocus && user && !validName
                            user && !validName ? "instructions" : "offscreen"
                        }
                    >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        4 to 24 characters.
                        <br />
                        Must begin with a letter.
                        <br />
                        Letters, numbers, underscores, hyphens allowed.
                    </p>

                    <input
                        type="email"
                        id="email"
                        autoComplete="off"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        required
                        aria-invalid={validEmail ? "false" : "true"}
                        aria-describedby="emailnote"
                        // onFocus={() => setEmailFocus(true)}
                        // onBlur={() => setEmailFocus(false)}
                        placeholder="Email"
                    />
                    <p
                        id="emailnote"
                        className={
                            email && !validEmail ? "instructions" : "offscreen"
                        }
                    >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Enter a valid Email address.
                    </p>

                    <input
                        type="password"
                        id="password"
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                        aria-invalid={validPwd ? "false" : "true"}
                        aria-describedby="pwdnote"
                        // onFocus={() => setPwdFocus(true)}
                        // onBlur={() => setPwdFocus(false)}
                        placeholder="Password"
                    />
                    <p
                        id="pwdnote"
                        className={
                            pwd && !validPwd ? "instructions" : "offscreen"
                        }
                    >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        8 to 1024 characters.
                        <br />
                        Must include uppercase and lowercase letters, a number
                        and a special character.
                        <br />
                        Allowed special characters:{" "}
                        <span aria-label="exclamation mark">!</span>{" "}
                        <span aria-label="at symbol">@</span>{" "}
                        <span aria-label="hashtag">#</span>{" "}
                        <span aria-label="dollar sign">$</span>{" "}
                        <span aria-label="percent">%</span>
                    </p>

                    <input
                        type="password"
                        id="confirm_pwd"
                        onChange={(e) => setMatchPwd(e.target.value)}
                        value={matchPwd}
                        required
                        aria-invalid={validMatch ? "false" : "true"}
                        aria-describedby="confirmnote"
                        // onFocus={() => setMatchFocus(true)}
                        // onBlur={() => setMatchFocus(false)}
                        placeholder="Password Again"
                    />
                    <p
                        id="confirmnote"
                        className={
                            matchPwd && !validMatch
                                ? "instructions"
                                : "offscreen"
                        }
                    >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Must match the first password input field.
                    </p>
                    <p
                        ref={errRef}
                        className={
                            errMsg ? "errmsg" : "offscreen" && "errorpara"
                        }
                        aria-live="assertive"
                    >
                        {errMsg}
                    </p>
                    <div className="pbtns">
                        <button
                            className="pbtns--signup"
                            disabled={
                                !validName ||
                                !validEmail ||
                                !validPwd ||
                                !validMatch
                                    ? true
                                    : false
                            }
                        >
                            Sign Up
                        </button>
                        <button
                            onClick={() => {
                                navigate("/login");
                            }}
                            className="pbtns--login"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default Register;
