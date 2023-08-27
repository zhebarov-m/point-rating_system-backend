const ApiError = require("../error/ApiError");
const { Rating, Student, User, Subject } = require("../models/models");

class RatingController {
  async getAll(req, res, next) {
    try {
      const { groupId, studentId } = req.query;

      const options = {
        include: [
          {
            model: Student,
            as: "student",
            include: [
              {
                model: User,
                as: "user",
              },
            ],
          },
          {
            model: Subject,
            as: "subject",
          },
        ],
      };

      if (groupId && !studentId) {
        options.where = { groupId };
      }
      if (!groupId && studentId) {
        options.where = { studentId };
      }
      if (groupId && studentId) {
        options.where = { groupId, studentId };
      }

      const ratings = await Rating.findAll(options);

      const formattedRatings = ratings.map((rating) => {
        return {
          rating_id: rating.rating_id,
          student: `${rating.student?.user.last_name} ${rating.student?.user.first_name} ${rating.student?.user.middle_name}`,
          subjectId: rating.subject.subject_id,
          subject: rating.subject.subject_name,
          semester: rating.semester,
          semester_points: rating.semester_points,
          current_attestation: rating.current_attestation,
          midterm_attestation: rating.midterm_attestation,
          bonus_scores: rating.bonus_scores,
          absences_count: rating.absences_count,
          attendance_points: rating.attendance_points,
          total_points: rating.totalPoints,
          createdAt: rating.createdAt,
          updatedAt: rating.updatedAt,
        };
      });

      return res.json(formattedRatings);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async update(req, res, next) {
    try {
      const { studentId, subjectId } = req.params; // Получаю идентификатор оценки

      const {
        semester,
        semester_points,
        current_attestation,
        midterm_attestation,
        bonus_scores,
        absences_count,
      } = req.body;
      const updatedRating = await Rating.findOne({
        where: {
          studentId: parseInt(studentId),
          subjectId: parseInt(subjectId),
        },
      });
      if (!updatedRating) {
        return next(ApiError.badRequest("Рейтинг не найден"));
      }

      // Обновляю поля оценки
      updatedRating.semester = semester;
      updatedRating.semester_points = semester_points;
      updatedRating.current_attestation = current_attestation;
      updatedRating.midterm_attestation = midterm_attestation;
      updatedRating.bonus_scores = bonus_scores;
      updatedRating.absences_count = absences_count;

      // Обновляю тут значение
      updatedRating.attendance_points = Math.floor(
        15 - absences_count * ((15 / 120) * 9.5)
      );

      await updatedRating.save(); // Сохраняю обновленные данные

      return res.json(updatedRating);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
  async gelRatingforOneGroup(req, res, next) {}
}

module.exports = new RatingController();
