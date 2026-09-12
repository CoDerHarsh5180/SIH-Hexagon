# 08. Notifications & Real-Time Alerts APIs

Provides alert notification management across all three portals (`User`, `Local Authority`, `Main Authority`) for SLA warnings, inspection schedules, discrepancy notices, fee challan receipts, and approval grant announcements.

---

## 1. Get Notifications
- **Endpoint**: `/api/notifications`
- **Method**: `GET`
- **Access**: Authenticated (All Roles)
- **Headers**: `Authorization: Bearer <TOKEN>`

### Request Query Parameters
| Parameter | Type | Required | Description | Example |
|---|---|---|---|---|
| `unreadOnly` | Boolean | No | Filter only unread | `true` |
| `type` | String | No | Filter by alert category | `SLA_WARNING`, `INSPECTION_SCHEDULED`, `DISCREPANCY_RAISED` |
| `page` | Integer | No | Page number | `1` |
| `limit` | Integer | No | Limit per page | `15` |

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Notifications fetched successfully",
  "data": [
    {
      "id": "notif-001",
      "type": "INSPECTION_SCHEDULED",
      "title": "Site Inspection Scheduled",
      "message": "Officer Anand Patil scheduled field inspection for CTE Orange on 2026-09-15 at 11:30 AM.",
      "timestamp": "2026-09-12T01:15:00.000Z",
      "read": false,
      "link": "/user/track/APP-MH-2026-89412",
      "applicationId": "APP-MH-2026-89412"
    },
    {
      "id": "notif-002",
      "type": "DISCREPANCY_RAISED",
      "title": "Discrepancy Raised on Form 1",
      "message": "Clarification required on hazardous waste storage layout. Please submit response before 2026-09-22.",
      "timestamp": "2026-09-11T14:20:00.000Z",
      "read": false,
      "link": "/user/pending-docs",
      "applicationId": "APP-MH-2026-89412"
    },
    {
      "id": "notif-003",
      "type": "SLA_WARNING",
      "title": "Clearance Approaching SLA Milestone",
      "message": "Water Supply Sanction file has 4 days remaining under Citizen Charter SLA.",
      "timestamp": "2026-09-10T09:00:00.000Z",
      "read": true,
      "link": "/user/track/APP-MH-2026-89413",
      "applicationId": "APP-MH-2026-89413"
    }
  ],
  "pagination": {
    "total": 3,
    "page": 1,
    "limit": 15,
    "totalPages": 1
  }
}
```

---

## 2. Get Unread Notification Count
Powers the live unread badge in the navigation bar.

- **Endpoint**: `/api/notifications/unread-count`
- **Method**: `GET`
- **Access**: Authenticated
- **Headers**: `Authorization: Bearer <TOKEN>`

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "unreadCount": 2
  }
}
```

---

## 3. Mark Notification as Read
- **Endpoint**: `/api/notifications/:id/read`
- **Method**: `PATCH`
- **Access**: Authenticated
- **Headers**: `Authorization: Bearer <TOKEN>`

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Notification marked as read"
}
```

---

## 4. Mark All Notifications as Read
- **Endpoint**: `/api/notifications/mark-all-read`
- **Method**: `POST`
- **Access**: Authenticated
- **Headers**: `Authorization: Bearer <TOKEN>`

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "All notifications marked as read"
}
```

---

## 5. Delete Notification
- **Endpoint**: `/api/notifications/:id`
- **Method**: `DELETE`
- **Access**: Authenticated
- **Headers**: `Authorization: Bearer <TOKEN>`

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Notification deleted successfully"
}
```
