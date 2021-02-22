import {
    LOADING_DATA,
    SET_SHOUTOUTS,
    LIKE_SHOUTOUT,
    UNLIKE_SHOUTOUT,
    DELETE_SHOUTOUT,
} from "../types";

import axios from "axios";

export const getShoutouts = () => (dispatch) => {
    dispatch({
        type: LOADING_DATA,
    });
    axios
        .get("/shoutouts")
        .then((res) => {
            dispatch({
                type: SET_SHOUTOUTS,
                payload: res.data,
            });
        })
        .catch((error) => {
            dispatch({
                type: SET_SHOUTOUTS,
                payload: [],
            });
        });
};

export const likeShoutout = (shoutoutId) => (dispatch) => {
    axios
        .post(`/shoutout/${shoutoutId}/like`)
        .then((res) => {
            dispatch({
                type: LIKE_SHOUTOUT,
                payload: res.data,
            });
        })
        .catch((error) => {
            console.log(error);
        });
};

export const unlikeShoutout = (shoutoutId) => (dispatch) => {
    axios
        .post(`/shoutout/${shoutoutId}/unlike`)
        .then((res) => {
            dispatch({
                type: UNLIKE_SHOUTOUT,
                payload: res.data,
            });
        })
        .catch((error) => {
            console.log(error);
        });
};

export const deleteShoutout = (shoutoutId) => (dispatch) => {
    axios
        .delete(`/shoutout/${shoutoutId}`)
        .then(() => {
            dispatch({
                type: DELETE_SHOUTOUT,
                payload: shoutoutId,
            });
        })
        .catch((error) => {
            console.log(error);
        });
};
