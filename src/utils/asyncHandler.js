// // method 1

// const asyncHandler = (fn) =>  async (req , res , next) => {
//     try {
//         await fn(req, res,next )
//     } catch (error) {
//       res.status(err.code || 404).json({
//         success: false,
//         message: error.message || "Server Error"
//       })
//     }
// }

// export { asyncHandler } 

// metrhod 2
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
      Promise.resolve(requestHandler(req, res, next))
          .catch((err) => {
              res.status(err.code || 500).json({
                  success: false,
                  message: err.message || "Server Error"
              });
          });
  };
};

export { asyncHandler };
