import { calculateTeacherReport } from "./teacherCalculator";
import { calculateStudentReport } from "./studentCalculator";
import { calculateParentReport } from "./parentCalculator";
import { calculateLeaderReport } from "./leaderCalculator";

/*
 * =========================================================
 * SCHOOL RESULTS CALCULATOR
 * =========================================================
 *
 * The Admin Results page needs a school-level profile made
 * from the role-specific responses belonging to that school.
 *
 * The seven school-facing dimensions are:
 *
 * 1. Teacher–Child Relationship
 * 2. Child–School Fit
 * 3. Leadership Trust
 * 4. Child Happiness & Safety
 * 5. Learning & Growth
 * 6. School Culture
 * 7. Parent–School Partnership
 *
 * SCHOOL-LEVEL AVERAGE RULE
 * --------------------------
 * Each valid respondent contributes one equal observation to a
 * dimension when that respondent has one or more mapped
 * parameters for that dimension.
 *
 * When more than one parameter from the same respondent maps to
 * the same school dimension, those parameter averages are first
 * averaged for that respondent. The respondent is then counted
 * once in the school-level average.
 *
 * This means the calculation is NOT:
 *   - a role-weighted average;
 *   - a parameter-weighted average;
 *   - a raw-question average across mixed forms.
 *
 * It is:
 *   respondent parameter scores → respondent dimension score
 *   → school average of contributing respondents.
 *
 * Every mapping below uses the existing parameters from the
 * Teacher, Student, Parent and Leader calculators. A role is only
 * included where one of its existing parameters meaningfully
 * measures or directly informs the school-facing dimension.
 *
 * No minimum-response threshold is imposed here, and no official
 * overall cross-role SFI score is created.
 * =========================================================
 */

export const SCHOOL_DIMENSIONS = [
  {
    key: "teacher_child_relationship",
    name: "Teacher–Child Relationship",
    sources: [
      {
        role: "teacher",
        parameterKey: "student_engagement",
      },
      {
        role: "teacher",
        parameterKey: "school_culture",
      },
      {
        role: "student",
        parameterKey: "teacher_support_classroom_climate",
      },
      {
        role: "parent",
        parameterKey: "teacher_child_relationship",
      },
    ],
  },

  {
    key: "child_school_fit",
    name: "Child–School Fit",
    sources: [
      {
        role: "teacher",
        parameterKey: "student_engagement",
      },
      {
        role: "teacher",
        parameterKey: "school_culture",
      },
      {
        role: "student",
        parameterKey: "happiness_school_experience",
      },
      {
        role: "student",
        parameterKey: "belonging_inclusion",
      },
      {
        role: "parent",
        parameterKey: "child_school_fit",
      },
    ],
  },

  {
    key: "leadership_trust",
    name: "Leadership Trust",
    sources: [
      {
        role: "teacher",
        parameterKey: "leadership_trust",
      },
      {
        role: "parent",
        parameterKey: "leadership_trust",
      },
      {
        role: "leader",
        parameterKey: "leadership_support_governance_connection",
      },
      {
        role: "leader",
        parameterKey: "decision_making_leadership_pressure",
      },
    ],
  },

  {
    key: "child_happiness_safety",
    name: "Child Happiness & Safety",
    sources: [
      {
        role: "student",
        parameterKey: "happiness_school_experience",
      },
      {
        role: "student",
        parameterKey: "emotional_wellbeing_resilience",
      },
      {
        role: "student",
        parameterKey: "psychological_safety",
      },
      {
        role: "parent",
        parameterKey: "happiness_emotional_safety",
      },
    ],
  },

  {
    key: "learning_growth",
    name: "Learning & Growth",
    sources: [
      {
        role: "teacher",
        parameterKey: "student_engagement",
      },
      {
        role: "teacher",
        parameterKey: "instructional_practices",
      },
      {
        role: "teacher",
        parameterKey: "classroom_management",
      },
      {
        role: "student",
        parameterKey: "learning_engagement_confidence",
      },
      {
        role: "student",
        parameterKey: "student_voice_purpose_future",
      },
      {
        role: "parent",
        parameterKey: "learning_growth",
      },
      {
        role: "parent",
        parameterKey: "holistic_future_readiness",
      },
      {
        role: "leader",
        parameterKey: "leadership_effectiveness_capacity",
      },
      {
        role: "leader",
        parameterKey: "purpose_growth_sustainable_leadership",
      },
    ],
  },

  {
    key: "school_culture",
    name: "School Culture",
    sources: [
      {
        role: "teacher",
        parameterKey: "school_culture",
      },
      {
        role: "teacher",
        parameterKey: "leadership_trust",
      },
      {
        role: "teacher",
        parameterKey: "resources_support",
      },
      {
        role: "student",
        parameterKey: "belonging_inclusion",
      },
      {
        role: "student",
        parameterKey: "peer_relationships_respect",
      },
      {
        role: "student",
        parameterKey: "teacher_support_classroom_climate",
      },
      {
        role: "parent",
        parameterKey: "school_culture_psychological_safety",
      },
      {
        role: "leader",
        parameterKey: "leadership_staff_relationships_culture",
      },
      {
        role: "leader",
        parameterKey: "organisational_operational_conditions",
      },
      {
        role: "leader",
        parameterKey: "leadership_support_governance_connection",
      },
    ],
  },

  {
    key: "parent_school_partnership",
    name: "Parent–School Partnership",
    sources: [
      {
        role: "parent",
        parameterKey: "parent_school_partnership",
      },
      {
        role: "teacher",
        parameterKey: "resources_support",
      },
      {
        role: "leader",
        parameterKey: "leadership_support_governance_connection",
      },
    ],
  },
];

