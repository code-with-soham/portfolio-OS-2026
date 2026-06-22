// ============================================
// Portfolio OS 2026 — WhatsApp Store (Zustand)
// ============================================
// Manages all WhatsApp app state: contacts, chats, messages,
// active chat, views, typing indicators, and user profile.

import { create } from 'zustand';

// ─── Contact Data ───
const CONTACTS = [
  { id: 'c1', name: 'Manoj Rayi', phone: '+91 98765 43210', about: 'Full Stack Developer 🚀', image: 'https://github.com/rayimanoj8.png', lastMessage: 'Your Last Message Here', lastTime: '10:30 AM', unread: 2, online: true, lastSeen: null, favorite: false },
  { id: 'c2', name: 'Anjali Kumar', phone: '+91 87654 32109', about: 'UI/UX Designer ✨', image: 'https://randomuser.me/api/portraits/women/2.jpg', lastMessage: 'Hello, how are you?', lastTime: '9:45 AM', unread: 1, online: true, lastSeen: null, favorite: true },
  { id: 'c3', name: 'Ravi Teja', phone: '+91 76543 21098', about: 'Backend Engineer 💻', image: 'https://randomuser.me/api/portraits/men/3.jpg', lastMessage: 'Looking forward to the meeting.', lastTime: '9:15 AM', unread: 0, online: false, lastSeen: '12:30 PM', favorite: false },
  { id: 'c4', name: 'Sneha Reddy', phone: '+91 65432 10987', about: 'Data Scientist 📊', image: 'https://randomuser.me/api/portraits/women/4.jpg', lastMessage: 'Can you send the report?', lastTime: '8:50 AM', unread: 3, online: true, lastSeen: null, favorite: false },
  { id: 'c5', name: 'Arjun Das', phone: '+91 54321 09876', about: 'DevOps Engineer ⚙️', image: 'https://randomuser.me/api/portraits/men/5.jpg', lastMessage: 'Thank you for your help!', lastTime: '8:20 AM', unread: 0, online: false, lastSeen: '7:45 AM', favorite: true },
  { id: 'c6', name: 'Priya Sharma', phone: '+91 43210 98765', about: 'ML Engineer 🤖', image: 'https://randomuser.me/api/portraits/women/6.jpg', lastMessage: "Let's catch up soon.", lastTime: 'Yesterday', unread: 0, online: false, lastSeen: 'Yesterday', favorite: false },
  { id: 'c7', name: 'Vikram Singh', phone: '+91 32109 87654', about: 'React Developer ⚛️', image: 'https://randomuser.me/api/portraits/men/7.jpg', lastMessage: 'I will call you later.', lastTime: 'Yesterday', unread: 0, online: true, lastSeen: null, favorite: false },
  { id: 'c8', name: 'Kavya Rao', phone: '+91 21098 76543', about: 'Product Manager 📋', image: 'https://randomuser.me/api/portraits/women/8.jpg', lastMessage: 'Did you receive my email?', lastTime: 'Yesterday', unread: 1, online: false, lastSeen: '6:30 PM', favorite: false },
  { id: 'c9', name: 'Rahul Verma', phone: '+91 10987 65432', about: 'Cloud Architect ☁️', image: 'https://randomuser.me/api/portraits/men/9.jpg', lastMessage: 'Meeting rescheduled to tomorrow.', lastTime: 'Yesterday', unread: 0, online: false, lastSeen: '5:15 PM', favorite: false },
  { id: 'c10', name: 'Deepika Nair', phone: '+91 09876 54321', about: 'Graphic Designer 🎨', image: 'https://randomuser.me/api/portraits/women/10.jpg', lastMessage: 'Happy birthday! Have a great day!', lastTime: 'Tuesday', unread: 0, online: true, lastSeen: null, favorite: true },
  { id: 'c11', name: 'Rohit Malhotra', phone: '+91 98765 12340', about: 'Cybersecurity Expert 🔒', image: 'https://randomuser.me/api/portraits/men/11.jpg', lastMessage: "What's the update?", lastTime: 'Tuesday', unread: 0, online: false, lastSeen: 'Tuesday', favorite: false },
  { id: 'c12', name: 'Neha Gupta', phone: '+91 87654 12309', about: 'iOS Developer 🍎', image: 'https://randomuser.me/api/portraits/women/12.jpg', lastMessage: "Hope you're doing well!", lastTime: 'Monday', unread: 0, online: false, lastSeen: 'Monday', favorite: false },
  { id: 'c13', name: 'Amit Yadav', phone: '+91 76543 12098', about: 'Blockchain Developer 🔗', image: 'https://randomuser.me/api/portraits/men/13.jpg', lastMessage: "Let's finalize the project.", lastTime: 'Monday', unread: 0, online: false, lastSeen: 'Monday', favorite: false },
  { id: 'c14', name: 'Simran Kaur', phone: '+91 65432 10087', about: 'QA Engineer 🧪', image: 'https://randomuser.me/api/portraits/women/14.jpg', lastMessage: 'Good morning!', lastTime: 'Sunday', unread: 0, online: true, lastSeen: null, favorite: false },
  { id: 'c15', name: 'Varun Chopra', phone: '+91 54321 09076', about: 'Game Developer 🎮', image: 'https://randomuser.me/api/portraits/men/15.jpg', lastMessage: "I'll send the documents soon.", lastTime: 'Sunday', unread: 0, online: false, lastSeen: 'Saturday', favorite: false },
  { id: 'c16', name: 'Meera Joshi', phone: '+91 43210 98065', about: 'Android Developer 📱', image: 'https://randomuser.me/api/portraits/women/16.jpg', lastMessage: 'How was your weekend?', lastTime: 'Saturday', unread: 0, online: false, lastSeen: 'Friday', favorite: true },
  { id: 'c17', name: 'Karthik Reddy', phone: '+91 32109 87054', about: 'SRE Engineer 🛠️', image: 'https://randomuser.me/api/portraits/men/17.jpg', lastMessage: 'Please confirm the time.', lastTime: 'Saturday', unread: 0, online: false, lastSeen: 'Friday', favorite: false },
  { id: 'c18', name: 'Pooja Sharma', phone: '+91 21098 76043', about: 'Technical Writer ✍️', image: 'https://randomuser.me/api/portraits/women/18.jpg', lastMessage: 'See you at the event!', lastTime: 'Friday', unread: 0, online: false, lastSeen: 'Thursday', favorite: false },
  { id: 'c19', name: 'Sandeep Kumar', phone: '+91 10987 65032', about: 'System Analyst 📈', image: 'https://randomuser.me/api/portraits/men/19.jpg', lastMessage: 'Just checking in.', lastTime: 'Friday', unread: 0, online: false, lastSeen: 'Wednesday', favorite: false },
  { id: 'c20', name: 'Lavanya Patel', phone: '+91 09876 54021', about: 'AI Researcher 🧠', image: 'https://randomuser.me/api/portraits/women/20.jpg', lastMessage: "Don't forget the meeting.", lastTime: 'Thursday', unread: 0, online: true, lastSeen: null, favorite: false },
];

