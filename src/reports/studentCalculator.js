/*
 * =========================================================
 * SCHOOL FLOURISH INDEX
 * STUDENT REPORT CALCULATOR
 * =========================================================
 *
 * Input:
 *   Raw Student survey response object
 *
 * Output:
 *   Individual Student report data
 *
 * Based on the supplied Student methodology:
 *   - 27 scored questions
 *   - 8 Student dimensions
 *   - Supplied dimension weights
 *   - Strength areas: average >= 4.0
 *   - Focus areas: average < 3.8
 *
 * Important:
 *   - No Student performance/rating bands were supplied,
 *     so performance is returned as "—".
 *   - No invented reverse scoring is applied because none
 *     was specified in the supplied methodology.
 *   - This module calculates data only.
 *   - It does NOT generate report UI or PDF.
 * =========================================================
 */


/* ---------------------------------------------------------
   QUESTION NORMALIZATION
--------------------------------------------------------- */

function normalizeKey(key) {
  return String(key || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}


/* ---------------------------------------------------------
   RESPONSE VALUE HELPERS
--------------------------------------------------------- */

function toScore(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const score = Number(value);

  if (
    !Number.isFinite(score) ||
    score < 1 ||
    score > 5
  ) {
    return null;
  }

  return score;
}


function buildNormalizedResponse(response) {
  const normalizedResponse = {};

  Object.entries(response || {}).forEach(
    ([key, value]) => {
      normalizedResponse[normalizeKey(key)] = value;
    }
  );

  return normalizedResponse;
}


function getResponseValue(
  response,
  possibleKeys
) {
  const normalizedResponse =
    buildNormalizedResponse(response);

  for (const key of possibleKeys) {
    const normalizedKey =
      normalizeKey(key);

    if (
      Object.prototype.hasOwnProperty.call(
        normalizedResponse,
        normalizedKey
      )
    ) {
      return normalizedResponse[
        normalizedKey
      ];
    }
  }

  return null;
}


/* ---------------------------------------------------------
   STUDENT QUESTIONS
--------------------------------------------------------- */

export const STUDENT_QUESTIONS = {
  q1: [
    "1. I enjoy coming to school.",
  ],

  q2: [
    "2. I feel happy and positive during most school days.",
  ],

  q3: [
    "3. I feel proud to be a student of my school.",
  ],

  q4: [
    "4. I know healthy ways to manage stress or difficult emotions.",
  ],

  q5: [
    "5. I can recover and move forward when I face difficulties.",
  ],

  q6: [
    "6. I feel hopeful and positive about my future.",
  ],

  q7: [
    "7. I feel safe at school.",
  ],

  q8: [
    "8. I can express my opinions and ask questions without being afraid.",
  ],

  q9: [
    "9. I know whom I can approach when I have a problem or need help.",
  ],

  q10: [
    "10. I feel that I belong in my school.",
  ],

  q11: [
    "11. I feel accepted and respected by other students.",
  ],

  q12: [
    "12. My school makes students feel included, even when they are different from one another.",
  ],

  q13: [
    "13. I enjoy learning new things at school.",
  ],

  q14: [
    "14.My teachers make learning interesting and encourage me to participate.",
    "14. My teachers make learning interesting and encourage me to participate.",
  ],

  q15: [
    "15. I feel confident that I can learn and improve when I practise and put in effort.",
  ],

  q16: [
    "16. I keep trying when I find something difficult.",
  ],

  q17: [
    "17. My teachers care about me as a person, not just my marks.",
  ],

  q18: [
    "18. My teachers encourage me when I struggle or make mistakes.",
  ],

  q19: [
    "19. My teachers treat students fairly and respectfully.",
  ],

  q20: [
    "20. Students in my school generally treat one another with kindness and respect.",
  ],

  q21: [
    "21. I feel comfortable working and learning with other students.",
  ],

  q22: [
    "22. When bullying or hurtful behaviour happens, I feel that the school takes it seriously.",
  ],

  q23: [
    "23. My ideas and opinions are listened to by adults in my school.",
    "23.  My ideas and opinions are listened to by adults in my school.",
  ],

  q24: [
    "24. I get opportunities to take responsibility or develop leadership skills.",
  ],

  q25: [
    "25. I feel that what I learn in school will help me in my future life.",
  ],

  q26: [
    "26. I am learning how to use technology and AI safely and responsibly.",
  ],

  q27: [
    "27. My school gives me opportunities to discover my interests, strengths and talents beyond academics.",
    "27.  My school gives me opportunities to discover my interests, strengths and talents beyond academics.",
  ],
};


/* ---------------------------------------------------------
   STUDENT DIMENSION DEFINITIONS
--------------------------------------------------------- */

export const STUDENT_DIMENSIONS = [
  {
    key: "happiness_school_experience",
    name: "Happiness & School Experience",
    questions: ["q1", "q2", "q3"],
    weight: 0.12,
  },

  {
    key: "emotional_wellbeing_resilience",
    name: "Emotional Well-being & Resilience",
    questions: ["q4", "q5", "q6"],
    weight: 0.12,
  },

  {
    key: "psychological_safety",
    name: "Psychological Safety",
    questions: ["q7", "q8", "q9"],
    weight: 0.12,
  },

  {
    key: "belonging_inclusion",
    name: "Belonging & Inclusion",
    questions: ["q10", "q11", "q12"],
    weight: 0.12,
  },

  {
    key: "learning_engagement_confidence",
    name: "Learning, Engagement & Confidence",
    questions: ["q13", "q14", "q15", "q16"],
    weight: 0.16,
  },

  {
    key: "teacher_support_classroom_climate",
    name: "Teacher Support & Classroom Climate",
    questions: ["q17", "q18", "q19"],
    weight: 0.12,
  },

  {
    key: "peer_relationships_respect",
    name: "Peer Relationships & Respect",
    questions: ["q20", "q21", "q22"],
    weight: 0.10,
  },

  {
    key: "student_voice_purpose_future",
    name: "Student Voice, Purpose & Future Readiness",
    questions: ["q23", "q24", "q25", "q26", "q27"],
    weight: 0.14,
  },
];


/* ---------------------------------------------------------
   DIMENSION WEIGHT CHECK
--------------------------------------------------------- */

function getTotalWeight() {
  return STUDENT_DIMENSIONS.reduce(
    (sum, dimension) =>
      sum + dimension.weight,
    0
  );
}


/* ---------------------------------------------------------
   QUESTION SCORE EXTRACTION
--------------------------------------------------------- */

function getQuestionScore(
  response,
  questionId
) {
  const possibleKeys =
    STUDENT_QUESTIONS[questionId] || [];

  return toScore(
    getResponseValue(
      response,
      possibleKeys
    )
  );
}


function getProcessedQuestionScores(
  response
) {
  const questionScores = {};

  Object.keys(STUDENT_QUESTIONS).forEach(
    (questionId) => {
      questionScores[questionId] =
        getQuestionScore(
          response,
          questionId
        );
    }
  );

  return questionScores;
}


/* ---------------------------------------------------------
   AVERAGE
--------------------------------------------------------- */

function calculateAverage(values) {
  const validValues =
    values.filter(
      (value) =>
        typeof value === "number" &&
        Number.isFinite(value)
    );

  if (!validValues.length) {
    return null;
  }

  return (
    validValues.reduce(
      (sum, value) =>
        sum + value,
      0
    ) / validValues.length
  );
}


/* ---------------------------------------------------------
   PERFORMANCE
---------------------------------------------------------

No official Student performance bands were supplied.

Therefore:
  >= 4.0 / < 3.8 are used only for
  strengths/focus areas.

Performance remains "—".
--------------------------------------------------------- */

function getPerformance(score) {
  if (score === null) {
    return "—";
  }

  return "—";
}


/* ---------------------------------------------------------
   DIMENSION CALCULATION
--------------------------------------------------------- */

function calculateDimensions(
  questionScores
) {
  return STUDENT_DIMENSIONS.map(
    (dimension) => {
      const scores =
        dimension.questions
          .map(
            (questionId) =>
              questionScores[questionId]
          )
          .filter(
            (score) =>
              typeof score === "number" &&
              Number.isFinite(score)
          );

      const average =
        calculateAverage(scores);

      /*
       * Weighted contribution on a 100-point
       * scale, derived directly from the
       * supplied dimension weight.
       */
      const weightedScore =
        average === null
          ? null
          : (average / 5) *
            100 *
            dimension.weight;

      return {
        key: dimension.key,

        name: dimension.name,

        questions:
          dimension.questions,

        weight:
          dimension.weight,

        weightPercentage:
          dimension.weight * 100,

        average:
          average === null
            ? null
            : Number(
                average.toFixed(2)
              ),

        weightedScore:
          weightedScore === null
            ? null
            : Number(
                weightedScore.toFixed(2)
              ),

        performance:
          getPerformance(average),

        answeredQuestions:
          scores.length,

        totalQuestions:
          dimension.questions.length,
      };
    }
  );
}


/* ---------------------------------------------------------
   OVERALL WEIGHTED SCORE
--------------------------------------------------------- */

function calculateOverallScore(
  dimensions
) {
  const validScores =
    dimensions
      .map(
        (dimension) =>
          dimension.weightedScore
      )
      .filter(
        (score) =>
          typeof score === "number" &&
          Number.isFinite(score)
      );

  if (!validScores.length) {
    return null;
  }

  return Number(
    validScores
      .reduce(
        (sum, score) =>
          sum + score,
        0
      )
      .toFixed(2)
  );
}


/* ---------------------------------------------------------
   STRENGTH AREAS
--------------------------------------------------------- */

function getStrengths(dimensions) {
  return dimensions
    .filter(
      (dimension) =>
        dimension.average !== null &&
        dimension.average >= 4.0
    )
    .sort(
      (a, b) =>
        b.average - a.average
    );
}


/* ---------------------------------------------------------
   FOCUS AREAS
--------------------------------------------------------- */

function getFocusAreas(dimensions) {
  return dimensions
    .filter(
      (dimension) =>
        dimension.average !== null &&
        dimension.average < 3.8
    )
    .sort(
      (a, b) =>
        a.average - b.average
    );
}


/* ---------------------------------------------------------
   QUESTION-LEVEL INDICATORS
--------------------------------------------------------- */

export const STUDENT_INDICATOR_NAMES = {
  q1: "Enjoy coming to school",
  q2: "Happy and positive school days",
  q3: "Pride in being a student",
  q4: "Managing stress and difficult emotions",
  q5: "Recovering from difficulties",
  q6: "Hopeful and positive future",
  q7: "Feeling safe at school",
  q8: "Expressing opinions and asking questions",
  q9: "Knowing whom to approach for help",
  q10: "Sense of belonging",
  q11: "Acceptance and respect from peers",
  q12: "Inclusion of differences",
  q13: "Enjoying new learning",
  q14: "Interesting and encouraging teachers",
  q15: "Confidence in learning and improvement",
  q16: "Persistence when learning is difficult",
  q17: "Teachers care about students",
  q18: "Teacher encouragement",
  q19: "Fair and respectful teacher treatment",
  q20: "Kindness and respect among students",
  q21: "Comfort working and learning with peers",
  q22: "School response to bullying and hurtful behaviour",
  q23: "Student ideas being heard",
  q24: "Leadership and responsibility opportunities",
  q25: "Future usefulness of learning",
  q26: "Safe and responsible technology/AI use",
  q27: "Discovering interests, strengths and talents",
};


function getIndicators(
  questionScores
) {
  return Object.entries(
    questionScores
  )
    .filter(
      ([, score]) =>
        typeof score === "number" &&
        Number.isFinite(score)
    )
    .map(
      ([questionId, score]) => ({
        questionId,

        name:
          STUDENT_INDICATOR_NAMES[
            questionId
          ] || questionId,

        score: Number(
          score.toFixed(2)
        ),
      })
    )
    .sort(
      (a, b) =>
        b.score - a.score
    );
}


/* ---------------------------------------------------------
   TOP INDICATORS
--------------------------------------------------------- */

function getTopStrengthIndicators(
  indicators
) {
  return indicators
    .slice()
    .sort(
      (a, b) =>
        b.score - a.score
    )
    .slice(0, 5);
}


function getTopImprovementIndicators(
  indicators
) {
  return indicators
    .slice()
    .sort(
      (a, b) =>
        a.score - b.score
    )
    .slice(0, 5);
}


/* ---------------------------------------------------------
   RESPONDENT DETAILS
--------------------------------------------------------- */

function getStudentName(response) {
  return (
    getResponseValue(
      response,
      [
        "Student's Full Name:",
        "Student's Full Name",
      ]
    ) || "Student"
  );
}


function getEmail(response) {
  return (
    getResponseValue(
      response,
      [
        "Email address",
        "Email Address",
        "Email",
        "email",
      ]
    ) || ""
  );
}


function getSchoolName(response) {
  return (
    getResponseValue(
      response,
      [
        "School Name:",
        "School Name",
      ]
    ) || ""
  );
}


function getGrade(response) {
  return (
    getResponseValue(
      response,
      [
        "Grade",
        "Grade/Class",
      ]
    ) || ""
  );
}


function getRole(response) {
  return (
    getResponseValue(
      response,
      [
        "Your Current Role/Position",
      ]
    ) || ""
  );
}


function getYearsAtSchool(response) {
  return (
    getResponseValue(
      response,
      [
        "How many years have you been studying at this school?",
      ]
    ) || ""
  );
}


function getSubmissionDate(response) {
  return (
    getResponseValue(
      response,
      [
        "Date of Submission",
      ]
    ) || ""
  );
}


function getTimestamp(response) {
  return (
    getResponseValue(
      response,
      [
        "Timestamp",
      ]
    ) || ""
  );
}


/* ---------------------------------------------------------
   QUALITATIVE RESPONSES
--------------------------------------------------------- */

function getQualitativeResponses(
  response
) {
  return {
    likedMost:
      getResponseValue(
        response,
        [
          "28. What is the one thing you like most about your school?",
        ]
      ),

    desiredChange:
      getResponseValue(
        response,
        [
          "29. If you could change one thing to make your school better for students, what would you change?",
        ]
      ),

    flourishBecause:
      getResponseValue(
        response,
        [
          "30. Complete the sentence:\n“I flourish at my school because…”",
          "30. Complete the sentence: “I flourish at my school because…”",
          "30. Complete the sentence:",
        ]
      ),

    happinessEnvironmentChange:
      getResponseValue(
        response,
        [
          "If you could change one thing about your school environment to increase your happiness, what would it be?",
        ]
      ),
  };
}


/* ---------------------------------------------------------
   OBSERVATIONS
--------------------------------------------------------- */

function buildObservations({
  strengths,
  focusAreas,
  overallScore,
  qualitative,
}) {
  const observations = [];

  if (strengths.length) {
    observations.push(
      `Strongest dimension: ${strengths[0].name} (${strengths[0].average.toFixed(
        2
      )}/5).`
    );
  } else {
    observations.push(
      "No dimension currently meets the strength threshold of 4.0."
    );
  }

  if (focusAreas.length) {
    const focusText =
      focusAreas
        .slice(0, 2)
        .map(
          (item) =>
            `${item.name} (${item.average.toFixed(
              2
            )}/5)`
        )
        .join(" and ");

    observations.push(
      `Areas below the focus threshold: ${focusText}.`
    );
  } else {
    observations.push(
      "No dimension falls below the focus threshold of 3.8."
    );
  }

  if (overallScore !== null) {
    observations.push(
      `Overall weighted Student index: ${overallScore}/100.`
    );
  } else {
    observations.push(
      "Overall weighted Student index is unavailable because there are no valid scored responses."
    );
  }

  if (
    qualitative.likedMost ||
    qualitative.desiredChange ||
    qualitative.flourishBecause ||
    qualitative.happinessEnvironmentChange
  ) {
    observations.push(
      "Qualitative student responses are available for contextual insight."
    );
  } else {
    observations.push(
      "No qualitative student responses were provided."
    );
  }

  return observations;
}


/* ---------------------------------------------------------
   MAIN CALCULATOR
--------------------------------------------------------- */

export function calculateStudentReport(
  response
) {
  if (
    !response ||
    typeof response !== "object"
  ) {
    throw new Error(
      "A valid student response is required."
    );
  }

  /*
   * Confirm supplied dimensions still total 100%.
   */
  const totalWeight =
    getTotalWeight();

  if (
    Math.abs(totalWeight - 1) >
    0.000001
  ) {
    throw new Error(
      "Student dimension weights must total 100%."
    );
  }

  const questionScores =
    getProcessedQuestionScores(
      response
    );

  const dimensions =
    calculateDimensions(
      questionScores
    );

  const strengths =
    getStrengths(dimensions);

  const focusAreas =
    getFocusAreas(dimensions);

  const indicators =
    getIndicators(
      questionScores
    );

  const top5Strengths =
    getTopStrengthIndicators(
      indicators
    );

  const top5ImprovementAreas =
    getTopImprovementIndicators(
      indicators
    );

  const overallScore =
    calculateOverallScore(
      dimensions
    );

  const qualitative =
    getQualitativeResponses(
      response
    );

  const observations =
    buildObservations({
      strengths,
      focusAreas,
      overallScore,
      qualitative,
    });

  return {
    role: "student",

    respondent: {
      name: getStudentName(
        response
      ),

      email: getEmail(
        response
      ),

      school: getSchoolName(
        response
      ),

      grade: getGrade(
        response
      ),

      currentRole: getRole(
        response
      ),

      yearsAtSchool:
        getYearsAtSchool(
          response
        ),
    },

    submission: {
      date: getSubmissionDate(
        response
      ),

      timestamp:
        getTimestamp(response),
    },

    /*
     * One respondent = one individual report.
     */
    respondents: 1,

    questionScores,

    dimensions,

    /*
     * Alias kept as parameters so the
     * report component can use the same
     * structure as TeacherReport.
     */
    parameters:
      dimensions,

    /*
     * This is a weighted 100-point index
     * derived directly from the supplied
     * dimension weights.
     *
     * It is NOT assigned a rating because
     * no Student rating methodology was
     * supplied.
     */
    overallScore,

    strengths,

    focusAreas,

    indicators,

    top5Strengths,

    top5ImprovementAreas,

    observations,

    /*
     * Performance labels are intentionally
     * not invented.
     */
    rating: null,

    rawQualitativeResponses:
      qualitative,
  };
}


export default calculateStudentReport;