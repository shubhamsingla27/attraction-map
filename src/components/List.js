import { Grid, Typography, CircularProgress } from "@mui/material";
import React from "react";
import ParkDetails from "./ParkDetails";
import "../css/list.css";
import { useState, createRef, useEffect } from "react";
import { Autocomplete } from "@react-google-maps/api";

const List = ({ parks, childClicked, isLoading, setCoordinates }) => {
    const [elRefs, setElRefs] = useState([]);
    const [autocomplete, setAutocomplete] = useState(null);

    useEffect(() => {
        setElRefs((refs) =>
            Array(parks.length)
                .fill()
                .map((_, i) => refs[i] || createRef())
        );
    }, [parks]);

    const onLoad = (autoC) => setAutocomplete(autoC);
    const onPlaceChanged = () => {
        const lat = autocomplete.getPlace().geometry.location.lat();
        const lng = autocomplete.getPlace().geometry.location.lng();
        setCoordinates({ lat, lng });
    };
    return (
        <div className="list-container">
            <div className="list-container-div1" style={{ display: "flex" }}>
                <Typography className="list-container-head" variant="h5">
                    Attractions
                </Typography>
                <div
                    className="list-container-div1-div"
                    style={{ marginLeft: "auto" }}
                >
                    <Autocomplete
                        onLoad={onLoad}
                        onPlaceChanged={onPlaceChanged}
                    >
                        <div>
                            <input
                                type="text"
                                className="searchinp"
                                placeholder="Search.."
                                style={{}}
                            />
                        </div>
                    </Autocomplete>
                </div>
            </div>
            {isLoading ? (
                <div className="loading">
                    <CircularProgress size="5rem" />
                </div>
            ) : (
                <Grid container spacing={3} className="grid-list">
                    {parks?.map((park, i) => (
                        <Grid ref={elRefs[i]} key={i} item xs={12}>
                            <ParkDetails
                                park={park}
                                selected={Number(childClicked) === i}
                                refProp={elRefs[i]}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
        </div>
    );
};

export default List;
