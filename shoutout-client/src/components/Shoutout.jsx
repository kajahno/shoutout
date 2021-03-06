import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import { Link } from "react-router-dom";

// MUI
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Redux
import { connect } from "react-redux";

import MyButton from "../util/MyButton";

// Icons
import ChatIcon from "@material-ui/icons/Chat";

import DeleteShoutout from "./DeleteShoutout";
import ShoutoutDialog from "./ShoutoutDialog";
import LikeButton from "./LikeButton";

const styles = {
    card: {
        position: "relative",
        display: "flex",
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
        dayjs.extend(relativeTime);
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
            user: {
                authenticated,
                credentials: { handle },
            },
        } = this.props;

        const deleteButton =
            authenticated && userHandle === handle ? (
                <DeleteShoutout shoutoutId={shoutoutId} />
            ) : (
                <></>
            );

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
                    {deleteButton}
                    <Typography variant="body2" color="textSecondary">
                        {dayjs(createdAt).fromNow()}
                    </Typography>
                    <Typography variant="body2">{body}</Typography>
                    <LikeButton shoutoutId={shoutoutId} />
                    <span>{likeCount} likes</span>
                    <MyButton tip="comments">
                        <ChatIcon color="primary" />
                    </MyButton>
                    <span>{commentCount} comments</span>
                    <ShoutoutDialog
                        shoutoutId={shoutoutId}
                        userHandle={userHandle}
                    />
                </CardContent>
            </Card>
        );
    }
}

Shoutout.propTypes = {
    user: PropTypes.object.isRequired,
    shoutout: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    user: state.user,
});

export default connect(mapStateToProps)(withStyles(styles)(Shoutout));
