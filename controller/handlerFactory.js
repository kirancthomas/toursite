const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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
