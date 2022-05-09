import { Grid, Typography, CircularProgress } from "@mui/material";
import React from "react";
import ParkDetails from "./ParkDetails";
import "../css/list.css";
import { useState, createRef, useEffect } from "react";

const List = ({ parks, childClicked, isLoading }) => {
    const [elRefs, setElRefs] = useState([]);

    useEffect(() => {
        setElRefs((refs) =>
            Array(parks.length)
                .fill()
                .map((_, i) => refs[i] || createRef())
        );
    }, [parks]);

    return (
        <div className="list-container">
            <Typography className="list-container-head" variant="h5">
                Parks around you
            </Typography>
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
