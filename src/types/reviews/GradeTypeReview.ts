import { GradeType } from "types/grade/returnCreateGrade";

export interface GradeReviewResult {
  id: String;
  point: Number;
  feedback: String;
  version: Number;
  teacherId: String;
  gradeReviewId: String;
  event: String;
}

export interface GradeReview {
  id: String;
  topic: String;
  desc: String;
  userId: String;
  expectedGrade: Number;
  userCourseGradeId: String;
  status: String;
  gradeReviewResults: GradeReviewResult[];
}

export interface GradeTypeReviews {
  id: String;
  gradeTypeId: String;
  studentId: String;
  courseId: String;
  point: Number;
  gradeType: GradeType;
  status: "REQUEST" | "DONE";
  gradeReviews: GradeReview[];
}

// [
//     {
//         "id": "3269f974-4ff5-4e9a-8f13-862f07bcef99",
//         "gradeTypeId": "3d4e4a3d-de05-4cc5-aa6e-511229d5c264",
//         "studentId": "20120500",
//         "courseId": "900ee539-62b9-4ec8-8cdd-0ea1adaf20c0",
//         "point": 0,
//         "gradeReviews": [
//             {
//                 "id": "d33a42a7-629e-4f39-8dc2-df649a822ce3",
//                 "topic": "Huy thử",
//                 "desc": "thử 1",
//                 "userId": "auth0|659df9366f441bc9813461cc",
//                 "expectedGrade": 9,
//                 "userCourseGradeId": "3269f974-4ff5-4e9a-8f13-862f07bcef99",
//                 "status": "REQUEST",
//                 "gradeReviewResults": []
//             },
//             {
//                 "id": "5275e13d-b582-4667-affa-02f01816e607",
//                 "topic": "dsahuahuas",
//                 "desc": "âsdassa",
//                 "userId": "auth0|659df9366f441bc9813461cc",
//                 "expectedGrade": 10,
//                 "userCourseGradeId": "3269f974-4ff5-4e9a-8f13-862f07bcef99",
//                 "status": "DONE",
//                 "gradeReviewResults": [
//                     {
//                         "id": "a0298dc1-8634-4372-b12f-667347d9d8d0",
//                         "point": 0,
//                         "feedback": "feedback",
//                         "version": 1,
//                         "teacherId": "auth0|659df9366f441bc9813461cc",
//                         "gradeReviewId": "5275e13d-b582-4667-affa-02f01816e607",
//                         "event": "ASSIGN"
//                     },
//                     {
//                         "id": "4529e723-9e9a-4f04-b41d-931b71856eee",
//                         "point": 10,
//                         "feedback": "ngon",
//                         "version": 2,
//                         "teacherId": "auth0|659df9366f441bc9813461cc",
//                         "gradeReviewId": "5275e13d-b582-4667-affa-02f01816e607",
//                         "event": "REASSIGN"
//                     }
//                 ]
//             },
//             {
//                 "id": "5db32413-b372-431b-8f7d-baefa97eda2e",
//                 "topic": "Thử cuối kì 2",
//                 "desc": "thử cuối kì",
//                 "userId": "auth0|659df9366f441bc9813461cc",
//                 "expectedGrade": 10,
//                 "userCourseGradeId": "3269f974-4ff5-4e9a-8f13-862f07bcef99",
//                 "status": "DONE",
//                 "gradeReviewResults": [
//                     {
//                         "id": "1cc71e52-37a7-4794-8ce8-45a34a941ba1",
//                         "point": 0,
//                         "feedback": "feedback",
//                         "version": 1,
//                         "teacherId": "auth0|659df9366f441bc9813461cc",
//                         "gradeReviewId": "5db32413-b372-431b-8f7d-baefa97eda2e",
//                         "event": "ASSIGN"
//                     },
//                     {
//                         "id": "7256cb8d-87c8-4e2a-9afa-2bac551b3eae",
//                         "point": 0,
//                         "feedback": "feedback",
//                         "version": 2,
//                         "teacherId": "auth0|659df9366f441bc9813461cc",
//                         "gradeReviewId": "5db32413-b372-431b-8f7d-baefa97eda2e",
//                         "event": "ASSIGN"
//                     },
//                     {
//                         "id": "68b0449d-9493-4d49-b226-4a889167be2c",
//                         "point": 0,
//                         "feedback": "feedback",
//                         "version": 3,
//                         "teacherId": "google-oauth2|118196577445197856814",
//                         "gradeReviewId": "5db32413-b372-431b-8f7d-baefa97eda2e",
//                         "event": "ASSIGN"
//                     },
//                     {
//                         "id": "d2ff3c2c-9cd8-48c3-91f4-b27c3a17ae0c",
//                         "point": 0,
//                         "feedback": "feedback",
//                         "version": 4,
//                         "teacherId": "google-oauth2|118196577445197856814",
//                         "gradeReviewId": "5db32413-b372-431b-8f7d-baefa97eda2e",
//                         "event": "ASSIGN"
//                     },
//                     {
//                         "id": "62ddad7b-f811-40b3-88fa-27a495667d5a",
//                         "point": 0,
//                         "feedback": "feedback",
//                         "version": 5,
//                         "teacherId": "google-oauth2|118196577445197856814",
//                         "gradeReviewId": "5db32413-b372-431b-8f7d-baefa97eda2e",
//                         "event": "ASSIGN"
//                     },
//                     {
//                         "id": "dbd23d28-714f-4508-8b86-e2992efc2009",
//                         "point": 0,
//                         "feedback": "feedback",
//                         "version": 6,
//                         "teacherId": "google-oauth2|118196577445197856814",
//                         "gradeReviewId": "5db32413-b372-431b-8f7d-baefa97eda2e",
//                         "event": "ASSIGN"
//                     },
//                     {
//                         "id": "56c097ed-f803-412d-9daf-811c0dfc2ee1",
//                         "point": 0,
//                         "feedback": "feedback",
//                         "version": 7,
//                         "teacherId": "google-oauth2|118196577445197856814",
//                         "gradeReviewId": "5db32413-b372-431b-8f7d-baefa97eda2e",
//                         "event": "ASSIGN"
//                     },
//                     {
//                         "id": "8c2b419f-59af-47f1-802f-5f63e6bf8065",
//                         "point": 0,
//                         "feedback": "feedback",
//                         "version": 8,
//                         "teacherId": "google-oauth2|118196577445197856814",
//                         "gradeReviewId": "5db32413-b372-431b-8f7d-baefa97eda2e",
//                         "event": "ASSIGN"
//                     },
//                     {
//                         "id": "12dd2185-b808-4c23-9419-80c95a0930b6",
//                         "point": 0,
//                         "feedback": "feedback",
//                         "version": 9,
//                         "teacherId": "google-oauth2|118196577445197856814",
//                         "gradeReviewId": "5db32413-b372-431b-8f7d-baefa97eda2e",
//                         "event": "ASSIGN"
//                     }
//                 ]
//             }
//         ],
//         "status": "REQUEST"
//     },
//     {
//         "id": "91c685a8-2647-4bdf-a8d1-4ab7217f1910",
//         "gradeTypeId": "1730e122-032b-411d-b39f-92dc139918c5",
//         "studentId": "20120500",
//         "courseId": "900ee539-62b9-4ec8-8cdd-0ea1adaf20c0",
//         "point": 10,
//         "gradeReviews": [
//             {
//                 "id": "d3dc5506-401d-4eb3-84dd-054739355b49",
//                 "topic": "Thử gky",
//                 "desc": "Thử gk",
//                 "userId": "auth0|659df9366f441bc9813461cc",
//                 "expectedGrade": 10,
//                 "userCourseGradeId": "91c685a8-2647-4bdf-a8d1-4ab7217f1910",
//                 "status": "REQUEST",
//                 "gradeReviewResults": []
//             },
//             {
//                 "id": "b43fe801-861b-481c-a76d-c7d6550f59bc",
//                 "topic": "Phúc khảo gk2",
//                 "desc": "mô tả phúc khảo",
//                 "userId": "auth0|659df9366f441bc9813461cc",
//                 "expectedGrade": 9,
//                 "userCourseGradeId": "91c685a8-2647-4bdf-a8d1-4ab7217f1910",
//                 "status": "REQUEST",
//                 "gradeReviewResults": []
//             }
//         ],
//         "status": "REQUEST"
//     }
// ]
