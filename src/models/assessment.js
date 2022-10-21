const COMMON_PACKAGE = require("@xseededucation/xseed-node-common-package");
const mongoose = require("mongoose");

const Assessment = mongoose.model(
  "Assessment",
  COMMON_PACKAGE.DB_SCHEMAS.LEARNOMETER.XLM_ASSESSMENT_SCHEMA
);

Assessment.findOnlyActive = function (
  query = {},
  projection = {},
  options = {},
  callback
) {
  query.isActive = true;
  return Assessment.find(query, projection, options, callback);
};

module.exports = {
  Assessment,
};
