const GT = require('../middleware/generate-token');
const jwt = require("jsonwebtoken");


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

        await jwt.verify(resultRefresh.token, refresh_secret); // If the token is not valid, it throws an error.

        res.status(200)
            .cookie('access_token', resultAccess.token, resultAccess.cookie)
            .cookie('refresh_token', resultRefresh.token, resultRefresh.cookie)
            .json({
                result: true, token: resultAccess.token, email: user.email, userId: user._id.toString()
            });

    } catch (err) {
        res.status(500).json({result: false, message: "Something went wrong."});
        return;
    }
};
exports.authorizedSubmit = async (req, res, next) => {
    res.status(200).json({result: true, message: "You are authorized.."});
}