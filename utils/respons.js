// customError.js
class ErrorResponse {
  constructor(message, status_code, data) {
    this.success = false;
    this.message = message;
    this.status_code = status_code;
    this.data = data || null;
  }
}

class SuccessResponse {
  constructor(message, status_code, data) {
    this.success = true;
    this.message = message;
    this.status_code = status_code;
    this.data = data;
  }
}

module.exports = { ErrorResponse, SuccessResponse };
