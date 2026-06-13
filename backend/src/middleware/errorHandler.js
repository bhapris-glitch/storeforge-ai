const errorHandler = (
  err,
  req,
  res,
  next
) => {
  console.error("ERROR:", err);

  let statusCode =
    err.statusCode || 500;

  let message =
    err.message ||
    "Internal Server Error";

  /*
  |--------------------------------------------------------------------------
  | Mongoose Bad ObjectId
  |--------------------------------------------------------------------------
  */

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID";
  }

  /*
  |--------------------------------------------------------------------------
  | Mongoose Duplicate Key
  |--------------------------------------------------------------------------
  */

  if (err.code === 11000) {
    statusCode = 400;
    message =
      "Duplicate field value entered";
  }

  /*
  |--------------------------------------------------------------------------
  | Mongoose Validation Error
  |--------------------------------------------------------------------------
  */

  if (
    err.name === "ValidationError"
  ) {
    statusCode = 400;

    message = Object.values(
      err.errors
    )
      .map((item) => item.message)
      .join(", ");
  }

  /*
  |--------------------------------------------------------------------------
  | JWT Errors
  |--------------------------------------------------------------------------
  */

  if (
    err.name ===
    "JsonWebTokenError"
  ) {
    statusCode = 401;
    message = "Invalid token";
  }

  if (
    err.name ===
    "TokenExpiredError"
  ) {
    statusCode = 401;
    message = "Token expired";
  }

  return res.status(statusCode).json({
    success: false,
    message,
    stack:
      process.env.NODE_ENV ===
      "development"
        ? err.stack
        : undefined
  });
};

module.exports = errorHandler;
