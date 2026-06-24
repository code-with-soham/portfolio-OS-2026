# WhatsApp Clone Architecture (Portfolio OS)

## User Login Flow
```text
User Login (Phone Number)
↓
Search/Create Chat with another Phone Number
↓
Chat Room Created
↓
Messages stored in MongoDB
↓
Real-time updates via Socket.IO
↓
Both users see messages instantly
```

## Phase 1 — MVP
### Dummy Users
Seed 5 users:

| Name  | Phone         |
| ----- | ------------- |
| Soham | +911111111111 |
| Rahul | +912222222222 |
| Priya | +913333333333 |
| Amit  | +914444444444 |
| Neha  | +915555555555 |

Login: `Phone Number` + `PIN`. No OTP for MVP.

## Database Design

### User Model
```js
{
  _id,
  name,
  phone,
  avatar,
  pin,
  isOnline,
  lastSeen,
  createdAt
}
```

### Conversation Model
```js
{
  _id,
  participants: [ObjectId, ObjectId],
  lastMessage,
  lastMessageTime,
  createdAt
}
```

### Message Model
```js
{
  _id,
  conversationId,
  senderId,
  text,
  type: "text",
  readBy: [],
  createdAt
}
```

## Socket.IO Architecture
```text
User A Login → Socket Connect → Join Personal Room (userId)
User B Login → Socket Connect → Join Personal Room (userId)

User A Sends Message → Backend Stores Message → Emit To User B Room → User B Receives Instantly
```

## Backend Structure
```text
server/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   └── messageController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Conversation.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── chatRoutes.js
│   │   └── messageRoutes.js
│   ├── sockets/
│   │   └── socketHandler.js
│   ├── middleware/
│   │   └── auth.js
│   └── app.js
```

## API Design

### Login
`POST /api/auth/login`
Body: `{"phone": "+911111111111", "pin": "1234"}`
Returns: `{"token": "...", "user": {}}`

### Create Chat
`POST /api/chats`
Body: `{"phone": "+912222222222"}`
Logic: Find user by phone → Create conversation if not exists → Return conversation

### Get Chats
`GET /api/chats`

### Send Message
`POST /api/messages`
Body: `{"conversationId": "...", "text": "Hello"}`

## Socket Events
- **Client → Server**: `join_user`, `send_message`, `typing`, `stop_typing`, `mark_read`
- **Server → Client**: `receive_message`, `message_read`, `user_online`, `user_offline`, `typing`

## Frontend Flow
Login → Sidebar (Chats/Contacts/Search) → Select Chat → Chat Window (Messages/Input/Send)

## UI Inside Portfolio OS
Registered as `WhatsApp Desktop` App using Windows 11 style. Support minimize, maximize, restore, and maintain state across refreshes.

## Future Features
- **Phase 2**: Message Read Receipts, Online Status, Typing Indicator, Profile Photos.
- **Phase 3**: Group Chat, File Upload, Image Sharing, Voice Notes.
