import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    const whiteList = [process.env.FRONTEND_URL];

    if (!origin || whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Cors Error: Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
};
