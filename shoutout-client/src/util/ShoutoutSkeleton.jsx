import React, { Fragment } from "react";
import { Redirect, Route } from "react-router-dom/cjs/react-router-dom.min";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";

import NoImg from "../images/no-img.png";

// MUI
import withStyles from "@material-ui/core/styles/withStyles";
import { Card, CardContent, CardMedia } from "@material-ui/core";

const styles = {
    card: {
        display: "flex",
        marginBottom: 20,
    },
    cardContent: {
        width: "100%",
        flexDirection: "column",
        padding: 25,
    },
    cover: {
        minWidth: 200,
        objectFit: "cover",
    },
    handle: {
        width: 60,
        height: 18,
        backgroundColor: "#00bcd4",
        marginBottom: 7,
    },
    date: {
        height: 14,
        width: 100,
        backgroundColor: "rgba(0,0,0,0.2)",
        marginBottom: 10,
    },
    fullLine: {
        height: 15,
        width: "90%",
        marginBottom: 10,
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    halfLine: {
        height: 15,
        width: "50%",
        marginBottom: 10,
        backgroundColor: "rgba(0,0,0,0.4)",
    },
};

const ShoutoutSkeleton = (props) => {
    const { classes } = props;

    const content = Array.from({ length: 5 }).map((item, index) => (
        <Card key={index} className={classes.card}>
            <CardMedia className={classes.cover} image={NoImg} />
            <CardContent className={classes.cardContent}>
                <div className={classes.handle} />
                <div className={classes.date} />
                <div className={classes.fullLine} />
                <div className={classes.fullLine} />
                <div className={classes.halfLine} />
            </CardContent>
        </Card>
    ));

    return <Fragment>{content}</Fragment>;
};

ShoutoutSkeleton.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ShoutoutSkeleton);
