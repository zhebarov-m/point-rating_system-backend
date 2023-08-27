const {
  Subject,
  Teacher,
  Group,
  User,
  TeacherAssignment,
} = require("../models/models");
const teacherController = require("./teacherController");

class SubjectController {
  async create(req, res) {
    const { subject_name } = req.body;
    const subject = await Subject.create({ subject_name });
    res.json(subject);
  }

  async getAll(req, res) {
    try {
      const subjects = await Subject.findAll({
        include: [
          {
            model: TeacherAssignment,
            as: "teacherAssignments",
            include: [
              {
                model: Teacher,
                include: {
                  model: User,
                  as: "user",
                  attributes: ["first_name", "last_name", "middle_name"],
                },
              },
              {
                model: Group,
                as: "group",
              },
            ],
          },
        ],
      });

      const formattedSubjects = subjects.map((subject) => {
        const formattedAssignments = subject.teacherAssignments.map(
          (assignment) => {
            try {
              const group_name = assignment.group.group_name;
              const course = assignment.group.course;
              const teacher = `${assignment.teacher.user.last_name} ${assignment.teacher.user.first_name} ${assignment.teacher.user.middle_name}`;
      
              return {
                group_name,
                course,
                teacher,
              };
            } catch (error) {
              console.error("Error formatting assignment:", error);
              return null; // Пометим ошибочные записи нулевым значением
            }
          }
        );
      
        const validAssignments = formattedAssignments.filter(
          (assignment) => assignment !== null
        );
      
        return {
          subject_id: subject.subject_id,
          subject_name: subject.subject_name,
          createdAt: subject.createdAt,
          updatedAt: subject.updatedAt,
          groups: validAssignments,
        };
      });

      if (!formattedSubjects.length) {
        res.status(404).json({ error: "Subject not found" });
        return;
      }

      res.status(200).json(formattedSubjects);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getOne(req, res) {
    try {
      const subject = await Subject.findByPk(req.params.subject_id, {
        include: [
          {
            model: TeacherAssignment,
            as: "teacherAssignments",
            include: [
              {
                model: Teacher,
                as: "teacher",
                include: {
                  model: User,
                  as: "user",
                  attributes: ["first_name", "last_name", "middle_name"],
                },
              },
              {
                model: Group,
                as: "group",
              },
            ],
          },
        ],
      });

      const formattedSubject = {
        subject_id: subject.subject_id,
        subject_name: subject.subject_name,
        createdAt: subject.createdAt,
        updatedAt: subject.updatedAt,

        groups: subject.teacherAssignments.map((assignment) => {
          return {
            group_name: assignment.group.group_name,
            course: assignment.group.course,
            teacher: `${assignment.teacher.user.last_name} ${assignment.teacher.user.first_name} ${assignment.teacher.user.middle_name}`,
          };
        }),
        // groups: subject.teacherAssignments.group.map(
        //   (group) => group.group_name
        // ),
      };

      if (!formattedSubject) {
        res.status(404).json({ error: "Subject not found" });
        return;
      }

      res.status(200).json(formattedSubject);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  // async getOne(req, res) {
  //   try {
  //     const subject = await Subject.findByPk(req.params.subject_id, {
  //       include: [
  //         {
  //           model: Teacher,
  //           as: "Teachers",
  //         },
  //         {
  //           model: Group,
  //           as: "Groups",
  //         },
  //       ],
  //     });

  //     if (!subject) {
  //       res.status(404).json({ error: "Subject not found" });
  //       return;
  //     }

  //     res.status(200).json(subject);
  //   } catch (error) {
  //     res.status(400).json({ error: error.message });
  //   }
  // }
}

module.exports = new SubjectController();
