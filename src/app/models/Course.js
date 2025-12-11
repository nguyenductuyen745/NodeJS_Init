const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const CourseSchema = new Schema(
  {
    _id: { type: Number },
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    videoId: { type: String, required: true },
    level: { type: String },
    slug: { type: String, slug: 'name', unique: true },
  },
  { _id: false, timestamps: true },
);

// Custom query helpers
CourseSchema.query.sortable = function (req) {
  if ('_sort' in req.query) {
    const isValidType = ['asc', 'desc'].includes(req.query.type);

    this.sort({
      [req.query.column]: isValidType ? req.query.type : 'desc',
    });
  }
  return this;
};

// Plugin
mongoose.plugin(slug);
CourseSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});

module.exports = mongoose.model('Course', CourseSchema);
