import Stylist from "../models/Stylist.js";
import User from "../models/User.js";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";
import bcrypt from 'bcrypt';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await Promise.all([
      User.find({}).populate("roles", "role"),
      Stylist.find({}).populate("roles", "role"),
    ]);

    const allUsers = users.flat();

    return res
    .status(200)
    .json(CreateSuccess(200, "Users fetched successfully", allUsers));
  } catch (error) {
    console.error("Error fetching all users:", error);
    return res
    .status(500)
    .json(CreateError(500, "Internal server error"));
  }
};

export const getById = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const [user, stylist] = await Promise.all([
      User.findById(userId).populate("roles", "role"),
      Stylist.findById(userId).populate("roles", "role"),
    ]);

    let foundUser = user;

    if (!foundUser) {
      foundUser = stylist;
    }

    if (!foundUser) {
      return res.status(404).json(CreateError(404, "User not found"));
    }

    return res
      .status(200)
      .json(CreateSuccess(200, "User fetched successfully", foundUser));
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return res.status(500).json(CreateError(500, "Internal server error"));
  }
};

export const updateById = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).populate("roles", "role");
    const stylist = await Stylist.findById(userId).populate("roles", "role");

    let foundUser = user;

    if (!foundUser && !stylist) {
      return res.status(404).json(CreateError(404, "User not found"));
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json(CreateError(400, "Request body is empty"));
    }

    // Encrypt the password
    const saltRounds = 10;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    req.body.password = hashedPassword;

    if (foundUser) {
      const updatedUser = await User.findOneAndUpdate({ _id: userId }, req.body, { new: true });
      return res
        .status(200)
        .json(CreateSuccess(200, "User updated successfully", updatedUser));
    } else {
      const updatedStylist = await Stylist.findOneAndUpdate({ _id: userId }, req.body, { new: true });
      return res
        .status(200)
        .json(CreateSuccess(200, "Stylist updated successfully", updatedStylist));
    }
  } catch (error) {
    console.error("Error updating user or stylist by ID:", error);
    return res.status(500).json(CreateError(500, "Internal server error"));
  }
};
