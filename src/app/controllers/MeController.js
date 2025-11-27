const { mongooseToOject } = require('../../util/mongoose');
const Course = require('../models/Course');

class MeController {
  // [GET] /me/stored/courses
  async storedCourse(req, res, next) {
    try {
      let courseQuery = Course.find({});

      if (res.locals._sort.enabled) {
        courseQuery.sort({
          [res.locals._sort.column]: res.locals._sort.type,
        });
      }

      Promise.all([courseQuery, Course.countDocumentsDeleted()]).then(
        ([courses, deletedCount]) => {
          res.render('me/stored-courses', {
            deletedCount,
            courses: mongooseToOject(courses),
          });
        },
      );
    } catch (error) {
      next(error);
    }
  }

  // [GET] /me/trash/courses
  async trashCourse(req, res) {
    try {
      const courses = mongooseToOject(await Course.findDeleted());

      res.render('me/trash-courses', { courses });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MeController();
