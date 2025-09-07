import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Issue } from '../types';

interface IssueCardProps {
  issue: Issue;
  onPress: () => void;
  onUpvote: () => void;
}

const categoryIcons = {
  Road: 'car-outline',
  Water: 'water-outline',
  Garbage: 'trash-outline',
  Electricity: 'flash-outline',
  Manholes: 'warning-outline',
  'Water Shortage': 'water',
  'Street Lights': 'bulb-outline',
  Other: 'ellipsis-horizontal',
} as const;

const statusColors = {
  Pending: '#ff6b6b',
  'In Progress': '#4ecdc4',
  Resolved: '#45b7d1',
};

export default function IssueCard({ issue, onPress, onUpvote }: IssueCardProps) {
  const iconName = categoryIcons[issue.category] as keyof typeof Ionicons.glyphMap;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.categoryContainer}>
          <Ionicons name={iconName} size={24} color="#3498DB" />
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>{issue.title}</Text>
            <Text style={styles.category}>{issue.category}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColors[issue.status] }]}>
          <Text style={styles.statusText}>{issue.status}</Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>{issue.description}</Text>

      <View style={styles.footer}>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.location} numberOfLines={1}>{issue.location}</Text>
        </View>
        <TouchableOpacity style={styles.upvoteButton} onPress={onUpvote}>
          <Ionicons name="thumbs-up-outline" size={16} color="#666" />
          <Text style={styles.upvoteText}>{issue.upvotes}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleContainer: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  location: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  upvoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  upvoteText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontWeight: 'bold',
  },
});