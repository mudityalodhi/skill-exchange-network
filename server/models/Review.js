const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exchange: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exchange",
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    skillTaught: {
      type: String,
      default: "",
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// One review per exchange per reviewer
reviewSchema.index({ reviewer: 1, exchange: 1 }, { unique: true });

// After saving review, update user's average rating
reviewSchema.post("save", async function () {
  const User = mongoose.model("User");
  const user = await User.findById(this.reviewee);
  if (user) await user.updateRating();
});

module.exports = mongoose.model("Review", reviewSchema);
