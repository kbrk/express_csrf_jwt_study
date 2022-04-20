const express = require('express');
const router = express.Router();
const testController = require('../controllers/test');

const csrf = require('csurf');
const checkAuth = require('../middleware/check-auth');

const csrfProtection = csrf();

// with Cookie
//const csrfProtection = csrf({cookie: true});
// if cookie used for csrf token secret
//router.use(cookieParser());

router.post('/test', testController.test);

router.get('/setCSRFToken', csrfProtection, (req, res, next) => {
    const token = req.csrfToken();
    res.send({csrfToken: token});
});

router.post('/checkCSRFToken', csrfProtection, function (req, res) {
    res.send({msg: 'CSRF Token is valid.'})
});

router.use(csrfProtection);
router.post('/signin', testController.signin);
router.post('/authorizedSubmit', checkAuth, testController.authorizedSubmit);

module.exports = router;