/*
 * =========================================================
 * ROLE CALCULATORS
 * =========================================================
 */

const ROLE_CALCULATORS = {
  teacher: calculateTeacherReport,
  student: calculateStudentReport,
  parent: calculateParentReport,
  leader: calculateLeaderReport,
};

/*
 * =========================================================
 * PERFORMANCE BANDS
 * =========================================================
 *
 * These use the same 1–5 language already used by the existing
 * role reports. They are display labels for the school dimension
 * cards; they do not create a new overall SFI formula.
 */

export function getPerformanceFromScore(score) {
  if (
    typeof score !== "number" ||
    !Number.isFinite(score)
  ) {
    return "";
  }

  if (score >= 4.5) return "Outstanding";
  if (score >= 4.0) return "Excellent";
  if (score >= 3.8) return "Very Good";
  if (score >= 3.0) return "Good";
  if (score >= 2.0) return "Needs Attention";

  return "Critical";
}

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

function normalizeRole(role) {
  return String(role || "")
    .trim()
    .toLowerCase();
}

function getParameters(report) {
  if (Array.isArray(report?.parameters)) {
    return report.parameters;
  }

  if (Array.isArray(report?.dimensions)) {
    return report.dimensions;
  }

  return [];
}

function getParameter(report, parameterKey) {
  return getParameters(report).find(
    (parameter) => parameter?.key === parameterKey
  );
}

function getAverage(parameter) {
  if (
    typeof parameter?.average !== "number" ||
    !Number.isFinite(parameter.average)
  ) {
    return null;
  }

  if (
    parameter.average < 1 ||
    parameter.average > 5
  ) {
    return null;
  }

  return parameter.average;
}

function calculateRoleReport(response) {
  const role = normalizeRole(response?.role);
  const calculator = ROLE_CALCULATORS[role];

  if (!calculator) {
    return null;
  }

  try {
    return calculator(response?.response_data || {});
  } catch (error) {
    console.error(
      `Unable to calculate ${role} response:`,
      error
    );

    return null;
  }
}

/*
 * =========================================================
 * CALCULATE SCHOOL DIMENSIONS
 * =========================================================
 */

export function calculateSchoolDimensions(responses = []) {
  const calculatedResponses = responses
    .map((response) => ({
      response,
      role: normalizeRole(response?.role),
      report: calculateRoleReport(response),
    }))
    .filter(
      (item) =>
        item.report &&
        ROLE_CALCULATORS[item.role]
    );

  return SCHOOL_DIMENSIONS.map((schoolDimension) => {
    const respondentContributions = [];

    calculatedResponses.forEach((item) => {
      const matchingSources = schoolDimension.sources.filter(
        (source) => source.role === item.role
      );

      if (!matchingSources.length) {
        return;
      }

      /*
       * More than one parameter may describe the same school
       * dimension for one respondent. Average those parameter
       * scores first so the respondent still has exactly ONE
       * contribution to the school average.
       */
      const mappedScores = matchingSources
        .map((source) =>
          getAverage(
            getParameter(
              item.report,
              source.parameterKey
            )
          )
        )
        .filter(
          (value) =>
            typeof value === "number"
        );

      if (!mappedScores.length) {
        return;
      }

      const respondentAverage =
        mappedScores.reduce(
          (sum, value) => sum + value,
          0
        ) / mappedScores.length;

      respondentContributions.push({
        responseId: item.response?.id || null,
        role: item.role,
        average: respondentAverage,
        sourceParameterCount: mappedScores.length,
      });
    });

    if (!respondentContributions.length) {
      return {
        ...schoolDimension,
        average: null,
        percentage: null,
        performance: "",
        responseCount: 0,
        contributingPerspectives: [],
        contributingResponses: [],
      };
    }

    /*
     * THIS is the school-level average:
     * every contributing respondent has equal weight.
     */
    const schoolAverage =
      respondentContributions.reduce(
        (sum, contribution) =>
          sum + contribution.average,
        0
      ) / respondentContributions.length;

    return {
      ...schoolDimension,
      average: Number(
        schoolAverage.toFixed(2)
      ),
      percentage: Number(
        ((schoolAverage / 5) * 100).toFixed(0)
      ),
      performance: getPerformanceFromScore(
        schoolAverage
      ),
      responseCount:
        respondentContributions.length,
      contributingPerspectives: [
        ...new Set(
          respondentContributions.map(
            (item) => item.role
          )
        ),
      ],
      contributingResponses:
        respondentContributions,
    };
  });
}

export function calculateSchoolResult(responses = []) {
  const dimensions =
    calculateSchoolDimensions(responses);

  const availableDimensions =
    dimensions.filter(
      (dimension) =>
        typeof dimension.average === "number"
    );

  return {
    dimensions,
    availableDimensionCount:
      availableDimensions.length,
    totalDimensionCount:
      dimensions.length,
    hasData:
      availableDimensions.length > 0,

    /*
     * Intentionally null. The seven dimension averages are now
     * available, but we have not invented a separate overall
     * cross-role SFI weighting formula.
     */
    overallScore: null,
    overallPerformance: "",
  };
}