const fs = require("fs");
const endpoints = `
  /api/v1/warehouses/{id}:
    get:
      tags:
        - Procurement and Inventory
      summary: Get Warehouse
      operationId: getWarehouse
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
    patch:
      tags:
        - Procurement and Inventory
      summary: Update Warehouse
      operationId: updateWarehouse
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
      responses:
        "200":
          description: OK
  /api/v1/warehouses/{id}/status:
    patch:
      tags:
        - Procurement and Inventory
      summary: Change Warehouse Status
      operationId: changeWarehouseStatus
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - name: status
          in: query
          required: true
          schema:
            type: string
      responses:
        "200":
          description: OK
  /api/v1/suppliers/{id}:
    get:
      tags:
        - Procurement and Inventory
      summary: Get Supplier
      operationId: getSupplier
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
    patch:
      tags:
        - Procurement and Inventory
      summary: Update Supplier
      operationId: updateSupplier
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
      responses:
        "200":
          description: OK
  /api/v1/suppliers/{id}/status:
    patch:
      tags:
        - Procurement and Inventory
      summary: Change Supplier Status
      operationId: changeSupplierStatus
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - name: status
          in: query
          required: true
          schema:
            type: string
      responses:
        "200":
          description: OK
  /api/v1/purchase-orders/{id}/items:
    post:
      tags:
        - Procurement and Inventory
      summary: Add PO Item
      operationId: addPOItem
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
      responses:
        "201":
          description: Created
  /api/v1/purchase-orders/{id}/items/{itemId}:
    patch:
      tags:
        - Procurement and Inventory
      summary: Update PO Item
      operationId: updatePOItem
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - name: itemId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
      responses:
        "200":
          description: OK
    delete:
      tags:
        - Procurement and Inventory
      summary: Delete PO Item
      operationId: deletePOItem
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - name: itemId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
  /api/v1/purchase-orders/{id}/submit:
    post:
      tags:
        - Procurement and Inventory
      summary: Submit PO
      operationId: submitPO
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
  /api/v1/purchase-orders/{id}/cancel:
    post:
      tags:
        - Procurement and Inventory
      summary: Cancel PO
      operationId: cancelPO
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - name: cancelReason
          in: query
          required: true
          schema:
            type: string
      responses:
        "200":
          description: OK
  /api/v1/inventory/warehouses/{warehouseId}/variants/{variantId}:
    get:
      tags:
        - Procurement and Inventory
      summary: Get Inventory Balance Details
      operationId: getWarehouseVariantBalance
      parameters:
        - name: warehouseId
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - name: variantId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
  /api/v1/inventory/warehouses/{warehouseId}/variants/{variantId}/available-count:
    get:
      tags:
        - Procurement and Inventory
      summary: Get Available Stock
      operationId: getAvailableStock
      parameters:
        - name: warehouseId
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - name: variantId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
  /api/v1/inventory/units:
    get:
      tags:
        - Procurement and Inventory
      summary: List Serialized Units
      operationId: listSerializedUnits
      responses:
        "200":
          description: OK
  /api/v1/inventory/identifiers/{identifier}:
    get:
      tags:
        - Procurement and Inventory
      summary: Lookup Unit
      operationId: lookupUnit
      parameters:
        - name: identifier
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: OK
  /api/v1/inventory/transactions:
    get:
      tags:
        - Procurement and Inventory
      summary: List Stock Ledger
      operationId: listStockTransactions
      responses:
        "200":
          description: OK
  /api/v1/inventory/stock-reservations:
    get:
      tags:
        - Procurement and Inventory
      summary: List Stock Reservations
      operationId: listStockReservations
      responses:
        "200":
          description: OK
  /api/v1/inventory/adjustments:
    post:
      tags:
        - Procurement and Inventory
      summary: Create Manual Adjustment
      operationId: createManualAdjustment
      parameters:
        - name: X-Idempotency-Key
          in: header
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
      responses:
        "201":
          description: Created
`;

let content = fs.readFileSync("phone-store-openapi.yaml", "utf8");
const lines = content.split("\n");
const compIndex = lines.findIndex((l) => l.startsWith("components:"));
if (compIndex > -1) {
  lines.splice(compIndex, 0, endpoints);
  fs.writeFileSync("phone-store-openapi.yaml", lines.join("\n"));
  console.log(
    "Successfully appended Warehouse, PO, Supplier, and Inventory endpoints!",
  );
}
