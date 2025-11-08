import { Express, NextFunction, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { version } from "../../package.json";
// import { ACCESS_TOKEN_COOKIE_NAME } from "./constants";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "REST API docs",
      version,
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["src/routes/**/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: number) {
  // UI endpoint
  app.use(
    "/docs",
    (req: Request, res: Response, next: NextFunction) => {
      res.setHeader(
        "Content-Security-Policy",
        `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:${port}`
      );
      next();
    },
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );

  // JSON endpoint
  app.get("/docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`Docs available at localhost:${port}/docs`);
}

export default swaggerDocs;
