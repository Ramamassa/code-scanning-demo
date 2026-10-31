const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const PORT = 8080;
const indexPath = path.join(__dirname, "index.html");

let site = "";

async function loadSite() {
  site = await fs.readFile(indexPath, "utf8");
}

app.get("/", async (req, res) => {
  const rawName = req.query.name;
  const name =
    typeof rawName === "string" && rawName.trim() ? rawName.trim() : "Guest";

  const greet = site.replace(/%%_USER_NAME%%/g, name);
  res.send(greet);
});

loadSite()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`The webpage is live on http://localhost:${PORT} :)`);
    });
  })
  .catch((error) => {
    console.error("Failed to load index.html:", error);
    process.exit(1);
  });
