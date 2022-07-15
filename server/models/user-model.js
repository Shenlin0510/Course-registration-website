const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 100,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 1024,
  },
  role: {
    type: String,
    enum: ["student", "instructor", "admin"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//用戶是否為學生
userSchema.methods.isStudent = function () {
  return this.role == "student";
};
//用戶是否為講師
userSchema.methods.isIntructors = function () {
  return this.role == "instructor";
};

//管理者
userSchema.methods.isAdmin = function () {
  return this.role == "admin";
};

//mongoose schema middleware
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  } else {
    return next();
  }
});

//比較使用者登入的密碼及資料庫中hash過後的密碼
//isMatch會回傳 Ｔrue or false
userSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) {
      return cb(err, isMatch);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", userSchema);
