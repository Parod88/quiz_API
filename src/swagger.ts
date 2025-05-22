import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Quiz App API",
      version: "1.0.0",
    },
  },
  apis: [`${path.join(__dirname, "./routes/*")}`],
};

const swaggerSpecs = swaggerJSDoc(options);

export default swaggerSpecs;
