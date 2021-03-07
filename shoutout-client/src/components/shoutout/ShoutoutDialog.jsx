import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import dayjs from "dayjs";

// Redux
import { connect } from "react-redux";
import { getShoutout, clearErrors } from "../../redux/actions/dataActions";

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

import MyButton from "../../util/MyButton";
import LikeButton from "./LikeButton";
import Comments from "./Comments";
import CommentForm from "./CommentForm";

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
    visibleSeparator: {
        width: "100%",
        borderBottom: "1px solid rgba(0,0,0,0.1)",
        marginBottom: 20,
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
            oldPath: "",
            newPath: "",
        };
    }

    componentDidMount() {
        if (this.props.openDialog) {
            this.handleOpen();
        }
    }

    handleOpen = () => {
        const oldPath = window.location.pathname;

        const { userHandle, shoutoutId } = this.props;
        const newPath = `/users/${userHandle}/shoutout/${shoutoutId}`;

        if (oldPath === newPath) oldPath = `/users/${userHandle}`;

        window.history.pushState(null, null, newPath);

        this.setState({ open: true, oldPath, newPath });
        this.props.getShoutout(this.props.shoutoutId);
    };

    handleClose = () => {
        window.history.pushState(null, null, this.state.oldPath);

        this.setState({ open: false });
        this.props.clearErrors();
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
                comments,
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
                <hr className={classes.visibleSeparator} />
                <CommentForm shoutoutId={shoutoutId} />
                <Comments comments={comments} />
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
    clearErrors,
};

export default connect(
    mapStateToProps,
    mapActionsToProps
)(withStyles(styles)(ShoutoutDialog));
