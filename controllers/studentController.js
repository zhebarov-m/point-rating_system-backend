const ApiError = require("../error/ApiError");
const {
  Student,
  User,
  Group,
  Rating,
  Subject,
  TeacherAssignment,
} = require("../models/models");

class StudentController {
  async create(req, res) {}

  async getST(req, res, next) {
    const student = await Student.findByPk(studentId);

    if (student) {
      if (student.group) {
        console.log(
          `Студент ${student.first_name} ${student.last_name} относится к группе ${student.group.group_name}`
        );
      } else {
        console.log(
          `Студент ${student.first_name} ${student.last_name} не найден в группе`
        );
      }
    } else {
      console.log(`Студент с ID ${studentId} не найден`);
    }
  }
  async getAll(req, res, next) {
    const students = await Student.findAll({
      include: [
        {
          model: User,
          as: "user",
        },
        {
          model: Group,
          as: "group",
          include: {
            model: TeacherAssignment,
            as: "teacherAssignments",
          },
        },
      ],
    });
    res.json(students);
  }

  async getSubjectRating(req, res, next) {
    const groupId = req.params.group_id;
    const subjectId = req.params.subject_id;
  
    try {
      const group = await Group.findByPk(groupId, {
        include: [
          {
            model: Student,
            as: "students",
            include: [
              {
                model: User,
                as: "user",
              },
              {
                model: Rating,
                as: "ratings",
                where: {
                  subjectId: subjectId,
                },
              },
            ],
          },
        ],
      });
  
      if (!group) {
        return res.status(404).json({ error: "Group not found" });
      }
  
      const formattedRating = group.students.map((student) => {
        const user = student.user;
        const rating = student.ratings.length > 0 ? student.ratings[0].rating_value : null;
  
        return {
          student_id: student.student_id,
          first_name: user.first_name,
          last_name: user.last_name,
          middle_name: user.middle_name,
          rating: rating,
        };
      });
  
      res.status(200).json(formattedRating);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
  
  // async getAll(req, res, next) {
  //   try {
  //     const { group } = req.params; // Получаем название группы из запроса
  //     let students;
  //     if (!group) {
  //       students = await Student.findAll({
  //         include: [
  //           {
  //             model: User,
  //             as: "user",
  //             where: { role: "STUDENT" },
  //           },
  //           {
  //             model: Group,
  //             as: "group",
  //           },
  //           // {
  //           //   model: Rating,
  //           //   as: "ratings",
  //           //   include: {
  //           //     model: Subject,
  //           //     as: "subject",
  //           //   },
  //           // },
  //         ],
  //       });
  //     }
  //     if (group) {
  //       students = await Student.findAll({
  //         include: [
  //           {
  //             model: User,
  //             as: "user",
  //             where: { role: "STUDENT" },
  //           },
  //           {
  //             model: Group,
  //             as: "group",
  //             where: { group_name: group }, // Фильтр по названию группы
  //           },
  //         ],
  //       });
  //     }

  //     const studentData = students.map((student) => ({
  //       student_id: student.student_id,
  //       first_name: student.user.first_name,
  //       last_name: student.user.last_name,
  //       middle_name: student.user.middle_name,
  //       group: student.group?.group_name,
  //       course: student.group?.course,
  //       // ratings: student.ratings,
  //       createdAt: student.createdAt,
  //       updatedAt: student.updatedAt,
  //       // Другие поля student, если они вам нужны
  //     }));

  //     return res.json(students);
  //   } catch (error) {
  //     next(ApiError.badRequest(error.message));
  //   }
  // }

  async getOne(req, res) {
    const student_id = req.params.student_id;
    const student = await Student.findOne({
      where: { student_id },
      include: [
        {
          model: User,
          as: "user",
          where: { role: "STUDENT" },
        },
        {
          model: Group,
          as: "group",
        },
      ],
    });

    if (!student) {
      return res.status(404).json({ message: "Студент не найден" });
    }

    const studentData = {
      student_id: student.student_id,
      first_name: student.user.first_name,
      last_name: student.user.last_name,
      middle_name: student.user.middle_name,
      group: student.group?.group_name,
      course: student.group?.course,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
      // Другие поля student, если они вам нужны
    };

    return res.json(studentData);
  }
}

module.exports = new StudentController();