// ─── Pre-seed some chat history ───
function generateSeedMessages(contactId, contactName) {
  const now = Date.now();
  return [
    {
      id: `seed_${contactId}_1`,
      text: `Hey ${contactName}! 👋`,
      sender: 'me',
      senderName: 'Soham Kundu',
      timestamp: new Date(now - 3600000).toISOString(),
      status: 'read',
      type: 'text',
    },
    {
      id: `seed_${contactId}_2`,
      text: `Hi Soham! How are you doing?`,
      sender: contactId,
      senderName: contactName,
      timestamp: new Date(now - 3500000).toISOString(),
      status: 'delivered',
      type: 'text',
    },
    {
      id: `seed_${contactId}_3`,
      text: `I'm great, thanks! Working on some cool projects. 🚀`,
      sender: 'me',
      senderName: 'Soham Kundu',
      timestamp: new Date(now - 3400000).toISOString(),
      status: 'read',
      type: 'text',
    },
  ];
}

const initialChats = {};
CONTACTS.forEach((c) => {
  initialChats[c.id] = generateSeedMessages(c.id, c.name);
});

// ─── Call History ───
const INITIAL_CALLS = [
  { id: 'call1', contactId: 'c1', contactName: 'Manoj Rayi', contactImage: 'https://github.com/rayimanoj8.png', type: 'video', direction: 'outgoing', timestamp: new Date(Date.now() - 7200000).toISOString(), duration: '5:23' },
  { id: 'call2', contactId: 'c2', contactName: 'Anjali Kumar', contactImage: 'https://randomuser.me/api/portraits/women/2.jpg', type: 'audio', direction: 'incoming', timestamp: new Date(Date.now() - 86400000).toISOString(), duration: '12:45' },
  { id: 'call3', contactId: 'c4', contactName: 'Sneha Reddy', contactImage: 'https://randomuser.me/api/portraits/women/4.jpg', type: 'audio', direction: 'missed', timestamp: new Date(Date.now() - 172800000).toISOString(), duration: null },
  { id: 'call4', contactId: 'c5', contactName: 'Arjun Das', contactImage: 'https://randomuser.me/api/portraits/men/5.jpg', type: 'video', direction: 'incoming', timestamp: new Date(Date.now() - 259200000).toISOString(), duration: '28:10' },
  { id: 'call5', contactId: 'c7', contactName: 'Vikram Singh', contactImage: 'https://randomuser.me/api/portraits/men/7.jpg', type: 'audio', direction: 'outgoing', timestamp: new Date(Date.now() - 345600000).toISOString(), duration: '3:12' },
];

