import React, { Component } from "react";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";

import Shoutout from "../components/shoutout/Shoutout";
import Profile from "../components/profile/Profile";

// Redux
import { connect } from "react-redux";
import { getShoutouts } from "../redux/actions/dataActions";

export class home extends Component {
    componentDidMount() {
        this.props.getShoutouts();
    }

    render() {
        const { shoutouts, loading } = this.props.data;

        let recentShoutoutsMarkup = !loading ? (
            shoutouts.map((shoutout) => {
                return (
                    <Shoutout key={shoutout.shoutoutId} shoutout={shoutout} />
                );
            })
        ) : (
            <p>Loading...</p>
        );

        return (
            <Grid container>
                <Grid item sm={8} xs={12}>
                    {recentShoutoutsMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    <Profile />
                </Grid>
            </Grid>
        );
    }
}

home.propTypes = {
    data: PropTypes.object.isRequired,
    getShoutouts: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    data: state.data,
});

export default connect(mapStateToProps, { getShoutouts })(home);
