/*
 * =========================================================
 * SCHOOL FLOURISH INDEX
 * TEACHER REPORT CALCULATOR
 * =========================================================
 *
 * Input:
 *   Raw survey response object
 *
 * Output:
 *   Individual Teacher THFI report data
 *
 * Important:
 *   - Q6 is reverse scored using 6 - rawScore
 *   - Supports numeric and string responses
 *   - Normalizes question keys so leading/trailing spaces
 *     in Google Sheet keys do not break calculations
 *   - This module calculates data only.
 *   - It does NOT generate the report UI/PDF.
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
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const score = Number(value);

  if (!Number.isFinite(score)) {
    return null;
  }

  return score;
}


function getResponseValue(response, possibleKeys) {
  const normalizedResponse = {};

  Object.entries(response || {}).forEach(([key, value]) => {
    normalizedResponse[normalizeKey(key)] = value;
  });

  for (const key of possibleKeys) {
    const normalizedKey = normalizeKey(key);

    if (
      Object.prototype.hasOwnProperty.call(
        normalizedResponse,
        normalizedKey
      )
    ) {
      return normalizedResponse[normalizedKey];
    }
  }

  return null;
}


function getQuestionScore(response, questionKey) {
  return toScore(
    getResponseValue(response, [questionKey])
  );
}


/* ---------------------------------------------------------
   QUESTION DEFINITIONS
--------------------------------------------------------- */

const TEACHER_QUESTIONS = {
  q1: "I enjoy coming to school each day.",
  q2: "I feel satisfied with my current teaching role.",
  q3: "I feel proud to be a teacher.",
  q4: "I would recommend my school as a good workplace for teachers.",

  q5: "I feel emotionally energized during most school days.",
  q6: "I often feel emotionally exhausted after work. (Reverse scored)",
  q7: "I am able to manage work-related stress effectively.",
  q8: "I feel optimistic about my teaching career.",

  q9: "I can motivate students who are not interested in learning.",
  q10: "I can encourage students to participate actively in class.",
  q11: "I can help students believe in their own abilities.",
  q12: "I can build positive relationships with my students.",

  q13: "I can adapt my teaching to meet diverse learning needs.",
  q14: "I can explain difficult concepts effectively.",
  q15: "I use a variety of teaching strategies confidently.",
  q16: "I can assess whether students have understood my lessons.",

  q17: "I can manage disruptive behaviour calmly.",
  q18: "I can maintain a positive classroom environment.",
  q19: "I can respond confidently to unexpected classroom situations.",
  q20: "I feel confident handling discipline issues fairly.",

  q21: "My workload is manageable.",
  q22: "Administrative work does not interfere with teaching.",
  q23: "I have enough time to prepare quality lessons.",
  q24: "I am able to maintain a healthy work-life balance.",

  q25: "School leaders genuinely listen to teachers.",
  q26: "I receive timely support when I face challenges.",
  q27: "School decisions are communicated transparently.",
  q28: "I feel safe expressing my opinions without fear of negative consequences.",
  q29: "Leadership treats teachers fairly and respectfully.",

  q30: "Teachers collaborate and support one another",
  q31: "I feel respected by my colleagues.",
  q32: "There is a culture of trust in this school.",
  q33: "I feel that I belong in this school community.",

  q34: "My work is appreciated by school leadership.",
  q35: "I receive opportunities to grow professionally.",
  q36: "I have enough freedom to make decisions about my teaching.",
  q37: "I receive useful feedback that helps me improve.",

  q38: "I have adequate teaching and learning resources.",
  q39: "The school provides an environment that supports effective teaching.",
  q40: "I receive adequate support when dealing with challenging student or parent situations.",

  q41: "My work makes a positive difference in students' lives.",
  q42: "Teaching gives me a strong sense of purpose",
  q43: "I feel that I accomplish meaningful work.",
  q44: "I believe my contribution is valued by my school.",
};


/* ---------------------------------------------------------
   PARAMETER DEFINITIONS
--------------------------------------------------------- */

