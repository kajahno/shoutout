import React, { Component } from "react";
import PropTypes from "prop-types";

import MyButton from "../../util/MyButton";

// Redux
import { connect } from "react-redux";
import { likeShoutout, unlikeShoutout } from "../../redux/actions/dataActions";

import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import { Link } from "react-router-dom";

class LikeButton extends Component {
    constructor(props) {
        super(props);
    }

    likedShoutout = () => {
        if (
            this.props.user.likes &&
            this.props.user.likes.find(
                (like) => like.shoutoutId === this.props.shoutoutId
            )
        ) {
            return true;
        }
        return false;
    };

    likeShoutout = () => {
        this.props.likeShoutout(this.props.shoutoutId);
    };

    unlikeShoutout = () => {
        this.props.unlikeShoutout(this.props.shoutoutId);
    };

    render() {
        const {
            user: { authenticated },
        } = this.props;

        const likeButton = !authenticated ? (
            <Link to="/login">
                <MyButton tip="Like">
                    <FavoriteBorderIcon color="primary" />
                </MyButton>
            </Link>
        ) : this.likedShoutout() ? (
            <MyButton tip="Unlike" onClick={this.unlikeShoutout}>
                <FavoriteIcon color="primary" />
            </MyButton>
        ) : (
            <MyButton tip="Like" onClick={this.likeShoutout}>
                <FavoriteBorderIcon color="primary" />
            </MyButton>
        );

        return likeButton;
    }
}

LikeButton.propTypes = {
    shoutoutId: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    likeShoutout: PropTypes.func.isRequired,
    unlikeShoutout: PropTypes.func.isRequired,
};

const mapActionsToProps = {
    likeShoutout,
    unlikeShoutout,
};

const mapStateToProps = (state) => ({
    user: state.user,
});

export default connect(mapStateToProps, mapActionsToProps)(LikeButton);
