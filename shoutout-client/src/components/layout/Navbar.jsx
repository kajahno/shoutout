import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// MUI
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

// Redux
import { connect } from "react-redux";

//Icons
import HomeIcon from "@material-ui/icons/Home";
import NotificationsIcon from "@material-ui/icons/Notifications";

import MyButton from "../../util/MyButton";
import PostShoutout from "../shoutout/PostShoutout";

export class Navbar extends Component {
    render() {
        const { authenticated } = this.props;
        return (
            <AppBar>
                <Toolbar className="nav-container">
                    {authenticated ? (
                        <Fragment>
                            <PostShoutout />
                            <Link to="/">
                                <MyButton tip="Home">
                                    <HomeIcon />
                                </MyButton>
                            </Link>
                            <MyButton tip="Notifications">
                                <NotificationsIcon />
                            </MyButton>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/login"
                            >
                                Login
                            </Button>
                            <Button color="inherit" component={Link} to="/">
                                Home
                            </Button>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/signup"
                            >
                                Signup
                            </Button>
                        </Fragment>
                    )}
                </Toolbar>
            </AppBar>
        );
    }
}

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated,
});

Navbar.propTypes = {
    authenticated: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps)(Navbar);