const TEACHER_PARAMETERS = [
  {
    key: "teacher_happiness",
    name: "Teacher Happiness & Job Satisfaction",
    questions: ["q1", "q2", "q3", "q4"],
    weight: 0.10,
  },

  {
    key: "emotional_wellbeing",
    name: "Emotional Well-being & Burnout",
    questions: ["q5", "q6", "q7", "q8"],
    weight: 0.14,
  },

  {
    key: "student_engagement",
    name: "Self-Efficacy – Student Engagement",
    questions: ["q9", "q10", "q11", "q12"],
    weight: 0.09,
  },

  {
    key: "instructional_practices",
    name: "Self-Efficacy – Instructional Practices",
    questions: ["q13", "q14", "q15", "q16"],
    weight: 0.09,
  },

  {
    key: "classroom_management",
    name: "Self-Efficacy – Classroom Management",
    questions: ["q17", "q18", "q19", "q20"],
    weight: 0.09,
  },

  {
    key: "workload_balance",
    name: "Workload & Work-Life Balance",
    questions: ["q21", "q22", "q23", "q24"],
    weight: 0.10,
  },

  {
    key: "leadership_trust",
    name: "Leadership Trust & Psychological Safety",
    questions: ["q25", "q26", "q27", "q28", "q29"],
    weight: 0.10,
  },

  {
    key: "school_culture",
    name: "School Culture & Relationships",
    questions: ["q30", "q31", "q32", "q33"],
    weight: 0.08,
  },

  {
    key: "professional_growth",
    name: "Professional Growth, Recognition & Autonomy",
    questions: ["q34", "q35", "q36", "q37"],
    weight: 0.06,
  },

  {
    key: "resources_support",
    name: "Resources & Organisational Support",
    questions: ["q38", "q39", "q40"],
    weight: 0.05,
  },

  {
    key: "meaning_accomplishment",
    name: "Meaning & Professional Accomplishment",
    questions: ["q41", "q42", "q43", "q44"],
    weight: 0.10,
  },
];


/* ---------------------------------------------------------
   REVERSE SCORING
--------------------------------------------------------- */

function reverseScore(score) {
  if (score === null) {
    return null;
  }

  return 6 - score;
}


/* ---------------------------------------------------------
   QUESTION SCORE EXTRACTION
--------------------------------------------------------- */

function getProcessedQuestionScores(response) {
  const scores = {};

  Object.entries(TEACHER_QUESTIONS).forEach(
    ([questionId, questionKey]) => {
      let score = getQuestionScore(
        response,
        questionKey
      );

      /*
       * Q6:
       * "I often feel emotionally exhausted after work."
       *
       * Reverse scoring:
       * 1 → 5
       * 2 → 4
       * 3 → 3
       * 4 → 2
       * 5 → 1
       */
      if (questionId === "q6" && score !== null) {
        score = reverseScore(score);
      }

      scores[questionId] = score;
    }
  );

  return scores;
}


/* ---------------------------------------------------------
   AVERAGE
--------------------------------------------------------- */

function calculateAverage(values) {
  const validValues = values.filter(
    (value) =>
      typeof value === "number" &&
      Number.isFinite(value)
  );

  if (!validValues.length) {
    return null;
  }

  return (
    validValues.reduce(
      (sum, value) => sum + value,
      0
    ) / validValues.length
  );
}


/* ---------------------------------------------------------
   PERFORMANCE LABEL
--------------------------------------------------------- */

function getPerformance(score) {
  if (score === null) {
    return "Not Available";
  }

  if (score >= 4.5) {
    return "Outstanding";
  }

  if (score >= 4.0) {
    return "Excellent";
  }

  if (score >= 3.8) {
    return "Very Good";
  }

  if (score >= 3.0) {
    return "Good";
  }

  if (score >= 2.0) {
    return "Needs Attention";
  }

  return "Critical";
}


/* ---------------------------------------------------------
   OVERALL THFI RATING
--------------------------------------------------------- */

function getTHFIRating(score) {
  if (score === null) {
    return "Not Available";
  }

  if (score >= 90) {
    return "Flourishing";
  }

  if (score >= 80) {
    return "Healthy";
  }

  if (score >= 70) {
    return "Developing";
  }

  if (score >= 60) {
    return "At Risk";
  }

  return "Critical";
}


