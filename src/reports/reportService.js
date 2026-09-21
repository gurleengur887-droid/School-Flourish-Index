import { supabase } from "../lib/supabase";
import { calculateTeacherReport } from "./teacherCalculator";
import { calculateStudentReport } from "./studentCalculator";
import { calculateParentReport } from "./parentCalculator";
import { calculateLeaderReport } from "./leaderCalculator";
/*
 * =========================================================
 * REPORT CALCULATORS
 * =========================================================
 *
 * Each role uses its own approved calculator.
 *
 * Parent / Leader will be added when their approved
 * report calculators are implemented.
 */

const reportCalculators = {
  teacher: calculateTeacherReport,
  student: calculateStudentReport,
  parent: calculateParentReport,
 leader: calculateLeaderReport,
  
};

  




/*
 * =========================================================
 * NORMALIZE EMAIL
 * =========================================================
 */

function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}


/*
 * =========================================================
 * NORMALIZE ROLE
 * =========================================================
 */

function normalizeRole(role) {
  const value = String(role || "")
    .trim()
    .toLowerCase();

  const roleAliases = {
    teacher: "teacher",
    "teacher voice": "teacher",

    parent: "parent",
    "parent voice": "parent",

    student: "student",
    "student voice": "student",

    leader: "leader",
    leadership: "leader",
    "leader voice": "leader",
  };

  return roleAliases[value] || "";
}


/*
 * =========================================================
 * FIND RESPONSES BY EMAIL
 * =========================================================
 *
 * Google Form response_data can contain slightly different
 * email-key formatting, so we check the common variants.
 */

async function findResponsesByEmail(email) {
  const emailKeys = [
    "Email address",
    "Email Address",
    "email address",
    "Email",
    "email",
  ];

  const results = await Promise.all(
    emailKeys.map(async (key) => {
      const { data, error } = await supabase
        .from("survey_responses")
        .select(`
          id,
          school_id,
          role,
          submitted_at,
          response_data,
          created_at
        `)
        .ilike(
          `response_data->>${key}`,
          email
        )
        .order("submitted_at", {
          ascending: false,
        });

      return {
        key,
        data: data || [],
        error,
      };
    })
  );


  /*
   * Check whether any database query failed.
   */

  const failed = results.find(
    (result) => result.error
  );

  if (failed) {
    console.error(
      "Error searching survey responses:",
      failed.error
    );

    throw new Error(
      failed.error.message ||
        "Unable to search survey responses."
    );
  }


  /*
   * Combine all matches.
   */

  const combined = results.flatMap(
    (result) => result.data
  );


  /*
   * Remove duplicate response IDs.
   */

  const uniqueResponses = Array.from(
    new Map(
      combined.map((response) => [
        response.id,
        response,
      ])
    ).values()
  );


  /*
   * Sort newest response first.
   */

  uniqueResponses.sort((a, b) => {
    const dateA = new Date(
      a.submitted_at ||
        a.created_at ||
        0
    ).getTime();

    const dateB = new Date(
      b.submitted_at ||
        b.created_at ||
        0
    ).getTime();

    return dateB - dateA;
  });


  return uniqueResponses;
}


/*
 * =========================================================
 * GENERATE REPORT BY EMAIL
 * =========================================================
 */

export async function generateReportByEmail(email, requestedRole) {
  const normalizedEmail =
    normalizeEmail(email);

  const normalizedRole =
    normalizeRole(requestedRole);

  /*
   * =========================================================
   * VALIDATE EMAIL
   * =========================================================
   */

  if (!normalizedEmail) {
    throw new Error(
      "Please enter an email address."
    );
  }


  /*
   * =========================================================
   * VALIDATE ROLE / PERSPECTIVE
   * =========================================================
   */

  if (!normalizedRole) {
    throw new Error(
      "Please select a perspective."
    );
  }

  if (!reportCalculators[normalizedRole]) {
    throw new Error(
      "Please select a valid perspective."
    );
  }


  /*
   * =========================================================
   * FIND RESPONSES BY EMAIL
   * =========================================================
   */

  const responses =
    await findResponsesByEmail(
      normalizedEmail
    );


  /*
   * =========================================================
   * NO EMAIL MATCH
   * =========================================================
   */

  if (!responses.length) {
    throw new Error(
      "No survey response was found for this email address."
    );
  }


  /*
   * =========================================================
   * FILTER BY SELECTED PERSPECTIVE
   * =========================================================
   *
   * This is the important part.
   *
   * The same email can have:
   * Teacher + Parent + Student + Leader responses.
   *
   * We only use the response matching the perspective
   * selected by the admin.
   */

 /*
 * =========================================================
 * FILTER RESPONSES BY SELECTED PERSPECTIVE
 * =========================================================
 *
 * The selected perspective is the source of truth.
 * The same email may have multiple role responses.
 */

const roleResponses = responses.filter(
  (response) =>
    normalizeRole(response.role) === normalizedRole
);


/*
 * =========================================================
 * NO RESPONSE FOR SELECTED PERSPECTIVE
 * =========================================================
 */

if (!roleResponses.length) {
  throw new Error(
    `No ${normalizedRole} survey response was found for this email address.`
  );
}


/*
 * =========================================================
 * SELECT MOST RECENT RESPONSE
 * =========================================================
 */

const response = roleResponses[0];


/*
 * =========================================================
 * SELECT CALCULATOR FROM ADMIN'S SELECTION
 * =========================================================
 *
 * IMPORTANT:
 * Never take the calculator from response.role.
 * The perspective selected by the admin decides the
 * calculator that must be used.
 */

const calculator = reportCalculators[normalizedRole];

if (!calculator) {
  throw new Error(
    `The ${normalizedRole} report calculator is not available.`
  );
}


/*
 * =========================================================
 * CALCULATE REPORT
 * =========================================================
 */

const report = calculator(
  response.response_data || {}
);


/*
 * =========================================================
 * FORCE CANONICAL ROLE
 * =========================================================
 */

report.role = normalizedRole;


  /*
   * =========================================================
   * RETURN REPORT
   * =========================================================
   */

  return {
  report,

  role: normalizedRole,

  matchedResponses: roleResponses.length,

  meta: {
    responseId: response.id,
    schoolId: response.school_id,

    role: normalizedRole,

    requestedRole: normalizedRole,

    submittedAt: response.submitted_at,
    createdAt: response.created_at,

    matchedEmail: normalizedEmail,

    matchedResponses: roleResponses.length,
  },
};
}


/*
 * =========================================================
 * EXPORT ROLE CALCULATORS
 * =========================================================
 */

export {
  reportCalculators,
  normalizeEmail,
  normalizeRole,
};