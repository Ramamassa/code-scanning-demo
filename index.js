const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const app = express();

let site = "";

async function loadSite() {
  const filePath = path.join(__dirname, "index.html");
  site = await fs.readFile(filePath, "utf8");
}

app.get("/", async (req, res) => {
  const name = typeof req.query.name === "string" ? req.query.name : "Guest";
  const greet = site.replace(/%%_USER_NAME%%/g, name);
  res.send(greet);
});

app.listen(8080, async () => {
  await loadSite();
  console.log("The webpage is live on http://localhost:8080 :)");
});
