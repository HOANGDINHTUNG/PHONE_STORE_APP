const fs = require("fs");
const endpoints = `
  /api/v1/guest-orders/access-links:
    post:
      tags:
        - Sales Order Management
      summary: Request Guest Order Link
      operationId: requestGuestOrderLink
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
      responses:
        "202":
          description: Accepted
  /api/v1/guest-orders/{orderCode}:
    get:
      tags:
        - Sales Order Management
      summary: Get Guest Order Detail
      operationId: getGuestOrder
      parameters:
        - name: orderCode
          in: path
          required: true
          schema:
            type: string
        - name: X-Guest-Order-Token
          in: header
          required: true
          schema:
            type: string
      responses:
        "200":
          description: OK
  /api/v1/admin/orders/{orderId}:
    get:
      tags:
        - Sales Order Management
      summary: Get Admin Order Detail
      operationId: getAdminOrder
      parameters:
        - name: orderId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
  /api/v1/admin/orders/{orderId}/start-processing:
    post:
      tags:
        - Sales Order Management
      summary: Start Processing Order
      operationId: startProcessingOrder
      parameters:
        - name: orderId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
  /api/v1/orders/{orderCode}/cancel:
    post:
      tags:
        - Sales Order Management
      summary: Customer Cancel Order
      operationId: customerCancelOrder
      parameters:
        - name: orderCode
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: OK
  /api/v1/admin/orders/{orderId}/cancel:
    post:
      tags:
        - Sales Order Management
      summary: Admin Cancel Order
      operationId: adminCancelOrder
      parameters:
        - name: orderId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
  /api/v1/internal/orders/{orderId}/complete:
    post:
      tags:
        - Sales Order Management
      summary: Internal Complete Order
      operationId: internalCompleteOrder
      parameters:
        - name: orderId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
  /api/v1/orders/{orderCode}/payment:
    get:
      tags:
        - Payment
      summary: Get Order Payment Summary
      operationId: getOrderPayment
      parameters:
        - name: orderCode
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: OK
  /api/v1/payment-attempts/{attemptId}:
    get:
      tags:
        - Payment
      summary: Get Payment Attempt
      operationId: getPaymentAttempt
      parameters:
        - name: attemptId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
  /api/v1/admin/shipments:
    get:
      tags:
        - Shipment
      summary: List Shipments
      operationId: listShipments
      responses:
        "200":
          description: OK
  /api/v1/admin/shipments/{shipmentId}:
    get:
      tags:
        - Shipment
      summary: Get Shipment Detail
      operationId: getShipmentDetail
      parameters:
        - name: shipmentId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
  /api/v1/admin/shipments/{shipmentId}/items:
    put:
      tags:
        - Shipment
      summary: Update Shipment Items
      operationId: updateShipmentItems
      parameters:
        - name: shipmentId
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
  /api/v1/orders/{orderCode}/shipments:
    get:
      tags:
        - Shipment
      summary: Get Customer Order Shipments
      operationId: getCustomerOrderShipments
      parameters:
        - name: orderCode
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: OK
  /api/v1/webhooks/shipments/{providerCode}:
    post:
      tags:
        - Shipment
      summary: Carrier Webhook
      operationId: carrierWebhook
      parameters:
        - name: providerCode
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: OK
`;

let content = fs.readFileSync("phone-store-openapi.yaml", "utf8");
const lines = content.split("\n");
const compIndex = lines.findIndex((l) => l.startsWith("components:"));
if (compIndex > -1) {
  lines.splice(compIndex, 0, endpoints);
  fs.writeFileSync("phone-store-openapi.yaml", lines.join("\n"));
  console.log("Successfully appended Order, Payment, Shipment endpoints!");
}
