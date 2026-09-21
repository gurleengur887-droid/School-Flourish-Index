/* =========================================================
   SCHOOL FLOURISH INDEX
   LEADER REPORT CALCULATOR
   =========================================================
   Approved Leader dimensions / weights:
   A  Leadership Well-being & Emotional Load ................ 15%
   B  Decision-Making & Leadership Pressure ................. 10%
   C  Leadership Support, Governance & Connection ............ 12%
   D  Organisational & Operational Conditions ............... 18%
   E  Leadership–Staff Relationships & Culture ............... 15%
   F  Leadership Effectiveness & Capacity ................... 12%
   G  Purpose, Growth & Sustainable Leadership ............... 18%

   Reverse-scored items:
   Q2, Q3, Q4, Q5, Q6, Q13, Q14, Q15

   Reverse mapping:
   1 → 5
   2 → 4
   3 → 3
   4 → 2
   5 → 1

   Higher score = healthier and more sustainable leadership
   conditions.

   NOTE:
   The supplied Leader methodology did not provide official
   performance bands or an overall rating-band table. Therefore
   this calculator does NOT invent those values.
========================================================= */

const LEADER_QUESTIONS = {
  q1: "1. I feel emotionally and mentally able to manage the demands of my leadership role.",
  q2: "2. I carry school-related concerns with me even after the working day has ended. ",
  q3: "3. I find myself managing other people's emotions while neglecting my own well-being. ",
  q4: "4. I feel emotionally or mentally exhausted by the demands of school leadership. ",
  q5: "5. I feel overwhelmed by the number and complexity of decisions I need to make each day. ",
  q6: "6. I feel pressure to appear calm and strong even when I am struggling internally. ",
  q7: "7. I am able to make difficult decisions with clarity even when there is considerable pressure or uncertainty.",
  q8: "8. I have trusted people with whom I can openly discuss my leadership challenges.",
  q9: "9. I receive meaningful support from my governing body, management or senior leadership.",
  q10: "10. My governing body or management respects the boundary between strategic oversight and operational leadership.",
  q11: "11. I have access to guidance, mentoring or peer support when I face difficult leadership situations.",
  q12: "12. Administrative, reporting and compliance demands leave me with sufficient time to focus on teaching, learning and school improvement.",
  q13: "13. Budget or resource constraints create significant pressure in my leadership role. ",
  q14: "14. Regulatory, compliance and external reporting requirements create significant pressure in my leadership role.",
  q15: "15. Managing competing expectations from teachers, parents, students, management and external stakeholders creates significant pressure for me. ",
  q16: "16. The school has adequate systems, processes and resources to support me in carrying out my leadership responsibilities effectively.",
  q17: "17. I am able to build trusting and respectful relationships with teachers and staff.",
  q18: "18. Teachers and staff feel comfortable approaching me with concerns or difficulties.",
  q19: "19. I am able to support staff well-being while maintaining appropriate accountability and performance standards.",
  q20: "20. The culture of my school reflects the values and behaviors I want to promote as a leader.",
  q21: "21. I have sufficient time and energy to focus on long-term school improvement rather than constantly responding to urgent issues.",
  q22: "22. I am able to delegate responsibilities effectively rather than trying to manage everything myself.",
  q23: "23. I am able to remain calm, thoughtful and constructive when the school faces a crisis or unexpected challenge.",
  q24: "24. I feel a strong sense of purpose in my role as a school leader.",
  q25: "25. I have opportunities to learn, reflect and develop as a leader.",
  q26: "26. I am able to maintain healthy boundaries between my professional responsibilities and personal life.",
  q27: "27. I feel that I can sustain my current leadership role without compromising my own well-being.",
};

const LEADER_DIMENSIONS = [
  {
    key: "leadership_wellbeing_emotional_load",
    name: "Leadership Well-being & Emotional Load",
    questions: ["q1", "q2", "q3", "q4"],
    weight: 0.15,
  },
  {
    key: "decision_making_leadership_pressure",
    name: "Decision-Making & Leadership Pressure",
    questions: ["q5", "q6", "q7"],
    weight: 0.1,
  },
  {
    key: "leadership_support_governance_connection",
    name: "Leadership Support, Governance & Connection",
    questions: ["q8", "q9", "q10", "q11"],
    weight: 0.12,
  },
  {
    key: "organisational_operational_conditions",
    name: "Organisational & Operational Conditions",
    questions: ["q12", "q13", "q14", "q15", "q16"],
    weight: 0.18,
  },
  {
    key: "leadership_staff_relationships_culture",
    name: "Leadership–Staff Relationships & Culture",
    questions: ["q17", "q18", "q19", "q20"],
    weight: 0.15,
  },
  {
    key: "leadership_effectiveness_capacity",
    name: "Leadership Effectiveness & Capacity",
    questions: ["q21", "q22", "q23"],
    weight: 0.12,
  },
  {
    key: "purpose_growth_sustainable_leadership",
    name: "Purpose, Growth & Sustainable Leadership",
    questions: ["q24", "q25", "q26", "q27"],
    weight: 0.18,
  },
];

