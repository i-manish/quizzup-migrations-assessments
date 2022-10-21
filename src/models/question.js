const COMMON_PACKAGE = require("@xseededucation/xseed-node-common-package");
const mongoose = require("mongoose");

const Question = mongoose.model(
  "Question",
  COMMON_PACKAGE.DB_SCHEMAS.LEARNOMETER.XLM_QUESTION_SCHEMA
);

module.exports = {
  Question,
};
