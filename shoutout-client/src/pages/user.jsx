import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";

// Redux
import { connect } from "react-redux";
import { getUserData } from "../redux/actions/dataActions";

import { Grid } from "@material-ui/core";

import Shoutout from "../components/shoutout/Shoutout";
import ShoutoutSkeleton from "../util/ShoutoutSkeleton";
import StaticProfile from "../components/profile/StaticProfile";
import ProfileSkeleton from "../util/ProfileSkeleton";

class user extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: null,
            loading: false,
            shoutoutIdParam: null,
        };
    }

    componentDidMount() {
        const handle = this.props.match.params.handle;
        const shoutoutId = this.props.match.params.shoutoutId;
        if (shoutoutId) {
            this.setState({
                shoutoutIdParam: shoutoutId,
            });
        }

        this.props.getUserData(handle);
        axios
            .get(`/user/${handle}`)
            .then((res) => {
                this.setState({
                    profile: res.data.user,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        const { shoutouts, loading } = this.props.data;
        const { shoutoutIdParam } = this.state;

        const shoutoutsMarkup = loading ? (
            <ShoutoutSkeleton />
        ) : shoutouts === null ? (
            <>No shoutouts for this user</>
        ) : !shoutoutIdParam ? (
            shoutouts.map((s) => <Shoutout key={s.shoutoutId} shoutout={s} />)
        ) : (
            shoutouts.map((s) => {
                if (s.shoutoutId === shoutoutIdParam) {
                    return (
                        <Shoutout key={s.shoutoutId} shoutout={s} openDialog />
                    );
                }
                return <Shoutout key={s.shoutoutId} shoutout={s} />;
            })
        );

        return (
            <Grid container spacing={16}>
                <Grid item sm={8} xs={12}>
                    {shoutoutsMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    {this.state.profile === null ? (
                        <ProfileSkeleton />
                    ) : (
                        <StaticProfile profile={this.state.profile} />
                    )}
                </Grid>
            </Grid>
        );
    }
}

user.propTypes = {
    getUserData: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    data: state.data,
});

export default connect(mapStateToProps, { getUserData })(user);
