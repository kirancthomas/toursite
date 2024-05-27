const { default: slugify } = require('slugify');
const Tour = require('../models/tourModels');
const Bookings = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');



exports.overView = catchAsync(async (req, res, next) => {
  //1) get all tour data
  const tours = await Tour.find();

  //2) build template
  //3) render the template using the tour data
    res.status(200).render('overview', {
      title: 'All Tours',
      tours
    });
});


exports.getTour = catchAsync(async (req, res, next) => {
  //1) get the data from the requested tour(including Reviews, Guides)
  const tour = await Tour.findOne({slug: req.params.slug}).populate({
    path: 'reviews',
    fields: 'review rating user photo'
  })
  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }
  
  
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  })
});


exports.getLoginForm = (req, res) => {
  
  res.status(200).render('login',{
    title: 'Log into Your Account'
  });
}
exports.getSignupForm = (req, res) => {

  res.status(200).render('signup', {
    title: 'Create Your New Account'
  });
}
exports.getAccount = (req, res) => {
  
  res.status(200).render('account',{
    title: 'Your account'
  });
}

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) find all bookings
  const bookings = await Bookings.find({ user: req.user.id})

  // 2) find tours with the returnd IDs
  const tourIDs = bookings.map(el => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours
  });
});


exports.updateUserData = catchAsync( async (req, res, next) => {
 const updatedUser = await User.findByIdAndUpdate(req.user.id, {
      name: req.body.name,
      email: req.body.email
    },{
      new: true,
      runValidators: true
    }
  );
  res.status(200).render('account',{
    title: 'Your account',
    user: updatedUser,
  });
});