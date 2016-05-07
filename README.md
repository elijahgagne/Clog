# Clog

This is the Clog project. It is a simple chat web application running on NodeJS and MongoDB.

FEATURES
========

Modes
-----
- Allow full-screen mode (Dashboard)
- Allow embedded mode (Portal)
- Allow third-party clients (Native)


Authentication
--------------
- Users must authenticate to access Clog Dashboard
  - Use CAS authentication and then create a JWT which will be stored in a cookie. Include a SessionID in the JWT for tracking session state.

Dashboard
---------
- Display recent chats, and be able to open them
  - Look in the CHAT_AUTH collection to see the chats the user is allowed to see
- Relaunch open chats if user refreshes their browser
  - Look at the "Chats" in the SESSION collection to see what chats were open for that session
- Show list of users with their online/offline status
  - Look at the LastHeartbeatTime in the USER collection (< 1 minutes = Online)
  - Everytime a user sends a message successfuly LastHeartbeatTime will be updated
  - If there is no activity for 30 seconds over the WS, a heartbeat message will be sent from client
- Allow alert to be broadcast to all clients
  - "system message" type that is sent over the websocket
  - Administrators can send a "system message"
  - When a user logs-in, they will be presented with all active system messages for ack


Communication
-------------
- All communication is TLS
  - Launch WebSocket with (Ex. wss://hostname/websocket)
- WebSocket Starts after login
- One WebSocket per Window Tab
- WebSocket Keep-alive 
  - If there is no activity for 30 seconds over the WS, a heartbeat message will be sent from client
  - When any activity is received from the client over the WS, the LastHeartbeatTime attribute will be updated in the USER collection
- Provide High Availability of all components
  - JWT cookie manages session, so it doesn't matter which backend server a client users
  - WebSocket can be launched to any server
  - Messages from a client must be published to a server-side queue. This queue will be accessible from servers using publish/subscribe model
  - Should the Queue be persistent?
  - When should a chat message be written to the database? When the message arrives at the server? or by a worker thread that subscribes to all chats?

Starting Chat
-------------
- Must authenticate to start chat with individual
- Can email invitation to chat
- Invitation sent via browser if online, email if offline or if browser invitation not addressed in 5 minutes
- Guest can be invited to chats by email address of "copy URL" invitation
- Chats can be created as public so guests can connect
- Chat invitation URL same for authenticated user as guest (if public chat)
- Keep internal chat identifiers short
- Use internal chat identifier in invitation (ex. https://chat.dartmouth.edu/go/A1C2 )
- Guest can initiated chat with team (HelpDesk style)

Joining Chat
------------
- Accessing invitation URL will allow user to authenticate or proceed as a Guest
- Guest access single chat

Chat Session
------------
- Send message to other users
- File Upload
- See when user starts/stops typing per channel
- Messages will have a time, user attribute
- Implement Markdown syntax in messages
- Show user online/offline
- Allow multi-lined messages
- Show members of a chat
- Display missed messages in a chat when reconnected
- Only allow invitees to join a chat (Guest allowed if public chat)
- Chat can be made public after start
- Chat can be made private after start
- Any authenticated member of chat can evict guest
- Chat owner can evict any user
- Public chat can only exist for 10 minutes after last authenticated user in session
- Play sounds when certain events occur (Online/Offline/Message/Invite)


DATABASE DESIGN
===============
 
CHAT
----
ChatID
StartTime

CHAT_MESSAGE
------------
ChatID
Message
Timestamp
 
CHAT_AUTH
---------
ChatID
UserID
Owner (T/F)
 
USER
----
UserID
Name
Guest (T/F)
LastHeartbeatTime
AckdSystemMessages: [SystemMessageID1, SystemMessageID2, ...]
Administrator (T/F)

SESSION
-------
SessionID
UserID
Chats: [ChatID1, ChatID2, ...]

SYSTEM_MESSAGE
--------------
SystemMessageID
Message
ValidUntilTime


WEBSOCKET PROTOCOL
==================
S: {"type": 'system message', "msg": 'This is a system message', "SystemMessageId": 1234}
C: {"type": 'system message ack', "SystemMessageId": 1234}
