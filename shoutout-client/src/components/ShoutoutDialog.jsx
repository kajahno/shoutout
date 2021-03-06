import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import dayjs from "dayjs";

// Redux
import { connect } from "react-redux";
import { getShoutout } from "../redux/actions/dataActions";

import MyButton from "../util/MyButton";

// Icons
import {
    Close as CloseIcon,
    UnfoldMore,
    Chat as ChatIcon,
} from "@material-ui/icons/";

// MUI
import {
    CircularProgress,
    Dialog,
    DialogContent,
    Grid,
    Link,
    Typography,
} from "@material-ui/core/";

import LikeButton from "./LikeButton";

const styles = {
    expandButton: {
        position: "absolute",
        left: "90%",
    },
    closeButton: {
        position: "absolute",
        left: "90%",
    },
    dialogContent: {
        padding: 20,
    },
    profileImage: {
        maxWidth: 200,
        height: 200,
        borderRadius: "50%",
        objectFit: "cover",
    },
    invisibleSeparator: {
        border: "none",
        margin: 4,
    },
    spinnerDiv: {
        textAlign: "center",
        marginTop: 10,
        marginBottom: 10,
    },
};

class ShoutoutDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            shoutout: {},
            errors: {},
        };
    }

    handleOpen = () => {
        this.setState({ open: true });
        this.props.getShoutout(this.props.shoutoutId);
    };
    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        const {
            classes,
            shoutout: {
                shoutoutId,
                body,
                createdAt,
                likeCount,
                commentCount,
                imageUrl,
                userHandle,
            },
            UI: { loading },
        } = this.props;

        const dialogMarkup = loading ? (
            <div className={classes.spinnerDiv}>
                <CircularProgress size={200} thickness={2} />
            </div>
        ) : (
            <Grid container spacing={16}>
                <Grid item sm={5}>
                    <img
                        src={imageUrl}
                        alt="Profile"
                        className={classes.profileImage}
                    />
                </Grid>
                <Grid item sm={7}>
                    <Typography
                        component={Link}
                        color="primary"
                        variant="h5"
                        to={`/users/${userHandle}`}
                    >
                        @{userHandle}
                    </Typography>
                    <hr className={classes.invisibleSeparator} />
                    <Typography variant="body2" color="textSecondary">
                        {dayjs(createdAt).format("h:mm a, MMM DD YYYY")}
                    </Typography>
                    <hr className={classes.invisibleSeparator} />
                    <Typography variant="body1">{body}</Typography>
                    <LikeButton shoutoutId={shoutoutId} />
                    <span>{likeCount} likes</span>
                    <MyButton tip="comments">
                        <ChatIcon color="primary" />
                    </MyButton>
                    <span>{commentCount} comments</span>
                </Grid>
            </Grid>
        );

        return (
            <Fragment>
                <MyButton
                    onClick={this.handleOpen}
                    tip="Expand shoutout"
                    tipClassName={classes.expandButton}
                >
                    <UnfoldMore color="primary" />
                </MyButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm"
                >
                    <MyButton
                        tip="Close"
                        onClick={this.handleClose}
                        className={classes.closeButton}
                    >
                        <CloseIcon color="primary" />
                    </MyButton>
                    <DialogContent className={classes.dialogContent}>
                        {dialogMarkup}
                    </DialogContent>
                </Dialog>
            </Fragment>
        );
    }
}

ShoutoutDialog.propTypes = {
    getShoutout: PropTypes.func.isRequired,
    shoutoutId: PropTypes.string.isRequired,
    userHandle: PropTypes.string.isRequired,
    shoutout: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    shoutout: state.data.shoutout,
    UI: state.UI,
});

const mapActionsToProps = {
    getShoutout,
};

export default connect(
    mapStateToProps,
    mapActionsToProps
)(withStyles(styles)(ShoutoutDialog));
