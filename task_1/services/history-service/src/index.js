const express = require("express");
const eventsRouter = require("./routes/events");
const historyRouter = require("./routes/history");

const app = express();
const port = process.env.HISTORY_PORT || 3002;

app.use(express.json());
app.use("/events", eventsRouter);
app.use("/history", historyRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
