const express = require("express");
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const verifyToken = require("../middleware/verify-token");

const router = express.Router();

// Create Booking
router.post("/", verifyToken, async (req, res) => {
  try {
    const db = getDB();
    const { studioId, date, startTime, endTime } = req.body;

    if (!ObjectId.isValid(studioId) || !date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid booking information",
      });
    }

    if (endTime <= startTime) {
      return res.status(400).json({
        success: false,
        message: "End time must be later than start time",
      });
    }

    const studio = await db.collection("studios").findOne({
      _id: new ObjectId(studioId),
    });

    if (!studio) {
      return res.status(404).json({
        success: false,
        message: "Studio not found",
      });
    }

    if (studio.hostEmail === req.user.email) {
      return res.status(400).json({
        success: false,
        message: "You cannot book your own studio",
      });
    }

    const booking = {
      studioId,
      studioTitle: studio.title,
      studioImage: studio.image,
      hostEmail: studio.hostEmail,
      customerEmail: req.user.email,
      date,
      startTime,
      endTime,
      hourlyRate: studio.hourlyRate,
      status: "Pending",
      createdAt: new Date(),
    };

    const result = await db.collection("bookings").insertOne(booking);

    res.status(201).json({
      success: true,
      message: "Booking request submitted successfully",
      bookingId: result.insertedId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get Customer Bookings
router.get("/my-bookings", verifyToken, async (req, res) => {
  try {
    const bookings = await getDB()
      .collection("bookings")
      .find({ customerEmail: req.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Host Bookings
router.get("/host-bookings", verifyToken, async (req, res) => {
  try {
    const db = getDB();

    const studios = await db
      .collection("studios")
      .find({ hostEmail: req.user.email })
      .project({ _id: 1 })
      .toArray();

    const studioIds = studios.map((studio) => studio._id.toString());

    const bookings = await db
      .collection("bookings")
      .find({ studioId: { $in: studioIds } })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Host Updates Booking Status
router.patch("/:id/status", verifyToken, async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const { status } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    if (!["Confirmed", "Cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
    }

    const booking = await db.collection("bookings").findOne({
      _id: new ObjectId(id),
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const studio = await db.collection("studios").findOne({
      _id: new ObjectId(booking.studioId),
      hostEmail: req.user.email,
    });

    if (!studio) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to manage this booking",
      });
    }

    if (booking.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending bookings can be updated",
      });
    }

    if (status === "Confirmed") {
      const conflict = await db.collection("bookings").findOne({
        _id: { $ne: booking._id },
        studioId: booking.studioId,
        date: booking.date,
        status: "Confirmed",
        startTime: { $lt: booking.endTime },
        endTime: { $gt: booking.startTime },
      });

      if (conflict) {
        return res.status(409).json({
          success: false,
          message: "This time slot is already confirmed for another booking",
        });
      }
    }

    await db.collection("bookings").updateOne(
      { _id: booking._id },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      },
    );

    res.json({
      success: true,
      message: `Booking ${status.toLowerCase()} successfully`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Customer Cancels Pending Booking
router.patch("/:id/cancel", verifyToken, async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const result = await getDB()
      .collection("bookings")
      .updateOne(
        {
          _id: new ObjectId(req.params.id),
          customerEmail: req.user.email,
          status: "Pending",
        },
        {
          $set: {
            status: "Cancelled",
            updatedAt: new Date(),
          },
        },
      );

    if (!result.matchedCount) {
      return res.status(404).json({
        success: false,
        message: "Pending booking not found",
      });
    }

    res.json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
