const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    unique: true,
    sparse: true // Allow null values but unique when present
  },
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String
  },
  description: {
    type: String
  },
  img: {
    type: String
  },
  imgTitle: {
    type: String
  },
  imgSm: {
    type: String
  },
  imgtitle: {
    type: String
  },
  imgSmall: {
    type: String
  },
  trailer: {
    type: String
  },
  video: {
    type: String
  },
  year: {
    type: String
  },
  limit: {
    type: Number
  },
  genre: {
    type: String
  },
  isSeries: {
    type: Boolean,
    default: false
  },
}, {timestamps: true});

module.exports = mongoose.model('Movie', MovieSchema);
