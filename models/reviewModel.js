
const Mongoose = require('mongoose');
const Tour = require('./tourModels');

const reviewSchema = new Mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'review can not be empty!']
    },
    rating: {
      type: Number,
      default: 0,
      min: [1.0, 'rating must be above 1.0'],
      max: [5.0, 'rating must be below 5.0']
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    tour: {
      type: Mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour']
    },
    user: {
      type: Mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    }
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });  // user can't write multiple reviews on a single tour

reviewSchema.pre(/^find/, function(next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name _id',
  // }).populate({
  //   path: 'user',
  //   select: 'name photo _id',
  // });
  this.populate({
    path: 'user',
    select: 'name photo _id'
  });

  next();
});

reviewSchema.statics.calcAverageRatings = async function(tourId) {
  console.log(tourId);
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId,{ 
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    })
  }else{
    await Tour.findByIdAndUpdate(tourId,{ 
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
  
};

reviewSchema.post('save', function() {
// this point to current review
  this.constructor.calcAverageRatings(this.tour);

});

//findByIdAndUpdate
//findByIdAndDelete

reviewSchema.pre(/^findOneAnd/,async function(next) {
 this.r = await this.findOne();
//console.log(this.r);
 next();
})
reviewSchema.post(/^findOneAnd/,async function() {
 //await this.findOne(); does not work here, query has already executed 
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = Mongoose.model('Review', reviewSchema);

module.exports = Review;
