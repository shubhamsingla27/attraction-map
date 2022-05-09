import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import axios from "../api/axios";
import AuthContext from "../context/AuthProvider";
import "../css/user.css";
import useAuth from "../hooks/useAuth";
import Map from "./Map";
import List from "./List";

import formatDistance from "date-fns/formatDistance";
import {
    Button,
    Grid,
    DialogTitle,
    DialogContentText,
    DialogContent,
    DialogActions,
    Dialog,
    Drawer,
    CssBaseline,
} from "@mui/material";

const GETDETAILS_URL = "/api/v2/people/me";
const RESET_URL = "/api/v2/people/reset_password";

const User = () => {
    const [parks, setParks] = useState([]);
    const [coordinates, setCoordinates] = useState({});
    const [bounds, setBounds] = useState({});
    const [childClicked, setChildClicked] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [resetResp, setResetResp] = useState("");
    const [state, setState] = React.useState({
        right: false,
    });
    const [userInfo, setUserInfo] = useState({
        created_at: "2019-01-29T05:55:25.608Z",
        display_name: "Display Name",
        email: "example@email.com",
        key: "",
        role: {
            key: "user",
            rank: 0,
        },
        updated_at: "2019-01-29T06:23:47.341Z",
    });
    const [open, setOpen] = React.useState(false);

    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);
    const logout = async () => {
        // if used in more components, this should be in context
        // axios to /login endpoint
        setAuth({});
        navigate("/login");
    };

    const { auth } = useAuth();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUserInfo = async () => {
            try {
                const response = await axios.get(GETDETAILS_URL, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: auth.accessToken,
                    },
                    signal: controller.signal,
                });
                isMounted && setUserInfo(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        getUserInfo();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            ({ coords: { latitude, longitude } }) => {
                setCoordinates({ lat: latitude, lng: longitude });
            }
        );
    }, []);

    useEffect(() => {
        if (bounds.sw && bounds.ne) {
            setIsLoading(true);
            const getParks = async () => {
                try {
                    const options = {
                        method: "GET",
                        url: "https://travel-advisor.p.rapidapi.com/attractions/list-in-boundary",
                        params: {
                            tr_longitude: bounds.ne.lng,
                            tr_latitude: bounds.ne.lat,
                            bl_longitude: bounds.sw.lng,
                            bl_latitude: bounds.sw.lat,
                        },
                        headers: {
                            "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
                            "X-RapidAPI-Key":
                                process.env.REACT_APP_RAPIDAPI_API_KEY,
                        },
                    };
                    const response = await axios(options);
                    setParks(
                        response.data.data?.filter(
                            (park) => park.name && park.num_reviews > 0
                        )
                    );
                    setIsLoading(false);
                } catch (err) {
                    console.error(err);
                }
            };
            getParks();
        }
    }, [bounds]);

    // Extract initals from display_name
    const getInitaisls = (name) => {
        let rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu");
        let initials = [...name.matchAll(rgx)] || [];
        return (initials = (
            (initials.shift()?.[1] || "") + (initials.pop()?.[1] || "")
        ).toUpperCase());
    };

    //Date distance:
    const dateDistance = (time) => {
        return formatDistance(new Date(time), new Date(), {
            addSuffix: true,
        });
    };

    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };

    const handleClose = () => {
        setOpen(false);
        setResetResp("");
    };

    const handleReset = async (e) => {
        try {
            const response = await axios.post(
                RESET_URL,
                JSON.stringify({ email: userInfo?.email }),
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            console.log(response.data);
            setResetResp(response.data.message);
            // console.log(JSON.stringify(response));
        } catch (err) {
            if (!err?.response) {
                setResetResp("No Server Response");
            } else {
                setResetResp("Reset Request Failed");
            }
        }
        setOpen(true);
    };

    const anchor = "right";

    return (
        <div className="usercomp">
            <header className="header">
                <h2 className="header-title">User Home Page</h2>
                <button
                    className="header-logo"
                    onClick={toggleDrawer(anchor, true)}
                >
                    {getInitaisls(userInfo?.display_name)}
                </button>
            </header>

            {/* <Box display="flex">
                <Typography variant="h6">Explore new place </Typography>
                <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                    <div>
                        <input
                            type="text"
                            className="searchinp"
                            placeholder="Search.."
                            style={{ marginLeft: "10px" }}
                        />
                    </div>
                </Autocomplete>
            </Box> */}
            <br />
            <CssBaseline />
            <Grid
                container
                spacing={3}
                className="usercomp-grid"
                style={{ width: "100%" }}
            >
                <Grid item xs={12} md={4}>
                    <List
                        parks={parks}
                        childClicked={childClicked}
                        isLoading={isLoading}
                        setCoordinates={setCoordinates}
                    />
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={8}
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Map
                        isLoading={isLoading}
                        setCoordinates={setCoordinates}
                        setBounds={setBounds}
                        coordinates={coordinates}
                        parks={parks}
                        setChildClicked={setChildClicked}
                    />
                </Grid>
            </Grid>

            <Drawer
                anchor={anchor}
                open={state[anchor]}
                onClose={toggleDrawer(anchor, false)}
            >
                {/* <div className="drawer-div"> */}
                <div>
                    <h2 className="drawer-head">{userInfo.display_name}</h2>
                    <h4 className="drawer-h4">{userInfo.email}</h4>
                    <span className="displaydate">
                        <h3 className="left grey">Account created:</h3>
                        <h4 className="grey">
                            {dateDistance(userInfo.created_at)}
                        </h4>
                    </span>
                </div>
                <div className="teeee">
                    <p className="btmmrgz grey">Security</p>
                    <span className="displaydate">
                        <h3 className="left grey">Last Update:</h3>
                        <h4 className="grey">
                            {dateDistance(userInfo.updated_at)}
                        </h4>
                    </span>
                </div>
                <div className="paddbtm">
                    <p onClick={handleReset} className="aligncent blue">
                        <span className="pointer">Reset Password</span>
                    </p>
                    <p onClick={logout} className="aligncent red">
                        <span className="pointer">Logout</span>
                    </p>
                </div>
                {/* </div> */}
            </Drawer>
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

export default User;