// ─── Status Data ───
const INITIAL_STATUSES = [
  { id: 's1', contactId: 'c2', contactName: 'Anjali Kumar', contactImage: 'https://randomuser.me/api/portraits/women/2.jpg', text: 'Working on a new design project! 🎨', timestamp: new Date(Date.now() - 3600000).toISOString(), viewed: false },
  { id: 's2', contactId: 'c4', contactName: 'Sneha Reddy', contactImage: 'https://randomuser.me/api/portraits/women/4.jpg', text: 'Data never lies! 📊 #DataScience', timestamp: new Date(Date.now() - 7200000).toISOString(), viewed: false },
  { id: 's3', contactId: 'c7', contactName: 'Vikram Singh', contactImage: 'https://randomuser.me/api/portraits/men/7.jpg', text: 'Just deployed a new React app 🚀', timestamp: new Date(Date.now() - 14400000).toISOString(), viewed: true },
  { id: 's4', contactId: 'c10', contactName: 'Deepika Nair', contactImage: 'https://randomuser.me/api/portraits/women/10.jpg', text: 'Art is the journey of a free soul 🖌️', timestamp: new Date(Date.now() - 21600000).toISOString(), viewed: true },
  { id: 's5', contactId: 'c14', contactName: 'Simran Kaur', contactImage: 'https://randomuser.me/api/portraits/women/14.jpg', text: 'Bug-free code is a myth 🐛😂', timestamp: new Date(Date.now() - 28800000).toISOString(), viewed: false },
];

