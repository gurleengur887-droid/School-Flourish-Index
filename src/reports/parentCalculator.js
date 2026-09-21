/*
 * Parent Voice Report Calculator
 *
 * Source methodology:
 * - 9 dimensions
 * - 27 scored questions
 * - weights total 100%
 * - dimension weighted index = (Average / 5) * Weight * 100
 * - overall Parent Voice / SFI score = sum of dimension weighted indices
 * - dimension performance bands mirror the existing Teacher report
 * - overall rating bands follow the approved Parent methodology
 */

const PARENT_QUESTIONS = {
  q1: "1. My child's school environment is well suited to their personality, strengths and learning needs.",
  q2: "2. The school recognizes and encourages my child's individual strengths and interests.",
  q3: "3. My child feels a sense of belonging and acceptance at school.",
  q4: "4.My child generally enjoys going to school.",
  q5: "5. My child feels emotionally safe and comfortable being themselves at school.",
  q6: "6. My child has at least one trusted adult at school whom they can approach for help.",
  q7: "7. My child is encouraged to understand, question and think rather than simply memorize.",
  q8: "8. My child receives feedback that helps them improve and grow.",
  q9: "9.I can see meaningful academic, personal and intellectual growth in my child.",
  q10: "10. The school is helping my child develop confidence and resilience.",
  q11: "11. My child is learning to handle mistakes, failure and setbacks constructively.",
  q12: "12. My child is developing empathy, responsibility, communication and collaboration skills.",
  q13: "13. My child's teachers understand and support my child beyond their academic performance.",
  q14: "14. Teachers recognize my child's strengths and encourage them when they face difficulties.",
  q15: "15. My child feels comfortable approaching teachers when they need help.",
  q16: "16. Students are treated fairly and with dignity and respect in this school.",
  q17: "17. Bullying, exclusion and inappropriate behavior are taken seriously by the school.",
  q18: "18. My child can express concerns and make mistakes without fear of humiliation or unfair treatment.",
  q19: "19. The school communicates important information clearly and in a timely manner.",
  q20: "20. Teachers listen respectfully to my concerns and perspectives about my child.",
  q21: "21. The school and our family work together effectively when my child faces difficulties.",
  q22: "22. I trust the school leadership to make decisions in the best interests of children.",
  q23: "23. The school is transparent about its policies, expectations and important decisions.",
  q24: "24. I feel confident that my child's well-being is a genuine priority for the school.",
  q25: "25. My child has meaningful opportunities to participate in sports, arts, creativity, leadership or other activities beyond academics.",
  q26: "26. The school is helping my child develop the skills needed for life beyond examinations.",
  q27: "27. The school is preparing my child to use technology and AI safely, responsibly and meaningfully.",
};

const PARENT_DIMENSIONS = [
  {
    key: "child_school_fit",
    name: "Child–School Fit",
    questions: ["q1", "q2", "q3"],
    weight: 0.12,
  },
  {
    key: "happiness_emotional_safety",
    name: "Happiness & Emotional Safety",
    questions: ["q4", "q5", "q6"],
    weight: 0.12,
  },
  {
    key: "learning_growth",
    name: "Learning & Growth",
    questions: ["q7", "q8", "q9"],
    weight: 0.14,
  },
  {
    key: "life_skills_resilience",
    name: "Life Skills & Resilience",
    questions: ["q10", "q11", "q12"],
    weight: 0.10,
  },
  {
    key: "teacher_child_relationship",
    name: "Teacher–Child Relationship",
    questions: ["q13", "q14", "q15"],
    weight: 0.12,
  },
  {
    key: "school_culture_psychological_safety",
    name: "School Culture & Psychological Safety",
    questions: ["q16", "q17", "q18"],
    weight: 0.12,
  },
  {
    key: "parent_school_partnership",
    name: "Parent–School Partnership",
    questions: ["q19", "q20", "q21"],
    weight: 0.10,
  },
  {
    key: "leadership_trust",
    name: "Leadership & Trust",
    questions: ["q22", "q23", "q24"],
    weight: 0.08,
  },
  {
    key: "holistic_future_readiness",
    name: "Holistic & Future Readiness",
    questions: ["q25", "q26", "q27"],
    weight: 0.10,
  },
];

