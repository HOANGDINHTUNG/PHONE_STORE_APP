const fs = require("fs");
const yaml = require("js-yaml");

const doc = yaml.load(fs.readFileSync("phone-store-openapi.yaml", "utf8"));

// Common responses and security
const standardResponses = {
  400: { $ref: "#/components/responses/BadRequest" },
  401: { $ref: "#/components/responses/Unauthorized" },
  403: { $ref: "#/components/responses/Forbidden" },
  404: { $ref: "#/components/responses/NotFound" },
  422: { $ref: "#/components/responses/UnprocessableEntity" },
  500: { $ref: "#/components/responses/InternalServerError" },
};
const standardSecurity = [{ BearerAuth: [] }];

// Helper function to inject schemas
function applyStandard(
  path,
  method,
  reqSchemaRef,
  resSchemaRef,
  resCode = "200",
  resDesc = "OK",
  isArray = false,
) {
  if (doc.paths[path] && doc.paths[path][method]) {
    const op = doc.paths[path][method];
    op.security = standardSecurity;
    op.responses = { ...op.responses, ...standardResponses };

    if (reqSchemaRef) {
      if (!op.requestBody)
        op.requestBody = {
          required: true,
          content: { "application/json": {} },
        };
      if (!op.requestBody.content["application/json"])
        op.requestBody.content["application/json"] = {};
      op.requestBody.content["application/json"].schema = {
        $ref: reqSchemaRef,
      };
    }

    if (resSchemaRef) {
      if (resSchemaRef === "") {
        op.responses[resCode] = { description: resDesc };
      } else {
        if (isArray) {
          op.responses[resCode] = {
            description: resDesc,
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: resSchemaRef } },
              },
            },
          };
        } else {
          op.responses[resCode] = {
            description: resDesc,
            content: { "application/json": { schema: { $ref: resSchemaRef } } },
          };
        }
      }
    }
  }
}

// 4. Procurement & Inventory
applyStandard(
  "/api/v1/warehouses/{id}",
  "get",
  null,
  "#/components/schemas/WarehouseResponse",
);
applyStandard(
  "/api/v1/warehouses/{id}",
  "patch",
  "#/components/schemas/WarehouseRequest",
  "#/components/schemas/WarehouseResponse",
);
applyStandard(
  "/api/v1/warehouses/{id}/status",
  "patch",
  null,
  "#/components/schemas/WarehouseResponse",
);

applyStandard(
  "/api/v1/suppliers/{id}",
  "get",
  null,
  "#/components/schemas/SupplierResponse",
);
applyStandard(
  "/api/v1/suppliers/{id}",
  "patch",
  "#/components/schemas/SupplierRequest",
  "#/components/schemas/SupplierResponse",
);
applyStandard(
  "/api/v1/suppliers/{id}/status",
  "patch",
  null,
  "#/components/schemas/SupplierResponse",
);

applyStandard(
  "/api/v1/purchase-orders/{id}/items",
  "post",
  "#/components/schemas/PurchaseOrderItemRequest",
  "#/components/schemas/PurchaseOrderResponse",
  "201",
  "Created",
);
applyStandard(
  "/api/v1/purchase-orders/{id}/items/{itemId}",
  "patch",
  "#/components/schemas/PurchaseOrderItemRequest",
  "#/components/schemas/PurchaseOrderResponse",
);
applyStandard(
  "/api/v1/purchase-orders/{id}/items/{itemId}",
  "delete",
  null,
  "#/components/schemas/PurchaseOrderResponse",
);
applyStandard(
  "/api/v1/purchase-orders/{id}/submit",
  "post",
  null,
  "#/components/schemas/PurchaseOrderResponse",
);
applyStandard(
  "/api/v1/purchase-orders/{id}/cancel",
  "post",
  null,
  "#/components/schemas/PurchaseOrderResponse",
);

applyStandard(
  "/api/v1/inventory/warehouses/{warehouseId}/variants/{variantId}",
  "get",
  null,
  "dummy",
);
if (
  doc.paths[
    "/api/v1/inventory/warehouses/{warehouseId}/variants/{variantId}"
  ] &&
  doc.paths["/api/v1/inventory/warehouses/{warehouseId}/variants/{variantId}"][
    "get"
  ]
) {
  doc.paths["/api/v1/inventory/warehouses/{warehouseId}/variants/{variantId}"][
    "get"
  ].responses["200"].content = {
    "application/json": { schema: { type: "object" } },
  };
}
applyStandard(
  "/api/v1/inventory/warehouses/{warehouseId}/variants/{variantId}/available-count",
  "get",
  null,
  "dummy",
);
if (
  doc.paths[
    "/api/v1/inventory/warehouses/{warehouseId}/variants/{variantId}/available-count"
  ] &&
  doc.paths[
    "/api/v1/inventory/warehouses/{warehouseId}/variants/{variantId}/available-count"
  ]["get"]
) {
  doc.paths[
    "/api/v1/inventory/warehouses/{warehouseId}/variants/{variantId}/available-count"
  ]["get"].responses["200"].content = {
    "application/json": { schema: { type: "integer" } },
  };
}

