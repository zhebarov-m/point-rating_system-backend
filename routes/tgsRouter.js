const express = require("express");
const {
  Teacher,
  Subject,
  Group,
  TeacherGroupSubject,
} = require("../models/models"); // Подставьте ваши модели
const router = express.Router();

// Привязка учителя к предмету и группе по их ID
router.post("/assign", async (req, res) => {
  try {
    const { teacher_id, subject_id, group_ids } = req.body;

    console.log("Запрос с клиента:", { teacher_id, subject_id, group_ids });
    const teacher = await Teacher.findByPk(teacher_id);
    const subject = await Subject.findByPk(subject_id);


    if (!teacher || !subject) {
      res.status(404).json({ error: "Teacher or subject not found" });
      return;
    }

    for (const group_id of group_ids) {
      const group = await Group.findByPk(group_id);
      
      if (!group) {
        res.status(404).json({ error: `Group with id ${group_id} not found` });
        return;
      }

      await TeacherGroupSubject.create({
        teacherId: teacher_id,
        subjectId: subject_id,
        groupId: group_id,
      });
    }

    res
      .status(200)
      .json({ message: "Teacher is now assigned to the subject and group" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Получение предметов, которые преподает учитель
router.get("/teachers/:teacherId/subjects", async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.teacherId);

    if (!teacher) {
      res.status(404).json({ error: "Teacher not found" });
      return;
    }

    const teacherSubjects = await teacher.getSubjects();
    res.status(200).json(teacherSubjects);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Получение предметов, принадлежащих группе
router.get("/groups/:groupId/subjects", async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.groupId);

    if (!group) {
      res.status(404).json({ error: "Group not found" });
      return;
    }

    const groupSubjects = await group.getSubjects();
    res.status(200).json(groupSubjects);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