const REVERSE_SCORED_QUESTIONS = new Set([
  "q2",
  "q3",
  "q4",
  "q5",
  "q6",
  "q13",
  "q14",
  "q15",
]);

function normalizeKey(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function buildNormalizedMap(response = {}) {
  const map = new Map();

  Object.entries(response || {}).forEach(([key, value]) => {
    map.set(normalizeKey(key), value);
  });

  return map;
}

function getResponseValue(response, keys = []) {
  const map = buildNormalizedMap(response);

  for (const key of keys) {
    const direct = response?.[key];

    if (
      direct !== undefined &&
      direct !== null &&
      String(direct).trim() !== ""
    ) {
      return direct;
    }

    const normalized = map.get(normalizeKey(key));

    if (
      normalized !== undefined &&
      normalized !== null &&
      String(normalized).trim() !== ""
    ) {
      return normalized;
    }
  }

  return "";
}

function getQuestionValue(response, questionId) {
  const canonical = LEADER_QUESTIONS[questionId];

  const aliases = [
    canonical,
    canonical?.replace(/\s+$/, ""),
    canonical?.replace(/\.\s+/g, "."),
  ];

  return getResponseValue(response, aliases);
}

function toScore(value) {
  const score = Number(value);

  if (!Number.isFinite(score)) {
    return null;
  }

  if (score < 1 || score > 5) {
    return null;
  }

  return score;
}

function reverseScore(score) {
  return score === null ? null : 6 - score;
}

function processQuestionScore(questionId, rawValue) {
  const score = toScore(rawValue);

  if (score === null) {
    return null;
  }

  return REVERSE_SCORED_QUESTIONS.has(questionId)
    ? reverseScore(score)
    : score;
}

function calculateQuestionScores(response = {}) {
  return Object.keys(LEADER_QUESTIONS).reduce(
    (scores, questionId) => {
      scores[questionId] = processQuestionScore(
        questionId,
        getQuestionValue(response, questionId)
      );

      return scores;
    },
    {}
  );
}

function calculateAverage(scores) {
  const validScores = scores.filter(
    (score) =>
      typeof score === "number" &&
      Number.isFinite(score)
  );

  if (!validScores.length) {
    return null;
  }

  return (
    validScores.reduce(
      (sum, score) => sum + score,
      0
    ) / validScores.length
  );
}

function calculateDimensions(questionScores = {}) {
  return LEADER_DIMENSIONS.map((dimension) => {
    const scores = dimension.questions.map(
      (questionId) =>
        questionScores[questionId]
    );

    const validScores = scores.filter(
      (score) =>
        typeof score === "number" &&
        Number.isFinite(score)
    );

    const rawAverage =
      calculateAverage(validScores);

    const average =
      rawAverage === null
        ? null
        : Number(rawAverage.toFixed(2));

    const weightedScore =
      rawAverage === null
        ? null
        : Number(
            (
              (rawAverage / 5) *
              100 *
              dimension.weight
            ).toFixed(2)
          );

    return {
      ...dimension,
      weightPercentage: Number(
        (dimension.weight * 100).toFixed(2)
      ),
      average,
      weightedScore,
      performance: "—",
      answeredQuestions: validScores.length,
      totalQuestions:
        dimension.questions.length,
    };
  });
}

function getRespondent(response = {}) {
  return {
    name: getResponseValue(response, [
      "Leader's Full Name :",
      "Leader's Full Name:",
      "Leader's Full Name",
    ]).trim(),

    email: getResponseValue(response, [
      "Email Address",
      "Email address",
      "email address",
      "Email",
      "email",
    ]).trim(),

    school: getResponseValue(response, [
      "School Name :",
      "School Name:",
      "School Name",
    ]).trim(),

    schoolType: getResponseValue(response, [
      "School Type:",
      "School Type: ",
      "School Type",
    ]).trim(),

    currentRole: getResponseValue(response, [
      "Current Leadership Role / Position :",
      "Current Leadership Role / Position:",
      "Current Leadership Role / Position",
    ]).trim(),

    schoolLevel: getResponseValue(response, [
      "School Level / Division Handled :",
      "School Level / Division Handled:",
      "School Level / Division Handled",
    ]).trim(),

    experience: getResponseValue(response, [
      "Total Years of Experience in Educational Leadership",
      "Total Years of Experience in Educational Leadership  ",
    ]).trim(),
  };
}

function getSubmission(response = {}) {
  return {
    timestamp: getResponseValue(response, [
      "Timestamp",
    ]),

    date: getResponseValue(response, [
      "Date of Submission",
    ]),
  };
}

function getQualitative(response = {}) {
  return {
    purpose: getResponseValue(response, [
      "28. What gives you the greatest sense of purpose, satisfaction or energy in your leadership role?",
    ]),

    desiredChange: getResponseValue(response, [
      "29. If you could change ONE thing in your school's systems, structures or support to make your leadership role more sustainable and effective, what would it be?",
    ]),

    flourishBecause: getResponseValue(response, [
      "30. Complete the sentence:\n“I would be a more effective and flourishing school leader if…”",
      "30. Complete the sentence: “I would be a more effective and flourishing school leader if…”",
    ]),

    happinessChange: getResponseValue(response, [
      "If you could change one thing about your school environment to increase your happiness, what would it be?",
    ]),
  };
}

function getIndicators(questionScores) {
  return Object.entries(questionScores)
    .filter(
      ([, score]) =>
        typeof score === "number"
    )
    .map(
      ([questionId, score]) => ({
        questionId,
        name:
          LEADER_QUESTIONS[questionId],
        score: Number(score.toFixed(2)),
        reversed:
          REVERSE_SCORED_QUESTIONS.has(
            questionId
          ),
      })
    );
}



function generateObservations({
  overallScore,
  qualitative,
}) {
  const observations = [];

  if (
    typeof overallScore === "number"
  ) {
    observations.push(
      `Overall weighted Leader index: ${overallScore.toFixed(
        2
      )}/100.`
    );
  } else {
    observations.push(
      "Overall weighted Leader index is unavailable."
    );
  }

  const hasQualitative =
    Object.values(qualitative).some(
      (value) =>
        String(value || "").trim()
    );

  observations.push(
    hasQualitative
      ? "Qualitative leader responses are available for contextual insight."
      : "No qualitative leader responses were provided."
  );

  return observations;
}

export function calculateLeaderReport(
  response = {}
) {
  const questionScores =
    calculateQuestionScores(
      response
    );

  const dimensions =
    calculateDimensions(
      questionScores
    );

  const weightedScores =
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

  const allQuestionsAnswered =
    dimensions.length ===
      LEADER_DIMENSIONS.length &&
    dimensions.every(
      (dimension) =>
        dimension.answeredQuestions ===
        dimension.totalQuestions
    );

  const overallScore =
    allQuestionsAnswered &&
    weightedScores.length ===
      LEADER_DIMENSIONS.length
      ? Number(
          weightedScores
            .reduce(
              (sum, score) =>
                sum + score,
              0
            )
            .toFixed(2)
        )
      : null;

  const respondent =
    getRespondent(response);

  const submission =
    getSubmission(response);

  const rawQualitativeResponses =
    getQualitative(response);

  const indicators =
    getIndicators(questionScores);

  return {
    role: "leader",

    respondent,

    submission,

    respondents: 1,

    questionScores,

    dimensions,

    parameters: dimensions,

    overallScore,

    sfi: overallScore,

    // Official Leader rating bands
    // were not supplied.
    rating: null,

    // Official Leader strength/focus
    // thresholds were not supplied.
    strengths: null,

    focusAreas: null,

    indicators,

    // Do not label indicators as
    // strengths/improvement areas
    // without an approved method.
    top5Strengths: [],

    top5ImprovementAreas: [],

    observations:
      generateObservations({
        overallScore,
        qualitative:
          rawQualitativeResponses,
      }),

    rawQualitativeResponses,
  };
}

export {
  LEADER_QUESTIONS,
  LEADER_DIMENSIONS,
  REVERSE_SCORED_QUESTIONS,
  normalizeKey,
  toScore,
  reverseScore,
  calculateQuestionScores,
  calculateDimensions,
};