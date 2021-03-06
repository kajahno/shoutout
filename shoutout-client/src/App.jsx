import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {
    ThemeProvider as MuiThemeProvider,
    createMuiTheme,
} from "@material-ui/core/styles";

import Navbar from "./components/layout/Navbar";

import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";
import AuthRoute from "./util/AuthRoute";
import user from "./pages/user";

import jwtDecode from "jwt-decode";

//Redux
import { Provider } from "react-redux";
import store from "./redux/store";
import { logoutUser, getUserData } from "./redux/actions/userActions";
import { SET_AUTHENTICATED } from "./redux/types";
import axios from "axios";

const theme = createMuiTheme({
    palette: {
        primary: {
            light: "#33c9dc",
            main: "#00bcd4",
            dark: "#008394",
            contrastText: "#fff",
        },
        secondary: {
            light: "#ff6333",
            main: "#ff3d00",
            dark: "#b22a00",
            contrastText: "#fff",
        },
    },
    typography: {
        useNextVariants: true,
    },
});

axios.defaults.baseURL =
    "https://europe-west2-shoutout-2364e.cloudfunctions.net/api";

const token = localStorage.FBIdToken;
if (token) {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp * 1000 < Date.now()) {
        store.dispatch(logoutUser());
    } else {
        store.dispatch({
            type: SET_AUTHENTICATED,
        });
        axios.defaults.headers.common["Authorization"] = token;
        store.dispatch(getUserData());
    }
}

function App() {
    return (
        <MuiThemeProvider theme={theme}>
            <Provider store={store}>
                <Router>
                    <Navbar />
                    <div className="container">
                        <Switch>
                            <Route exact path="/" component={home} />
                            <AuthRoute exact path="/login" component={login} />
                            <AuthRoute
                                exact
                                path="/signup"
                                component={signup}
                            />
                            <Route
                                exact
                                path="/users/:handle"
                                component={user}
                            />
                            <Route
                                exact
                                path="/users/:handle/shoutout/:shoutoutId"
                                component={user}
                            />
                        </Switch>
                    </div>
                </Router>
            </Provider>
        </MuiThemeProvider>
    );
}

export default App;
