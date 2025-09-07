import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mockNotifications = [
  {
    id: '1',
    title: 'Issue Status Updated',
    message: 'Your water leak report is now being addressed',
    type: 'status_update',
    read: false,
    createdAt: '2024-01-17T10:30:00Z',
  },
  {
    id: '2',
    title: 'New Upvote',
    message: 'Someone upvoted your pothole report',
    type: 'upvote',
    read: true,
    createdAt: '2024-01-16T15:45:00Z',
  },
];

const notificationIcons = {
  status_update: 'checkmark-circle-outline',
  upvote: 'thumbs-up-outline',
  comment: 'chatbubble-outline',
};

export default function NotificationsScreen() {
  const renderNotification = ({ item }: any) => {
    const iconName = notificationIcons[item.type as keyof typeof notificationIcons] as keyof typeof Ionicons.glyphMap;
    
    return (
      <TouchableOpacity style={[styles.notificationCard, !item.read && styles.unreadCard]}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={iconName} 
            size={24} 
            color={item.read ? '#666' : '#3498DB'} 
          />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{item.title}</Text>
            {!item.read && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.time}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <Text style={styles.headerSubtitle}>Stay updated on your issues</Text>
      </View>

      <FlatList
        data={mockNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  list: {
    padding: 16,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadCard: {
    backgroundColor: '#f8f9ff',
    borderLeftWidth: 4,
    borderLeftColor: '#3498DB',
  },
  iconContainer: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3498DB',
  },
  message: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
});