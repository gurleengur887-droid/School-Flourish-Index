import React from "react";
import { createRoot } from "react-dom/client";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

import TeacherReport from "./TeacherReport";


export async function generateTeacherReportPDF(report) {
  if (!report) {
    throw new Error("Teacher report data is required.");
  }

  const container = document.createElement("div");

  container.style.position = "fixed";
  container.style.left = "-100000px";
  container.style.top = "0";

  container.style.width = "1055px";
  container.style.minHeight = "1491px";

  container.style.background = "#ffffff";

  document.body.appendChild(container);

  const root = createRoot(container);

  root.render(
    <TeacherReport
      report={report}
    />
  );

  /*
   * Give React enough time to render
   * the complete report.
   */
  await new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(resolve, 300);
      });
    });
  });

  const canvas = await html2canvas(container, {
    width: 1055,
    height: 1491,

    scale: 2,

    useCORS: true,

    backgroundColor: "#ffffff",

    logging: false,

    scrollX: 0,
    scrollY: 0,
  });


  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });


  const image = canvas.toDataURL(
    "image/png",
    1.0
  );


  pdf.addImage(
    image,
    "PNG",
    0,
    0,
    210,
    297
  );


  root.unmount();

  document.body.removeChild(container);


  return pdf;
}


export async function downloadTeacherReport(report) {

  const pdf =
    await generateTeacherReportPDF(report);


  const name =
    String(
      report?.respondent?.name ||
      "Teacher"
    )
      .trim()
      .replace(
        /[^a-z0-9]+/gi,
        "-"
      )
      .replace(
        /^-+|-+$/g,
        ""
      );


  const generatedDate =
    new Date()
      .toISOString()
      .slice(0, 10);


  pdf.save(
    `${name || "Teacher"}-Teacher-Flourishing-Report-${generatedDate}.pdf`
  );
}