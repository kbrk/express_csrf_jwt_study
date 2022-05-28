const GT = require('./generate-token');
const TC = require('./token-caching');
const SC = require('../helpers/split-cookie');
const jwt = require('jsonwebtoken');

/**
 *  @desc Splits request Cookie header array and generates another array that contain access and/or refresh token.
 *  @param {array}  contains cookies from request Cookie header.
 */
refreshAccessToken = async (refresh_token) => {
    try {
        const refresh_secret = process.env.JWT_REFRESH_SECRET;
        const verifiedToken = await jwt.verify(refresh_token, refresh_secret);
        if (!verifiedToken) {
            return false;
        }
        const user = {
            "_id": "someId123", "email": "test@mail.com"
        }
        const access_token = GT.generateToken(user, 1);
        return access_token;
    } catch (error) {
        return false;
    }
};

/**
 * @desc Gets tokens through request cookie and checks token validation. If the access token expired, a new access token is generated through the refresh token.
 * */
module.exports = async (req, res, next) => {
    let verifiedToken;
    let cookieArray, access_token, refresh_token;
    try {
        const cookies = req.get('Cookie').split('; ');
        cookieArray = SC.splitCookieArray(cookies);
        access_token = cookieArray["access_token"];

        if (!access_token) { // An access token must be in Cookie header.
            res.status(401).json({result: false, message: "Authentication failed."});
            return;
        }

        const secret = process.env.JWT_SECRET;
        verifiedToken = await jwt.verify(access_token, secret); // If the token cannot be verified an error threw.
    } catch (e) {
        if (e.name === "TokenExpiredError" && e.expiredAt !== undefined) {
            // ++ Refresh the access token
            if (typeof req.get('Cookie') !== 'undefined') {
                refresh_token = cookieArray["refresh_token"];
                const newAccessToken = await refreshAccessToken(refresh_token);
                if (newAccessToken) {
                    await TC.setCache(newAccessToken.token); // Cache the new token.
                    res.status(200).cookie('access_token', newAccessToken.token, newAccessToken.cookie);
                    req.isAuth = true;
                    next();
                    return;
                }
            }
            // -- Refresh the access token
        }
        res.status(500).json({result: false, message: "Invalid or Expired Token. Sign in again."});
        return;
    }
    if (!verifiedToken) {
        res.status(401).json({result: false, message: "Authentication failed."});
        return;
    }
    req.userId = verifiedToken.userId;
    req.isAuth = true;
    next();
};
