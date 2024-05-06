const { default: slugify } = require('slugify');
const Tour = require('../models/tourModels');
const catchAsync = require('../utils/catchAsync');
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

exports.tour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour'
  })
};

exports.getTour = catchAsync(async (req, res, next) => {
  //1) get the data from the requested tour(including Reviews, Guides)
  const tour = await Tour.findOne({slug: req.params.slug}).populate({
    path: 'reviews',
    fields: 'review rating user'
  })
  //2) Build the template

  //3) Render the template using data step 1)
  
  
  
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
    tour
  })
});