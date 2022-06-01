const express = require('express');
const router = express.Router();
const testController = require('../controllers/test');

const csrf = require('csurf');
const checkAuth = require('../middleware/check-auth');
const tokenCaching = require('../middleware/token-caching');

const csrfProtection = csrf();

router.post('/test', testController.test);

router.get('/setCSRFToken', csrfProtection, (req, res, next) => {
    const token = req.csrfToken();
    res.send({csrfToken: token});
});

router.post('/checkCSRFToken', csrfProtection, function (req, res) {
    res.send({msg: 'CSRF Token is valid.'})
}); // If the token is invalid, it throws a 'ForbiddenError: invalid csrf token' error.

router.use(csrfProtection);
router.post('/signin', testController.signin);
router.post('/signout', checkAuth, tokenCaching.removeCache, testController.signout);
router.post('/authorizedSubmit', checkAuth, tokenCaching.checkCache, testController.authorizedSubmit);

module.exports = router;
