class ApiFeatures {
  constructor(queryObj, queryParam) {
    this.queryObj = queryObj;
    this.queryParam = queryParam;
  }

  filter() {
    const excludeFields = ["sort", "limit", "page", "fields"];
    const queryObj = { ...this.queryParam };
    console.log(queryObj)
    excludeFields.forEach((el) => {
      delete queryObj[el];
    });
    const getFilteredQuery = getFinalFilterQuery(queryObj);
    this.queryObj = this.queryObj.find(getFilteredQuery);
    return this;
  }

  sort() {
    if (this.queryParam?.sort) {
      const sortBy = this.queryParam.sort.split(",").join(" ");
      this.queryObj = this.queryObj.sort(sortBy);
    } else {
      this.queryObj = this.queryObj.sort("cheapestPrice");
    }
    return this;
  }

  limitFields() {
    if (this.queryParam?.fields) {
      const fields = this.queryParam.fields.split(",").join(" ");
      this.queryObj = this.queryObj.select(fields);
    } else {
      this.queryObj = this.queryObj.select("-__v");
    }
    return this;
  }

  paginate() {
    const limit = +this.queryParam.limit || 10
    const page = +this.queryParam.page || 1
    const skip = (page-1)*limit
    this.queryObj = this.queryObj.skip(skip).limit(limit)
    return this
  }

}
getFinalFilterQuery = (queryObj) => {
  const finalFilterQuery = {};

  for (const key in queryObj) {
    const value = queryObj[key];
    const operatorMatch = key.match(/(.+)\[(gt|gte|lt|lte)\]/);
    if (operatorMatch) {
      const fieldName = operatorMatch[1];
      const operator = `$${operatorMatch[2]}`;
      if (!finalFilterQuery[fieldName]) finalFilterQuery[fieldName] = {};
      finalFilterQuery[fieldName][operator] = value;
    } else {
      finalFilterQuery[key] = value;
    }
  }
  return finalFilterQuery;
};

module.exports = ApiFeatures;
