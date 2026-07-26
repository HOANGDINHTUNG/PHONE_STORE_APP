const fs = require('fs');
const endpoints = `
  /api/v1/cart/items:
    delete:
      tags:
        - Cart
      summary: Clear Cart
      operationId: clearCart
      responses:
        "204":
          description: No Content
  /api/v1/cart/coupon-quote:
    post:
      tags:
        - Cart
      summary: Quote Coupon
      operationId: quoteCoupon
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                code:
                  type: string
      responses:
        "200":
          description: OK
  /api/v1/admin/coupons/{code}/status:
    patch:
      tags:
        - Admin Coupons
      summary: Change Coupon Status
      operationId: changeCouponStatus
      parameters:
        - name: code
          in: path
          required: true
          schema:
            type: string
        - name: status
          in: query
          required: true
          schema:
            type: string
      responses:
        "200":
          description: OK
`;

let content = fs.readFileSync('phone-store-openapi.yaml', 'utf8');
const lines = content.split('\\n');
const compIndex = lines.findIndex(l => l.startsWith('components:'));
if (compIndex > -1) {
  lines.splice(compIndex, 0, endpoints);
  fs.writeFileSync('phone-store-openapi.yaml', lines.join('\\n'));
  console.log("Successfully appended new endpoints!");
}
`;
