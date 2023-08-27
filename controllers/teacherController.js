const { model } = require("../db");
const {
  Teacher,
  User,
  Subject,
  TeacherAssignment,
  Group,
} = require("../models/models");

class TeacherController {
  async create(req, res) {}

  async getAll(req, res) {
    try {
      const teachers = await Teacher.findAll({
        include: [
          {
            model: TeacherAssignment,
            as: "teacherAssignments",
            include: [
              {
                model: Subject,
                as: "subject",
              },
              {
                model: Group,
                as: "group",
              },
            ],
          },
          {
            model: User,
            as: "user",
            attributes: ["first_name", "last_name", "middle_name"],
          },
        ],
      });

      const formattedTeachers = teachers.map((teacher) => {
        const formattedSubjects = {};
        
        teacher.teacherAssignments.forEach((assignment) => {
          try {
            const subjectName = assignment.subject.subject_name;
            const groupInfo = assignment.group.group_name
    
            if (!formattedSubjects[subjectName]) {
              formattedSubjects[subjectName] = {
                subject_name: subjectName,
                assigned_groups: [],
              };
            }
    
            formattedSubjects[subjectName].assigned_groups.push(groupInfo);
          } catch (error) {
            console.error("Error formatting assignment:", error);
            return null; 
          }
        });
  
        const validSubjects = Object.values(formattedSubjects).filter(
          (subject) => subject !== null
        );

        return {
          teacher_id: teacher.teacher_id,
          first_name: teacher.user?.first_name,
          last_name: teacher.user?.last_name,
          middle_name: teacher.user?.middle_name,
          subjects: validSubjects,
        };
      });

      return res.json(formattedTeachers);
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
      return res.status(500).json({ message: error.message });
    }
  }

  async getOne(req, res) {
    try {
      const teacher = await Teacher.findByPk(req.params.teacher_id, {
        include: [
          {
            model: TeacherAssignment,
            as: "teacherAssignments",
            include: [
              {
                model: Subject,
                as: "subject",
              },
              {
                model: Group,
                as: "group",
              },
            ],
          },
          {
            model: User,
            as: "user",
            attributes: ["first_name", "last_name", "middle_name"],
          },
        ],
      });

      const formattedTeachers = () => {
        const formattedSubjects = {};
        
        teacher.teacherAssignments.forEach((assignment) => {
          const subjectName = assignment.subject.subject_name;
          const groupInfo = assignment.group.group_name
  
          if (!formattedSubjects[subjectName]) {
            formattedSubjects[subjectName] = {
              subject_name: subjectName,
              assigned_groups: [],
            };
          }
  
          formattedSubjects[subjectName].assigned_groups.push(groupInfo);
        });
  
        return {
          teacher_id: teacher.teacher_id,
          first_name: teacher.user?.first_name,
          last_name: teacher.user?.last_name,
          middle_name: teacher.user?.middle_name,
          subjects: Object.values(formattedSubjects),
        };
      }

      return res.json(formattedTeachers());
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
      return res.status(500).json({ message: error.message });
    }
  }
}
module.exports = new TeacherController();
