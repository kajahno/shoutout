import {
    LOADING_DATA,
    SET_SHOUTOUTS,
    LIKE_SHOUTOUT,
    UNLIKE_SHOUTOUT,
} from "../types";

const initialState = {
    shoutouts: [],
    shoutout: [],
    loading: false,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case LOADING_DATA:
            return {
                ...state,
                loading: true,
            };
        case SET_SHOUTOUTS:
            return {
                ...state,
                shoutouts: action.payload,
                loading: false
            };
        case LIKE_SHOUTOUT:
        case UNLIKE_SHOUTOUT:
            let index = state.shoutouts.findIndex(
                (shoutout) => shoutout.shoutoutId === action.payload.shoutoutId
            );
            state.shoutouts[index] = action.payload;
            return {
                ...state,
                shoutout: action.payload,
            };
        default:
            return state;
    }
}
