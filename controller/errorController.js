const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldDB = (err) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  // const value = err.keyValue.name;
  //console.log(value);
  const message = `Duplicate field value: "${value}" . Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data: ${errors.join('/ ')}`;
  return new AppError(message, 400);
};

const handleJwtError = () =>
  new AppError('invalid token, please log in again!', 401);

const handleTokenExpairedError = () =>
  new AppError('Token expaired, please log in again!', 401);




const sendErrorDev = (err, req, res) => {
  //API
  if(req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
      
    });
  }

  //THE RENDERED WEBSITE
  console.error('ERROR', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message
    });
};

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }

  // B) RENDERED WEBSITE
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    // console.log(err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      // msg: 'Please try again later.'
      msg: err.message,

    });
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error('ERROR 💥', err);
  // 2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    // msg: err.message,
    msg: 'Please try again later.'
  });
};

module.exports = (err, req, res, next) => {
  //console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  err.message = err.message || 'Something Went Wrong Please Try Again!'

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err,req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.assign(err);
    // let error = Object.prototypeOf(error,err);

    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldDB(error);
    if (err._message === 'Validation failed')
      error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJwtError();
    if (err.name === 'TokenExpiredError') error = handleTokenExpairedError();


    sendErrorProd(error,req, res);
  }
};
