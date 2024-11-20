const express = require("express");
const app = express();
const port = 3001;

const productsRouter = require("./routes/products");
const inventoriesRouter = require("./routes/inventories");

app.use(express.json());

app.use("/products", productsRouter);
app.use("/inventories", inventoriesRouter);

app.listen(port, () => {
    console.log(`Inventory service running on port ${port}`);
});
