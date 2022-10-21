const { ObjectId } = require("mongoose");
const quizzupDb = require("../config/quizzupDb");
const reportBeeDb = require("../config/reportBeeDb");
const { Assessment } = require("../models/assessment");
const {
  AssessmentSchoolSettings,
} = require("../models/assessmentSchoolSettings");

const baseAssessmentSchoolSettingHash = {
  canSendReportToStudent: false,
  canSendReportToParent: false,
  canSendReportToSchoolAdmin: false,
  isActive: false,
  isAnnouncementSent: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  isAssessmentOpen: false,

  assessmentDates: [],
  assessmentId: null,
  caaSchoolId: null,
  caaYearId: null,
  rbStandardId: null,
};
const fetchSchoolDetailsFromReportBee = `
  SELECT
    sch.caa_school_id, y.caa_year_id, std.id as standard_id, s.id as section_id
  FROM schools sch
  JOIN standards std ON sch.id = std.school_id
  JOIN sections s ON std.id = s.standard_id
  JOIN years y ON y.id = sch.current_year_id
  `;
const fetchSectionIds = `
  SELECT
  a.id as quizzup_assessment_id, a.name, ARRAY(
    SELECT section_id FROM assessment_sections asq WHERE a.id = asq.assessment_id
  ) as sections
  FROM assessments a`;

const insertAssessmentSchoolSettings = async () => {
  try {
    const assessmentQueryResponse = await quizzupDb.query(fetchSectionIds, {
      type: quizzupDb.QueryTypes.SELECT,
    });
    const assessmentSchoolSettingQueryResponse = await reportBeeDb.query(
      fetchSchoolDetailsFromReportBee,
      {
        type: reportBeeDb.QueryTypes.SELECT,
      }
    );
    // const assessments = await Assessment.find({
    //   $and: [
    //     {
    //       isMigratedAssessment: { $exists: true },
    //     },
    //     {
    //       isMigratedAssessment: true,
    //     },
    //   ],
    // });
    const bulk = AssessmentSchoolSettings.collection.initializeOrderedBulkOp();
    for (const assessmentDetail of assessmentQueryResponse) {
      const schoolDetails = assessmentSchoolSettingQueryResponse.filter(
        (schoolDetail) => {
          return assessmentDetail["sections"].includes(
            schoolDetail["section_id"]
          );
        }
      );
      // const assessment = assessments.find((assessment) => {
      //   return assessment["name"] === assessmentDetail["name"];
      // });
      // if (assessment == undefined) {
      //   throw new Error(`Assessment is not migrated from QuizzUp`);
      // }
      const responseHash = {};
      schoolDetails.map((schoolDetail) => {
        if (
          schoolDetail["caa_school_id"] == null ||
          schoolDetail["caa_year_id"] == null
        ) {
          return;
        }
        if (responseHash[schoolDetail["caa_school_id"]] == undefined) {
          const temp = baseAssessmentSchoolSettingHash;
          temp["caaSchoolId"] = schoolDetail["caa_school_id"];
          temp["caaYearId"] = schoolDetail["caa_year_id"];
          temp["rbStandardId"] = schoolDetail["standard_id"];
          temp["assessmentDates"].push({
            rbSectionId: schoolDetail["section_id"],
          });
          // temp["assessmentId"] = assessment["_id"].toString();
          responseHash[schoolDetail["caa_school_id"]] = temp;
        } else {
          const temp = responseHash[schoolDetail["caa_school_id"]];
          temp["assessmentDates"].push({
            rbSectionId: schoolDetail["section_id"],
          });
          responseHash[schoolDetail["caa_school_id"]] = temp;
        }
      });
      if (Object.keys(responseHash).length != 0) {
        Object.values(responseHash).map((hash) => {
          bulk.insert(hash);
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = insertAssessmentSchoolSettings;
