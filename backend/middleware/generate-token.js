const jwt = require('jsonwebtoken');

/**
 *  @desc Generates a token. Return the token and cookie configuration.
 * @param user
 * @param tokenType is 1: JWT for authentication, 2: JWT for refresh token
 */
exports.generateToken = async (user, tokenType) => {
    let secret;
    let expires_in;
    let payload = {};
    if (tokenType == 1) {
        secret = process.env.JWT_SECRET;
        expires_in = process.env.JWT_EXPIRESIN;
        payload = {
            email: user.email,
            userId: user._id.toString()
        }
    } else if (tokenType == 2) {
        secret = process.env.JWT_REFRESH_SECRET;
        expires_in = process.env.JWT_REFRESH_EXPIRESIN;
        payload = {
            email: user.email,
            userId: user._id.toString()
        }
    }

    try {
        const token = await jwt.sign(payload, secret,
            {expiresIn: expires_in});
        return {
            "token": token, "cookie": {
                secure: true,
                httpOnly: true,
                sameSite: true,
                expires: new Date(Date.now() + parseInt(expires_in))
            }
        };
    } catch (err) {
        return false;
    }
};