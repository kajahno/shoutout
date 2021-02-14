import React, { Component } from "react";

import Grid from "@material-ui/core/Grid";

import axios from "axios";

import Shoutout from "../components/Shoutout";
export class home extends Component {
    // state = {
    //     shoutouts: null,
    // };

    constructor(props) {
        super(props);
        this.state = { shoutouts: null };
    }

    componentDidMount() {
        axios
            .get("/shoutouts")
            .then((res) => {
                this.setState({
                    shoutouts: res.data,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {

        let recentShoutoutsMarkup = this.state.shoutouts ? (
            this.state.shoutouts.map((shoutout) => {
                return <Shoutout shoutout={shoutout} />;
            })
        ) : (
            <p>Loading...</p>
        );

        return (
            <Grid container>
                <Grid sm={8} xs={12}>
                    {recentShoutoutsMarkup}
                </Grid>
                <Grid sm={4} xs={12}>
                    <p>Profile...</p>
                </Grid>
            </Grid>
        );
    }
}

export default home;
