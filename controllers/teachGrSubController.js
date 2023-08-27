const { Teacher, Subject, TeacherGroupSubject } = require("../models/models");

class TeacherGroupSubjectController {
  async getAll(req, res) {
    const teacherId = req.params.teacherId;
    const groupId = req.params.groupId;
    const tgs = await Teacher.findAll({
      include: [
        {
          model: Subject,
        }
      ]
    });

    // if (teacher) {
    //   const subjectsTaughtInGroup = teacher.Subjects;
    //   res.json(subjectsTaughtInGroup);
    // } else {
    //   res.status(404).json({ message: "Преподаватель не найден" });
    // }
    res.json(tgs)
  }
}

module.exports = new TeacherGroupSubjectController();
