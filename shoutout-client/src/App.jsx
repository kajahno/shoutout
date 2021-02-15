import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {
    ThemeProvider as MuiThemeProvider,
    createMuiTheme,
} from "@material-ui/core/styles";

import Navbar from "./components/Navbar";

import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";
import AuthRoute from "./util/AuthRoute";

import jwtDecode from "jwt-decode";

//Redux
import { Provider } from "react-redux";
import store from "./redux/store";

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

let authenticated = false;
const token = localStorage.FBIdToken;

if (token) {
    const decodedToken = jwtDecode(token);
    if (decodedToken * 1000 < Date.now()) {
        window.location.ref("/login");
        authenticated = false;
    }
    {
        authenticated = true;
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
                            <AuthRoute
                                exact
                                path="/login"
                                component={login}
                                authenticated={authenticated}
                            />
                            <AuthRoute
                                exact
                                path="/signup"
                                component={signup}
                                authenticated={authenticated}
                            />
                        </Switch>
                    </div>
                </Router>
            </Provider>
        </MuiThemeProvider>
    );
}

export default App;
