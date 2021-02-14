import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";

import { Link } from "react-router-dom";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

const styles = {
    card: {
        display: "flex",
        // maxWidth: 500,
        marginBottom: 20,
    },
    image: {
        minWidth: 200,
    },
    content: {
        padding: 25,
        objectFit: "cover",
    },
};

class Shoutout extends Component {
    render() {
        const {
            classes,
            shoutout: {
                body,
                createdAt,
                imageUrl,
                shoutoutId,
                userHandle,
                likeCount,
                commentCount,
            },
        } = this.props;

        return (
            <Card className={classes.card}>
                <CardMedia
                    image={imageUrl}
                    title="Profile image"
                    className={classes.image}
                ></CardMedia>
                <CardContent className={classes.content}>
                    <Typography
                        variant="h5"
                        component={Link}
                        to={`/users/${userHandle}`}
                        color="primary"
                    >
                        {userHandle}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {createdAt}
                    </Typography>
                    <Typography variant="body1">{body}</Typography>
                </CardContent>
            </Card>
        );
    }
}

export default withStyles(styles)(Shoutout);
