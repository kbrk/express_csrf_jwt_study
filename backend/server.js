const express = require("express");
require('dotenv').config();
const session = require('express-session');


const app = express();

//app.use(express.json()); //Used to parse incoming request with JSON payload.

// with session
const sessionConfig = session({
    secret: process.env.CSRFT_SESSION_SECRET,
    keys: ['some random key'],
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: parseInt(process.env.CSRFT_EXPIRESIN), // Used for expiration time.
        sameSite: 'strict', // Cookies will only be sent in a first-party context. 'lax' is default value for third-parties.
        httpOnly: true, //Mitigate the risk of a client side script accessing the cookie.
        domain: process.env.DOMAIN, //Used to compare against the domain of the server in which the URL is being requested.
        secure: false // Ensures the browser only sends the cookie over HTTPS. false for localhost.
    }
});
app.use(sessionConfig);

// ** Routes requirements
const testRoutes = require("./routes/test");

// ** Routes usage
app.use('/test', testRoutes);


const domain = process.env.DOMAIN
const port = process.env.PORT
app.listen(port, ()=> {
    console.log(`Listening at http://${domain}:${port}`)
});
