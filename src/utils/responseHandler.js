const successResponse = (res, message, data = {}, status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
    path: res.req ? res.req.originalUrl : "",
  });
};

const errorResponse = (res, message, status = 500, code = null, details = null) => {
  return res.status(status).json({
    success: false,
    message,
    code,
    ...(details && { details }),
    timestamp: new Date().toISOString(),
    path: res.req ? res.req.originalUrl : "",
  });
};

export default { successResponse, errorResponse };
