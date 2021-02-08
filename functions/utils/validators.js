const isEmpty = (string) => string.trim() === "";

const isValidEmail = (string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(string).toLowerCase());
};

exports.validateSignupData = (data) => {
    let errors = {};

    if (isEmpty(data.email)) {
        errors.email = "Must not be empty";
    } else if (!isValidEmail(data.email)) {
        errors.email = "Must be a valid email address";
    }
    if (isEmpty(data.password)) errors.password = "Must not be empty";
    if (data.password !== data.confirmPassword)
        errors.confirmPassword = "Passwords must match";
    if (isEmpty(data.handle)) errors.handle = "Must not be empty";

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

exports.validateLoginData = (data) => {
    let errors = {};
    if (!isValidEmail(data.email)) errors.email = "Must be valid";
    if (isEmpty(data.password)) errors.password = "Must not be empty";
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

exports.reduceUserDetails = (data) => {
    let userDetails = {};

    if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio.trim();
    if (!isEmpty(data.website.trim())){
        userDetails.website = data.website.trim();
        if (! data.website.trim().startsWith("http")){
            userDetails.website = "http://" + userDetails.website;
        }
    }
    if (!isEmpty(data.location.trim())) userDetails.location = data.location.trim();

    return userDetails;
};
