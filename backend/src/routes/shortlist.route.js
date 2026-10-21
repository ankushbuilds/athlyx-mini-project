const express = require("express");
const router = express.Router();

const {
  addToShortlist,
  getShortlist,
  removeFromShortlist,
} = require("../controllers/shortlist.controller");

const protect = require("../middleware/auth.middleware");

const scoutOnly = (req, res, next) => {
  if (req.user?.role !== "scout") {
    return res.status(403).json({
      message: "Only scouts can manage their shortlist",
    });
  }

  next();
};

router.use(protect, scoutOnly);

router.get("/", getShortlist);
router.post("/:athleteId", addToShortlist);
router.delete("/:athleteId", removeFromShortlist);

module.exports = router;