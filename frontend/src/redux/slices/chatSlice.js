import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL;

export const fetchChats = createAsyncThunk(
  'chat/fetchChats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/chat`, {
        headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchChatMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/chat/${chatId}/messages`, {
        headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return { chatId, messages: response.data.messages };
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ chatId, content }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/chat/${chatId}/messages`, 
        { content },
        { headers: { authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      return { chatId, message: response.data.message };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const startChat = createAsyncThunk(
  'chat/startChat',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/chat/start`, 
        { userId },
        { headers: { authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start chat');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteChat = createAsyncThunk(
  'chat/deleteChat',
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/chat/${chatId}`, {
        headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Chat deleted');
      return chatId;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState = {
  chats: [],
  selectedChat: null,
  messages: {},
  isLoading: false,
  isSending: false,
  error: null,
  unreadCount: 0
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    selectChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    addMessageLocally: (state, action) => {
      const { chatId, message } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].push(message);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Chats
      .addCase(fetchChats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chats = action.payload.chats || [];
        state.unreadCount = action.payload.unreadCount || 0;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Messages
      .addCase(fetchChatMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchChatMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages[action.payload.chatId] = action.payload.messages;
      })
      .addCase(fetchChatMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.isSending = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isSending = false;
        const { chatId, message } = action.payload;
        if (!state.messages[chatId]) {
          state.messages[chatId] = [];
        }
        state.messages[chatId].push(message);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isSending = false;
        state.error = action.payload;
      })
      // Start Chat
      .addCase(startChat.fulfilled, (state, action) => {
        const existingChat = state.chats.find(c => c.id === action.payload.chat.id);
        if (!existingChat) {
          state.chats.push(action.payload.chat);
        }
        state.selectedChat = action.payload.chat;
      })
      // Delete Chat
      .addCase(deleteChat.fulfilled, (state, action) => {
        state.chats = state.chats.filter(c => c.id !== action.payload);
        if (state.selectedChat?.id === action.payload) {
          state.selectedChat = null;
        }
        delete state.messages[action.payload];
      });
  }
});

export const { selectChat, addMessageLocally } = chatSlice.actions;
export default chatSlice.reducer;
