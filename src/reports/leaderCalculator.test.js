import { calculateLeaderReport } from "./leaderCalculator";

describe("Leader Calculator", () => {
  test(
    "calculates the supplied Leader response correctly",
    () => {
      const response = {
        "Timestamp":
          "19/09/2026 11:35:32",

        "Email Address":
          "anitadasgupta0512@gmail.com",

        "Email address":
          "anitadasgupta0512@gmail.com",

        "School Name :":
          "Manav rachna international school ",

        "School Type: ":
          "CBSE",

        "Date of Submission":
          "19/09/2026",

        "Leader's Full Name :":
          "Anita Dasgupta ",

        "School Level / Division Handled :":
          "Pre-Primary / Early Years, Primary School",

        "Current Leadership Role / Position :":
          "Headmistress ",

        "Total Years of Experience in Educational Leadership  ":
          "16+ years",

        "24. I feel a strong sense of purpose in my role as a school leader.":
          "4",

        "25. I have opportunities to learn, reflect and develop as a leader.":
          "4",

        "2. I carry school-related concerns with me even after the working day has ended. ":
          "5",

        "4. I feel emotionally or mentally exhausted by the demands of school leadership. ":
          "3",

        "8. I have trusted people with whom I can openly discuss my leadership challenges.\n":
          "5",

        "6. I feel pressure to appear calm and strong even when I am struggling internally. ":
          "1",

        "1. I feel emotionally and mentally able to manage the demands of my leadership role.":
          "4",

        "17. I am able to build trusting and respectful relationships with teachers and staff.":
          "5",

        "18. Teachers and staff feel comfortable approaching me with concerns or difficulties.":
          "5",

        "13. Budget or resource constraints create significant pressure in my leadership role. ":
          "3",

        "3. I find myself managing other people's emotions while neglecting my own well-being. ":
          "3",

        "9. I receive meaningful support from my governing body, management or senior leadership.":
          "4",

        "5. I feel overwhelmed by the number and complexity of decisions I need to make each day. ":
          "2",

        "20. The culture of my school reflects the values and behaviors I want to promote as a leader.":
          "4",

        "27. I feel that I can sustain my current leadership role without compromising my own well-being.":
          "4",

        "30. Complete the sentence:\n“I would be a more effective and flourishing school leader if…”":
          "The administrative departments took accountability for their operational areas and staff welfare to reduce attrition.",

        "28. What gives you the greatest sense of purpose, satisfaction or energy in your leadership role?":
          "The impact in teaching learning process and parent engagement. ",

        "11. I have access to guidance, mentoring or peer support when I face difficult leadership situations.\n":
          "5",

        "22. I am able to delegate responsibilities effectively rather than trying to manage everything myself.":
          "4",

        "26. I am able to maintain healthy boundaries between my professional responsibilities and personal life.":
          "3",

        "If you could change one thing about your school environment to increase your happiness, what would it be?":
          "",

        "7. I am able to make difficult decisions with clarity even when there is considerable pressure or uncertainty.\n":
          "4",

        "14. Regulatory, compliance and external reporting requirements create significant pressure in my leadership role.":
          "2",

        "19. I am able to support staff well-being while maintaining appropriate accountability and performance standards.":
          "4",

        "23. I am able to remain calm, thoughtful and constructive when the school faces a crisis or unexpected challenge.":
          "4",

        "10. My governing body or management respects the boundary between strategic oversight and operational leadership.\n":
          "4",

        "21. I have sufficient time and energy to focus on long-term school improvement rather than constantly responding to urgent issues.":
          "2",

        "16. The school has adequate systems, processes and resources to support me in carrying out my leadership responsibilities effectively.":
          "4",

        "12. Administrative, reporting and compliance demands leave me with sufficient time to focus on teaching, learning and school improvement.":
          "3",

        "15. Managing competing expectations from teachers, parents, students, management and external stakeholders creates significant pressure for me. ":
          "2",

        "29. If you could change ONE thing in your school's systems, structures or support to make your leadership role more sustainable and effective, what would it be?":
          "Supportive colleagues",
      };

      const report =
        calculateLeaderReport(
          response
        );

      expect(report.role).toBe(
        "leader"
      );

      expect(
        report.respondent.name
      ).toBe("Anita Dasgupta");

      expect(
        report.respondent.email
      ).toBe(
        "anitadasgupta0512@gmail.com"
      );

      expect(
        report.respondent.school
      ).toBe(
        "Manav rachna international school"
      );

      expect(
        report.respondent.currentRole
      ).toBe("Headmistress");

      expect(
        report.dimensions
      ).toHaveLength(7);

      expect(
        Object.keys(
          report.questionScores
        )
      ).toHaveLength(27);

      /*
       * Reverse-scored question checks.
       */
      expect(
        report.questionScores.q2
      ).toBe(1);

      expect(
        report.questionScores.q3
      ).toBe(3);

      expect(
        report.questionScores.q4
      ).toBe(3);

      expect(
        report.questionScores.q5
      ).toBe(4);

      expect(
        report.questionScores.q6
      ).toBe(5);

      expect(
        report.questionScores.q13
      ).toBe(3);

      expect(
        report.questionScores.q14
      ).toBe(4);

      expect(
        report.questionScores.q15
      ).toBe(4);

      /*
       * Dimension averages.
       */
      const expectedAverages = [
        2.75,
        4.33,
        4.5,
        3.6,
        4.5,
        3.33,
        3.75,
      ];

      /*
       * Weighted contribution of each dimension.
       */
      const expectedWeightedScores = [
        8.25,
        8.67,
        10.8,
        12.96,
        13.5,
        8.0,
        13.5,
      ];

      report.dimensions.forEach(
        (dimension, index) => {
          expect(
            dimension.average
          ).toBe(
            expectedAverages[index]
          );

          expect(
            dimension.weightPercentage
          ).toBeCloseTo(
            [
              15,
              10,
              12,
              18,
              15,
              12,
              18,
            ][index],
            10
          );

          expect(
            dimension.weightedScore
          ).toBe(
            expectedWeightedScores[
              index
            ]
          );
        }
      );

      /*
       * Overall score.
       */
      expect(
        report.overallScore
      ).toBe(75.68);

      expect(
        report.sfi
      ).toBe(75.68);

      /*
       * Official Leader rating,
       * strength and focus bands
       * were not supplied.
       */
      expect(
        report.strengths
      ).toBeNull();

      expect(
        report.focusAreas
      ).toBeNull();

      expect(
        report.rating
      ).toBeNull();

      expect(
        report.top5Strengths
      ).toEqual([]);

      expect(
        report.top5ImprovementAreas
      ).toEqual([]);

      /*
       * Qualitative response checks.
       */
      expect(
        report.rawQualitativeResponses
          .purpose
      ).toContain(
        "impact in teaching learning process"
      );

      expect(
        report.rawQualitativeResponses
          .desiredChange
      ).toBe(
        "Supportive colleagues"
      );

      /*
       * Debug output.
       */
      console.log(
        "===== LEADER REPORT RESULT ====="
      );

      console.dir(
        report,
        { depth: null }
      );

      console.log(
        "===== LEADER DIMENSIONS ====="
      );

      report.dimensions.forEach(
        (dimension) => {
          console.log(
            `${dimension.name}: ${dimension.average} Weight: ${dimension.weightPercentage}% Weighted: ${dimension.weightedScore} Performance: ${dimension.performance}`
          );
        }
      );

      console.log(
        "Overall Score:",
        report.overallScore
      );

      console.log(
        "Rating:",
        report.rating
      );

      console.log(
        "Strengths:",
        report.strengths
      );

      console.log(
        "Focus Areas:",
        report.focusAreas
      );
    }
  );
});