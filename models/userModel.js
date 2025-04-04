const mongoose = require('mongoose');
const bcrypt =require('bcrypt')

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

userSchema.pre('save',async function (next) {
  if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password,10);
  }
  next();
});

userSchema.methods.comparePassword = async function (canditatePassword) {
  return await bcrypt.compare(canditatePassword,this.password);
}

const User = mongoose.model('User', userSchema);


module.exports = User;
