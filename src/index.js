require("dotenv").config();
require("./db/index");
const app = require('./app')
const PORT = process.env.PORT || "3000";


app.listen(PORT, () => console.log(`connected to post ${PORT}`));
