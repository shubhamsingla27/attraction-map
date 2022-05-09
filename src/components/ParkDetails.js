import React from "react";
import {
    Box,
    Typography,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
} from "@mui/material";
import Rating from "@mui/material/Rating";

const ParkDetails = ({ park, selected, refProp }) => {
    if (selected)
        refProp?.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });

    return (
        <Card elevation={6}>
            <CardMedia
                style={{ height: 200 }}
                image={
                    park.photo
                        ? park.photo.images.large.url
                        : "https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg"
                }
                title={park.name}
            />
            <CardContent>
                <Typography gutterBottom variant="h5">
                    {park.name}
                </Typography>
                <Box display="flex" justifyContent="space-between" my={2}>
                    <Rating
                        name="read-only"
                        value={Number(park.rating)}
                        readOnly
                    />
                    <Typography component="legend">
                        {park.num_reviews} review{park.num_reviews > 1 && "s"}
                    </Typography>
                </Box>
                <Typography gutterBottom variant="subtitle1">
                    {park.address}
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    color="primary"
                    onClick={() => window.open(park.website, "_blank")}
                >
                    Website
                </Button>
            </CardActions>
        </Card>
    );
};

export default ParkDetails;
