const successResponse = (res, message, data = {}, status = 200) => {
return res.status(status).json({
status: "success",
message,
data,
});
};

const errorResponse = (res, message, status = 500, details = null) => {
return res.status(status).json({
status: "error",
message,

...(details && { details }),
});
};

export default { successResponse, errorResponse };

// USAGE FOR successResponse
// successResponse(res, message, data, status)
// Use this when an operation completes successfully.
// It takes the Express res object, a human-readable message, an optional data payload, and an optional HTTP status (default is 200).
// Example: when a user is created, you could write
// successResponse(res, "User created successfully", newUser, 201).

// USAGE FOR errorResponse
// errorResponse(res, message, status, details)
// Use this when something goes wrong.
// It standardizes all your errors to return the same structure, so clients know exactly what to expect.
// Example: if validation fails,
// errorResponse(res, "Invalid input", 400)
// or if something crashes,
// errorResponse(res, "Server error", 500, err.message).
