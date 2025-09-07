import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Issue, Notification } from '../types';

const API_BASE_URL = __DEV__ ? 'http://10.0.2.2:5000' : 'https://your-api.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Auth token management
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('auth_token');
      // Navigate to login
    }
    return Promise.reject(error);
  }
);

// Sync offline data
export const syncOfflineData = async () => {
  const offline = await AsyncStorage.getItem('offline_issues');
  if (offline) {
    const offlineIssues = JSON.parse(offline);
    for (const issue of offlineIssues) {
      try {
        await api.post('/issues', issue);
      } catch (error) {
        console.log('Sync failed for issue:', issue.id);
      }
    }
    await AsyncStorage.removeItem('offline_issues');
  }
};

// Mock data for development
const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Pothole on Main Street',
    description: 'Large pothole causing traffic issues',
    category: 'Road',
    status: 'Pending',
    location: 'Main Street, Downtown',
    upvotes: 15,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    userId: 'user1',
    userName: 'John Doe'
  },
  {
    id: '2',
    title: 'Water Leak in Park Avenue',
    description: 'Continuous water leak from underground pipe',
    category: 'Water',
    status: 'In Progress',
    location: 'Park Avenue, Block 5',
    upvotes: 8,
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-16T09:15:00Z',
    userId: 'user2',
    userName: 'Jane Smith'
  }
];

export const issuesAPI = {
  async getAll(): Promise<Issue[]> {
    try {
      const response = await api.get('/issues');
      const issues = response.data;
      await AsyncStorage.setItem('cached_issues', JSON.stringify(issues));
      return issues;
    } catch (error) {
      console.warn('API call failed, using cached data');
      const cached = await AsyncStorage.getItem('cached_issues');
      return cached ? JSON.parse(cached) : mockIssues;
    }
  },

  async create(issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'upvotes'>): Promise<Issue> {
    try {
      const response = await api.post('/issues', issueData);
      return response.data;
    } catch (error) {
      // Store offline for sync later
      const offline = await AsyncStorage.getItem('offline_issues') || '[]';
      const offlineIssues = JSON.parse(offline);
      const newIssue = { ...issueData, id: Date.now().toString(), offline: true };
      offlineIssues.push(newIssue);
      await AsyncStorage.setItem('offline_issues', JSON.stringify(offlineIssues));
      throw error;
    }
  },

  async upvote(id: string): Promise<Issue> {
    try {
      const response = await api.post(`/issues/${id}/upvote`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async uploadImage(imageUri: string): Promise<string> {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'issue.jpg',
    } as any);
    
    try {
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.url;
    } catch (error) {
      return imageUri;
    }
  }
};

export const authAPI = {
  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    await AsyncStorage.setItem('auth_token', token);
    await AsyncStorage.setItem('user_data', JSON.stringify(user));
    return { token, user };
  },

  async register(userData: any) {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  async logout() {
    await AsyncStorage.multiRemove(['auth_token', 'user_data']);
  }
};