import { asyncHandler }  from "../utils/asyncHandler.js"
import  { ApiError } from "../utils/apiError.js"
import {User} from "../models/user.model.js"
import { uploadonCloudinary } from "../utils/fileupload.js"
import {  ApiResponse } from "../utils/apiResponse.js"




const resisterUser = asyncHandler(async (req, res) => {
    try {
        const { fullname, email, password, username } = req.body;
        console.log("Request Body:", req.body);

        if ([fullname, email, password, username].some(field => field?.trim() === "")) {
            throw new ApiError("All the fields are required.", 400);
        }

        const existedUser = await User.findOne({ $or: [{ username }, { email }] });
        console.log("Existed User:", existedUser);

        if (existedUser) {
            throw new ApiError("Username or email already exists.", 409);
        }

        const avatarLocalPath = req.files?.avatar[0]?.path;
        const coverImageLocalPath = req.files?.coverImage[0]?.path;
        console.log("Avatar Local Path:", avatarLocalPath);
        console.log("Cover Image Local Path:", coverImageLocalPath);

        if (!avatarLocalPath) {
            throw new ApiError("Missing avatar.", 404);
        }

        const avatar = await uploadonCloudinary(avatarLocalPath);
        const coverImage = await uploadonCloudinary(coverImageLocalPath);
        console.log("Avatar:", avatar);
        console.log("Cover Image:", coverImage);

        if (!avatar) {
            throw new ApiError("Avatar upload failed. Please upload an avatar.", 404);
        }

        const user = await User.create({
            fullname,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            email,
            password,
            username: username.toLowerCase(),
        });
        console.log("Created User:", user);

        const createdUser = await User.findById(user._id).select("-password -refreshToken");
        console.log("Created User without password and refresh token:", createdUser);

        if (!createdUser) {
            throw new ApiError("Something went wrong while registering the user.", 500);
        }

        res.status(200).json(new ApiResponse(200, createdUser, "User registered successfully."));
    } catch (error) {
        console.error("Error in resisterUser:", error);
        throw error;  // Ensure error bubbles up to asyncHandler
    }
});

export { resisterUser };