export const useWhatsAppStore = create((set, get) => ({
  // ─── State ───
  contacts: CONTACTS,
  chats: initialChats,
  activeChat: null,
  currentView: 'chats', // 'chats' | 'status' | 'calls' | 'settings' | 'profile'
  searchQuery: '',
  filter: 'all', // 'all' | 'unread' | 'favorites' | 'groups'
  typingContacts: [],
  calls: INITIAL_CALLS,
  statuses: INITIAL_STATUSES,
  showEmojiPicker: false,
  showAttachMenu: false,
  messageInput: '',
  userProfile: {
    name: 'Soham Kundu',
    phone: '+91 7557804027',
    about: 'Full Stack Developer | Portfolio OS Creator 🚀',
    avatar: 'https://github.com/code-with-soham.png',
  },

  // ─── Actions ───
  setActiveChat: (contactId) => {
    const contact = get().contacts.find((c) => c.id === contactId);
    set({ activeChat: contact });
    // Mark as read
    if (contact) {
      set((state) => ({
        contacts: state.contacts.map((c) =>
          c.id === contactId ? { ...c, unread: 0 } : c
        ),
      }));
    }
  },

  setCurrentView: (view) => set({ currentView: view, activeChat: view === 'chats' ? get().activeChat : null }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setFilter: (filter) => set({ filter }),

  setMessageInput: (text) => set({ messageInput: text }),

  toggleEmojiPicker: () => set((s) => ({ showEmojiPicker: !s.showEmojiPicker, showAttachMenu: false })),

  toggleAttachMenu: () => set((s) => ({ showAttachMenu: !s.showAttachMenu, showEmojiPicker: false })),

  closeMenus: () => set({ showEmojiPicker: false, showAttachMenu: false }),

  sendMessage: (text) => {
    const { activeChat, chats } = get();
    if (!activeChat || !text.trim()) return;

    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: text.trim(),
      sender: 'me',
      senderName: 'Soham Kundu',
      timestamp: new Date().toISOString(),
      status: 'sent', // ✓
      type: 'text',
    };

    const contactChats = chats[activeChat.id] || [];

    set({
      chats: {
        ...chats,
        [activeChat.id]: [...contactChats, message],
      },
      messageInput: '',
      showEmojiPicker: false,
      showAttachMenu: false,
      // Update contact's last message
      contacts: get().contacts.map((c) =>
        c.id === activeChat.id
          ? { ...c, lastMessage: text.trim(), lastTime: 'Just now' }
          : c
      ),
    });

    // Simulate delivery after 500ms
    setTimeout(() => {
      set((state) => ({
        chats: {
          ...state.chats,
          [activeChat.id]: (state.chats[activeChat.id] || []).map((m) =>
            m.id === message.id ? { ...m, status: 'delivered' } : m
          ),
        },
      }));
    }, 500);

    return message;
  },

  receiveMessage: (contactId, message) => {
    const { chats, activeChat, contacts } = get();
    const contactChats = chats[contactId] || [];

    const contact = contacts.find((c) => c.id === contactId);

    set({
      chats: {
        ...chats,
        [contactId]: [...contactChats, message],
      },
      contacts: contacts.map((c) =>
        c.id === contactId
          ? {
              ...c,
              lastMessage: message.text,
              lastTime: 'Just now',
              unread: activeChat?.id === contactId ? 0 : c.unread + 1,
            }
          : c
      ),
    });
  },

  setTyping: (contactId, isTyping) => {
    set((state) => {
      if (isTyping) {
        return {
          typingContacts: state.typingContacts.includes(contactId)
            ? state.typingContacts
            : [...state.typingContacts, contactId],
        };
      } else {
        return {
          typingContacts: state.typingContacts.filter((id) => id !== contactId),
        };
      }
    });
  },

  updateContactStatus: (contactId, online, lastSeen) => {
    set((state) => ({
      contacts: state.contacts.map((c) =>
        c.id === contactId ? { ...c, online, lastSeen: lastSeen || c.lastSeen } : c
      ),
    }));
  },

  markAsRead: (contactId, messageIds) => {
    set((state) => ({
      chats: {
        ...state.chats,
        [contactId]: (state.chats[contactId] || []).map((m) =>
          messageIds.includes(m.id) ? { ...m, status: 'read' } : m
        ),
      },
    }));
  },

  addStatus: (text) => {
    const status = {
      id: `status_${Date.now()}`,
      contactId: 'me',
      contactName: 'Soham Kundu',
      contactImage: 'https://github.com/code-with-soham.png',
      text,
      timestamp: new Date().toISOString(),
      viewed: false,
    };
    set((state) => ({
      statuses: [status, ...state.statuses],
    }));
  },

  getFilteredContacts: () => {
    const { contacts, searchQuery, filter } = get();
    let filtered = contacts;

    // Apply search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.lastMessage.toLowerCase().includes(q)
      );
    }

    // Apply filter
    switch (filter) {
      case 'unread':
        filtered = filtered.filter((c) => c.unread > 0);
        break;
      case 'favorites':
        filtered = filtered.filter((c) => c.favorite);
        break;
      default:
        break;
    }

    return filtered;
  },
}));
