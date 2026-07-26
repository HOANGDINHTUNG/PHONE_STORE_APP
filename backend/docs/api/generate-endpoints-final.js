const fs = require("fs");
const endpoints = `
  /api/v1/admin/audit-logs:
    get:
      summary: GET Audit Logs
      responses: { "200": { description: OK } }
  /api/v1/admin/audit-logs/{id}:
    get:
      summary: GET Audit Log Details
      responses: { "200": { description: OK } }
  /api/v1/admin/audit-logs/export:
    post:
      summary: POST Export Audit Logs
      responses: { "200": { description: OK } }
  /api/v1/me/notifications:
    get:
      summary: GET My Notifications
      responses: { "200": { description: OK } }
  /api/v1/me/notifications/{id}/read:
    patch:
      summary: PATCH Mark Notification Read
      responses: { "200": { description: OK } }
  /api/v1/me/notifications/read-all:
    patch:
      summary: PATCH Mark All Notifications Read
      responses: { "200": { description: OK } }
  /api/v1/admin/notifications:
    get:
      summary: GET Admin Notifications
      responses: { "200": { description: OK } }
  /api/v1/admin/notifications:
    post:
      summary: POST Admin Create Notification
      responses: { "201": { description: Created } }
  /api/v1/admin/notifications/broadcast:
    post:
      summary: POST Broadcast Notification
      responses: { "200": { description: OK } }
  /api/v1/admin/outbox:
    get:
      summary: GET Outbox Messages
      responses: { "200": { description: OK } }
  /api/v1/admin/outbox/{id}/retry:
    post:
      summary: POST Retry Outbox Message
      responses: { "200": { description: OK } }
  /api/v1/me/wishlist:
    get:
      summary: GET Wishlist
      responses: { "200": { description: OK } }
  /api/v1/me/wishlist/{productId}:
    post:
      summary: POST Add to Wishlist
      responses: { "201": { description: Created } }
  /api/v1/me/wishlist/{productId}:
    delete:
      summary: DELETE Remove from Wishlist
      responses: { "200": { description: OK } }
  /api/v1/me/wishlist:
    delete:
      summary: DELETE Clear Wishlist
      responses: { "200": { description: OK } }
  /api/v1/admin/reports/sales:
    get:
      summary: GET Sales Report
      responses: { "200": { description: OK } }
  /api/v1/admin/reports/inventory:
    get:
      summary: GET Inventory Report
      responses: { "200": { description: OK } }
  /api/v1/admin/jobs:
    get:
      summary: GET Cron Jobs
      responses: { "200": { description: OK } }
  /api/v1/admin/jobs/{jobId}/run:
    post:
      summary: POST Run Cron Job
      responses: { "200": { description: OK } }
  /api/v1/webhooks/logs:
    get:
      summary: GET Webhook Delivery Logs
      responses: { "200": { description: OK } }
  /api/v1/webhooks/logs/{id}/retry:
    post:
      summary: POST Retry Webhook Delivery
      responses: { "200": { description: OK } }
`;

let content = fs.readFileSync("phone-store-openapi.yaml", "utf8");
const lines = content.split("\\n");
const compIndex = lines.findIndex((l) => l.startsWith("components:"));
if (compIndex > -1) {
  lines.splice(compIndex, 0, endpoints);
  let res = lines.join("\\n");
  fs.writeFileSync("phone-store-openapi.yaml", res);
  // Remove duplicates quickly
  let doc = require("js-yaml").load(
    fs.readFileSync("phone-store-openapi.yaml", "utf8"),
  );
  let c = 0;
  for (let p in doc.paths) {
    for (let m in doc.paths[p]) c++;
  }
  console.log("Total Endpoints:", c);
}
