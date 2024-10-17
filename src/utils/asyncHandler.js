// method 1

const asyncHandler = (fn) =>  async (req , res , next) => {
    try {
        await fn(req, res,next )
    } catch (error) {
      res.status(err.code || 404).json({
        success: false,
        message: error.message || "Server Error"
      })
    }
}

export { asyncHandler } 

// metrhod 2

// const asyncHandler = (requestHandler) => {
//     (req, res , next) => {
//         Promise.resolve(requestHandler(req, res, next))
//        .catch((err)=> next(err))
//     }
// }

// export { asyncHandler } 