const fs = require('fs');
const endpoints = `
  /api/v1/admin/positions/{id}:
    patch:
      tags:
        - Organization Management
      summary: Update Position
      operationId: updatePosition
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
              $ref: "#/components/schemas/PositionRequest"
      responses:
        "200":
          description: OK
        "400":
          $ref: "#/components/responses/BadRequest"
        "403":
          $ref: "#/components/responses/Forbidden"
  /api/v1/admin/positions/{id}/status:
    patch:
      tags:
        - Organization Management
      summary: Change Position Status
      operationId: changePositionStatus
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
  /api/v1/admin/staff/{id}:
    get:
      tags:
        - Organization Management
      summary: Get Staff Detail
      operationId: getStaff
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
        - Organization Management
      summary: Update Staff
      operationId: updateStaff
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
  /api/v1/admin/staff/{id}/employment-status:
    patch:
      tags:
        - Organization Management
      summary: Change Employment Status
      operationId: changeEmploymentStatus
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
  /api/v1/admin/permissions:
    get:
      tags:
        - Organization Management
      summary: List Permissions
      operationId: listPermissions
      responses:
        "200":
          description: OK
  /api/v1/admin/roles/{id}:
    get:
      tags:
        - Organization Management
      summary: Get Role Detail
      operationId: getRoleDetail
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
        - Organization Management
      summary: Update Role
      operationId: updateRole
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
              $ref: "#/components/schemas/RoleRequest"
      responses:
        "200":
          description: OK
  /api/v1/admin/roles/{id}/status:
    patch:
      tags:
        - Organization Management
      summary: Change Role Status
      operationId: changeRoleStatus
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
  /api/v1/admin/roles/{id}/permissions:
    put:
      tags:
        - Organization Management
      summary: Replace Role Permissions
      operationId: replaceRolePermissions
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
              type: array
              items:
                type: string
                format: uuid
      responses:
        "200":
          description: OK
  /api/v1/admin/users/{id}/role-assignments:
    get:
      tags:
        - Admin User Management
      summary: List User Role Assignments
      operationId: listUserRoleAssignments
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
    post:
      tags:
        - Admin User Management
      summary: Assign Role
      operationId: assignRole
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
              properties:
                roleId:
                  type: string
                  format: uuid
      responses:
        "201":
          description: Created
  /api/v1/admin/users/{id}/role-assignments/{assignmentId}/revoke:
    post:
      tags:
        - Admin User Management
      summary: Revoke Role Assignment
      operationId: revokeRoleAssignment
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - name: assignmentId
          in: path
          required: true
          schema:
            type: string
            format: uuid
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
