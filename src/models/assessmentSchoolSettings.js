const COMMON_PACKAGE = require("@xseededucation/xseed-node-common-package");
const mongoose = require("mongoose");

const AssessmentSchoolSettings = mongoose.model(
  "AssessmentSchoolSettings",
  COMMON_PACKAGE.DB_SCHEMAS.LEARNOMETER.XLM_ASSESSMENT_SCHOOL_SETTING_SCHEMA
);

AssessmentSchoolSettings.findOnlyActive = function (
  query = {},
  projection = {},
  options = {},
  callback
) {
  query.isActive = true;
  return AssessmentSchoolSettings.find(query, projection, options, callback);
};

module.exports = {
  AssessmentSchoolSettings,
};
