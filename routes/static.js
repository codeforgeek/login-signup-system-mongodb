const express = require("express");
const app = express();
const router = express.Router();

// static routes

router.get("/", (req, res) => {
  if (req.session.user) {
    return res.redirect("/home");
  }
  res.render("index.html");
});

router.get("/home", function (req, res) {
  if (req.session.user) {
    return res.render("home.html", { name: req.session.user.name });
  }
  res.redirect("/");
});

module.exports = router;
