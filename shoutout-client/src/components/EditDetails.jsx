import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

// MUI
import {
    withStyles,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
} from "@material-ui/core";

// Icons
import { Edit as EditIcon } from "@material-ui/icons";

// Redux
import { connect } from "react-redux";
import { editUserDetails } from "../redux/actions/userActions";
import MyButton from "../util/MyButton";

const styles = {
    palette: {
        primary: {
            light: "#33c9dc",
            main: "#00bcd4",
            dark: "#008394",
            contrastText: "#fff",
        },
        secondary: {
            light: "#ff6333",
            main: "#ff3d00",
            dark: "#b22a00",
            contrastText: "#fff",
        },
    },
    textField: {
        margin: "10px auto 10px auto",
    },
    button: {
        float: "right",
    },
    typography: {
        useNextVariants: true,
    },
};

class EditDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bio: "",
            website: "",
            location: "",
            open: false,
        };
    }

    componentDidMount() {
        this.mapUserDetailsToState();
    }

    handleOpen = () => {
        this.setState({ open: true });
        this.mapUserDetailsToState();
    };

    handleClose = () => {
        this.setState({
            open: false,
        });
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    handleSubmit = () => {
        const { bio, website, location } = this.state;
        const userDetails = {
            bio,
            website,
            location,
        };
        this.props.editUserDetails(userDetails);
        this.handleClose();
    };

    mapUserDetailsToState = () => {
        const { credentials } = this.props;
        this.setState({
            bio: credentials.bio || "",
            website: credentials.website || "",
            location: credentials.location || "",
        });
    };

    render() {
        const { classes } = this.props;

        return (
            <Fragment>
                <MyButton
                    tip="Edit details"
                    onClick={this.handleOpen}
                    btnClassName={classes.button}
                    placement="top"
                >
                    <EditIcon color="primary"></EditIcon>
                </MyButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle>Edit your details</DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField
                                name="bio"
                                type="text"
                                label="Bio"
                                multiline
                                rows="3"
                                placeholder="A short bio about yourself"
                                className={classes.TextField}
                                value={this.state.bio}
                                onChange={this.handleChange}
                                fullWidth
                            />
                            <TextField
                                name="website"
                                type="text"
                                label="Website"
                                placeholder="Your personal/professional website"
                                className={classes.TextField}
                                value={this.state.website}
                                onChange={this.handleChange}
                                fullWidth
                            />
                            <TextField
                                name="location"
                                type="text"
                                label="Location"
                                placeholder="Where you live"
                                className={classes.TextField}
                                value={this.state.location}
                                onChange={this.handleChange}
                                fullWidth
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleSubmit} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

EditDetails.propTypes = {
    editUserDetails: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    credentials: state.user.credentials,
});

export default connect(mapStateToProps, { editUserDetails })(
    withStyles(styles)(EditDetails)
);
