const { PORT, ALLOWED_ORIGINS, JWT_SECRET_KEY } = require('./config/index.js');
const { handleErrorMw, handleDbErrorMw, logRequestsMw } = require('./middleware');

const authRoutes = require('./api/routes/authRoutes');
const userRoutes = require('./api/routes/userRoutes');
const collectionRoutes = require('./api/routes/collectionRoutes');
const wishlistRoutes = require('./api/routes/wishlistRoutes');
const itemRoutes = require('./api/routes/itemRoutes.js');
const cartRoutes = require('./api/routes/cartRoutes');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
// const helmet = require('helmet');
const connectToDb = require('./db/mongoose');
const express = require('express');

const { expressjwt: jwt } = require('express-jwt');

const jwks = require('jwks-rsa');
const port = process.env.PORT || PORT;

connectToDb();

const app = express();

const corsOptions = {
  origin: ALLOWED_ORIGINS,
  credentials: true,
};

const verifyJwt = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://dev-qpd12wfu3va8x70r.eu.auth0.com/.well-known/jwks.json',
  }),
  audience: 'https://items-app-backend.onrender.com',
  issuer: 'https://dev-qpd12wfu3va8x70r.eu.auth0.com/',
  algorithms: ['RS256'],
});

app.use(cors(corsOptions));

app.use(mongoSanitize());
app.use(cookieParser(JWT_SECRET_KEY));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/wishlists', wishlistRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/cart', cartRoutes);

app.use('/api/auth', authRoutes);

app.use(logRequestsMw);
app.use(handleDbErrorMw);
app.use(handleErrorMw);

app.get('/', (req, res) => {
  res.send('Welcome to the Items API!');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
