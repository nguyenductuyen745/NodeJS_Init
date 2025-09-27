const { mongooseToOject } = require('../../util/mongoose');
const Course = require('../models/Course');

class CourseController {
  // [GET] /course/:slug
  async show(req, res) {
    const slug = req.params['slug'];
    const course = mongooseToOject(await Course.findOne({ slug }));

    if (course) {
      res.render('courses/show', { course });
    } else {
      res.status(404).send('Not found !!!');
    }
  }

  // [GET] /course/create
  create(req, res) {
    res.render('courses/create');
  }

  // [POST] /course/store
  store(req, res, next) {
    const newCourse = req.body;
    newCourse.image = `https://i.ytimg.com/vi/${req.body.videoId}/sddefault.jpg`;

    Course.create(newCourse).then(() => {
      res.redirect('/');
    });
  }
}
module.exports = new CourseController();
