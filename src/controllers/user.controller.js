import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/fileupload.js";

const resisterUser = asyncHandler(async (req, res) => {
  try {
    const { username, email, fullName, password } = req.body;

    // Log the request body for debugging
    console.log("Request Body:", req.body);

    // Validate required fields
    if (!fullName || !email || !password || !username) {
      throw new ApiError("fullname, email, password, and username are required.", 400);
    }

    // Check if the user already exists
    const existedUser = await User.findOne({ $or: [{ username }, { email }] });
    console.log("Existed User:", existedUser);

    if (existedUser) {
      throw new ApiError("Username or email already exists.", 409);
    }

    // Handle file uploads
    const avatarLocalPath = req.files?.avatar[0]?.path;
    let coverImageLocalPath;

    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
      coverImageLocalPath = req.files.coverImage[0].path;
    }

    console.log("Avatar Local Path:", avatarLocalPath);
    console.log("Cover Image Local Path:", coverImageLocalPath);

    // Validate avatar presence
    if (!avatarLocalPath) {
      throw new ApiError("Missing avatar.", 404);
    }

    // Upload files to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    console.log("Avatar:", avatar);
    console.log("Cover Image:", coverImage);

    // Check if avatar upload was successful
    if (!avatar) {
      throw new ApiError(400, "Avatar file is required");
    }

    // Create the user in the database
    const user = await User.create({
      fullName,
      avatar: avatar.secure_url,
      coverImage: coverImage?.secure_url || "",
      email,
      password,
      username: username.toLowerCase(),
    });

    console.log("Created User:", user);

    // Retrieve the created user without sensitive information
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    console.log("Created User without password and refresh token:", createdUser);

    // Validate user creation
    if (!createdUser) {
      throw new ApiError("Something went wrong while registering the user.", 500);
    }

    // Send success response
    res.status(200).json(new ApiResponse(200, createdUser, "User registered successfully."));
  } catch (error) {
    throw new ApiResponse(error, "Something went wrong while registering the user")
    
  }
});

export { resisterUser };
