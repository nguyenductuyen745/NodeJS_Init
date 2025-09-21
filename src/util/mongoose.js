mongooseToOject = (mongooses) => {
  if (!mongooses) return mongooses;

  if (Array.isArray(mongooses)) {
    return mongooses.map((mongoose) => mongoose.toObject());
  } else {
    return mongooses.toObject();
  }
};

module.exports = {
  mongooseToOject,
};