function normalizeKey(value) {
  return String(value ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/\r?\n/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

const NORMALIZED_PARENT_QUESTIONS = Object.fromEntries(
  Object.entries(PARENT_QUESTIONS).map(([id, key]) => [
    normalizeKey(key),
    id,
  ])
);

function getResponseValue(response, candidates) {
  if (!response || typeof response !== "object") {
    return "";
  }

  for (const candidate of candidates) {
    if (
      Object.prototype.hasOwnProperty.call(
        response,
        candidate
      )
    ) {
      return response[candidate];
    }
  }

  const normalizedEntries = Object.entries(response).map(
    ([key, value]) => [
      normalizeKey(key),
      value,
    ]
  );

  for (const candidate of candidates) {
    const normalizedCandidate =
      normalizeKey(candidate);

    const match = normalizedEntries.find(
      ([key]) =>
        key === normalizedCandidate
    );

    if (match) {
      return match[1];
    }
  }

  return "";
}

function getQuestionValue(response, questionId) {
  const canonicalKey =
    PARENT_QUESTIONS[questionId];

  if (!canonicalKey) {
    return "";
  }

  const direct = getResponseValue(
    response,
    [canonicalKey]
  );

  if (direct !== "") {
    return direct;
  }

  const normalizedTarget =
    normalizeKey(canonicalKey);

  const normalizedMatch = Object.entries(
    response || {}
  ).find(
    ([key]) =>
      normalizeKey(key) ===
      normalizedTarget
  );

  if (normalizedMatch) {
    return normalizedMatch[1];
  }

  // Support forms/sheets that omitted
  // the space after the question number.
  const strippedTarget =
    normalizedTarget.replace(
      /^(\d+)\./,
      "$1."
    );

  const fuzzyMatch = Object.entries(
    response || {}
  ).find(([key]) => {
    const normalized =
      normalizeKey(key);

    return normalized ===
      strippedTarget;
  });

  return fuzzyMatch
    ? fuzzyMatch[1]
    : "";
}

function toScore(value) {
  const score = Number(
    String(value ?? "").trim()
  );

  if (!Number.isFinite(score)) {
    return null;
  }

  if (score < 1 || score > 5) {
    return null;
  }

  return score;
}

function calculateAverage(values) {
  const valid = values.filter(
    (value) =>
      typeof value === "number" &&
      Number.isFinite(value)
  );

  if (!valid.length) {
    return null;
  }

  return (
    valid.reduce(
      (sum, value) =>
        sum + value,
      0
    ) / valid.length
  );
}

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

function getOverallRating(score) {
  if (score === null) {
    return "Not Available";
  }

  if (score >= 90) {
    return "Flourishing School";
  }

  if (score >= 80) {
    return "Healthy School";
  }

  if (score >= 70) {
    return "Developing School";
  }

  if (score >= 60) {
    return "At Risk";
  }

  return "Critical";
}

function calculateQuestionScores(response) {
  const scores = {};

  Object.keys(PARENT_QUESTIONS).forEach(
    (questionId) => {
      scores[questionId] =
        toScore(
          getQuestionValue(
            response,
            questionId
          )
        );
    }
  );

  return scores;
}

function calculateDimensions(
  questionScores
) {
  return PARENT_DIMENSIONS.map(
    (dimension) => {
      const scores =
        dimension.questions
          .map(
            (questionId) =>
              questionScores[
                questionId
              ]
          )
          .filter(
            (score) =>
              typeof score ===
                "number" &&
              Number.isFinite(
                score
              )
          );

      const average =
        calculateAverage(scores);

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
          getPerformance(
            average
          ),
        answeredQuestions:
          scores.length,
        totalQuestions:
          dimension.questions.length,
      };
    }
  );
}

function getStrengths(
  dimensions
) {
  return dimensions
    .filter(
      (dimension) =>
        dimension.average !==
          null &&
        dimension.average >=
          4.0
    )
    .sort(
      (a, b) =>
        b.average -
        a.average
    );
}

function getFocusAreas(
  dimensions
) {
  return dimensions
    .filter(
      (dimension) =>
        dimension.average !==
          null &&
        dimension.average <
          3.8
    )
    .sort(
      (a, b) =>
        a.average -
        b.average
    );
}

function getRespondent(
  response
) {
  return {
    name:
      getResponseValue(
        response,
        [
          "Parent/ Guardian Full Name:",
          "Parent/ Guardian Full Name: ",
          "Parent/Guardian Full Name",
          "Parent Full Name",
        ]
      ) || "Parent",

    email:
      getResponseValue(
        response,
        [
          "Email address",
          "Email Address",
          "Email",
          "email",
        ]
      ),

    school:
      getResponseValue(
        response,
        [
          "School Name",
          "School Name:",
          "_submitted_school_name",
        ]
      ) || "",

    grade:
      getResponseValue(
        response,
        [
          "Chaild's Grade/ Class",
          "Child's Grade/ Class",
          "Child's Grade",
          "Grade",
        ]
      ),

    currentRole:
      getResponseValue(
        response,
        [
          "Your Current Role/Position",
        ]
      ),

    yearsInEducation:
      getResponseValue(
        response,
        [
          "Years of Experience in Education",
        ]
      ),

    childName:
      getResponseValue(
        response,
        [
          "Child's Full Name",
        ]
      ),

    childSection:
      getResponseValue(
        response,
        [
          "Child's Section /Division",
        ]
      ),

    childrenEnrolled:
      getResponseValue(
        response,
        [
          "Number of Children enrolled in this School",
        ]
      ),

    yearsAtSchool:
      getResponseValue(
        response,
        [
          "How long has your child been studying at this school?",
        ]
      ),
  };
}

function getSubmission(
  response
) {
  return {
    timestamp:
      getResponseValue(
        response,
        ["Timestamp"]
      ),

    date:
      getResponseValue(
        response,
        ["Date of Submission"]
      ),
  };
}

function getQualitative(
  response
) {
  return {
    exceptionallyWell:
      getResponseValue(
        response,
        [
          "28. What is the ONE thing this school does exceptionally well that helps your child flourish?",
          "28. What is the ONE thing this school does exceptionally well that helps your child flourish?\n",
        ]
      ),

    factorsJobSatisfaction:
      getResponseValue(
        response,
        [
          "Which factors contribute most positively to your job satisfaction? (Select all that apply)",
        ]
      ),

    desiredChange:
      getResponseValue(
        response,
        [
          "29. If you could change ONE thing about this school to help your child flourish even more, what would it be?",
        ]
      ),

    flourishBecause:
      getResponseValue(
        response,
        [
          "30. Complete the sentence: “My child flourishes at this school because…”",
          "30. Complete the sentence: “My child flourishes at this school because…”\n",
        ]
      ),
  };
}

function getIndicators(
  questionScores
) {
  return Object.entries(
    questionScores
  )
    .filter(
      ([, score]) =>
        typeof score ===
        "number"
    )
    .map(
      ([questionId, score]) => ({
        questionId,
        name:
          PARENT_QUESTIONS[
            questionId
          ],
        score,
      })
    );
}

function generateObservations({
  dimensions,
  overallScore,
  strengths,
  focusAreas,
  qualitative,
}) {
  const observations = [];

  if (strengths.length) {
    const top =
      strengths
        .slice(0, 2)
        .map(
          (item) =>
            `${item.name} (${item.average.toFixed(
              2
            )}/5)`
        )
        .join(" and ");

    observations.push(
      `Strength areas: ${top}.`
    );
  } else {
    observations.push(
      "No dimension currently meets the strength threshold of 4.0."
    );
  }

  if (focusAreas.length) {
    const areas =
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
      `Areas below the focus threshold: ${areas}.`
    );
  } else {
    observations.push(
      "No dimension falls below the focus threshold of 3.8."
    );
  }

  if (
    typeof overallScore ===
    "number"
  ) {
    observations.push(
      `Overall weighted Parent Voice index: ${overallScore.toFixed(
        2
      )}/100.`
    );
  } else {
    observations.push(
      "Overall weighted Parent Voice index is unavailable."
    );
  }

  const hasQualitative =
    Object.values(
      qualitative
    ).some(
      (value) =>
        String(
          value || ""
        ).trim()
    );

  observations.push(
    hasQualitative
      ? "Qualitative parent responses are available for contextual insight."
      : "No qualitative parent responses were provided."
  );

  return observations;
}

