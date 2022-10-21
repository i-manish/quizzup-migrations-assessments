require("dotenv").config();
const { connectToDb } = require("./config/learnometerDb");
const insertAssessments = require("./helpers/assessment");
const DB = require("./config/reportBeeDb");
const insertAssessmentSchoolSettings = require("./helpers/assessmentSchoolSettings");

let main = async () => {
  // await insertAssessments();
  await insertAssessmentSchoolSettings();
};

connectToDb(() => {
  main();
});