/* ---------------------------------------------------------
   RESPONDENT DETAILS
--------------------------------------------------------- */

function getTeacherName(response) {
  return (
    getResponseValue(response, [
      "Teacher's Full Name:",
      "Teacher's Full Name",
    ]) || "Teacher"
  );
}


function getEmail(response) {
  return (
    getResponseValue(response, [
      "Email address",
      "Email Address",
      "Email",
      "email",
    ]) || ""
  );
}


function getSchoolName(response) {
  return (
    getResponseValue(response, [
      "School Name:",
      "School Name",
    ]) || ""
  );
}


/* ---------------------------------------------------------
   OVERALL HAPPINESS / RECOMMENDATION
--------------------------------------------------------- */

function getOverallHappiness(response) {
  const score = toScore(
    getResponseValue(response, [
      "Overall, how happy are you in your current school?",
    ])
  );

  if (score === null) {
    return {
      score: null,
      percentage: null,
    };
  }

  return {
    score,
    percentage: score * 10,
  };
}


function getRecommendation(response) {
  const score = toScore(
    getResponseValue(response, [
      "How likely are you to recommend your school as a workplace for teachers?",
    ])
  );

  if (score === null) {
    return {
      score: null,
      percentage: null,
    };
  }

  return {
    score,
    percentage: score * 10,
  };
}


/* ---------------------------------------------------------
   INDIVIDUAL PARAMETER CALCULATION
--------------------------------------------------------- */

function calculateParameters(questionScores) {
  return TEACHER_PARAMETERS.map((parameter) => {
    const scores = parameter.questions
      .map((questionId) =>
        questionScores[questionId]
      )
      .filter(
        (score) =>
          typeof score === "number" &&
          Number.isFinite(score)
      );

    const average = calculateAverage(scores);

    const weightedScore =
      average === null
        ? null
        : (average / 5) *
          100 *
          parameter.weight;

    return {
      key: parameter.key,
      name: parameter.name,
      questions: parameter.questions,
      average:
        average === null
          ? null
          : Number(average.toFixed(2)),
      weight: parameter.weight,
      weightPercentage:
        parameter.weight * 100,
      weightedScore:
        weightedScore === null
          ? null
          : Number(weightedScore.toFixed(2)),
      performance: getPerformance(average),
      answeredQuestions: scores.length,
      totalQuestions: parameter.questions.length,
    };
  });
}


/* ---------------------------------------------------------
   STRENGTHS / FOCUS AREAS
--------------------------------------------------------- */

function getStrengths(parameters) {
  return parameters
    .filter(
      (parameter) =>
        parameter.average !== null &&
        parameter.average >= 4.0
    )
    .sort(
      (a, b) =>
        b.average - a.average
    );
}


function getFocusAreas(parameters) {
  return parameters
    .filter(
      (parameter) =>
        parameter.average !== null &&
        parameter.average < 3.8
    )
    .sort(
      (a, b) =>
        a.average - b.average
    );
}


/* ---------------------------------------------------------
   QUESTION-LEVEL INDICATORS
--------------------------------------------------------- */

const INDICATOR_NAMES = {
  q1: "Enjoy coming to school",
  q2: "Job satisfaction",
  q3: "Pride in teaching",
  q4: "Recommend school as workplace",

  q5: "Emotional energy",
  q6: "Emotional exhaustion",
  q7: "Managing work-related stress",
  q8: "Teaching career optimism",

  q9: "Motivating uninterested students",
  q10: "Encouraging active participation",
  q11: "Building student confidence",
  q12: "Positive student relationships",

  q13: "Adapting to diverse learning needs",
  q14: "Explaining difficult concepts",
  q15: "Teaching strategy confidence",
  q16: "Assessing student understanding",

  q17: "Managing disruptive behaviour",
  q18: "Positive classroom environment",
  q19: "Unexpected classroom situations",
  q20: "Fair discipline",

  q21: "Workload manageability",
  q22: "Administrative workload",
  q23: "Lesson preparation time",
  q24: "Work-life balance",

  q25: "Leadership listening",
  q26: "Timely support",
  q27: "Transparent communication",
  q28: "Psychological safety",
  q29: "Fair and respectful leadership",

  q30: "Teacher collaboration",
  q31: "Respect among colleagues",
  q32: "Culture of trust",
  q33: "Sense of belonging",

  q34: "Leadership recognition",
  q35: "Professional growth",
  q36: "Teaching autonomy",
  q37: "Useful feedback",

  q38: "Teaching resources",
  q39: "Effective teaching environment",
  q40: "Support for difficult student/parent situations",

  q41: "Positive difference for students",
  q42: "Sense of purpose",
  q43: "Meaningful work",
  q44: "Contribution valued",
};


