const express = require("express");
const router = express.Router();

let obj = {};

router.get('/summary', (req, res) => {
  obj = {
      title: "Summary",
  };
  res.render('summary.ejs', obj)
});

module.exports = router;
