import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
 const verifyJWT = asyncHandler(async(req , res , next) => {

    try {
      const token = req.cookie?.accessToken || req.header("authorization")?.replace("bearer " , "")
  
  if(!token){
    throw new ApiError(401,"Unauthorised request")
  }
  
   const decodedToken = jwt.verify(token ,process.env.ACCESS_TOKEN_SECRET)
   
   const user = await User.findById(decodedToken?._id).select("-password  -refreshToken")

   if(!user) {
    throw new ApiError(401,"Invalid access token")
   }

   req.user = user
   next()
   
    } 
    catch (error) 
    {
      console.log(error)
      throw new ApiError(401 , error?.message ||"InvalidAccess token")
    }

})

export { verifyJWT }

 