import axios from "axios";
import { CLEAR_ERRORS, LOADING_UI, SET_ERRORS, SET_USER } from "../types";

export const loginUser = (userData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios
        .post("/login", userData)
        .then((res) => {
            console.log(res.data);
            const FBIdToken = `Bearer ${res.data.token}`;
            localStorage.setItem("FBIdToken", FBIdToken);
            axios.defaults.headers.common["Authorization"] = FBIdToken;
            dispatch(getUserData());
            dispatch({
                type: CLEAR_ERRORS,
            });
            history.push("/");
        })
        .catch((error) => {
            dispatch({
                type: SET_ERRORS,
                payload: error.response.data,
            });
        });
};

export const getUserData = () => (dispatch) => {
    axios
        .get("/user")
        .then((res) => {
            dispatch({
                type: SET_USER,
                payload: res.data,
            });
        })
        .catch((error) => {
            console.log(error);
        });
};