export function calculateParentReport(
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

  const allQuestionsAnswered =
    dimensions.every(
      (dimension) =>
        dimension.answeredQuestions ===
        dimension.totalQuestions
    );

  const weightedScores =
    dimensions
      .map(
        (dimension) =>
          dimension.weightedScore
      )
      .filter(
        (score) =>
          typeof score ===
            "number" &&
          Number.isFinite(
            score
          )
      );

  const overallScore =
    allQuestionsAnswered &&
    weightedScores.length ===
      PARENT_DIMENSIONS.length
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

  const strengths =
    getStrengths(
      dimensions
    );

  const focusAreas =
    getFocusAreas(
      dimensions
    );

  const respondent =
    getRespondent(
      response
    );

  const submission =
    getSubmission(
      response
    );

  const rawQualitativeResponses =
    getQualitative(
      response
    );

  const indicators =
    getIndicators(
      questionScores
    );

  const rating =
    getOverallRating(
      overallScore
    );

  return {
    role: "parent",

    respondent,

    submission,

    respondents: 1,

    questionScores,

    dimensions,

    parameters: dimensions,

    overallScore,

    sfi: overallScore,

    rating,

    strengths,

    focusAreas,

    indicators,

    top5Strengths:
      strengths.slice(0, 5),

    top5ImprovementAreas:
      focusAreas.slice(0, 5),

    observations:
      generateObservations({
        dimensions,
        overallScore,
        strengths,
        focusAreas,
        qualitative:
          rawQualitativeResponses,
      }),

    rawQualitativeResponses,
  };
}

export {
  PARENT_QUESTIONS,
  PARENT_DIMENSIONS,
  normalizeKey,
  toScore,
  getPerformance,
  getOverallRating,
  calculateQuestionScores,
  calculateDimensions,
};