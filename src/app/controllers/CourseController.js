const { message } = require('statuses');
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
  async store(req, res, next) {
    req.body.image = `https://i.ytimg.com/vi/${req.body.videoId}/sddefault.jpg`;

    const course = new Course(req.body);

    try {
      await course.save();
      res.redirect('/me/stored/courses');
    } catch (error) {
      next(error);
    }
  }

  // [GET] /course/edit
  async edit(req, res, next) {
    try {
      const course = mongooseToOject(await Course.findById(req.params.id));

      res.render('courses/edit', { course });
    } catch (error) {
      next(error);
    }
  }

  // [PUT] /course/:id
  async update(req, res, next) {
    const currentCourse = req.body;

    if (currentCourse.videoId) {
      currentCourse.image = `https://i.ytimg.com/vi/${req.body.videoId}/sddefault.jpg`;
    }

    try {
      await Course.updateOne({ _id: req.params.id }, currentCourse);
      res.redirect('/me/stored/courses');
    } catch (error) {
      next(error);
    }
  }

  // [DELETE] /course/:id
  async delete(req, res, next) {
    try {
      await Course.delete({ _id: req.params.id });
      res.redirect('/me/stored/courses');
    } catch (error) {
      next(error);
    }
  }

  // [DELETE] /course/:id/force
  async forceDelete(req, res, next) {
    try {
      await Course.deleteOne({ _id: req.params.id });
      res.redirect('/me/stored/courses');
    } catch (error) {
      next(error);
    }
  }

  // [PATCH] /course/:id/restore
  async restore(req, res, next) {
    try {
      const course = await Course.findOneDeleted({ _id: req.params.id });
      await course.restore(); // instance method
      res.redirect('/me/stored/courses');
    } catch (error) {
      next(error);
    }
  }

  // [PATCH] /course/handle-form-actions
  async handleFormActions(req, res, next) {
    switch (req.body.action) {
      case 'delete':
        await Course.delete({ _id: { $in: req.body.courseIds } });
        break;
      case 'restore':
        await Course.restore({
          _id: { $in: req.body.courseIds },
        });
        await Course.updateMany(
          { _id: req.body.courseIds },
          { deleted: false },
        );
        break;
      case 'force-delete':
        await Course.deleteMany({ _id: req.body.courseIds });
        break;
      default:
        return res.json({ message: 'Action is invalid' });
    }

    res.redirect('/me/stored/courses');
  }
}
module.exports = new CourseController();
