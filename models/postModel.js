const  mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true
  },
  title: String,
  description: String,
  name: String,
  creator: String,
  photo: String,
  likes: {
    type: [String],//here we store the user ID
    default: [],
  }
},{
  timestamps: true
});


module.exports = mongoose.model('Post', postSchema)

