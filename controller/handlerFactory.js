const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIfeatures = require('../utils/apiFeatures');




exports.deleteOne = (model) =>
  catchAsync(async (req, res, next) => {
    const docu = await model.findByIdAndDelete(req.params.id);

    if (!docu) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'file deleted successfully... ',
      data: docu,
    });
  });


exports.updateOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    return next(new AppError('No Document are found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.createOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
  
  let query = Model.findById(req.params.id);
  if(popOptions) query = query.populate(popOptions);
  const doc = await query;

  if (!doc) {
    return next(new AppError('No documente found with that ID', 404));
  }

  res.status(200).json({
    status: 'succes',
    data: {
      data: doc,
    },
  });
});

exports.getAll = Model => catchAsync(async (req, res, next) => {
  //to allow for nested get reviews on tour(hack)
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  //EXICUTE A QUERY
  const features = new APIfeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  //const doc = await features.query.explain();
  const doc = await features.query;

  //SEND RESPONES

  res.status(200).json({
    status: 'succes',
    result: doc.length,
    data: {
      data: doc,
    },
  });
});