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
import { likeShoutout, unlikeShoutout } from "../redux/actions/dataActions";

import MyButton from "../util/MyButton";

// Icons
import ChatIcon from "@material-ui/icons/Chat";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

import DeleteShoutout from "./DeleteShoutout";

const styles = {
    card: {
        position: "relative",
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
    likedShoutout = () => {
        if (
            this.props.user.likes &&
            this.props.user.likes.find(
                (like) => like.shoutoutId === this.props.shoutout.shoutoutId
            )
        ) {
            return true;
        }
        return false;
    };

    likeShoutout = () => {
        this.props.likeShoutout(this.props.shoutout.shoutoutId);
    };

    unlikeShoutout = () => {
        this.props.unlikeShoutout(this.props.shoutout.shoutoutId);
    };

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

        const likeButton = !authenticated ? (
            <MyButton tip="Like">
                <Link to="/login">
                    <FavoriteBorderIcon color="primary" />
                </Link>
            </MyButton>
        ) : this.likedShoutout() ? (
            <MyButton tip="Unlike" onClick={this.unlikeShoutout}>
                <FavoriteIcon color="primary" />
            </MyButton>
        ) : (
            <MyButton tip="Like" onClick={this.likeShoutout}>
                <FavoriteBorderIcon color="primary" />
            </MyButton>
        );

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
                    {likeButton}
                    <span>{likeCount} likes</span>
                    <MyButton tip="comments">
                        <ChatIcon color="primary" />
                    </MyButton>
                    <span>{commentCount} comments</span>
                </CardContent>
            </Card>
        );
    }
}

Shoutout.propTypes = {
    user: PropTypes.object.isRequired,
    shoutout: PropTypes.object.isRequired,
    likeShoutout: PropTypes.func.isRequired,
    unlikeShoutout: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    user: state.user,
});

const mapActionsToProps = {
    likeShoutout,
    unlikeShoutout,
};

export default connect(
    mapStateToProps,
    mapActionsToProps
)(withStyles(styles)(Shoutout));
