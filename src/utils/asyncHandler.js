// method 1

// const asyncHandler = (fn) =>  async (req , res , next) => {
//     try {
//         await fn(req, res,next )
//     } catch (error) {
//       res.status(error.code || 404).json({
//         success: false,
//         message: error.message || "Server Error"
//       })
//     }
// }

// export { asyncHandler } 

// metrhod 2
// const asyncHandler = (requestHandler) => {
//   return (req, res, next) => {
//       Promise.resolve(requestHandler(req, res, next))
//           .catch((err) => {
//               res.status(err.code || 500).json({
//                   success: false,
//                   message: err.message || "Server Error"
//               });
//           });
//   };
// };

// export { asyncHandler };
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(error => {
      console.error("Error:", error);
      res.status(error.statusCode || 500).json({
          success: false,
          message: error.message || "Server Error",
          data: error.data || null,
      });
  });
};

export { asyncHandler };

