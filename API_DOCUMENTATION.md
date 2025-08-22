# Esusu App API Documentation

**Base URL**: `http://localhost:5000/api`

This document outlines all the available API endpoints for the Esusu savings application. All responses follow a standard format: `{ success, message, data? }`.

---

## 1. User Authentication

Handles user registration and login.

### 1.1 User Login
Authenticates a user and returns their details along with a JWT token for future requests.

- **Endpoint:** `/users/login`
- **Method:** `POST`
- **Authentication:** Public (No token required).
- **Request Body:**
  ```json
  {
      "email": "user@example.com",
      "password": "userpassword123"
  }


- **Success Response (200 OK):**
{
    "success": true,
    "message": "Login successful!",
    "data": {
        "_id": "60d5ecb0c5f2a1b9c8f8b8a1",
        "fullName": "Blessing Uzoukwu",
        "email": "user@example.com",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}

- **Error Response (401 Unauthorized):**
{
    "success": false,
    "message": "Invalid credentials"
}

<!--
1.2 User Signup
Registers a new user in the database.

Endpoint: /users/signup

Method: POST

Authentication: Public.

Request Body:
-->

{
    "fullName": "New User",
    "email": "new.user@example.com",
    "phoneNumber": "08012345678",
    "password": "newpassword123"
}

- **Success Response (201 Created):**

{
    "success": true,
    "message": "User registered successfully!"
}

- **Error Response (400 Bad Request):**

{
    "success": false,
    "message": "User with this email already exists"
}

### 1.3 Get Current User Details
Fetches the profile data of the currently logged-in user using their JWT token. This is useful for re-populating user data when the app loads.

- **Endpoint:** `/users/me`
- **Method:** `GET`
- **Authentication:** **Required.** Must include `Authorization: Bearar <token>` in the request header.
- **Request Body:** (None)
- **Success Response (200 OK):**
  ```json
  {
      "success": true,
      "message": "User data fetched successfully",
      "data": {
          "_id": "60d5ecb0c5f2a1b9c8f8b8a1",
          "fullName": "Blessing Uzoukwu",
          "email": "user@example.com",
          "phoneNumber": "08012345678"
      }
  }

- **Error Response (401 Unauthorized):**
  {
    "success": false,
    "message": "Not authorized, token failed"
}

<!--
2. Groups
Handles the creation and retrieval of Esusu groups.

2.1 Get All Groups
Fetches a list of all available Esusu groups to display on the home page.

Endpoint: /groups

Method: GET

Authentication: Public.

Success Response (200 OK):
-->

{
    "success": true,
    "message": "Groups fetched successfully",
    "data": [
        {
            "_id": "60d5f2a1b9c8f8b8a1ecb0c5",
            "groupName": "Family and Friends Esusu",
            "numberOfMembers": 10,
            "contributionAmount": 5000,
            "admin": {
                "_id": "60d5ecb0c5f2a1b9c8f8b8a1",
                "fullName": "Blessing Uzoukwu"
            },
            "members": ["60d5ecb0c5f2a1b9c8f8b8a1"],
            "startingDate": "2025-08-15T00:00:00.000Z"
        }
    ]
}

<!--
2.2 Create a New Group
Creates a new Esusu group. The creator automatically becomes the admin.

Endpoint: /groups

Method: POST

Authentication: Required. Must include Authorization: Bearer <token> in the request header.

Request Body:
-->

{
    "groupName": "Office Colleagues",
    "numberOfMembers": 5,
    "contributionAmount": 10000,
    "startingDate": "2025-09-01"
}

- **Success Response (201 Created):**
{
    "success": true,
    "message": "Group created successfully",
    "data": {
        "_id": "60d5f2a1b9c8f8b8a2ecb0c6",
        "groupName": "Office Colleagues",
        "numberOfMembers": 5,
        "contributionAmount": 10000,
        "admin": "60d5ecb0c5f2a1b9c8f8b8a1",
        "members": ["60d5ecb0c5f2a1b9c8f8b8a1"],
        "startingDate": "2025-09-01T00:00:00.000Z"
    }
}

<!--
3. Joining and Managing Groups
Handles join requests and admin approvals.

3.1 Request to Join a Group
Allows a logged-in user to send a request to join a specific group.

Endpoint: /groups/:id/join (e.g., /groups/60d5f2a1b9c8f8b8a1ecb0c5/join)

Method: POST

Authentication: Required.

Request Body:
-->

{
    "chosenNumber": 7,
    "accountDetails": "0123456789"
}

**Success Response (201 Created):**

{
    "success": true,
    "message": "Your request to join the group has been sent successfully!"
}

**Error Response (400 Bad Request):**

{
    "success": false,
    "message": "You are already a member of this group"
}

<!-- 3.2 Get Pending Join Requests (Admin Only)
Fetches all pending join requests for a specific group.

Endpoint: /groups/:id/requests (e.g., /groups/60d5f2a1b9c8f8b8a1ecb0c5/requests)

Method: GET

Authentication: Required. Only the admin of the group can access this.

Success Response (200 OK): -->

{
    "success": true,
    "message": "Pending requests fetched successfully",
    "data": [
        {
            "_id": "60d5f2a1b9c8f8b8a3ecb0c7",
            "user": {
                "_id": "60d5ecb0c5f2a1b9c8f8b8a2",
                "fullName": "John Doe",
                "email": "john.doe@example.com"
            },
            "chosenNumber": 5,
            "accountDetails": "0123456789"
        }
    ]
}

**Error Response (401 Unauthorized):**

{
    "success": false,
    "message": "Not authorized"
}

<!-- 3.3 Approve a Join Request (Admin Only)
Allows a group admin to approve a pending join request, adding the user to the group.

Endpoint: /groups/requests/:requestId/approve (e.g., /groups/requests/60d5f2a1b9c8f8b8a3ecb0c7/approve)

Method: PUT

Authentication: Required. Only the admin of the group can perform this action.

Request Body: (None)

Success Response (200 OK): -->

{
    "success": true,
    "message": "User has been added to the group!"
}

- **Error Response (404 Not Found):**

{
    "success": false,
    "message": "Request not found"
}