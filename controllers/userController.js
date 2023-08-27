const {
  User,
  Student,
  Group,
  Rating,
  Subject,
  Teacher,
} = require("../models/models");
const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateJwt = (tokenPayload) => {
  return jwt.sign(tokenPayload, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class UserController {
  async registration(req, res, next) {
    const { email, password, first_name, last_name, middle_name, role, group } =
      req.body;
    if (!email || !password) {
      return next(ApiError.badRequest("Некорректный email или password"));
    }
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return next(ApiError.badRequest("Пользователь с таким email уже есть"));
    }
    const hashPassword = await bcrypt.hash(password, 5);

    let user;
    if (role === "TEACHER") {
      user = await User.create({
        email,
        password: hashPassword,
        first_name,
        last_name,
        middle_name,
        role,
      });

      const teacher = await Teacher.create({
        user_id: user.user_id,
        // Другие поля учителя
      });

      // Добавляем связь со учителем
      await user.setTeacher(teacher);
    } else if (role === "STUDENT") {
      if (!group) {
        return next(ApiError.badRequest("Не указана группа для студента"));
      }
      console.log('ЧИСЛО ЛИ ЭТО????',typeof group);
      if (typeof group !== "number") {
        return next(ApiError.badRequest("Нужно указать числовой ID группы"));
      }
      const groupInstance = await Group.findOne({
        where: { group_id: group },
      });
      if (!groupInstance) {
        return next(ApiError.badRequest("Группа не найдена"));
      }

      user = await User.create({
        email,
        password: hashPassword,
        first_name,
        last_name,
        middle_name,
        role,
        group,
      });

      const student = await Student.create({
        userId: user.user_id,
        groupId: user.group,
        // Другие поля студента
      });

      // Добавляем связь со студентом
      await user.setStudent(student);
      // const subjects = await Promise.all(
      //   subjectsId.map(async (subjectId) => {
      //     const subject = await Subject.findByPk(subjectId);
      //     if (!subject) {
      //       console.log(`Предмет с ID ${subjectId} не найден`);
      //       return next(ApiError.badRequest("Предмет не найден"));
      //     }
      //     console.log(`Создание рейтинга для предмета с ID ${subjectId}`);
      //     await Rating.create({
      //       semester: 1,
      //       groupId: groupInstance.group_id,
      //       studentId: student.student_id,
      //       subjectId: subject.subject_id,
      //     });
      //     return subject;
      //   })
      // );
    } else if (role === "ADMIN") {
      user = await User.create({
        email,
        password: hashPassword,
        first_name,
        last_name,
        middle_name,
        role,
      });
    } else {
      return next(ApiError.badRequest("Некорректная роль пользователя"));
    }

    const token = generateJwt({
      user_id: user.user_id,
      email: email,
      role: role,
    });

    return res.json({ token });
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return next(ApiError.internal("Пользователь не найден"));
    }

    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.internal("Указан неверный пароль"));
    }
    const token = generateJwt({
      user_id: user.user_id,
      email: user.email,
      role: user.role,
    });
    return res.json({ token });
  }
  async getAll(req, res, next) {
    const users = await User.findAll();
    res.json(users);
  }
  async check(req, res, next) {
    res.json({ message: "COOL" });
  }

  async remove(req, res, next) {
    try {
      const user_id = req.params.user_id;

      const user = await User.findByPk(user_id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.role === "TEACHER") {
        const userId = req.params.user_id;
        const teacher = await Teacher.findOne({ where: { userId } });
        if (teacher) {
          await teacher.destroy();
        }
      }

      if (user.role === "STUDENT") {
        const userId = req.params.user_id;
        const student = await Student.findOne({ where: { userId } });
        if (student) {
          await student.destroy();
        }
      }

      await user.destroy();

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = new UserController();
