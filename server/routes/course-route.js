const router = require("express").Router();
const Course = require("../models").courseModel;
const courseValidation = require("../validation").courseValidation;

router.use((req, res, next) => {
  console.log("A request is coming into API");
  next();
});

router.get("/", (req, res) => {
  Course.find({})
    .populate("instructor", ["username", "email"])
    .then((course) => {
      res.send(course);
    })
    .catch(() => {
      res.status(500).send("Error Cannot get course!!");
    });
});
//根據講師id找到課程
router.get("/instructor/:_instructor_id", (req, res) => {
  let { _instructor_id } = req.params;
  Course.find({ instructor: _instructor_id })
    .populate("instructor", ["username", "email"])
    .then((d) => {
      res.send(d);
    })
    .catch(() => {
      res.status(500).send("Cannot get Course data.");
    });
});

router.get("/student/:_student_id", (req, res) => {
  let { _student_id } = req.params;
  Course.find({ students: _student_id })
    .populate("instructor", ["username", "email"])
    .then((d) => {
      res.send(d);
    })
    .catch(() => {
      res.status(500).send("Cannot get data.");
    });
});

router.get("/:_id", (req, res) => {
  let { _id } = req.params;
  Course.findOne({ _id })
    .populate("instructor", ["email"])
    .then((course) => {
      res.send(course);
    })
    .catch((e) => {
      res.send(e);
    });
});

router.get("/findByName/:name", (req, res) => {
  let { name } = req.params;
  Course.find({ title: name })
    .populate("instructor", ["username", "email"])
    .then((course) => {
      res.send(course);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post("/enroll/:_id", async (req, res) => {
  let { _id } = req.params;
  let { user_id } = req.body;
  try {
    let course = await Course.findOne({ _id });
    course.students.push(user_id);
    await course.save();
    res.sendFile("Done Enrollment");
  } catch (err) {
    res.send(err);
  }
});

router.post("/", async (req, res) => {
  //validate the inputs before making new a course
  const { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { title, description, price } = req.body;
  if (req.user.isStudent()) {
    return res.status(400).send("Only instructor can post a new course");
  }
  let newCourse = new Course({
    title,
    description,
    price,
    instructor: req.user._id,
  });

  try {
    await newCourse.save();
    res.status(200).send("New course has been saved.");
  } catch (err) {
    res.status(400).send("Cannot save a course");
  }
});

//update course
router.patch("/:_id", async (req, res) => {
  //validate the inputs before making new a course
  const { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { _id } = req.params;
  const course = await Course.findOne({ _id });
  if (!course) {
    res.status(400).send("Course is not found");
  }
  if (course.instructor.equals(req.user._id) || req.user.isAdmin()) {
    Course.findOneAndUpdate({ _id }, req.body, {
      new: true,
      runValidators: true,
    })
      .then(() => {
        res.send("Course is update");
      })
      .catch((e) => {
        res.send(e);
      });
  } else {
    res.status(403);
    return res.json({
      success: false,
      message: "Only instructor and admin can update!!",
    });
  }
});

router.delete("/:_id", async (req, res) => {
  const { _id } = req.params;
  const course = await Course.findOne({ _id });
  if (!course) {
    res.status(400).send("Course is not found");
  }
  if (course.instructor.equals(req.user._id) || req.user.isAdmin()) {
    Course.deleteOne({ _id })
      .then(() => {
        res.send("Course is delete");
      })
      .catch((e) => {
        res.send(e);
      });
  } else {
    res.status(403);
    return res.json({
      success: false,
      message: "Only instructor and admin can delete!!",
    });
  }
});

module.exports = router;
