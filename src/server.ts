import app from "./app";
import config from "./config/default";

const port = config.port;

app.listen(port, () =>
  console.log(`Server successfully started on port: ${port}`)
);
