import calculateStudentReport from "./studentCalculator";

test("Student calculator works with Arisaz response", () => {
  const response = {
    "Student's Full Name:": "Arisaz",
    "Email address": "eshumadaan609@gmail.com",
    "School Name:": "Gd",
    "Grade/Class": "6",
    "Your Current Role/Position": "",
    "How many years have you been studying at this school?":
      "Less than 1 year",

    "1. I enjoy coming to school.": "3",
    "2. I feel happy and positive during most school days.": "3",
    "3. I feel proud to be a student of my school.": "3",

    "4. I know healthy ways to manage stress or difficult emotions.": "3",
    "5. I can recover and move forward when I face difficulties.": "3",
    "6. I feel hopeful and positive about my future.": "3",

    "7. I feel safe at school.": "3",
    "8. I can express my opinions and ask questions without being afraid.": "3",
    "9. I know whom I can approach when I have a problem or need help.": "3",

    "10. I feel that I belong in my school.": "3",
    "11. I feel accepted and respected by other students.": "3",
    "12. My school makes students feel included, even when they are different from one another.": "3",

    "13. I enjoy learning new things at school.": "3",
    "14.My teachers make learning interesting and encourage me to participate.": "3",
    "15. I feel confident that I can learn and improve when I practise and put in effort.": "3",
    "16. I keep trying when I find something difficult.": "3",

    "17. My teachers care about me as a person, not just my marks.": "3",
    "18. My teachers encourage me when I struggle or make mistakes.": "3",
    "19. My teachers treat students fairly and respectfully.": "3",

    "20. Students in my school generally treat one another with kindness and respect.": "3",
    "21. I feel comfortable working and learning with other students.": "3",
    "22. When bullying or hurtful behaviour happens, I feel that the school takes it seriously.": "3",

    "23.  My ideas and opinions are listened to by adults in my school.": "3",
    "24. I get opportunities to take responsibility or develop leadership skills.": "3",
    "25. I feel that what I learn in school will help me in my future life.": "4",
    "26. I am learning how to use technology and AI safely and responsibly.": "3",
    "27.  My school gives me opportunities to discover my interests, strengths and talents beyond academics.": "3",

    "28. What is the one thing you like most about your school?": "",
    "29. If you could change one thing to make your school better for students, what would you change?": "",
    "30. Complete the sentence:\n“I flourish at my school because…”\n": "",
    "If you could change one thing about your school environment to increase your happiness, what would it be?": "",
  };

  const result = calculateStudentReport(response);

  console.log("STUDENT REPORT RESULT:", result);

  expect(result.role).toBe("student");
  expect(result.respondent.name).toBe("Arisaz");
  expect(result.respondent.email).toBe("eshumadaan609@gmail.com");
  expect(result.respondent.grade).toBe("6");

  expect(result.dimensions).toHaveLength(8);

  console.log(
    "\n===== STUDENT DIMENSIONS ====="
  );

  result.dimensions.forEach((dimension) => {
    console.log(
      `${dimension.name}:`,
      dimension.average,
      "Weight:",
      dimension.weightPercentage + "%",
      "Weighted:",
      dimension.weightedScore
    );
  });

  console.log(
    "\nOverall Score:",
    result.overallScore
  );

  console.log(
    "Strengths:",
    result.strengths.map((x) => x.name)
  );

  console.log(
    "Focus Areas:",
    result.focusAreas.map((x) => x.name)
  );

  expect(
    result.dimensions[0].average
  ).toBe(3);

  expect(
    result.dimensions[1].average
  ).toBe(3);

  expect(
    result.dimensions[2].average
  ).toBe(3);

  expect(
    result.dimensions[3].average
  ).toBe(3);

  expect(
    result.dimensions[4].average
  ).toBe(3);

  expect(
    result.dimensions[5].average
  ).toBe(3);

  expect(
    result.dimensions[6].average
  ).toBe(3);

  expect(
    result.dimensions[7].average
  ).toBe(3.2);

  expect(
    result.overallScore
  ).toBe(60.56);

  expect(
    result.strengths
  ).toHaveLength(0);

  expect(
    result.focusAreas
  ).toHaveLength(8);
});