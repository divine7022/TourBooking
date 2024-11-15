const mongoose = require('mongoose');

// Creating a Schema. ( the fields to be displayed in the overview page make those filds *required*)
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'], // it is like a validater
    unique: true,
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty']
  },
  reatingsAverage: {
    type: Number,
    default: 4.5
  },
  reatingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour must have price']
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true, // trim only works to stings(which will remove all the whitespace in the beginning and in the end of the string )
    required: [true, 'A tour must have a discription']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    // only give the image name in the "DB" not link. then access the image from the filesystem.
    type: String,
    required: [true, 'A tour must have a cover image']
  },
  images: [String],
  createdAt: {
    type: Date, //Date is yet another js builtin datatype
    default: Date.now() // this will give a current timestamp in millisecond
  },
  startDates: [Date] // there might be a different date for the same tours
});

// Creating a Models.
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

//////
// In schema the information which we want to display on the overview(i,e main page) that feilds should be made as *required* in schema.

//imageCover: {
// basically we can provide all the image link in the database but simply we give the image number in the database and we store the images in the file system and late we will be able to read the image from the file system.Only a refrence will be stored in a database.we could store entair image in the database but it is not a good idea.
//  type: String,
//  required: [true, "A tour must have a cover image"]} });

// startDates: [Date] // there might be a different date for the same tours -->
//    if we entered like this "2021-03-21, 11:32" all of this will parsed as a date by the mongodb.only if it can't it will throw an error.
