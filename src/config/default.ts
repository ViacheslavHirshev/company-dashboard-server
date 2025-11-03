import { config } from "dotenv";

config();

export default {
  port: Number(process.env.PORT),
};
