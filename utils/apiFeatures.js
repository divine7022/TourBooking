class APIFeatures {
  constructor(query, queryString) {
    this.query = query; // Mongoose query object (e.g., Tour.find()) assingned to query at this point
    this.queryString = queryString;
  }

  // we are creating one method to each of the fucntionality.
  filter() {
    const queryObj = { ...this.queryString };

    const excludeFields = ['page', 'sort', 'limit', 'fields'];

    excludeFields.forEach(el => delete queryObj[el]); //it mutate the same query object it won't create the another

    // 1B) Advance filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr)); // here this.query contais Tour.find() give by mongooes
    return this; // here this is simply the entair object.
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' '); // sort('price ratingAverage')
      this.query = this.query.sort(sortBy);
    } else {
      // if sort in qureystring by default we sort by created date
      this.query = this.query.sort('-createdAt'); // it sorts by most recently created tour
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields); // if no minus(-) means to include those fields only in the querystring.
    } else {
      // if user doesn't specified the fields by default
      this.query = this.query.select('-__v'); // minus(-) it exculudes the __v filed form the response
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;

///
//this.query = this.query.find(JSON.parse(queryStr));  -->
//this.query.find() refines the existing Tour.find() query by adding filtering criteria.
