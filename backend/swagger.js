const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BeautyBook API",
      version: "1.0.0"
    }
  },
  apis: ["./routes/*.js"]
};

module.exports = swaggerJSDoc(options);
