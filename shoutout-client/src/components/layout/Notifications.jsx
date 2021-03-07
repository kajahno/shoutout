import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import { Link } from "react-router-dom";

// MUI
import {
    Typography,
    Badge,
    IconButton,
    Menu,
    MenuItem,
    Tooltip,
} from "@material-ui/core";

// MUI Icons
import {
    Notifications as NotificationsIcon,
    Favorite as FavoriteIcon,
    Chat as ChatIcon,
} from "@material-ui/icons/";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Redux
import { connect } from "react-redux";
import { markNotificationsRead } from "../../redux/actions/userActions";

class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
        };
    }

    handleOpen = (event) => {
        this.setState({
            anchorEl: event.target,
        });
    };

    handleClose = () => {
        this.setState({
            anchorEl: null,
        });
    };

    onMenuOpened = () => {
        let unreadNotiticationsIds = this.props.notifications
            .filter((n) => n.read !== true)
            .map((n) => n.notificationId);
        this.props.markNotificationsRead(unreadNotiticationsIds);
    };

    render() {
        const { notifications } = this.props;
        const { anchorEl } = this.state;

        dayjs.extend(relativeTime);

        let notificationsIcon;
        if (notifications && notifications.length > 0) {
            const unreadNotifications = notifications.filter(
                (n) => n.read !== true
            ).length;
            if (unreadNotifications > 0) {
                notificationsIcon = (
                    <Badge badgeContent={unreadNotifications} color="secondary">
                        <NotificationsIcon />
                    </Badge>
                );
            } else {
                notificationsIcon = <NotificationsIcon />;
            }
        } else {
            notificationsIcon = <NotificationsIcon />;
        }

        let notificationsMarkup =
            notifications && notifications.length > 0 ? (
                notifications.map((n) => {
                    const verb = n.type === "like" ? "liked" : "commented on";
                    const time = dayjs(n.createdAt).fromNow();
                    const iconColor = n.read ? "primary" : "secondary";
                    const icon =
                        n.type === "like" ? (
                            <FavoriteIcon
                                color={iconColor}
                                style={{ marginRight: 10 }}
                            />
                        ) : (
                            <ChatIcon
                                color={iconColor}
                                style={{ marginRight: 10 }}
                            />
                        );

                    return (
                        <MenuItem key={n.createdAt} onClick={this.handleClose}>
                            {icon}
                            <Typography
                                color="primary"
                                variant="body1"
                                component={Link}
                                to={`/users/${n.recipient}/shoutout/${n.shoutoutId}`}
                            >
                                {n.sender} {verb} your shoutout {time}
                            </Typography>
                        </MenuItem>
                    );
                })
            ) : (
                <MenuItem onClick={this.handleClose}>
                    You have no notifications yet
                </MenuItem>
            );

        return (
            <Fragment>
                <Tooltip placement="top" title="Notifications">
                    <IconButton
                        aria-owns={anchorEl ? "simple-menu" : undefined}
                        aria-haspopup="true"
                        onClick={this.handleOpen}
                    >
                        {notificationsIcon}
                    </IconButton>
                </Tooltip>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                    onEntered={this.onMenuOpened}
                >
                    {notificationsMarkup}
                </Menu>
            </Fragment>
        );
    }
}

Notifications.propTypes = {
    markNotificationsRead: PropTypes.func.isRequired,
    notifications: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
    notifications: state.user.notifications,
});

export default connect(mapStateToProps, { markNotificationsRead })(
    Notifications
);
