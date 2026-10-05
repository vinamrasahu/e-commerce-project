import Slider from "../models/Slider.js";

// Get All
export const getSliders = async (req, res) => {
  try {
    const sliders = await Slider.find().sort({ order: 1 });

    res.json(sliders);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get Single
export const getSlider = async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);

    if (!slider) {
      return res.status(404).json({
        message: "Slider not found",
      });
    }

    res.json(slider);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Create
export const createSlider = async (req, res) => {
  try {
    const slider = await Slider.create(req.body);

    res.status(201).json(slider);
  } catch (err) {
    console.error(err);   // 👈 Add this

    res.status(500).json({
      message: err.message,
    });
  }
};

// Update
export const updateSlider = async (req, res) => {
  try {
    const slider = await Slider.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.json(slider);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Delete
export const deleteSlider = async (req, res) => {
  try {
    await Slider.findByIdAndDelete(req.params.id);

    res.json({
      message: "Slider Deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};