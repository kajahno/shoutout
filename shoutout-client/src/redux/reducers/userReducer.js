import {
    SET_AUTHENTICATED,
    SET_UNAUTHENTICATED,
    SET_USER,
    LOADING_USER,
    LIKE_SHOUTOUT,
    UNLIKE_SHOUTOUT,
} from "../types";

const initialState = {
    authenticated: false,
    loading: false,
    credentials: [],
    likes: [],
    notifications: [],
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_AUTHENTICATED:
            return {
                ...state,
                authenticated: true,
            };
        case SET_UNAUTHENTICATED:
            return initialState;
        case SET_USER:
            return {
                authenticated: true,
                loading: false,
                ...action.payload,
            };
        case LOADING_USER:
            return {
                ...state,
                loading: true,
            };
        case LIKE_SHOUTOUT:
            return {
                ...state,
                likes: [
                    ...state.likes,
                    {
                        userHandle: state.credentials.handle,
                        shoutoutId: action.payload.shoutoutId,
                    },
                ],
            };
        case UNLIKE_SHOUTOUT:
            return {
                ...state,
                likes: [
                    ...state.likes.filter(
                        (like) => like.shoutoutId !== action.payload.shoutoutId
                    ),
                ],
            };

        default:
            return state;
    }
}
