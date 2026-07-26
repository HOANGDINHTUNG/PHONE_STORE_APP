const fs = require("fs");
const endpoints = `
  /api/v1/warranties/{warrantyCode}:
    get:
      tags:
        - Warranty
      summary: Get Customer Warranty Info
      operationId: getCustomerWarranty
      parameters:
        - name: warrantyCode
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: OK
  /api/v1/admin/warranties:
    get:
      tags:
        - Admin Warranty
      summary: List Warranties
      operationId: listAdminWarranties
      responses:
        "200":
          description: OK
  /api/v1/admin/warranties/{warrantyCode}:
    get:
      tags:
        - Admin Warranty
      summary: Get Warranty Detail
      operationId: getAdminWarrantyDetail
      parameters:
        - name: warrantyCode
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: OK
  /api/v1/admin/warranty-claims:
    get:
      tags:
        - Admin Warranty
      summary: List Warranty Claims Queue
      operationId: listWarrantyClaims
      responses:
        "200":
          description: OK
  /api/v1/admin/warranty-claims/{claimId}:
    get:
      tags:
        - Admin Warranty
      summary: Get Warranty Claim Detail
      operationId: getWarrantyClaimDetail
      parameters:
        - name: claimId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
  /api/v1/admin/warranty-claims/{claimId}/process:
    post:
      tags:
        - Admin Warranty
      summary: Process Warranty Claim
      operationId: processWarrantyClaim
      parameters:
        - name: claimId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
  /api/v1/admin/warranty-claims/{claimId}/complete:
    post:
      tags:
        - Admin Warranty
      summary: Complete Warranty Claim
      operationId: completeWarrantyClaim
      parameters:
        - name: claimId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
  /api/v1/orders/{orderCode}/return-requests:
    get:
      tags:
        - Return, Exchange and Refund
      summary: List Customer Return Requests
      operationId: listCustomerReturnRequests
      parameters:
        - name: orderCode
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: OK
  /api/v1/orders/{orderCode}/return-requests/{returnId}:
    get:
      tags:
        - Return, Exchange and Refund
      summary: Get Customer Return Request Detail
      operationId: getCustomerReturnRequest
      parameters:
        - name: orderCode
          in: path
          required: true
          schema:
            type: string
        - name: returnId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
  /api/v1/admin/return-requests:
    get:
      tags:
        - Admin Return
      summary: List Admin Return Requests
      operationId: listAdminReturnRequests
      responses:
        "200":
          description: OK
  /api/v1/admin/return-requests/{returnId}:
    get:
      tags:
        - Admin Return
      summary: Get Admin Return Request Detail
      operationId: getAdminReturnRequestDetail
      parameters:
        - name: returnId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
  /api/v1/me/refunds:
    get:
      tags:
        - Return, Exchange and Refund
      summary: List Customer Refunds
      operationId: listCustomerRefunds
      responses:
        "200":
          description: OK
  /api/v1/admin/refunds:
    get:
      tags:
        - Admin Refund
      summary: List Admin Refunds
      operationId: listAdminRefunds
      responses:
        "200":
          description: OK
  /api/v1/admin/refunds/{refundId}:
    get:
      tags:
        - Admin Refund
      summary: Get Refund Detail
      operationId: getAdminRefundDetail
      parameters:
        - name: refundId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
  /api/v1/admin/refunds/{refundId}/execute:
    post:
      tags:
        - Admin Refund
      summary: Execute Internal Refund
      operationId: executeRefund
      parameters:
        - name: refundId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: OK
  /api/v1/webhooks/refunds/{providerCode}:
    post:
      tags:
        - Admin Refund
      summary: Refund Webhook Provider
      operationId: refundWebhook
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
  console.log("Successfully appended Warranty, Return, Refund endpoints!");
}
