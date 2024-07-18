import { getCachedConfiguration } from "../init/configuration.js";
import { Response, NextFunction } from "express";

async function contextMiddleware(
  req: MonkeyTypes.Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const configuration = await getCachedConfiguration(true);

  req.ctx = {
    configuration,
    decodedToken: {
      type: "None",
      uid: "",
      email: "",
    },
  };

  next();
}

export default contextMiddleware;
