const express = require("express");
const { Teacher, Subject, Group, TeacherSubjectGroup, TeacherAssignment } = require("../models/models"); // Подставьте ваши модели
const router = express.Router();

// Привязка к учителю предмету в определенной группе по их ID
router.post("/assign-teacher-subject-group", async (req, res) => {
  try {
    const { teacher_id, subject_id, group_id } = req.body;

    // Создание нового назначения
    const assignment = await TeacherAssignment.create({
      teacherId: teacher_id,
      subjectId: subject_id,
      groupId: group_id
    });

    res.status(200).json({ message: "Teacher is now assigned to the subject and group" });
  } catch (error) {
    res.status(400).json({ error: error.errors });
  }
});

// Привязка к предмету групп по их ID
router.post("/assign-subject-groups", async (req, res) => {
  try {
    const { subject_id, group_ids } = req.body;

    const subject = await Subject.findByPk(subject_id);
    const groups = await Group.findAll({
      where: { group_id: group_ids },
    });

    if (!subject || !groups) {
      res.status(404).json({ error: "Teacher or subject not found" });
      return;
    }

    // for (const group_id of group_ids) {
    //   const group = await Group.findByPk(group_id);

    //   if (!group) {
    //     res.status(404).json({ error: `Group with id ${group_id} not found` });
    //     return;
    //   }

    //   await TeacherGroupSubject.create({
    //     teacherId: teacher_id,
    //     subjectId: subject_id,
    //     groupId: group_id,
    //   });
    // }

    await subject.addGroups(groups);
    res
      .status(200)
      .json({ message: "Teacher is now assigned to the subjects" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Привязка к предмету групп по их ID
router.post("/assign-teacher-groups", async (req, res) => {
  try {
    const { teacher_id, group_ids } = req.body;

    const teacher = await Teacher.findByPk(teacher_id);
    const groups = await Group.findAll({
      where: { group_id: group_ids },
    });

    if (!teacher || !groups) {
      res.status(404).json({ error: "Teacher or groups not found" });
      return;
    }

    await teacher.addGroups(groups);
    res
      .status(200)
      .json({ message: "Teacher is now assigned to the subjects" });
  } catch (error) {
    res.status(400).json({ error: error.errors });
  }
});
// Получение информации о предмете, его преподавателях и группах
// router.get("/subjects", async (req, res) => {
//   try {
//     const subject = await Subject.findByPk(req.body.subject_id, {
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
// });

// // Получение предметов, которые преподает учитель
// router.get("/teachers/:teacherId/subjects", async (req, res) => {
//   try {
//     const teacher = await Teacher.findByPk(req.params.teacherId);

//     if (!teacher) {
//       res.status(404).json({ error: "Teacher not found" });
//       return;
//     }

//     const teacherSubjects = await teacher.getSubjects();
//     res.status(200).json(teacherSubjects);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // Получение предметов, принадлежащих группе
// router.get("/groups/:groupId/subjects", async (req, res) => {
//   try {
//     const group = await Group.findByPk(req.params.groupId);

//     if (!group) {
//       res.status(404).json({ error: "Group not found" });
//       return;
//     }

//     const groupSubjects = await group.getSubjects();
//     res.status(200).json(groupSubjects);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

module.exports = router;
