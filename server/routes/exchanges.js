// ===== exchanges.js =====
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  sendExchangeRequest,
  respondToExchange,
  completeExchange,
  getMyExchanges,
  getExchangeById,
} = require("../controllers/exchangeController");

router.post("/", protect, sendExchangeRequest);
router.get("/", protect, getMyExchanges);
router.get("/:id", protect, getExchangeById);
router.put("/:id/respond", protect, respondToExchange);
router.put("/:id/complete", protect, completeExchange);

module.exports = router;
