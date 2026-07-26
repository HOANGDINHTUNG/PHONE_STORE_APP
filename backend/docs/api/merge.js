const fs = require("fs");
let b = fs.readFileSync("phone-store-openapi.yaml", "utf8");

const duplicates = [
  "/api/v1/warehouses/{id}",
  "/api/v1/suppliers/{id}",
  "/api/v1/orders/{orderCode}/return-requests",
  "/api/v1/admin/refunds",
];

duplicates.forEach((path) => {
  // Regex to match exact path declaration e.g. "  /api/v1/warehouses/{id}:\n"
  const safePath = path
    .replace(/\\/ / g, "\\/")
    .replace(/\\{/g, "\\{")
    .replace(/\\}/g, "\\}");
  const regex = new RegExp("\\n  " + safePath + ":\\n", "g");

  const parts = b.split(regex);
  if (parts.length === 3) {
    // The first part is everything before the FIRST occurrence
    // The second part is everything between FIRST and SECOND occurrence
    // The third part is everything after the SECOND occurrence

    // We want to extract the methods from the second occurrence (parts[2])
    const endOfBottomBlock = parts[2].search(/\n  \/[a-zA-Z]/);
    let bottomChildren = "";

    if (endOfBottomBlock === -1) {
      // It's the very last path in the file
      bottomChildren = parts[2].substring(0, parts[2].search(/\ncomponents:/));
      if (bottomChildren === "") {
        bottomChildren = parts[2];
        parts[2] = "";
      } else {
        parts[2] = parts[2].substring(bottomChildren.length);
      }
    } else {
      bottomChildren = parts[2].substring(0, endOfBottomBlock);
      parts[2] = parts[2].substring(endOfBottomBlock);
    }

    // Move the bottom children to right after the first occurrence
    b =
      parts[0] + "\\n  " + path + ":\\n" + bottomChildren + parts[1] + parts[2];
  }
});

fs.writeFileSync("phone-store-openapi.yaml", b);
console.log("Merge complete!");
