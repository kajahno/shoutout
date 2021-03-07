import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

// Redux
import { connect } from "react-redux";
import { submitComment } from "../../redux/actions/dataActions";
import { Button, Grid, TextField } from "@material-ui/core";

const styles = {
    commentText: {
        textAlign: "center",
    },
    visibleSeparator: {
        width: "100%",
        borderBottom: "1px solid rgba(0,0,0,0.1)",
        marginBottom: 20,
    },
    textField: {
        paddingBottom: 10,
    },
};

class CommentForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
            });
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.submitComment(this.props.shoutoutId, {
            body: this.state.body,
        });
    };

    render() {
        const { classes, authenticated } = this.props;
        const { errors } = this.state;

        const commentFormMarkup = authenticated ? (
            <Grid item sm={12} className={classes.commentText}>
                <form onSubmit={this.handleSubmit}>
                    <TextField
                        name="body"
                        type="text"
                        label="Comment on shoutout"
                        error={errors.body ? true : false}
                        helperText={errors.body}
                        value={this.state.body}
                        onChange={this.handleChange}
                        fullWidth
                        className={classes.textField}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.button}
                    >
                        Add comment
                    </Button>
                </form>
                <hr className={classes.visibleSeparator} />
            </Grid>
        ) : (
            <></>
        );

        return commentFormMarkup;
    }
}

CommentForm.propTypes = {
    submitComment: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
    shoutoutId: PropTypes.string.isRequired,
    authenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
    UI: state.UI,
    authenticated: state.user.authenticated,
});

export default connect(mapStateToProps, { submitComment })(
    withStyles(styles)(CommentForm)
);
