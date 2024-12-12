import Role from "../models/Role.js";
import User from "../models/User.js";
import Stylist from "../models/Stylist.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";
import UserToken from "../models/UserToken.js";

export const registerUser = async (req, res, next) => {
  try {
    // 1. Fetch User Role
    const userRole = await getRoleByName("User");

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // 3. Create New User Object
    const newUser = new User({
      fullName: req.body.fullName || "",
      about: req.body.about || "",
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
      profileImage: req.body.profileImage,
      bodyweight: req.body.bodyweight,
      height: req.body.height,
      isAdmin: req.body.isAdmin,
      roles: [userRole._id], // Assign role ID
    });

    // 4. Save New User to Database
    await newUser.save();

    // 5. Send Success Response
    return next(CreateSuccess(200, "User Registered Successfully!"));
  } catch (error) {
    console.error("Error during user registration:", error); // Log the error
    if (error.name === "ValidationError") {
      return next(CreateError(400, error.message));
    }
    return next(CreateError(500, "Internal server error"));
  }
};

export const registerStylist = async (req, res, next) => {
  try {
    // 1. Fetch Stylist Role
    const stylistRole = await getRoleByName("Stylist");

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // 3. Create New Stylist Object
    const newStylist = new Stylist({
      fullName: req.body.fullName || "", // Default to empty string if not provided
      about: req.body.about || "", // Default to empty string if not provided
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
      profileImage: req.body.profileImage,
      isAdmin: req.body.isAdmin,
      roles: [stylistRole._id], // Assign role ID
    });

    // 4. Save New Stylist to Database
    await newStylist.save();

    // 5. Send Success Response
    return next(CreateSuccess(200, "Stylist Registered Successfully!"));
  } catch (error) {
    console.error("Error during user registration:", error); // Log the error
    if (error.name === "ValidationError") {
      return next(CreateError(400, error.message));
    }
    return next(CreateError(500, "Internal server error"));
  }
};

// Example getRoleByName function
async function getRoleByName(roleName) {
  try {
    const role = await Role.findOne({ role: roleName });
    if (!role) {
      throw new Error(`Role '${roleName}' not found`);
    }
    return role;
  } catch (error) {
    throw error; // Re-throw error to be handled by the calling function
  }
}

export const registerAdmin = async (req, res, next) => {
  const role = await Role.find({});
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  const newStylist = new Stylist({
    // fullName: req.body.fullName, // Include if you have a fullName field
    username: req.body.username,
    email: req.body.email,
    password: hashPassword,
    profileImage: req.body.profileImage,
    isAdmin: true,
    roles: role,
  });
  await newStylist.save();
  return next(CreateSuccess(200, "Admin Registered Successfully!"));
};

export const login = async (req, res, next) => {
  try {
    let user;

    // Check if the user is a Stylist
    user = await Stylist.findOne({ email: req.body.email }).populate(
      "roles",
      "role"
    );

    if (!user) {
      // If the user is not a Stylist, check if the user is a User
      user = await User.findOne({ email: req.body.email }).populate(
        "roles",
        "role"
      );
    }

    if (!user) {
      return next(CreateError(404, "User not found"));
    }

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect) {
      return next(CreateError(400, "Password is Incorrect"));
    }

    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
        roles: user.roles.map((role) => role.role), // Extract role names
      },
      process.env.JWT_SECRET
    );

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({
        status: 200,
        message: "Login Successfully!",
        data: {
          userType: user.roles.some((role) => role.role === "Stylist")
            ? "Stylist"
            : "User", // Determine user type based on roles
          user: user,
        },
      });
  } catch (error) {
    // Only return the error response when necessary
    return next(CreateError(500, "Something Went wrong"));
  }
};

export const sendEmail = async (req, res, next) => {
  const email = req.body.email;
  const user = await User.findOne({
    email: { $regex: "^" + email + "$", $options: "i" },
  });
  if (!user) {
    return next(CreateError(404, "User not found to reset the email"));
  }
  const payload = {
    email: user.email,
  };
  const expiryTime = 300;
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiryTime,
  });

  const newToken = new UserToken({
    userId: user._id,
    token: token,
  });

  const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "praisodavid@gmail.com",
      pass: "qrotxeyebfimztih",
    },
  });

  let mailDetails = {
    from: "praisodavid@gmail.com",
    to: email,
    subject: "Reset Password",
    html: `
    <html>
    <head>
      <title>Password Reset Request</title>
    </head>
    <body>
      <h1>Password Reset Request</h1>
      <p>Dear ${user.username},</p>
      <p>We have received a request to reset your password for your account with BookMYBook. To complete the password reset process, please click on the button below:</p>
      <a href=${process.env.LIVE_URL}/reset/${token}><button style="background-color: #4CAF50; color: white; padding: 14px 20px; border: none;
        cursor: pointer; border-radius: 4px;">Reset Password</button></a>
      <p>Please note that this link is only valid for a 5mins. If you did not request a password reset, please disregard this message.</p>
      <p>Thank you,</p>
      <p>Let's Program Team</p>
    </body>
    </html>
    `,
  };
  mailTransporter.sendMail(mailDetails, async (err, data) => {
    if (err) {
      console.log(err);
      return next(
        CreateError(500, "Something went wrong while sending the email")
      );
    } else {
      await newToken.save();
      return next(CreateSuccess(200, "Email Sent Successfully!"));
    }
  });
};

export const resetPassword = (req, res, next) => {
  const token = req.body.token;
  const newPassword = req.body.password;

  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      return next(CreateError(500, "Reset Link is Expired!"));
    } else {
      const response = data;
      const user = await User.findOne({
        email: { $regex: "^" + response.email + "$", $options: "i" },
      });
      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(newPassword, salt);
      user.password = encryptedPassword;
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $set: user },
          { new: true }
        );
        return next(CreateSuccess(200, "Password Reset Success!"));
      } catch (error) {
        return next(
          CreateError(500, "Something went wrong while resetting the password!")
        );
      }
    }
  });
};
