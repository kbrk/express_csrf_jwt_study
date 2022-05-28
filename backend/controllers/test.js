const GT = require('../middleware/generate-token');
const TC = require('../middleware/token-caching');
const jwt = require("jsonwebtoken");
const NodeCache = require("node-cache");

exports.test = (req, res, next) => {
    res.status(200).json({result: true, message: 'Success..'});
}
exports.setCSRFToken = (req, res, next) => {
    try {
        const token = req.csrfToken();
        res.send({csrfToken: token});
    } catch (err) {
        res.status(500).json({result: false, message: "Something went wrong."});
        return;
    }
}
exports.signin = async (req, res, next) => {
    try {
        const user = {
            "_id": "someId123", "email": "test@mail.com"
        } // user data is assigned manually for testing.
        const resultAccess = await GT.generateToken(user, 1);
        const resultRefresh = await GT.generateToken(user, 2);
        const refresh_secret = process.env.JWT_REFRESH_SECRET;
        const access_token = resultAccess.token;
        const refresh_token = resultRefresh.token;

        await jwt.verify(resultRefresh.token, refresh_secret); // If the token is not valid, it throws an error.

        const resultCaching = await TC.setCache(access_token); // Cache the valid token.
        if (!resultCaching.result) {
            const error = new Error();
            error.message = resultCaching.message;
            throw error;
        }

        res.status(200)
            .cookie('access_token', resultAccess.token, resultAccess.cookie)
            .cookie('refresh_token', resultRefresh.token, resultRefresh.cookie)
            .json({
                result: true, token: resultAccess.token, email: user.email, userId: user._id.toString()
            });
    } catch (e) {
        res.status(500).json({result: false, message: "Something went wrong.", e_message: e.message});
        return;
    }
};

exports.signout = async (req, res) => {
    try {
        res.status(200)
            .clearCookie("access_token")
            .clearCookie("refresh_token")
            .json({
                result: true, message: 'Signed out.'
            });
    } catch (err) {
        res.status(500).json({result: false, message: "Something went wrong."});
        return;
    }
}

exports.authorizedSubmit = async (req, res, next) => {
    res.status(200).json({result: true, message: "You are authorized."});
}
