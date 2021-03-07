import React from "react";
import PropTypes from "prop-types";

import NoImg from "../images/no-img.png";

// MUI
import withStyles from "@material-ui/core/styles/withStyles";
import { Card, CardContent, CardMedia, Paper } from "@material-ui/core";
import {
    CalendarToday,
    LocationOn,
    Link as LinkIcon,
} from "@material-ui/icons";

const styles = {
    paper: {
        padding: 20,
        marginLeft: 20,
    },
    profile: {
        "& .image-wrapper": {
            textAlign: "center",
            position: "relative",
            "& button": {
                position: "absolute",
                top: "80%",
                left: "70%",
            },
        },
        "& .profile-image": {
            width: 200,
            height: 200,
            objectFit: "cover",
            maxWidth: "100%",
            borderRadius: "50%",
        },
        "& .profile-details": {
            textAlign: "center",
            "& span, svg": {
                verticalAlign: "middle",
            },
            "& a": {
                color: "#00bcd4",
            },
        },
        "& hr": {
            border: "none",
            margin: "0 0 10px 0",
        },
        "& svg.button": {
            "&:hover": {
                cursor: "pointer",
            },
        },
    },
    buttons: {
        textAlign: "center",
        "& a": {
            margin: "20px 10px",
        },
    },
    handle: {
        height: 20,
        backgroundColor: "#00bcd4",
        width: 60,
        margin: "0 auto 7px auto",
    },
    fullLine: {
        height: 15,
        backgroundColor: "rgba(0,0,0,0.3)",
        width: "100%",
        marginBottom: 10,
    },
    halfLine: {
        height: 15,
        backgroundColor: "rgba(0,0,0,0.3)",
        width: "50%",
        margin: "auto auto 10px auto"
    },
};

const ProfileSkeleton = (props) => {
    const { classes } = props;
    return (
        <Paper className={classes.paper}>
            <div className={classes.profile}>
                <div className="image-wrapper">
                    <img
                        src={NoImg}
                        alt="profile"
                        className="profile-image"
                    />
                </div>
                <hr />
                <div className="profile-details">
                    <div className={classes.handle} />
                    <hr />
                    <div className={classes.fullLine} />
                    <div className={classes.halfLine} />
                    <hr />
                    <LocationOn color="primary" />
                    <span>Location</span>
                    <hr />
                    <LinkIcon color="primary">https://website.com </LinkIcon>
                    <hr />
                    <CalendarToday color="primary" /> Joined date
                </div>
            </div>
        </Paper>
    );
};

ProfileSkeleton.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProfileSkeleton);
