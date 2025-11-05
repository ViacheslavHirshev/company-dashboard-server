import app from "./app";
import { PORT } from "./config/constants";

app.listen(PORT, () =>
  console.log(`Server successfully started on port: ${PORT}`)
);
