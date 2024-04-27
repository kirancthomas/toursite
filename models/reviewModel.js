// review /rating /createdAt /ref to tour /ref to user

const Mongoose = require('mongoose');

const reviewSchema = new Mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'review can not be empty!'],
    },
    rating: {
      type: Number,
      default: 0,
      min: [1.0, 'rating must be above 1.0'],
      max: [5.0, 'rating must be below 5.0'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: Mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: Mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name _id',
  // }).populate({
  //   path: 'user',
  //   select: 'name photo _id',
  // });
  this.populate({
    path: 'user',
    select: 'name photo _id',
  });

  next();
});

const Review = Mongoose.model('Review', reviewSchema);

module.exports = Review;

