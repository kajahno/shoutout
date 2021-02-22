import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

// Redux
import { connect } from "react-redux";
import { deleteShoutout } from "../redux/actions/dataActions";

import MyButton from "../util/MyButton";

// Icons
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

// MUI
import { Button, Dialog, DialogActions, DialogTitle } from "@material-ui/core/";

const styles = {
    deleteButton: {
        left: "90%",
        top: "10%", 
        position: "absolute",
    },
};

class DeleteShoutout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
    }

    handleOpen = () => {
        this.setState({
            open: true,
        });
    };

    handleClose = () => {
        this.setState({
            open: false,
        });
    };

    deleteShoutout = () => {
        this.props.deleteShoutout(this.props.shoutoutId);
        this.setState({
            open: false,
        });
    };

    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <MyButton
                    tip="delete"
                    onClick={this.handleOpen}
                    btnClassName={classes.deleteButton}
                >
                    <DeleteOutlineIcon color="secondary" />
                </MyButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle>
                        Are you sure you want to delete this shoutout?
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.deleteShoutout} color="secondary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

DeleteShoutout.propTypes = {
    shoutoutId: PropTypes.string.isRequired,
    deleteShoutout: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

export default connect(null, { deleteShoutout })(
    withStyles(styles)(DeleteShoutout)
);
