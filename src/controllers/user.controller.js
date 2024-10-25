import { asyncHandler }  from "../utils/asyncHandler.js"
import  { ApiError } from "../utils/apiError.js"
import {User} from "../models/user.model.js"
import { uploadonCloudinary } from "../utils/fileupload.js"
import {  ApiResponse } from "../utils/apiResponse.js"



const resisterUser = asyncHandler(async (req , res) => {
   
//get user detail from  frontend

const { fullname , email , password , username } = req.body
console.log("fullname:" , fullname)

//validation-not empty

if ([fullname , email , password , username].some((field)=> {
   field?.trim()===""
})) {
    throw new ApiError(400 , "all the feilds are required.")
}

//check if user already exists or not (email,username)

 const existedUser = User.findOne({
    $or: [{ username } , { email }]
})

if(existedUser) {
    throw new ApiError(409 , "username or email already exists")
}

//check for images,check for avatar

 const avatarLoaclpath = req.files?.avatar[0]?.path
 const coverImageLoaclpath = req.files?.coverImage[0]?.path

if(!avatarLoaclpath) {
    throw new ApiError(404 , "missing avatar")
}


//upload them to cloudinary, avatar is required

const avatar = await uploadonCloudinary(avatarLoaclpath)
const coverImage = await uploadonCloudinary(coverImageLoaclpath)
// checking avatar is present or not

if(!avatar) {
    throw new ApiError(404 , "still avatar is not uploaded. Please upload a avatar")
}

//create user oobject- create entry in db

const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username : username.toLowerCase(),

})

//remove password and refresh token feild from response

const createdUser = await User.findbyId(user.id).select("-password -refreshToken")

//check for user creation

if(!createdUser) {
    throw new ApiError(500 , "Something went wrong while resistering the user")
}

//return response


res.status(200).json(
    new ApiResponse(200 ,createdUser , "user resistered successfully" )
)


})


export { resisterUser } 