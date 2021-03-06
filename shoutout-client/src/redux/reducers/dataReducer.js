import {
    LOADING_DATA,
    SET_SHOUTOUTS,
    LIKE_SHOUTOUT,
    UNLIKE_SHOUTOUT,
    DELETE_SHOUTOUT,
    POST_SHOUTOUT,
    SET_SHOUTOUT,
    SUBMIT_COMMENT,
} from "../types";

const initialState = {
    shoutouts: [],
    shoutout: {},
    loading: false,
};

export default function (state = initialState, action) {
    let index;
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
                loading: false,
            };
        case SET_SHOUTOUT:
            return {
                ...state,
                shoutout: action.payload,
            };
        case LIKE_SHOUTOUT:
        case UNLIKE_SHOUTOUT:
            index = state.shoutouts.findIndex(
                (shoutout) => shoutout.shoutoutId === action.payload.shoutoutId
            );
            state.shoutouts[index] = action.payload;

            if (state.shoutout.shoutoutId === action.payload.shoutoutId) {
                state.shoutout = action.payload;
            }

            return {
                ...state,
                shoutout: action.payload,
            };
        case DELETE_SHOUTOUT:
            index = state.shoutouts.findIndex(
                (shoutout) => shoutout.shoutoutId === action.payload
            );
            state.shoutouts.splice(index, 1);
            return {
                ...state,
            };
        case POST_SHOUTOUT:
            return {
                ...state,
                shoutouts: [action.payload, ...state.shoutouts],
            };
        case SUBMIT_COMMENT:
            return {
                ...state,
                shoutout: {
                    ...state.shoutout,
                    comments: [action.payload, ...state.shoutout.comments],
                },
            };
        default:
            return state;
    }
}
