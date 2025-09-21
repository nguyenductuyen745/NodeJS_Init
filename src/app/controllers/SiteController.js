const { mongooseToOject } = require('../../util/mongoose');
const Course = require('../models/Course');

class SiteController {
  // [GET] /
  async index(req, res, next) {
    try {
      const courses = mongooseToOject(await Course.find({}));

      res.render('home', {
        courses,
      });
    } catch (error) {
      next(error);
    }
  }

  // [GET] /search
  search(req, res) {
    res.send('search');
  }
}

module.exports = new SiteController();