applyStandard("/api/v1/inventory/units", "get", null, "dummy"); // Paged list Placeholder
applyStandard(
  "/api/v1/inventory/identifiers/{identifier}",
  "get",
  null,
  "dummy",
); // Specific unit Placeholder
applyStandard("/api/v1/inventory/transactions", "get", null, "dummy");
applyStandard("/api/v1/inventory/stock-reservations", "get", null, "dummy");
applyStandard(
  "/api/v1/inventory/adjustments",
  "post",
  "#/components/schemas/StockAdjustmentRequest",
  "",
  "201",
  "Created",
);

// 5. Order & Checkout
applyStandard(
  "/api/v1/guest-orders/access-links",
  "post",
  null,
  "",
  "202",
  "Accepted",
); // Body was type: object
applyStandard(
  "/api/v1/guest-orders/{orderCode}",
  "get",
  null,
  "#/components/schemas/OrderResponse",
);
applyStandard(
  "/api/v1/admin/orders/{orderId}",
  "get",
  null,
  "#/components/schemas/OrderResponse",
);
applyStandard(
  "/api/v1/admin/orders/{orderId}/start-processing",
  "post",
  null,
  "#/components/schemas/OrderResponse",
);
applyStandard(
  "/api/v1/orders/{orderCode}/cancel",
  "post",
  null,
  "#/components/schemas/OrderResponse",
);
applyStandard(
  "/api/v1/admin/orders/{orderId}/cancel",
  "post",
  null,
  "#/components/schemas/OrderResponse",
);
applyStandard(
  "/api/v1/internal/orders/{orderId}/complete",
  "post",
  null,
  "#/components/schemas/OrderResponse",
);

// 6. Payment & Shipment
applyStandard("/api/v1/orders/{orderCode}/payment", "get", null, "dummy"); // No schema
applyStandard("/api/v1/payment-attempts/{attemptId}", "get", null, "dummy"); // No schema
applyStandard("/api/v1/admin/shipments", "get", null, "dummy"); // Paged ShipmentResponse
applyStandard(
  "/api/v1/admin/shipments/{shipmentId}",
  "get",
  null,
  "#/components/schemas/ShipmentResponse",
);
applyStandard(
  "/api/v1/admin/shipments/{shipmentId}/items",
  "put",
  null,
  "#/components/schemas/ShipmentResponse",
);
applyStandard(
  "/api/v1/orders/{orderCode}/shipments",
  "get",
  null,
  "dummy",
  "200",
  "OK",
  true,
); // Array of ShipmentResponse
if (
  doc.paths["/api/v1/orders/{orderCode}/shipments"] &&
  doc.paths["/api/v1/orders/{orderCode}/shipments"]["get"]
) {
  doc.paths["/api/v1/orders/{orderCode}/shipments"]["get"].responses[
    "200"
  ].content = {
    "application/json": {
      schema: {
        type: "array",
        items: { $ref: "#/components/schemas/ShipmentResponse" },
      },
    },
  };
}
applyStandard(
  "/api/v1/webhooks/shipments/{providerCode}",
  "post",
  null,
  "",
  "200",
  "OK",
);

// 7. Warranty & Return
applyStandard(
  "/api/v1/warranties/{warrantyCode}",
  "get",
  null,
  "#/components/schemas/WarrantyResponse",
);
applyStandard("/api/v1/admin/warranties", "get", null, "dummy");
applyStandard(
  "/api/v1/admin/warranties/{warrantyCode}",
  "get",
  null,
  "#/components/schemas/WarrantyResponse",
);
applyStandard("/api/v1/admin/warranty-claims", "get", null, "dummy");
applyStandard(
  "/api/v1/admin/warranty-claims/{claimId}",
  "get",
  null,
  "#/components/schemas/WarrantyClaimResponse",
);
applyStandard(
  "/api/v1/admin/warranty-claims/{claimId}/process",
  "post",
  null,
  "#/components/schemas/WarrantyClaimResponse",
);
applyStandard(
  "/api/v1/admin/warranty-claims/{claimId}/complete",
  "post",
  null,
  "#/components/schemas/WarrantyClaimResponse",
);

applyStandard(
  "/api/v1/orders/{orderCode}/return-requests",
  "get",
  null,
  "dummy",
  "200",
  "OK",
  true,
);
applyStandard(
  "/api/v1/orders/{orderCode}/return-requests/{returnId}",
  "get",
  null,
  "#/components/schemas/ReturnRequestResponse",
);
applyStandard("/api/v1/admin/return-requests", "get", null, "dummy");
applyStandard(
  "/api/v1/admin/return-requests/{returnId}",
  "get",
  null,
  "#/components/schemas/ReturnRequestResponse",
);

applyStandard("/api/v1/me/refunds", "get", null, "dummy", "200", "OK", true);
applyStandard("/api/v1/admin/refunds", "get", null, "dummy");
applyStandard(
  "/api/v1/admin/refunds/{refundId}",
  "get",
  null,
  "#/components/schemas/RefundResponse",
);
applyStandard(
  "/api/v1/admin/refunds/{refundId}/execute",
  "post",
  null,
  "#/components/schemas/RefundResponse",
);
applyStandard("/api/v1/webhooks/refunds/{providerCode}", "post", null, "");

fs.writeFileSync(
  "phone-store-openapi.yaml",
  yaml.dump(doc, { lineWidth: -1, noRefs: true }),
);
console.log("Phase 2 detailed endpoints applied successfully!");
