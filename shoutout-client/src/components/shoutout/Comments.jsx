import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { Grid, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

import dayjs from "dayjs";

const styles = {
    invisibleSeparator: {
        border: "none",
        margin: 4,
    },
    visibleSeparator: {
        width: "100%",
        borderBottom: "1px solid rgba(0,0,0,0.1)",
        marginBottom: 20,
    },
    commentImage: {
        width: "100%",
        height: 100,
        objectFit: "cover",
        borderRadius: "50%",
    },
    commentData: {
        marginLeft: 20,
    },
};

class Comments extends Component {
    render() {
        const { classes, comments } = this.props;
        return (
            <Grid container>
                {comments.map((c, index) => {
                    const { body, createdAt, userHandle, imageUrl } = c;
                    return (
                        <Fragment key={createdAt}>
                            <Grid item sm={12}>
                                <Grid container>
                                    <Grid item sm={2}>
                                        <img
                                            src={imageUrl}
                                            alt="comment"
                                            className={classes.commentImage}
                                        />
                                    </Grid>
                                    <Grid item sm={9}>
                                        <div className={classes.commentData}>
                                            <Typography
                                                variant="h5"
                                                color="primary"
                                                component={Link}
                                                to={`/users/${userHandle}`}
                                            >
                                                {userHandle}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="textSecondary"
                                            >
                                                {dayjs(createdAt).format(
                                                    "h:mm a, MMM DD YYYY"
                                                )}
                                            </Typography>
                                            <hr
                                                className={
                                                    classes.invisibleSeparator
                                                }
                                            />
                                            <Typography variant="body1">
                                                {body}
                                            </Typography>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                            {index !== comments.length - 1 ? (
                                <hr className={classes.visibleSeparator} />
                            ) : (
                                <></>
                            )}
                        </Fragment>
                    );
                })}
            </Grid>
        );
    }
}

export default withStyles(styles)(Comments);
