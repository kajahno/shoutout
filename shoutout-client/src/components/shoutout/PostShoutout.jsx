import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

// Redux
import { connect } from "react-redux";
import { postShoutout, clearErrors } from "../../redux/actions/dataActions";

import MyButton from "../../util/MyButton";

// Icons
import { Add as AddIcon, Close as CloseIcon } from "@material-ui/icons/";

// MUI
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
} from "@material-ui/core/";

const styles = {
    submitButton: {
        position: "relative",
        marginTop: "10px",
        float: "right",
    },
    progressSpinner: {
        position: "absolute",
    },
    closeButton: {
        position: "absolute",
        left: "91%",
        top: "10%",
    },
    dialogTitle: {
        position: "relative",
        paddingBottom: 0,
    },
};

class PostShoutout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            body: "",
            errors: {},
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.UI.errors) {
            this.setState({
                errors: nextProps.UI.errors,
            });
        }
        if (!nextProps.UI.errors && !nextProps.UI.loading) {
            this.setState({
                body: "",
                open: false,
                errors: "",
            });
        }
    }

    handleOpen = () => {
        this.setState({
            open: true,
        });
    };

    handleClose = () => {
        this.props.clearErrors();
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.postShoutout({ body: this.state.body });
    };

    render() {
        const { errors } = this.state;
        const {
            classes,
            UI: { loading },
        } = this.props;

        return (
            <Fragment>
                <MyButton tip="Post a Shoutout!" onClick={this.handleOpen}>
                    <AddIcon />
                </MyButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle className={classes.dialogTitle}>
                        Post a shoutout!
                        <MyButton
                            tip="Close"
                            onClick={this.handleClose}
                            className={classes.closeButton}
                        >
                            <CloseIcon color="primary" />
                        </MyButton>
                    </DialogTitle>

                    <DialogContent>
                        <form onSubmit={this.handleSubmit}>
                            <TextField
                                name="body"
                                type="text"
                                label="Shoutout!"
                                multiline
                                rows="3"
                                placeholder="Shoutout at your mates"
                                error={errors.body ? true : false}
                                helperText={errors.body}
                                className={classes.textField}
                                onChange={this.handleChange}
                                fullWidth
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                className={classes.submitButton}
                                disabled={loading}
                            >
                                Submit
                                {loading && (
                                    <CircularProgress
                                        size={30}
                                        className={classes.progressSpinner}
                                    />
                                )}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </Fragment>
        );
    }
}

PostShoutout.propTypes = {
    postShoutout: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    UI: state.UI,
});

export default connect(mapStateToProps, { postShoutout, clearErrors })(
    withStyles(styles)(PostShoutout)
);
