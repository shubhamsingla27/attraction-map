import React from "react";
import GoogleMapReact from "google-map-react";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { Paper, Typography, useMediaQuery } from "@mui/material";
import "../css/map.css";

const Map = ({
    isLoading,
    setCoordinates,
    setBounds,
    coordinates,
    parks,
    setChildClicked,
}) => {
    const matches = useMediaQuery("(min-width:600px)");
    return (
        <div className="mapcontainer">
            <GoogleMapReact
                bootstrapURLKeys={{
                    key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
                }}
                center={coordinates}
                defaultCenter={coordinates}
                defaultZoom={12}
                margin={[50, 50, 50, 50]}
                mapContainerStyle={{ width: "100%", height: "100%" }}
                onChange={(e) => {
                    setCoordinates({ lat: e.center.lat, lng: e.center.lng });
                    setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw });
                    console.log(e);
                }}
                onChildClick={(child) => setChildClicked(child)}
            >
                {parks?.map((park, i) => (
                    <div
                        className="markerContainer"
                        lat={Number(park.latitude)}
                        lng={Number(park.longitude)}
                        key={i}
                    >
                        {!matches ? (
                            <LocationOnOutlinedIcon
                                color="primary"
                                fontSize="large"
                            />
                        ) : (
                            <>
                                <LocationOnOutlinedIcon
                                    color="primary"
                                    fontSize="large"
                                />
                                <Paper elevation={3} className="mappaper">
                                    <Typography
                                        className="mapper-typography"
                                        variant="subtitle5"
                                        gutterBottom
                                    >
                                        {park.name}
                                    </Typography>
                                </Paper>
                            </>
                        )}
                    </div>
                ))}
            </GoogleMapReact>
        </div>
    );
};

export default Map;
