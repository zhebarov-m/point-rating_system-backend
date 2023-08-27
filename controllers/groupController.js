const {
  Group,
  Teacher,
  Subject,
  User,
  TeacherAssignment,
} = require("../models/models");

class GroupController {
  async create(req, res) {
    const { group_name, course } = req.body;
    const group = await Group.create({ group_name, course });
    return res.json(group);
  }
  async getAll(req, res) {
    try {
      const groups = await Group.findAll({
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
                model: Subject,
                as: "subject",
                attributes: ["subject_name"],
              },
            ],
          },
        ],
      });

      const formattedGroups = groups.map((group) => {
        const assignmentsByTeacher = new Map();

        group.teacherAssignments.forEach((assignment) => {
          try {
            const teacher = assignment.teacher;

            const teacherName = `${teacher.user.last_name} ${teacher.user.first_name} ${teacher.user.middle_name}`;
            const subjectName = assignment.subject.subject_name;

            if (!assignmentsByTeacher.has(teacherName)) {
              assignmentsByTeacher.set(teacherName, []);
            }

            assignmentsByTeacher.get(teacherName).push(subjectName);
          } catch (error) {
            console.error("Error formatting assignment:", error);
            return null; // Пометим ошибочные записи нулевым значением
          }
        });

        const formattedAssignments = Array.from(
          assignmentsByTeacher,
          ([teacherName, subjects]) => ({
            teacher_name: teacherName,
            subject_name: subjects.length === 1 ? subjects[0] : subjects,
          })
        );

        const validAssignments = formattedAssignments.filter(
          (assignment) => assignment !== null
        );

        return {
          group_id: group.group_id,
          group_name: group.group_name,
          course: group.course,
          createdAt: group.createdAt,
          updatedAt: group.updatedAt,
          teachers: formattedAssignments,
        };
      });

      if (!formattedGroups) {
        res.status(404).json({ error: "No groups found" });
        return;
      }

      res.status(200).json(formattedGroups);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getOne(req, res) {
    try {
      const group = await Group.findByPk(req.params.group_id, {
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
                model: Teacher,
                as: "teacher",
                include: {
                  model: User,
                  as: "user",
                },
              },
            ],
          },
        ],
      });

      if (!group) {
        res.status(404).json({ error: "No group found" });
        return;
      }

      const assignmentsByTeacher = new Map();

      group.teacherAssignments.forEach((assignment) => {
        const teacher = assignment.teacher;
        const teacherName = `${teacher.user.last_name} ${teacher.user.first_name} ${teacher.user.middle_name}`;
        const subjectName = assignment.subject.subject_name;

        if (!assignmentsByTeacher.has(teacherName)) {
          assignmentsByTeacher.set(teacherName, []);
        }

        assignmentsByTeacher.get(teacherName).push(subjectName);
      });

      const formattedAssignments = Array.from(
        assignmentsByTeacher,
        ([teacherName, subjects]) => ({
          teacher_name: teacherName,
          subject_name: subjects.length === 1 ? subjects[0] : subjects,
        })
      );

      const formattedGroup = {
        group_id: group.group_id,
        group_name: group.group_name,
        course: group.course,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
        teachers: formattedAssignments,
      };

      res.status(200).json(formattedGroup);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async remove(req, res) {
    try {
      const groupId = req.params.group_id;
      const group = await Group.findByPk(groupId);

      if (!group) {
        res.status(404).json({ error: "Group not found" });
        return;
      }

      await group.destroy();

      res.status(204).send({
        message: "Группа успешно удалена!",
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new GroupController();
