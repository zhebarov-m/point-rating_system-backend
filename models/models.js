const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING, allowNull: false },
  middle_name: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: "STUDENT" },
  group: { type: DataTypes.STRING },
  deleted: { type: DataTypes.BOOLEAN, defaultValue: false }, // Мягкое удаление пользователя
});

const Student = sequelize.define("student", {
  student_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

const Teacher = sequelize.define("teacher", {
  teacher_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

const Group = sequelize.define("group", {
  group_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  group_name: { type: DataTypes.STRING, allowNull: false, unique: true },
  course: { type: DataTypes.INTEGER, allowNull: false },
});

const Subject = sequelize.define("subject", {
  subject_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  subject_name: { type: DataTypes.STRING, allowNull: false, unique: true },
});

// const TeacherGroupSubject = sequelize.define("teacher_group_subject", {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
// });

const TeacherSubjects = sequelize.define("teacher_subject", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const SubjectGroups = sequelize.define("subject_groups", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

// const TeacherSubject = sequelize.define("teacher_subject", {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
// });

// Привязка учителя к предметам и группам
// const TeacherSubjectGroup = sequelize.define("teacher_subject_group", {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
// });

const TeacherAssignment = sequelize.define("teacher-assignment", {
  assignmentId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

const Rating = sequelize.define("rating", {
  rating_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  semester: { type: DataTypes.INTEGER, allowNull: false },
  semester_points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  current_attestation: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  midterm_attestation: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  bonus_scores: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  absences_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  attendance_points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 15,
  },
  totalPoints: {
    type: DataTypes.VIRTUAL,
    get() {
      return (
        this.semester_points +
        this.current_attestation +
        this.midterm_attestation +
        this.bonus_scores +
        this.attendance_points
      );
    },
  },
});

User.hasOne(Student, { foreignKey: "userId" });
Student.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasOne(Teacher, { foreignKey: "userId" });
Teacher.belongsTo(User, { foreignKey: "userId", as: "user" });

Student.hasMany(Rating, { foreignKey: "studentId" });
Rating.belongsTo(Student, { foreignKey: "studentId", as: "student" });

Group.hasMany(Rating, { foreignKey: "groupId" });
Rating.belongsTo(Group, { foreignKey: "groupId", as: "group" });

Subject.hasMany(Rating, { foreignKey: "subjectId" });
Rating.belongsTo(Subject, { foreignKey: "subjectId", as: "subject" });

Group.hasMany(Student, { foreignKey: "groupId" });
Student.belongsTo(Group, { foreignKey: "groupId", as: "group" });

Student.belongsToMany(Subject, { through: Rating });
Subject.belongsToMany(Student, { through: Rating });

// // Привязка учителя к нескольким предметам
// Teacher.belongsToMany(Subject, {through: TeacherSubjects, foreignKey: "teacherId", as: "Subjects",});
// Subject.belongsToMany(Teacher, {through: TeacherSubjects, foreignKey: "subjectId", as: "Teachers",});

// // Привязка предмета к нескольким группам
// Subject.belongsToMany(Group, {
//   through: SubjectGroups,
//   foreignKey: "subjectId",
//   as: "Groups",
// });
// Group.belongsToMany(Subject, {
//   through: SubjectGroups,
//   foreignKey: "groupId",
//   as: "Subjects",
// });

// Привязка учителя к нескольким группам
// Teacher.belongsToMany(Group, {through: "teacher_groups",foreignKey: "teacherId",as: "Groups"});
// Group.belongsToMany(Teacher, {through: "teacher_groups",foreignKey: "groupId",as: "Teachers"});

// Teacher.belongsToMany(Subject, {through: TeacherSubject});
// Subject.belongsToMany(Teacher, {through: TeacherSubject});

Teacher.hasMany(TeacherAssignment, {
  foreignKey: "teacherId",
  as: "teacherAssignments",
});
TeacherAssignment.belongsTo(Teacher, { foreignKey: "teacherId" });
Subject.hasMany(TeacherAssignment, {
  foreignKey: "subjectId",
  as: "teacherAssignments",
});
TeacherAssignment.belongsTo(Subject, { foreignKey: "subjectId" });
Group.hasMany(TeacherAssignment, {
  foreignKey: "groupId",
  as: "teacherAssignments",
});
TeacherAssignment.belongsTo(Group, { foreignKey: "groupId" });

// // Устанавливаем связи с внешними ключами
// Teacher.belongsToMany(Subject, {
//   through: TeacherSubjectGroup,
//   foreignKey: "teacherId",
//   as: "Subjects",
// });
// Subject.belongsToMany(Teacher, {
//   through: TeacherSubjectGroup,
//   foreignKey: "subjectId",
//   as: "Teachers",
// });

// Teacher.belongsToMany(Group, {
//   through: TeacherSubjectGroup,
//   foreignKey: "teacherId",
//   as: "Groups",
// });
// Group.belongsToMany(Teacher, {
//   through: TeacherSubjectGroup,
//   foreignKey: "groupId",
//   as: "Teachers",
// });

// Subject.belongsToMany(Group, {
//   through: TeacherSubjectGroup,
//   foreignKey: "subjectId",
//   as: "Groups",
// });
// Group.belongsToMany(Subject, {
//   through: TeacherSubjectGroup,
//   foreignKey: "groupId",
//   as: "Subjects",
// });

module.exports = {
  User,
  Student,
  Teacher,
  Group,
  Subject,
  // TeacherSubjects,
  // SubjectGroups,
  // TeacherSubjectGroup,
  TeacherAssignment,
  Rating,
};
