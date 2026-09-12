# 01. Authentication & Enterprise Profile APIs

Handles user signup, login for all 3 portal roles (`USER`, `LOCAL_AUTH`, `MAIN_AUTH`), JWT issuance, session management, and enterprise profile CRUD.

---

## 1. Register User / Enterprise
- **Endpoint**: `/api/auth/register`
- **Method**: `POST`
- **Access**: Public
- **Headers**: `Content-Type: application/json`

### Request Body JSON Format
```json
{
  "fullName": "Rajesh Kumar Sharma",
  "email": "rajesh@sharmaenterprises.in",
  "password": "SecurePassword@123",
  "phone": "+919876543210",
  "companyName": "Sharma Precision Polymers Pvt Ltd",
  "udyamNumber": "UDYAM-MH-12-0045612",
  "cinNumber": "U25209MH2021PTC356789",
  "gstin": "27AAACS1429B1ZB",
  "industryType": "Polymer & Plastic Manufacturing",
  "scale": "MEDIUM",
  "panNumber": "AAACS1429B",
  "address": {
    "plotNumber": "Plot A-44/2",
    "street": "Phase 2, MIDC Industrial Area",
    "city": "Taloja",
    "district": "Raigad",
    "state": "Maharashtra",
    "pincode": "410208"
  }
}
```

### Success Response JSON Format (`201 Created`)
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Enterprise registered successfully. Please verify your email.",
  "data": {
    "userId": "usr_678a12bc90ef",
    "email": "rajesh@sharmaenterprises.in",
    "companyName": "Sharma Precision Polymers Pvt Ltd",
    "role": "USER",
    "isVerified": false,
    "createdAt": "2026-09-12T01:30:00.000Z"
  }
}
```

---

## 2. Login User / Authority Officer
- **Endpoint**: `/api/auth/login`
- **Method**: `POST`
- **Access**: Public
- **Headers**: `Content-Type: application/json`

### Request Body JSON Format
```json
{
  "email": "rajesh@sharmaenterprises.in",
  "password": "SecurePassword@123",
  "portalType": "USER"
}
```
*Note: `portalType` accepts `"USER"`, `"LOCAL_AUTH"`, or `"MAIN_AUTH"`.*

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "dGhpcy1pcy1hLXJlZnJlc2gtdG9rZW4...",
    "user": {
      "id": "usr_678a12bc90ef",
      "fullName": "Rajesh Kumar Sharma",
      "email": "rajesh@sharmaenterprises.in",
      "role": "USER",
      "companyName": "Sharma Precision Polymers Pvt Ltd",
      "designation": "Managing Director",
      "unreadNotifications": 3
    }
  }
}
```

---

## 3. Logout
- **Endpoint**: `/api/auth/logout`
- **Method**: `POST`
- **Access**: Authenticated
- **Headers**: `Authorization: Bearer <TOKEN>`

### Request Body JSON Format
```json
{}
```

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Logged out successfully"
}
```

---

## 4. Get Current Profile
- **Endpoint**: `/api/auth/profile`
- **Method**: `GET`
- **Access**: Authenticated
- **Headers**: `Authorization: Bearer <TOKEN>`

### Request Parameters
None. Reads user identity from JWT.

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Profile fetched successfully",
  "data": {
    "id": "usr_678a12bc90ef",
    "fullName": "Rajesh Kumar Sharma",
    "email": "rajesh@sharmaenterprises.in",
    "phone": "+919876543210",
    "role": "USER",
    "companyName": "Sharma Precision Polymers Pvt Ltd",
    "udyamNumber": "UDYAM-MH-12-0045612",
    "cinNumber": "U25209MH2021PTC356789",
    "gstin": "27AAACS1429B1ZB",
    "industryType": "Polymer & Plastic Manufacturing",
    "scale": "MEDIUM",
    "panNumber": "AAACS1429B",
    "totalInvestedCapitalInr": 18500000,
    "annualTurnoverInr": 42000000,
    "totalEmployees": 48,
    "powerRequirementKW": 85,
    "waterRequirementKLD": 22,
    "address": {
      "plotNumber": "Plot A-44/2",
      "street": "Phase 2, MIDC Industrial Area",
      "city": "Taloja",
      "district": "Raigad",
      "state": "Maharashtra",
      "pincode": "410208"
    },
    "complianceScore": 94,
    "createdAt": "2026-09-12T01:30:00.000Z"
  }
}
```

---

## 5. Update Enterprise Profile
- **Endpoint**: `/api/auth/profile`
- **Method**: `PUT`
- **Access**: Authenticated (`USER`)
- **Headers**: `Authorization: Bearer <TOKEN>`, `Content-Type: application/json`

### Request Body JSON Format
```json
{
  "fullName": "Rajesh Kumar Sharma",
  "phone": "+919876543210",
  "totalInvestedCapitalInr": 22000000,
  "annualTurnoverInr": 51000000,
  "totalEmployees": 55,
  "powerRequirementKW": 95,
  "waterRequirementKLD": 25,
  "address": {
    "plotNumber": "Plot A-44/2 & A-44/3",
    "street": "Phase 2, MIDC Industrial Area",
    "city": "Taloja",
    "district": "Raigad",
    "state": "Maharashtra",
    "pincode": "410208"
  }
}
```

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Enterprise profile updated successfully",
  "data": {
    "id": "usr_678a12bc90ef",
    "updatedAt": "2026-09-12T01:35:00.000Z"
  }
}
```

---

## 6. Forgot Password (OTP / Reset Link)
- **Endpoint**: `/api/auth/forgot-password`
- **Method**: `POST`
- **Access**: Public
- **Headers**: `Content-Type: application/json`

### Request Body JSON Format
```json
{
  "email": "rajesh@sharmaenterprises.in"
}
```

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Password reset OTP has been sent to your registered email."
}
```

---

## 7. Reset Password with Token
- **Endpoint**: `/api/auth/reset-password`
- **Method**: `POST`
- **Access**: Public
- **Headers**: `Content-Type: application/json`

### Request Body JSON Format
```json
{
  "email": "rajesh@sharmaenterprises.in",
  "resetToken": "981240",
  "newPassword": "NewSecurePassword@2026"
}
```

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Password updated successfully. Please log in with your new credentials."
}
```
