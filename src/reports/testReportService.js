import { generateReportByEmail } from "./reportService";

export async function testReportService() {
  try {
    const report =
      await generateReportByEmail(
        "vinaypradhan563@gmail.com"
      );

    console.log(
      "================================="
    );

    console.log(
      "REPORT SERVICE SUCCESS"
    );

    console.log(
      "================================="
    );

    console.log(
      "Role:",
      report.meta.role
    );

    console.log(
      "Response ID:",
      report.meta.responseId
    );

    console.log(
      "School ID:",
      report.meta.schoolId
    );

    console.log(
      "Teacher:",
      report.respondent?.name
    );

    console.log(
      "THFI:",
      report.thfi
    );

    console.log(
      "Rating:",
      report.rating
    );

    console.log(
      "Parameters:",
      report.parameters
    );

    return report;

  } catch (error) {

    console.error(
      "REPORT SERVICE FAILED:",
      error
    );

    throw error;
  }
}