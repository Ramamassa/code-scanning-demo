const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const PORT = 8080;
const indexPath = path.join(__dirname, "index.html");

let site = "";

// Функция экранирования HTML-спецсимволов для защиты от XSS
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function loadSite() {
  site = await fs.readFile(indexPath, "utf8");
}

app.get("/", async (req, res) => {
  const rawName = req.query.name;
  const name =
    typeof rawName === "string" && rawName.trim() ? rawName.trim() : "Guest";

  // Экранируем перед вставкой в HTML
  const safeName = escapeHtml(name);
  const greet = site.replace(/%%_USER_NAME%%/g, safeName);

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
