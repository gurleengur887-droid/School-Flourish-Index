import { calculateTeacherReport } from "./teacherCalculator";
import { calculateStudentReport } from "./studentCalculator";
import { calculateParentReport } from "./parentCalculator";
import { calculateLeaderReport } from "./leaderCalculator";

const ROLE_CALCULATORS = {
  teacher: calculateTeacherReport,
  parent: calculateParentReport,
  student: calculateStudentReport,
  leader: calculateLeaderReport,
};

const ROLE_LABELS = {
  teacher: "Teacher",
  parent: "Parent",
  student: "Student",
  leader: "Leadership",
};

function normalizeRole(role) {
  const value = String(role || "").trim().toLowerCase();

  const aliases = {
    "teacher voice": "teacher",
    teacher_voice: "teacher",
    "parent voice": "parent",
    parent_voice: "parent",
    "student voice": "student",
    student_voice: "student",
    leadership: "leader",
    "leader voice": "leader",
    leader_voice: "leader",
  };

  return aliases[value] || value;
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

function getAverage(parameter) {
  const value = parameter?.average;

  return typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 1 &&
    value <= 5
    ? value
    : null;
}
function getPerformanceFromScore(score) {
  if (
    typeof score !== "number" ||
    !Number.isFinite(score)
  ) {
    return "—";
  }

  if (score >= 4.5) return "Outstanding";
  if (score >= 4.0) return "Excellent";
  if (score >= 3.8) return "Very Good";
  if (score >= 3.0) return "Good";
  if (score >= 2.0) return "Needs Attention";

  return "Critical";
}
function calculateRoleResponse(response, role) {
  const calculator = ROLE_CALCULATORS[role];

  if (!calculator) {
    return null;
  }

  try {
    return calculator(response?.response_data || {});
  } catch (error) {
    console.error(
      `Unable to calculate ${role} response for aggregate:`,
      error
    );
    return null;
  }
}

function getTemplateParameters(role) {
  const calculator = ROLE_CALCULATORS[role];

  if (!calculator) {
    return [];
  }

  try {
    return getParameters(calculator({}));
  } catch {
    return [];
  }
}

export function calculatePerspectiveAggregate(
  responses = [],
  perspective = ""
) {
  const role = normalizeRole(perspective);
  const calculator = ROLE_CALCULATORS[role];

  if (!calculator) {
    return {
      role,
      label: ROLE_LABELS[role] || "Perspective",
      respondentCount: 0,
      parameters: [],
      overallScore: null,
      totalParameterCount: 0,
      availableParameterCount: 0,
    };
  }

  const roleResponses = responses.filter(
    (response) =>
      normalizeRole(response?.role) === role
  );

  const respondentReports = roleResponses
    .map((response) =>
      calculateRoleResponse(response, role)
    )
    .filter(Boolean)
    .map((report) => ({
      report,
      parameters: getParameters(report),
    }))
    .filter((item) => item.parameters.length);

  const template =
    respondentReports.length > 0
      ? respondentReports[0].parameters
      : getTemplateParameters(role);

  const parameterMap = new Map();

  template.forEach((parameter) => {
    if (!parameter?.key) return;

    parameterMap.set(parameter.key, {
      key: parameter.key,
      name: parameter.name || parameter.key,
      weight:
        typeof parameter.weight === "number"
          ? parameter.weight
          : null,
      weightPercentage:
        typeof parameter.weightPercentage === "number"
          ? parameter.weightPercentage
          : typeof parameter.weight === "number"
            ? Number((parameter.weight * 100).toFixed(2))
            : null,
      values: [],
      performances: [],
    });
  });

  respondentReports.forEach(({ parameters }) => {
    parameters.forEach((parameter) => {
      if (!parameter?.key) return;

      if (!parameterMap.has(parameter.key)) {
        parameterMap.set(parameter.key, {
          key: parameter.key,
          name: parameter.name || parameter.key,
          weight:
            typeof parameter.weight === "number"
              ? parameter.weight
              : null,
          weightPercentage:
            typeof parameter.weightPercentage === "number"
              ? parameter.weightPercentage
              : typeof parameter.weight === "number"
                ? Number((parameter.weight * 100).toFixed(2))
                : null,
          values: [],
          performances: [],
        });
      }

      const entry = parameterMap.get(parameter.key);
      const average = getAverage(parameter);

      if (average !== null) {
        entry.values.push(average);
      }

      if (
        parameter.performance &&
        parameter.performance !== "—"
      ) {
        entry.performances.push(parameter.performance);
      }
    });
  });

  const parameters = Array.from(
    parameterMap.values()
  ).map((parameter) => {
    const average = parameter.values.length
      ? parameter.values.reduce(
          (sum, value) => sum + value,
          0
        ) / parameter.values.length
      : null;

    const percentage =
      average === null
        ? null
        : Number(((average / 5) * 100).toFixed(0));

    const weightedScore =
      average !== null &&
      typeof parameter.weight === "number" &&
      Number.isFinite(parameter.weight)
        ? Number(
            (
              (average / 5) *
              100 *
              parameter.weight
            ).toFixed(2)
          )
        : null;

    return {
      key: parameter.key,
      name: parameter.name,
      average:
        average === null
          ? null
          : Number(average.toFixed(2)),
      percentage,
      weight: parameter.weight,
      weightPercentage: parameter.weightPercentage,
      weightedScore,
     performance:
  average === null
    ? "—"
    : getPerformanceFromScore(average),
      respondentCount: parameter.values.length,
    };
  });

  const weightedParameters = parameters.filter(
    (parameter) =>
      typeof parameter.weight === "number" &&
      Number.isFinite(parameter.weight)
  );

  const overallScore =
    weightedParameters.length > 0 &&
    weightedParameters.every(
      (parameter) =>
        typeof parameter.average === "number"
    )
      ? Number(
          weightedParameters
            .reduce(
              (sum, parameter) =>
                sum + parameter.weightedScore,
              0
            )
            .toFixed(2)
        )
      : null;

  return {
    role,
    label: ROLE_LABELS[role] || "Perspective",
    respondentCount: respondentReports.length,
    parameters,
    overallScore,
    totalParameterCount: parameters.length,
    availableParameterCount: parameters.filter(
      (parameter) =>
        typeof parameter.average === "number"
    ).length,
  };
}

export default calculatePerspectiveAggregate;