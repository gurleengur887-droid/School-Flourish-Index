import {
  calculateSchoolResult,
  calculateSchoolDimensions,
  getPerformanceFromScore,
} from "./schoolResultsCalculator";

import { calculateTeacherReport } from "./teacherCalculator";
import { calculateStudentReport } from "./studentCalculator";
import { calculateParentReport } from "./parentCalculator";
import { calculateLeaderReport } from "./leaderCalculator";

jest.mock("./teacherCalculator", () => ({
  calculateTeacherReport: jest.fn(),
}));

jest.mock("./studentCalculator", () => ({
  calculateStudentReport: jest.fn(),
}));

jest.mock("./parentCalculator", () => ({
  calculateParentReport: jest.fn(),
}));

jest.mock("./leaderCalculator", () => ({
  calculateLeaderReport: jest.fn(),
}));

/*
 * ---------------------------------------------------------
 * HELPERS
 * ---------------------------------------------------------
 */

const parameter = (key, average) => ({
  key,
  average,
});

const response = (id, role) => ({
  id,
  role,
  response_data: {},
});

/*
 * ---------------------------------------------------------
 * TEST SUITE
 * ---------------------------------------------------------
 */

describe("School Results Calculator", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    /*
     * Teacher response
     */
    calculateTeacherReport.mockReturnValue({
      parameters: [
        parameter("student_engagement", 4),
        parameter("school_culture", 3),
        parameter("leadership_trust", 4),
        parameter("instructional_practices", 4),
        parameter("classroom_management", 3),
        parameter("resources_support", 2),
      ],
    });

    /*
     * Student response
     */
    calculateStudentReport.mockReturnValue({
      parameters: [
        parameter(
          "teacher_support_classroom_climate",
          4
        ),
        parameter(
          "happiness_school_experience",
          5
        ),
        parameter(
          "emotional_wellbeing_resilience",
          5
        ),
        parameter(
          "psychological_safety",
          4
        ),
        parameter(
          "belonging_inclusion",
          4
        ),
        parameter(
          "learning_engagement_confidence",
          5
        ),
        parameter(
          "student_voice_purpose_future",
          4
        ),
        parameter(
          "peer_relationships_respect",
          3
        ),
      ],
    });

    /*
     * Parent response
     */
    calculateParentReport.mockReturnValue({
      parameters: [
        parameter(
          "teacher_child_relationship",
          4
        ),
        parameter(
          "child_school_fit",
          3
        ),
        parameter(
          "leadership_trust",
          4
        ),
        parameter(
          "happiness_emotional_safety",
          5
        ),
        parameter(
          "learning_growth",
          4
        ),
        parameter(
          "holistic_future_readiness",
          3
        ),
        parameter(
          "school_culture_psychological_safety",
          4
        ),
        parameter(
          "parent_school_partnership",
          5
        ),
      ],
    });

    /*
     * Leader response
     */
    calculateLeaderReport.mockReturnValue({
      parameters: [
        parameter(
          "leadership_support_governance_connection",
          4
        ),
        parameter(
          "decision_making_leadership_pressure",
          3
        ),
        parameter(
          "leadership_effectiveness_capacity",
          4
        ),
        parameter(
          "purpose_growth_sustainable_leadership",
          5
        ),
        parameter(
          "leadership_staff_relationships_culture",
          4
        ),
        parameter(
          "organisational_operational_conditions",
          3
        ),
      ],
    });
  });

  /*
   * -------------------------------------------------------
   * 1. SEVEN DIMENSIONS EXIST
   * -------------------------------------------------------
   */

  test("calculates all seven school dimensions", () => {
    const result = calculateSchoolResult([
      response("t1", "teacher"),
      response("s1", "student"),
      response("p1", "parent"),
      response("l1", "leader"),
    ]);

    expect(result.dimensions).toHaveLength(7);

    expect(result.availableDimensionCount).toBe(7);

    expect(result.totalDimensionCount).toBe(7);

    expect(result.hasData).toBe(true);

    /*
     * Overall score intentionally remains null.
     */
    expect(result.overallScore).toBeNull();

    expect(
      result.dimensions.map(
        (dimension) => dimension.name
      )
    ).toEqual([
      "Teacher–Child Relationship",
      "Child–School Fit",
      "Leadership Trust",
      "Child Happiness & Safety",
      "Learning & Growth",
      "School Culture",
      "Parent–School Partnership",
    ]);
  });

  /*
   * -------------------------------------------------------
   * 2. RESPONDENT IS COUNTED ONLY ONCE
   * -------------------------------------------------------
   *
   * Teacher has:
   *
   * student_engagement = 4
   * school_culture = 3
   *
   * Both contribute to Teacher–Child Relationship.
   *
   * Respondent average:
   *
   * (4 + 3) / 2 = 3.5
   *
   * Since there is only one respondent:
   *
   * school average = 3.5
   *
   * percentage = 70%
   */

  test(
    "counts one respondent only once when multiple parameters map to a dimension",
    () => {
      const result =
        calculateSchoolResult([
          response("t1", "teacher"),
        ]);

      const teacherChild =
        result.dimensions.find(
          (dimension) =>
            dimension.key ===
            "teacher_child_relationship"
        );

      expect(
        teacherChild
      ).toBeDefined();

      expect(
        teacherChild.responseCount
      ).toBe(1);

      expect(
        teacherChild.average
      ).toBe(3.5);

      expect(
        teacherChild.percentage
      ).toBe(70);

      expect(
        teacherChild.contributingPerspectives
      ).toEqual(["teacher"]);

      expect(
        teacherChild
          .contributingResponses[0]
          .sourceParameterCount
      ).toBe(2);
    }
  );

  /*
   * -------------------------------------------------------
   * 3. EQUAL RESPONDENT WEIGHTING
   * -------------------------------------------------------
   *
   * Two student respondents contribute:
   *
   * Student 1:
   * happiness = 5
   * safety = 4
   *
   * respondent average = 4.5
   *
   * Student 2:
   * happiness = 5
   * safety = 4
   *
   * respondent average = 4.5
   *
   * School average = 4.5
   *
   * percentage = 90%
   */

  test(
    "gives equal weight to each contributing respondent",
    () => {
      calculateStudentReport
        .mockReturnValueOnce({
          parameters: [
            parameter(
              "happiness_school_experience",
              5
            ),
            parameter(
              "emotional_wellbeing_resilience",
              5
            ),
            parameter(
              "psychological_safety",
              4
            ),
          ],
        })
        .mockReturnValueOnce({
          parameters: [
            parameter(
              "happiness_school_experience",
              3
            ),
            parameter(
              "emotional_wellbeing_resilience",
              3
            ),
            parameter(
              "psychological_safety",
              3
            ),
          ],
        });

      const result =
        calculateSchoolResult([
          response("s1", "student"),
          response("s2", "student"),
        ]);

      const happinessSafety =
        result.dimensions.find(
          (dimension) =>
            dimension.key ===
            "child_happiness_safety"
        );

      /*
       * Student 1:
       * (5 + 5 + 4) / 3 = 4.6667
       *
       * Student 2:
       * (3 + 3 + 3) / 3 = 3
       *
       * School average:
       * (4.6667 + 3) / 2 = 3.8333
       *
       * Rounded to 2 decimals = 3.83
       *
       * Percentage rounds to 77%.
       */

      expect(
        happinessSafety.responseCount
      ).toBe(2);

      expect(
        happinessSafety.average
      ).toBe(3.83);

      expect(
        happinessSafety.percentage
      ).toBe(77);
    }
  );

  /*
   * -------------------------------------------------------
   * 4. DIFFERENT PERSPECTIVES CAN CONTRIBUTE
   * -------------------------------------------------------
   */

