const NodeCache = require("node-cache");
const cache = new NodeCache();
const SC = require('../helpers/split-cookie');
const jwt = require('jsonwebtoken');

/**
 * @desc Get and check cache of access token.
 * */
const checkCache = async (req, res, next) => {
    try {
        const cookies = req.get('Cookie').split('; ');
        const cookieArray = SC.splitCookieArray(cookies);
        const access_token = cookieArray["access_token"];
        let cachedAccessToken = cache.get("at-" + access_token);

        if (cachedAccessToken === undefined) {
            return res.status(500).json({result: false, message: "Invalid Token. Sign in again. -- (checkCache)"});
        }
        next();
    } catch (e) {
        return res.status(500).json({result: false, message: e.message});
    }
};

/**
 * @desc Set cache to store access token..
 * @param access_token
 * */
const setCache = async (access_token) => {
    try {
        const secretAccessToken = process.env.JWT_SECRET;
        const verifiedAccessToken = await jwt.verify(access_token, secretAccessToken);

        const expAccessToken = verifiedAccessToken.exp; // in seconds
        const now = Math.floor(Date.now() / 1000); // in seconds
        const ttlAccess = (expAccessToken - now); // in seconds
        cache.set("at-" + access_token, access_token, ttlAccess);

        return {result: true, message: ""};
    } catch (e) {
        return {result: false, message: e.message};
    }
};

const removeCache = async (req, res, next) => {
    try {
        const cookies = req.get('Cookie').split('; ');
        const cookieArray = SC.splitCookieArray(cookies);
        const access_token = cookieArray["access_token"];

        cache.del(["at-" + access_token]);
        next();
    } catch (e) {
        res.status(500).json({result: false, message: e.message});
        return;
    }
}

/**
 * @desc set, get and remove cache through node-cache.
 * */
module.exports = {
    setCache, checkCache, removeCache
};