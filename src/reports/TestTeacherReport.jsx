import React from "react";
import TeacherReport from "./TeacherReport";
import { calculateTeacherReport } from "./teacherCalculator";
import { useEffect } from "react";
import { testReportService } from "./testReportService";
const testResponse = {
  "School Name:": "BCM Arya Model Sen. Sec. School",
  "Email address": "vinaypradhan563@gmail.com",
  "Teacher's Full Name:": "Vinay",

  "My workload is manageable.": "5",
  "I feel proud to be a teacher.": "5",
  "I feel respected by my colleagues.": "2",
  "I enjoy coming to school each day.": "2",

  "I can manage disruptive behaviour calmly.": "2",
  "I feel that I accomplish meaningful work.": "2",
  "I feel optimistic about my teaching career.": "1",
  "Teaching gives me a strong sense of purpose": "2",

  "There is a culture of trust in this school.": "4",
  "My work is appreciated by school leadership.": "4",
  "School leaders genuinely listen to teachers.": "5",
  "Teachers collaborate and support one another": "4",

  "I can explain difficult concepts effectively.": "5",
  "I have enough time to prepare quality lessons.": "3",
  "I feel that I belong in this school community.": "4",
  "I feel satisfied with my current teaching role.": "4",

  "I receive opportunities to grow professionally.": "4",
  "I have adequate teaching and learning resources.": "4",
  "I receive useful feedback that helps me improve.": "4",

  "School decisions are communicated transparently.": "3",
  "I can maintain a positive classroom environment.": "5",
  "I receive timely support when I face challenges.": "2",
  "I believe my contribution is valued by my school.": "4",

  "I am able to maintain a healthy work-life balance.": "3",

  "Overall, how happy are you in your current school?": "1",

  "I feel confident handling discipline issues fairly.": "3",
  "Leadership treats teachers fairly and respectfully.": "2",

  "I can help students believe in their own abilities.": "1",
  "I use a variety of teaching strategies confidently.": "4",

  "I am able to manage work-related stress effectively.": "3",
  "I can build positive relationships with my students.": "4",

  "Administrative work does not interfere with teaching.": "1",
  "I feel emotionally energized during most school days.": "3",

  "I can adapt my teaching to meet diverse learning needs.": "2",
  "My work makes a positive difference in students' lives.": "3",

  "I can assess whether students have understood my lessons.": "5",
  "I can encourage students to participate actively in class.": "1",

  "I have enough freedom to make decisions about my teaching.": "4",
  "I can motivate students who are not interested in learning.": "5",

  "I would recommend my school as a good workplace for teachers.": "1",

  "I can respond confidently to unexpected classroom situations.": "2",

  "I often feel emotionally exhausted after work. (Reverse scored)": "5",

  "The school provides an environment that supports effective teaching.": "3",

  "How likely are you to recommend your school as a workplace for teachers?":
    "1",

  "I feel safe expressing my opinions without fear of negative consequences.":
    "2",

  "I receive adequate support when dealing with challenging student or parent situations.":
    "3",
};


export default function TestTeacherReport() {
useEffect(() => {
  testReportService();
}, []);
  const report =
    calculateTeacherReport(testResponse);


 return (
  <div className="test-teacher-report-page">
    <TeacherReport report={report} />
  </div>
);

    
}