test(
  "includes contributions from all perspectives mapped to Leadership Trust",
  () => {
    const result =
      calculateSchoolResult([
        response("t1", "teacher"),
        response("s1", "student"),
        response("p1", "parent"),
        response("l1", "leader"),
      ]);

    const leadershipTrust =
      result.dimensions.find(
        (dimension) =>
          dimension.key ===
          "leadership_trust"
      );

    expect(
      leadershipTrust
    ).toBeDefined();

    /*
     * Leadership Trust currently receives
     * contributions from:
     *
     * Teacher
     * Parent
     * Leader
     *
     * Student has no parameter mapped to this
     * dimension, so the student response is not
     * counted here.
     */
    expect(
      leadershipTrust.responseCount
    ).toBe(3);

    expect(
      leadershipTrust.contributingPerspectives
    ).toEqual(
      expect.arrayContaining([
        "teacher",
        "parent",
        "leader",
      ])
    );

    expect(
      leadershipTrust.contributingPerspectives
        .includes("student")
    ).toBe(false);
  }
);

  /*
   * -------------------------------------------------------
   * 5. NO RESPONSE = NO DATA
   * -------------------------------------------------------
   */

  test(
    "returns no dimension scores for a school with no responses",
    () => {
      const result =
        calculateSchoolResult([]);

      expect(result.hasData).toBe(false);

      expect(
        result.availableDimensionCount
      ).toBe(0);

      expect(
        result.totalDimensionCount
      ).toBe(7);

      expect(
        result.overallScore
      ).toBeNull();

      expect(
        result.dimensions.every(
          (dimension) =>
            dimension.average === null
        )
      ).toBe(true);

      expect(
        result.dimensions.every(
          (dimension) =>
            dimension.percentage === null
        )
      ).toBe(true);

      expect(
        result.dimensions.every(
          (dimension) =>
            dimension.responseCount === 0
        )
      ).toBe(true);
    }
  );

  /*
   * -------------------------------------------------------
   * 6. UNKNOWN ROLE IS IGNORED
   * -------------------------------------------------------
   */

  test(
    "ignores responses with an unknown role",
    () => {
      const result =
        calculateSchoolResult([
          response("x1", "unknown"),
        ]);

      expect(result.hasData).toBe(false);

      expect(
        result.availableDimensionCount
      ).toBe(0);

      expect(
        result.dimensions.every(
          (dimension) =>
            dimension.average === null
        )
      ).toBe(true);
    }
  );

  /*
   * -------------------------------------------------------
   * 7. INVALID PARAMETER AVERAGES ARE IGNORED
   * -------------------------------------------------------
   */

  test(
    "ignores invalid parameter averages",
    () => {
      calculateTeacherReport.mockReturnValue({
        parameters: [
          parameter(
            "student_engagement",
            6
          ),
          parameter(
            "school_culture",
            null
          ),
        ],
      });

      const result =
        calculateSchoolResult([
          response("t1", "teacher"),
        ]);

      const teacherChild =
        result.dimensions.find(
          (dimension) =>
            dimension.key ===
            "teacher_child_relationship"
        );

      expect(
        teacherChild.average
      ).toBe(null);

      expect(
        teacherChild.percentage
      ).toBe(null);

      expect(
        teacherChild.responseCount
      ).toBe(0);
    }
  );

  /*
   * -------------------------------------------------------
   * 8. PERFORMANCE BANDS
   * -------------------------------------------------------
   */

  test("returns correct performance labels", () => {
    expect(
      getPerformanceFromScore(4.8)
    ).toBe("Outstanding");

    expect(
      getPerformanceFromScore(4.2)
    ).toBe("Excellent");

    expect(
      getPerformanceFromScore(3.9)
    ).toBe("Very Good");

    expect(
      getPerformanceFromScore(3.2)
    ).toBe("Good");

    expect(
      getPerformanceFromScore(2.5)
    ).toBe("Needs Attention");

    expect(
      getPerformanceFromScore(1.5)
    ).toBe("Critical");
  });

  /*
   * -------------------------------------------------------
   * 9. DIRECT calculateSchoolDimensions TEST
   * -------------------------------------------------------
   */

  test(
    "calculateSchoolDimensions returns seven dimensions",
    () => {
      const dimensions =
        calculateSchoolDimensions([
          response("t1", "teacher"),
          response("s1", "student"),
          response("p1", "parent"),
          response("l1", "leader"),
        ]);

      expect(dimensions).toHaveLength(7);

      dimensions.forEach(
        (dimension) => {
          expect(
            dimension
          ).toHaveProperty("key");

          expect(
            dimension
          ).toHaveProperty("name");

          expect(
            dimension
          ).toHaveProperty("average");

          expect(
            dimension
          ).toHaveProperty("percentage");

          expect(
            dimension
          ).toHaveProperty("responseCount");
        }
      );
    }
  );
});