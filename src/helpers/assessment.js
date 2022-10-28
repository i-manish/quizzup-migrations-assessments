const DB = require("../config/quizzupDb");
const { standardNameIdMap } = require("../constants/common");
const { Assessment } = require("../models/assessment");

const insertAssessments = async () => {
  try {
    console.log(`Starting script execution for migrating Questions`);
    const fetchAssessmentsQuery = `
        SELECT distinct(a.name), a.id, a.duration, a.created_at, a.randomize_questions, a.subject_id, a.year_name, s.name as standard_name
        FROM
        assessments a
         JOIN assessment_questions aq ON aq.assessment_id = a.id
         JOIN standard_questions sq ON sq.question_id = aq.question_id
         JOIN standards s ON sq.standard_id = s.id
         WHERE a.name LIKE '%xlm%' 
        `;
    // SELECT created_at, duration, id, instructions, name, max_marks, randomize_questions, subject_id, year_name FROM assessments
    const assessmentQueryResponse = await DB.query(fetchAssessmentsQuery, {
      type: DB.QueryTypes.SELECT,
    });
    let index = 1;
    const baseAssessmentHash = {
      reportPages: [1, 2, 3, 4, 5, 6, 7],
      isActive: false,
      assessmentType: "annual",
      startDate: new Date("2021-01-01T00:00:00.000Z"),
      endDate: new Date("2021-01-31T00:00:00.000Z"),
      defaultDate: new Date("2021-01-15T01:00:00.000Z"),
      sendReport: "dont_send_report",
      instructionVideoLink: "",
      status: "published",
      randomiseQuestionSequence: false,
      randomiseQuestionsClone: false,
      isMigratedAssessment: true,

      name: null,
      publishReportAfter: null,
      xseedGlobalStandardId: null,
      cloneNumber: false,
      totalTime: false,
      yearName: null,
      createdAt: null,
      updatedAt: null,
      questionSourceStandardId: null,
      demoTestTotalTime: null,
    };
    const bulk = Assessment.collection.initializeOrderedBulkOp();
    for (let quizzupAssessment of assessmentQueryResponse) {
      var temp = baseAssessmentHash;
      temp["name"] = quizzupAssessment["name"];
      temp["totalTime"] = quizzupAssessment["duration"];
      temp["createdAt"] = new Date(quizzupAssessment["created_at"]);
      temp["yearName"] = quizzupAssessment["year_name"];
      temp["updatedAt"] = new Date();
      temp["questionSourceStandardId"] =
        standardNameIdMap[quizzupAssessment["standard_name"]];
      temp["xseedGlobalStandardId"] =
        standardNameIdMap[quizzupAssessment["standard_name"]];
      temp["demoTestTotalTime"] = 2;
      temp["publishReportAfter"] = 24;
      temp["cloneNumber"] = 1;
      bulk.insert(temp);
    }

    // bulk.execute((err, results) => {
    //   if (err) {
    //     console.log(err);
    //   }
    // });
    console.log(bulk.length);
  } catch (e) {
    console.log(e);
  }
};

module.exports = insertAssessments;
