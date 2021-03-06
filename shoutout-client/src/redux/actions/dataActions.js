import {
    LOADING_DATA,
    SET_SHOUTOUTS,
    LIKE_SHOUTOUT,
    UNLIKE_SHOUTOUT,
    DELETE_SHOUTOUT,
    LOADING_UI,
    STOP_LOADING_UI,
    SET_ERRORS,
    CLEAR_ERRORS,
    POST_SHOUTOUT,
    SET_SHOUTOUT,
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

export const getShoutout = (shoutoutId) => (dispatch) => {
    dispatch({
        type: LOADING_UI,
    });
    axios
        .get(`/shoutout/${shoutoutId}`)
        .then((res) => {
            dispatch({
                type: SET_SHOUTOUT,
                payload: res.data,
            });
            dispatch({
                type: STOP_LOADING_UI
            });
        })
        .catch((err) => {
            console.log(err);
            // dispatch({
            //     type: STOP_LOADING_UI
            // });
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

export const postShoutout = (newShoutout) => (dispatch) => {
    dispatch({
        type: LOADING_UI,
    });
    axios
        .post(`/shoutout`, newShoutout)
        .then((res) => {
            dispatch({
                type: POST_SHOUTOUT,
                payload: res.data,
            });
            dispatch({
                type: CLEAR_ERRORS,
            });
        })
        .catch((error) => {
            dispatch({
                type: SET_ERRORS,
                payload: error.response.data,
            });
            console.log(error);
        });
};

export const clearErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};
