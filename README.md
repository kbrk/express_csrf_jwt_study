# express_csrf_jwt_study - A study about JWT Authentication along with CSRF prevention on Node.js Express



<p>In this study, CSRF prevention and authentication with JWT are implemented with a simple example regardless of database and front-end implementations. 
  HTTP requests were handled through Postman.</p>
  
# Dev Dependencies:
<p><b>nodemon:</b> A tool that helps develop node.js based applications by restarting automatically the application when file changes are detected in the directory.</p>

# Dependencies:
<p><b>csurf:</b> A Node.js middleware that is used to prevent CSRF attacks.</p>
<p><b>dotenv:</b> A module for environmental configuration variables.</p>
<p><b>express:</b> A backend web application framework for Node.js.</p>
<p><b>express-session:</b> A session middleware for Express.</p>
<p><b>jsonwebtoken:</b> An implementation of JWT for Node.js.</p>

# .env variables

There should be a .env file in ./backend and its variables are;

```dotenv
DOMAIN
PORT
CSRFT_SESSION_SECRET
JWT_SECRET
#jwt and csrf token expires in milliseconds
CSRFT_EXPIRESIN
JWT_EXPIRESIN
JWT_REFRESH_EXPIRESIN
```

# User credentials
Authentication credentials are not required. They were given manually in the code.

```javascript
const user = {
    "_id": "someId123", "email": "test@mail.com"
} // user data is assigned manually for testing.
```

# Package Installation
```
cd backend
npm install
```
# Usage
```
npm run start:dev
```
