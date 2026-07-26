const fs = require('fs');
const endpoints = `
  /api/v1/admin/products/{productId}/variants:
    post:
      tags:
        - Admin Catalog
      summary: Create Product Variant
      operationId: createProductVariant
      parameters:
        - name: productId
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
  /api/v1/admin/variants/{variantId}:
    patch:
      tags:
        - Admin Catalog
      summary: Update Product Variant
      operationId: updateProductVariant
      parameters:
        - name: variantId
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
  /api/v1/admin/variants/{variantId}/status:
    patch:
      tags:
        - Admin Catalog
      summary: Change Variant Status
      operationId: changeVariantStatus
      parameters:
        - name: variantId
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
  /api/v1/admin/variants/{variantId}/price-changes:
    post:
      tags:
        - Admin Catalog
      summary: Change Variant Price
      operationId: changeVariantPrice
      parameters:
        - name: variantId
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
  /api/v1/admin/variants/{variantId}/images:
    post:
      tags:
        - Admin Catalog
      summary: Add Variant Image
      operationId: addVariantImage
      parameters:
        - name: variantId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                file:
                  type: string
                  format: binary
      responses:
        "201":
          description: Created
  /api/v1/admin/variants/{variantId}/images/{imageId}/set-primary:
    post:
      tags:
        - Admin Catalog
      summary: Set Primary Image
      operationId: setPrimaryImage
      parameters:
        - name: variantId
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - name: imageId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "204":
          description: No Content
  /api/v1/admin/variants/{variantId}/images/{imageId}:
    delete:
      tags:
        - Admin Catalog
      summary: Delete Variant Image
      operationId: deleteVariantImage
      parameters:
        - name: variantId
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - name: imageId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        "204":
          description: No Content
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
