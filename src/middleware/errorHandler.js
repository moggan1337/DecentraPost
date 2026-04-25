export function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      details: err.details
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or missing authentication'
    });
  }
  
  if (err.status === 404 || err.statusCode === 404) {
    return res.status(404).json({
      error: 'Not Found',
      message: err.message || 'Resource not found'
    });
  }
  
  res.status(err.status || err.statusCode || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
}
