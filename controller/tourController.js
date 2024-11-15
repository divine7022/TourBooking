const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err
    });
  }
};

// it is to get only one tour
exports.getTour = async (req, res) => {
  try {
    // Tour.findOne({_id: req.params.id })
    const tour = await Tour.findById(req.params.id); // this works exect same way as above, but it is shortend of the above query.

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'faile',
      message: err
    });
  }
};

// we are using a async await here cuz newTour returns a promise
exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({})
    // newTour.sava() // save method returns a promise. Insterd of this we are directly creating using document using a *model* in the below.

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
    // if we have any fild missing in the req.body then we get error it is handled in the catch
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    // third argument is optional, that is just to know it is updated.
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
