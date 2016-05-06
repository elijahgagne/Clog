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


Dashboard
---------
- Display recent chats, and be able to open them
- Relaunch open chats if user refreshes their browser
- Show list of users with their online/offline status
- Allow alert to be broadcast to all clients


Communication
-------------
- All communication is TLS
- WebSocket Starts after login
- One WebSocket per Window Tab
- WebSocket Keep-alive
- Provide High Availability of all components


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

 