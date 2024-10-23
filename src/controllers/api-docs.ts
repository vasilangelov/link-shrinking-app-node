import { Router } from "express";
import swaggerUI from "swagger-ui-express";
import swaggerDocument from "@/swagger.json";

const apiDocsRouter = Router();

apiDocsRouter.use("/", swaggerUI.serve);

apiDocsRouter.get("/", swaggerUI.setup(swaggerDocument));

export default apiDocsRouter;
