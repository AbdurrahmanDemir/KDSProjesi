const mongoose = require('mongoose');
const bcrypt= require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
      type:String,
      required: true
  }
});

UserSchema.pre('save', async function (next) {
  const user = this;

  if (!user.isModified('password')) {
    return next(); // Şifre değiştirilmediyse tekrar hashleme yapılmaz
  }

  user.password = await bcrypt.hash(user.password, 10);
  next();
});


const User = mongoose.model('User', UserSchema);
module.exports = User;
