const COMMON_PACKAGE = require("@xseededucation/xseed-node-common-package");
const mongoose = require("mongoose");

const AssessmentAttempt = mongoose.model(
  "AssessmentAttempt",
  COMMON_PACKAGE.DB_SCHEMAS.LEARNOMETER.XLM_ASSESSMENT_ATTEMPT_SCHEMA
);

module.exports = {
  AssessmentAttempt,
};
