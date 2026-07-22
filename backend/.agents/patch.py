import sys

with open('docs/api/openapi.yaml', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_paths = """  /api/v1/orders/checkout:
    post:
      tags:
        - Sales Order Management
      summary: Tạo đơn hàng từ giỏ hàng (Checkout)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CheckoutRequest'
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/OrderResponse'
  /api/v1/me/orders:
    get:
      tags:
        - Sales Order Management
      summary: Lấy lịch sử đơn hàng của tôi
      responses:
        '200':
          description: OK
  /api/v1/me/orders/{orderCode}:
    get:
      tags:
        - Sales Order Management
      summary: Chi tiết đơn hàng của customer
      parameters:
        - name: orderCode
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/OrderResponse'
  /api/v1/admin/orders:
    get:
      tags:
        - Sales Order Management
      summary: Danh sách đơn hàng (vận hành)
      responses:
        '200':
          description: OK
  /api/v1/admin/orders/{orderId}/confirm:
    post:
      tags:
        - Sales Order Management
      summary: Xác nhận đơn hàng (Duyệt đơn)
      parameters:
        - name: orderId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '204':
          description: OK

"""

new_schemas = """    CheckoutRequest:
      type: object
      required:
        - idempotencyKey
      properties:
        idempotencyKey:
          type: string
          example: xxyyzz
        couponCode:
          type: string
        shippingAddressId:
          type: string
          format: uuid
        guestName:
          type: string
        guestPhone:
          type: string
        guestEmail:
          type: string
        guestProvinceCode:
          type: string
        guestDistrictCode:
          type: string
        guestWardCode:
          type: string
        guestDetailAddress:
          type: string
        note:
          type: string
    OrderItemResponse:
      type: object
      properties:
        id:
          type: string
          format: uuid
        productName:
          type: string
        variantName:
          type: string
        sku:
          type: string
        unitPrice:
          type: number
        quantity:
          type: integer
        discountAmount:
          type: number
        lineTotal:
          type: number
    OrderResponse:
      type: object
      properties:
        id:
          type: string
          format: uuid
        orderCode:
          type: string
        customerId:
          type: string
          format: uuid
        contactName:
          type: string
        contactPhone:
          type: string
        shippingDetailAddress:
          type: string
        currency:
          type: string
        subtotalAmount:
          type: number
        discountAmount:
          type: number
        shippingFee:
          type: number
        grandTotalAmount:
          type: number
        status:
          type: string
        createdAt:
          type: string
          format: date-time
        items:
          type: array
          items:
            $ref: '#/components/schemas/OrderItemResponse'
"""

components_index = -1
for i, line in enumerate(lines):
    if line.startswith('components:'):
        components_index = i
        break

if components_index != -1:
    lines.insert(components_index, new_paths)
    lines.append(new_schemas)
    
with open('docs/api/openapi.yaml', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("done")
