const path = require('path');
const cors = require('cors')
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean'); this lib depreciated 
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const globalErrorHandler = require('./controller/errorController');

const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
const reviewRouter = require('./routes/reviewRouter');
const bookingRouter = require('./routes/bookingRouter');
const bookingController = require('./controller/bookingController');
const viewRouter = require('./routes/viewRouter');


const app = express();

app.enable('trust proxy');  

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

app.set('view engine', 'pug');
app.set('viwes', path.join(__dirname, 'views'))

app.use(cors());
app.options('*', cors());
// app.options('/api/v1/tours/:id', cors());


const cspConfig = {
  directives: {
    defaultSrc: ["'self'"],
    imgSrc: ["'self'", 'data:', 'https://tile.openstreetmap.org/'],
    scriptSrc: ["'self'", 'https://cdnjs.cloudflare.com', 'https://js.stripe.com'],
    connectSrc: ["'self'", "ws://127.0.0.1:46009", "ws://127.0.0.1:33301", "ws://127.0.0.1:34113"],  // Include the new WebSocket URL
    frameSrc: ["'self'", 'https://js.stripe.com'],  // Allow framing from Stripe
  }
};

// Use helmet middleware with CSP
app.use(helmet({
  contentSecurityPolicy: cspConfig,
}));

// serving static file
app.use(express.static(path.join(__dirname, 'public')));

//development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// set limit request from same API
const limiter = rateLimit({
  validate: {
		validationsConfig: false,
		default: true,
	},
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too Many requests from this IP, Please try again in an hour!',
});

app.use('/api', limiter);

app.post('/webhook-checkout',express.raw({
  type: 'application/json'
}), bookingController.webhookCheckout)

//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser());

//Data sanitization against NoSQL injection
app.use(mongoSanitize());

//Data sanitization against XSS
//app.use(xss()); [DONT USE THIS CODE BECAUSE THE LATER VERSION SANITIZATION AGAINST XSS IS SOLVED ]

//prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);
// to compress the text size, when you deploy your application into server
app.use(compression());


// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// 3) ROUTES

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(` can't find ${req.originalUrl} on this server!`, '404'));
});

app.use(globalErrorHandler);

// 4) START SERVER

module.exports = app;
