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
) {
  if (doc.paths[path] && doc.paths[path][method]) {
    const op = doc.paths[path][method];
    op.security = standardSecurity;

    // Add common responses
    op.responses = { ...op.responses, ...standardResponses };

    // Add request schema if provided
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

    // Add response schema if provided
    if (resSchemaRef) {
      if (resSchemaRef === "") {
        // No Content or just basic descriptions
        op.responses[resCode] = { description: resDesc };
      } else {
        op.responses[resCode] = {
          description: resDesc,
          content: { "application/json": { schema: { $ref: resSchemaRef } } },
        };
      }
    }
  }
}

// 1. Organization, Staff & RBAC
applyStandard(
  "/api/v1/admin/positions/{id}",
  "patch",
  "#/components/schemas/PositionRequest",
  "#/components/schemas/PositionResponse",
);
applyStandard(
  "/api/v1/admin/positions/{id}/status",
  "patch",
  null,
  "#/components/schemas/PositionResponse",
);

applyStandard(
  "/api/v1/admin/staff/{id}",
  "get",
  null,
  "#/components/schemas/StaffResponse",
);
applyStandard(
  "/api/v1/admin/staff/{id}",
  "patch",
  "#/components/schemas/StaffRequest",
  "#/components/schemas/StaffResponse",
);
applyStandard(
  "/api/v1/admin/staff/{id}/employment-status",
  "patch",
  null,
  "#/components/schemas/StaffResponse",
);

applyStandard(
  "/api/v1/admin/permissions",
  "get",
  null,
  "#/components/schemas/PermissionResponse",
); // wait, likely array. Let's manually fix array below if needed.
if (
  doc.paths["/api/v1/admin/permissions"] &&
  doc.paths["/api/v1/admin/permissions"]["get"]
) {
  doc.paths["/api/v1/admin/permissions"]["get"].responses["200"].content = {
    "application/json": {
      schema: {
        type: "array",
        items: { $ref: "#/components/schemas/PermissionResponse" },
      },
    },
  };
}

applyStandard(
  "/api/v1/admin/roles/{id}",
  "get",
  null,
  "#/components/schemas/RoleResponse",
);
applyStandard(
  "/api/v1/admin/roles/{id}",
  "patch",
  "#/components/schemas/RoleRequest",
  "#/components/schemas/RoleResponse",
);
applyStandard(
  "/api/v1/admin/roles/{id}/status",
  "patch",
  null,
  "#/components/schemas/RoleResponse",
);
applyStandard(
  "/api/v1/admin/roles/{id}/permissions",
  "put",
  null,
  "#/components/schemas/RoleResponse",
); // Body is array of string, already defined in endpoints creation initially, but let's just leave it or overwrite...
if (
  doc.paths["/api/v1/admin/roles/{id}/permissions"] &&
  doc.paths["/api/v1/admin/roles/{id}/permissions"]["put"]
) {
  doc.paths["/api/v1/admin/roles/{id}/permissions"]["put"].requestBody.content[
    "application/json"
  ].schema = {
    type: "array",
    items: { type: "string", format: "uuid" },
  };
}

applyStandard(
  "/api/v1/admin/users/{id}/role-assignments",
  "get",
  null,
  "dummy",
); // replace dummy
if (
  doc.paths["/api/v1/admin/users/{id}/role-assignments"] &&
  doc.paths["/api/v1/admin/users/{id}/role-assignments"]["get"]
) {
  doc.paths["/api/v1/admin/users/{id}/role-assignments"]["get"].responses[
    "200"
  ].content = {
    "application/json": {
      schema: {
        type: "array",
        items: { $ref: "#/components/schemas/RoleAssignmentResponse" },
      },
    },
  };
}
applyStandard(
  "/api/v1/admin/users/{id}/role-assignments",
  "post",
  null,
  "#/components/schemas/RoleAssignmentResponse",
  "201",
  "Created",
);
applyStandard(
  "/api/v1/admin/users/{id}/role-assignments/{assignmentId}/revoke",
  "post",
  null,
  "",
);

// 2. Product Catalog
applyStandard(
  "/api/v1/admin/products/{productId}/variants",
  "post",
  "#/components/schemas/ProductVariantRequest",
  "#/components/schemas/ProductVariantResponse",
  "201",
  "Created",
);
applyStandard(
  "/api/v1/admin/variants/{variantId}",
  "patch",
  "#/components/schemas/ProductVariantRequest",
  "#/components/schemas/ProductVariantResponse",
);
applyStandard(
  "/api/v1/admin/variants/{variantId}/status",
  "patch",
  null,
  "#/components/schemas/ProductVariantResponse",
);
applyStandard(
  "/api/v1/admin/variants/{variantId}/price-changes",
  "post",
  "#/components/schemas/VariantPriceChangeRequest",
  "#/components/schemas/VariantPriceChangeResponse",
  "201",
  "Created",
);

applyStandard(
  "/api/v1/admin/variants/{variantId}/images",
  "post",
  null,
  "#/components/schemas/VariantImageResponse",
  "201",
  "Created",
); // requestBody is multipart, don't overwrite if not requested schema.
applyStandard(
  "/api/v1/admin/variants/{variantId}/images/{imageId}/set-primary",
  "post",
  null,
  "",
  "204",
  "No Content",
);
applyStandard(
  "/api/v1/admin/variants/{variantId}/images/{imageId}",
  "delete",
  null,
  "",
  "204",
  "No Content",
);

// 3. Cart & Coupons
applyStandard("/api/v1/cart/items", "delete", null, "", "204", "No Content");
if (
  doc.paths["/api/v1/cart/items"] &&
  doc.paths["/api/v1/cart/items"]["delete"]
) {
  doc.paths["/api/v1/cart/items"]["delete"].security = standardSecurity;
}

applyStandard("/api/v1/cart/coupon-quote", "post", null, "dummy");
if (
  doc.paths["/api/v1/cart/coupon-quote"] &&
  doc.paths["/api/v1/cart/coupon-quote"]["post"]
) {
  doc.paths["/api/v1/cart/coupon-quote"]["post"].security = standardSecurity;
  doc.paths["/api/v1/cart/coupon-quote"]["post"].responses["200"].content = {
    "application/json": {
      schema: { $ref: "#/components/schemas/CartResponse" },
    },
  };
}

applyStandard(
  "/api/v1/admin/coupons/{code}/status",
  "patch",
  null,
  "#/components/schemas/CouponResponse",
);

// Save the transformed file back
fs.writeFileSync(
  "phone-store-openapi.yaml",
  yaml.dump(doc, { lineWidth: -1, noRefs: true }),
);
console.log("Phase 1 detailed endpoints applied successfully!");
