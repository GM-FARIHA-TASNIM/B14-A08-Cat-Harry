const express = require("express");
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const verifyToken = require("../middleware/verify-token");

const router = express.Router();

// Get all studios
router.get("/", async (req, res) => {
  try {
    const db = getDB();

    const studios = await db
      .collection("studios")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      total: studios.length,
      studios,
    });
  } catch (error) {
    res.status(500).json({
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

    const db = getDB();

    const studio = await db.collection("studios").findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!studio) {
      return res.status(404).json({
        success: false,
        message: "Studio not found",
      });
    }

    res.status(200).json({ success: true, studio });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch studio",
    });
  }
});

// Add new studio
router.post("/", verifyToken, async (req, res) => {
  try {
    const db = getDB();

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

    if (
      !title ||
      !category ||
      !hourlyRate ||
      !capacity ||
      !location ||
      !image ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields",
      });
    }

    const studioData = {
      title,
      category,
      hourlyRate: Number(hourlyRate),
      securityDeposit: Number(securityDeposit || 0),
      capacity: Number(capacity),
      location,
      image,
      amenities: Array.isArray(amenities) ? amenities : [],
      description,
      rating: 0,
      hostEmail: req.user.email,
      hostId: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("studios").insertOne(studioData);

    res.status(201).json({
      success: true,
      message: "Studio created successfully",
      studioId: result.insertedId,
    });
  } catch (error) {
    console.error("Add studio error:", error.message);

    res.status(500).json({
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

    const db = getDB();
    const { _id, hostEmail, hostId, createdAt, ...updates } = req.body;

    const result = await db.collection("studios").updateOne(
      {
        _id: new ObjectId(req.params.id),
        hostEmail: req.user.email,
      },
      {
        $set: {
          ...updates,
          hourlyRate: Number(updates.hourlyRate),
          securityDeposit: Number(updates.securityDeposit || 0),
          capacity: Number(updates.capacity),
          updatedAt: new Date(),
        },
      },
    );

    if (!result.matchedCount) {
      return res.status(404).json({
        success: false,
        message: "Studio not found or access denied",
      });
    }

    res.status(200).json({
      success: true,
      message: "Studio updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
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

    const db = getDB();

    const result = await db.collection("studios").deleteOne({
      _id: new ObjectId(req.params.id),
      hostEmail: req.user.email,
    });

    if (!result.deletedCount) {
      return res.status(404).json({
        success: false,
        message: "Studio not found or access denied",
      });
    }

    res.status(200).json({
      success: true,
      message: "Studio deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete studio",
    });
  }
});

module.exports = router;
