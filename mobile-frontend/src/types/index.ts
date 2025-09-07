export interface Issue {
  id: string;
  title: string;
  description: string;
  category: 'Road' | 'Water' | 'Garbage' | 'Electricity' | 'Manholes' | 'Water Shortage' | 'Street Lights' | 'Other';
  status: 'Pending' | 'In Progress' | 'Resolved';
  location: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  upvotes: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  userName: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'status_update' | 'upvote' | 'comment';
  read: boolean;
  createdAt: string;
  issueId?: string;
}