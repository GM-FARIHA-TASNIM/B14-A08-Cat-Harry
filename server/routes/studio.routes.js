const express = require("express");
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const verifyToken = require("../middleware/verify-token");

const router = express.Router();

const validateStudio = (data) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return "Invalid studio information";
  }

  const {
    title,
    category,
    hourlyRate,
    securityDeposit,
    capacity,
    location,
    image,
    description,
    amenities,
  } = data;

  if (
    typeof title !== "string" ||
    !title.trim() ||
    title.trim().length > 100 ||
    typeof category !== "string" ||
    !category.trim() ||
    category.trim().length > 50 ||
    typeof location !== "string" ||
    !location.trim() ||
    location.trim().length > 200 ||
    typeof image !== "string" ||
    !image.trim() ||
    image.trim().length > 2048 ||
    typeof description !== "string" ||
    !description.trim() ||
    description.trim().length > 2000
  ) {
    return "Please provide valid studio information";
  }

  try {
    const imageURL = new URL(image.trim());

    if (!["http:", "https:"].includes(imageURL.protocol)) {
      return "Please provide a valid image URL";
    }
  } catch {
    return "Please provide a valid image URL";
  }

  const rate = Number(hourlyRate);
  const deposit = Number(securityDeposit ?? 0);
  const maxCapacity = Number(capacity);

  if (!Number.isFinite(rate) || rate <= 0) {
    return "Hourly rate must be a positive number";
  }

  if (!Number.isFinite(deposit) || deposit < 0) {
    return "Security deposit cannot be negative";
  }

  if (!Number.isSafeInteger(maxCapacity) || maxCapacity <= 0) {
    return "Capacity must be a positive whole number";
  }

  if (
    amenities !== undefined &&
    (!Array.isArray(amenities) ||
      amenities.length > 30 ||
      !amenities.every(
        (item) =>
          typeof item === "string" &&
          item.trim().length > 0 &&
          item.trim().length <= 50,
      ))
  ) {
    return "Amenities must be a valid list of text values";
  }

  return null;
};

// Get all studios
router.get("/", async (req, res) => {
  try {
    const studios = await getDB()
      .collection("studios")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json({
      success: true,
      total: studios.length,
      studios,
    });
  } catch (error) {
    console.error("Fetch studios error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch studios",
    });
  }
});

// Get single studio
router.get("/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid studio ID",
      });
    }

    const studio = await getDB()
      .collection("studios")
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!studio) {
      return res.status(404).json({
        success: false,
        message: "Studio not found",
      });
    }

    return res.status(200).json({
      success: true,
      studio,
    });
  } catch (error) {
    console.error("Fetch studio error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch studio",
    });
  }
});

// Add new studio
router.post("/", verifyToken, async (req, res) => {
  try {
    const validationError = validateStudio(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const {
      title,
      category,
      hourlyRate,
      securityDeposit,
      capacity,
      location,
      image,
      amenities,
      description,
    } = req.body;

    const studioData = {
      title: title.trim(),
      category: category.trim(),
      hourlyRate: Number(hourlyRate),
      securityDeposit: Number(securityDeposit ?? 0),
      capacity: Number(capacity),
      location: location.trim(),
      image: image.trim(),
      amenities: amenities || [],
      description: description.trim(),
      rating: 0,
      hostEmail: req.user.email,
      hostId: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await getDB().collection("studios").insertOne(studioData);

    return res.status(201).json({
      success: true,
      message: "Studio created successfully",
      studioId: result.insertedId,
    });
  } catch (error) {
    console.error("Add studio error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create studio",
    });
  }
});

// Update studio
router.put("/:id", verifyToken, async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid studio ID",
      });
    }

    const validationError = validateStudio(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const {
      title,
      category,
      hourlyRate,
      securityDeposit,
      capacity,
      location,
      image,
      amenities,
      description,
    } = req.body;

    const updates = {
      title: title.trim(),
      category: category.trim(),
      hourlyRate: Number(hourlyRate),
      securityDeposit: Number(securityDeposit ?? 0),
      capacity: Number(capacity),
      location: location.trim(),
      image: image.trim(),
      amenities: amenities || [],
      description: description.trim(),
      updatedAt: new Date(),
    };

    const result = await getDB()
      .collection("studios")
      .updateOne(
        {
          _id: new ObjectId(req.params.id),
          hostEmail: req.user.email,
        },
        { $set: updates },
      );

    if (!result.matchedCount) {
      return res.status(404).json({
        success: false,
        message: "Studio not found or access denied",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Studio updated successfully",
    });
  } catch (error) {
    console.error("Update studio error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update studio",
    });
  }
});

// Delete studio
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid studio ID",
      });
    }

    const result = await getDB()
      .collection("studios")
      .deleteOne({
        _id: new ObjectId(req.params.id),
        hostEmail: req.user.email,
      });

    if (!result.deletedCount) {
      return res.status(404).json({
        success: false,
        message: "Studio not found or access denied",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Studio deleted successfully",
    });
  } catch (error) {
    console.error("Delete studio error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete studio",
    });
  }
});

module.exports = router;
