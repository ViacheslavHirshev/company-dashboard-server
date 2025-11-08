import app from "./app";
import { PORT } from "./config/constants";
import swaggerDocs from "./config/swagger";

app.listen(PORT, () => {
  console.log(`Server successfully started on port: ${PORT}`);
});
