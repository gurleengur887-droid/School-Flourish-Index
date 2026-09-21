import {
  calculateParentReport,
} from "./parentCalculator";

describe("Parent Calculator", () => {
  test("calculates Parent Voice report correctly", () => {
    const sampleResponse = {
      "Parent/ Guardian Full Name: ": "Harsh",
      "Email address": "prachivats06@gmail.com",
      "School Name": "Pending School Verification",
      "Child's Full Name": "Prachi",
      "Chaild's Grade/ Class": "12",
      "Child's Section /Division": "A",
      "Number of Children enrolled in this School": "1",
      "How long has your child been studying at this school?":
        "More than 6 years",

      // Q1–Q3 → Child–School Fit
      "1. My child's school environment is well suited to their personality, strengths and learning needs.": "1",
      "2. The school recognizes and encourages my child's individual strengths and interests.": "1",
      "3. My child feels a sense of belonging and acceptance at school.": "1",

      // Q4–Q6 → Happiness & Emotional Safety
      "4.My child generally enjoys going to school.": "1",
      "5. My child feels emotionally safe and comfortable being themselves at school.": "1",
      "6. My child has at least one trusted adult at school whom they can approach for help.": "1",

      // Q7–Q9 → Learning & Growth
      "7. My child is encouraged to understand, question and think rather than simply memorize.": "1",
      "8. My child receives feedback that helps them improve and grow.": "1",
      "9.I can see meaningful academic, personal and intellectual growth in my child.": "1",

      // Q10–Q12 → Life Skills & Resilience
      "10. The school is helping my child develop confidence and resilience.": "1",
      "11.  My child is learning to handle mistakes, failure and setbacks constructively.": "1",
      "12. My child is developing empathy, responsibility, communication and collaboration skills.": "1",

      // Q13–Q15 → Teacher–Child Relationship
      "13. My child's teachers understand and support my child beyond their academic performance.": "1",
      "14. Teachers recognize my child's strengths and encourage them when they face difficulties.": "1",
      "15. My child feels comfortable approaching teachers when they need help.": "1",

      // Q16–Q18 → School Culture & Psychological Safety
      "16. Students are treated fairly and with dignity and respect in this school.": "1",
      "17. Bullying, exclusion and inappropriate behavior are taken seriously by the school.": "1",
      "18. My child can express concerns and make mistakes without fear of humiliation or unfair treatment.": "5",

      // Q19–Q21 → Parent–School Partnership
      "19. The school communicates important information clearly and in a timely manner.": "1",
      "20. Teachers listen respectfully to my concerns and perspectives about my child.": "1",
      "21. The school and our family work together effectively when my child faces difficulties.": "1",

      // Q22–Q24 → Leadership & Trust
      "22. I trust the school leadership to make decisions in the best interests of children.": "2",
      "23. The school is transparent about its policies, expectations and important decisions.": "1",
      "24. I feel confident that my child's well-being is a genuine priority for the school.": "3",

      // Q25–Q27 → Holistic & Future Readiness
      "25. My child has meaningful opportunities to participate in sports, arts, creativity, leadership or other activities beyond academics.": "2",
      "26.  The school is helping my child develop the skills needed for life beyond examinations.": "2",
      "27. The school is preparing my child to use technology and AI safely, responsibly and meaningfully.": "2",

      // Qualitative responses
      "28. What is the ONE thing this school does exceptionally well that helps your child flourish?\n":
        "",

      "29. If you could change ONE thing about this school to help your child flourish even more, what would it be?":
        "",

      "30. Complete the sentence: “My child flourishes at this school because…”\n":
        "",

      "Which factors contribute most positively to your job satisfaction? (Select all that apply)":
        "",
    };

    const report =
      calculateParentReport(
        sampleResponse
      );

    console.log(
      "\n===== PARENT REPORT RESULT ====="
    );

    console.log(report);

    console.log(
      "\n===== PARENT DIMENSIONS ====="
    );

    report.dimensions.forEach(
      (dimension) => {
        console.log(
          `${dimension.name}:`,
          dimension.average,
          "Weight:",
          dimension.weightPercentage + "%",
          "Weighted:",
          dimension.weightedScore,
          "Performance:",
          dimension.performance
        );
      }
    );

    console.log(
      "\nOverall Score:",
      report.overallScore
    );

    console.log(
      "Overall Rating:",
      report.rating
    );

    console.log(
      "Strengths:",
      report.strengths.map(
        (item) => item.name
      )
    );

    console.log(
      "Focus Areas:",
      report.focusAreas.map(
        (item) => item.name
      )
    );

    // --------------------------------------------------
    // BASIC STRUCTURE CHECKS
    // --------------------------------------------------

    expect(report.role).toBe(
      "parent"
    );

    expect(
      report.dimensions
    ).toHaveLength(9);

    expect(
      Object.keys(
        report.questionScores
      )
    ).toHaveLength(27);

    // --------------------------------------------------
    // DIMENSION SCORE CHECKS
    // --------------------------------------------------

    expect(
      report.dimensions[0].average
    ).toBe(1);

    expect(
      report.dimensions[1].average
    ).toBe(1);

    expect(
      report.dimensions[2].average
    ).toBe(1);

    expect(
      report.dimensions[3].average
    ).toBe(1);

    expect(
      report.dimensions[4].average
    ).toBe(1);

    // Q16 = 1, Q17 = 1, Q18 = 5
   expect(report.dimensions[5].average).toBe(2.33);

    expect(
      report.dimensions[6].average
    ).toBe(1);

    // Q22 = 2, Q23 = 1, Q24 = 3
    expect(
      report.dimensions[7].average
    ).toBe(2);

    expect(
      report.dimensions[8].average
    ).toBe(2);

    // --------------------------------------------------
    // PERFORMANCE CHECK
    // --------------------------------------------------

   expect(
  report.dimensions[0].performance
).toBe(
  "Critical"
);
    expect(
      report.dimensions[5].performance
    ).toBe(
      "Needs Attention"
    );

    // --------------------------------------------------
    // OVERALL SCORE
    // --------------------------------------------------

    /*
     * Expected:
     *
     * Child–School Fit              = 2.4
     * Happiness & Emotional Safety  = 2.4
     * Learning & Growth             = 2.8
     * Life Skills & Resilience      = 2.0
     * Teacher–Child Relationship    = 2.4
     * School Culture                = 5.6
     * Parent–School Partnership     = 2.0
     * Leadership & Trust            = 3.2
     * Holistic & Future Readiness   = 4.0
     *
     * Total = 26.8
     */

    expect(
      report.overallScore
    ).toBeCloseTo(
      26.8,
      2
    );

    expect(
      report.sfi
    ).toBeCloseTo(
      26.8,
      2
    );

    expect(
      report.rating
    ).toBe(
      "Critical"
    );

    // --------------------------------------------------
    // STRENGTHS / FOCUS AREAS
    // --------------------------------------------------

    expect(
      report.strengths
    ).toHaveLength(0);

    expect(
      report.focusAreas
    ).toHaveLength(9);
  });
});