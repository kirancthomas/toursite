const { default: slugify } = require('slugify');
const Tour = require('../models/tourModels');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');


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


exports.getLoginForm = catchAsync( async (req, res) => {
  
  res.status(200).render('login',{
    title: 'Log into Your Account'
  })
}

)