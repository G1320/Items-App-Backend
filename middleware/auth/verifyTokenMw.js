const { JWT_SECRET_KEY } = require('../../config');
const jwt = require('jsonwebtoken');

function verifyTokenMw(req, res, next) {
  const token = req.signedCookies.accessToken;

  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.decodedJwt = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired' });
    } else {
      return res.status(400).json({ message: 'Invalid access token' });
    }
  }
}

module.exports = verifyTokenMw;

// const { auth } = require('express-oauth2-jwt-bearer');

// // Define the configuration for Auth0 JWT verification
// const jwtCheckConfig = {
//   audience: 'https://items-app-backend.onrender.com',
//   issuerBaseURL: 'https://dev-qpd12wfu3va8x70r.eu.auth0.com/',
//   tokenSigningAlg: 'RS256',
// };

// const verifyTokenMw = auth(jwtCheckConfig);

// module.exports = verifyTokenMw;

// const jwt = require('express-jwt');
// const jwksRsa = require('jwks-rsa');

// // Middleware function to verify Auth0 tokens
// const verifyTokenMw = jwt({
//   // Dynamically provide the signing key based on the key in the header and the signing keys provided by the JWKS endpoint.
//   secret: jwksRsa.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri: `https://dev-qpd12wfu3va8x70r.eu.auth0.com/.well-known/jwks.json`,
//   }),
//   // Validate the audience and the issuer.
//   audience: 'https://items-app-backend.onrender.com',
//   issuer: 'https://dev-qpd12wfu3va8x70r.eu.auth0.com/',
//   algorithms: ['RS256'],
// });

// module.exports = verifyTokenMw;