function getIndicators(questionScores) {
  return Object.entries(questionScores)
    .filter(
      ([, score]) =>
        typeof score === "number" &&
        Number.isFinite(score)
    )
    .map(([questionId, score]) => ({
      questionId,
      name:
        INDICATOR_NAMES[questionId] ||
        questionId,
      score: Number(score.toFixed(2)),
    }))
    .sort((a, b) => b.score - a.score);
}


/* ---------------------------------------------------------
   TOP 5 STRENGTHS / IMPROVEMENT AREAS
--------------------------------------------------------- */

function getTop5StrengthIndicators(indicators) {
  return indicators
    .slice()
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}


function getTop5ImprovementIndicators(indicators) {
  return indicators
    .slice()
    .sort((a, b) => a.score - b.score)
    .slice(0, 5);
}


/* ---------------------------------------------------------
   MAIN CALCULATOR
--------------------------------------------------------- */

export function calculateTeacherReport(response) {
  if (!response || typeof response !== "object") {
    throw new Error(
      "A valid teacher response is required."
    );
  }

  const questionScores =
    getProcessedQuestionScores(response);

  const parameters =
    calculateParameters(questionScores);

  const validWeightedScores = parameters
    .map(
      (parameter) =>
        parameter.weightedScore
    )
    .filter(
      (score) =>
        typeof score === "number" &&
        Number.isFinite(score)
    );

  /*
   * Official THFI:
   *
   * Average / 5 × 100 × weight
   *
   * Sum of all weighted contributions.
   */
  const thfi =
    validWeightedScores.length
      ? validWeightedScores.reduce(
          (sum, score) =>
            sum + score,
          0
        )
      : null;

  const roundedTHFI =
    thfi === null
      ? null
      : Number(thfi.toFixed(2));

  const indicators =
    getIndicators(questionScores);

  const strengths =
    getStrengths(parameters);

  const focusAreas =
    getFocusAreas(parameters);

  const top5Strengths =
    getTop5StrengthIndicators(
      indicators
    );

  const top5ImprovementAreas =
    getTop5ImprovementIndicators(
      indicators
    );

  return {
    respondent: {
      name: getTeacherName(response),
      email: getEmail(response),
      school: getSchoolName(response),
    },

    questionScores,

    parameters,

    thfi: roundedTHFI,

    rating:
      getTHFIRating(roundedTHFI),

    strengths,

    focusAreas,

    indicators,

    top5Strengths,

    top5ImprovementAreas,

    overallHappiness:
      getOverallHappiness(response),

    recommendation:
      getRecommendation(response),

    rawQualitativeResponses: {
      bestSupport:
        getResponseValue(response, [
          "What is the one thing your school does best to support teacher well-being?",
        ]),

      biggestChallenge:
        getResponseValue(response, [
          "What is the biggest challenge affecting your well-being at school?",
        ]),

      desiredChange:
        getResponseValue(response, [
          "If you could change one thing about your school, what would it be?",
        ]),

      professionalDevelopment:
        getResponseValue(response, [
          "What support or professional development would help you flourish as a teacher?",
        ]),

      additionalComments:
        getResponseValue(response, [
          "Any additional comments or suggestions?",
        ]),
    },
  };
}

export default calculateTeacherReport;
