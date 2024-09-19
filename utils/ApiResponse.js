class ApiResponse {
        constructor(statusCode, message, data) {
          this.statusCode = statusCode || 400
          this.message = message
          this.data = data
      
        }
      }     
 export { ApiResponse }