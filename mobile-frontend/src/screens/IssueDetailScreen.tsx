import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Issue } from '../types';

const categoryIcons = {
  Road: 'car-outline',
  Water: 'water-outline',
  Garbage: 'trash-outline',
  Electricity: 'flash-outline',
} as const;

const statusColors = {
  Pending: '#ff6b6b',
  'In Progress': '#4ecdc4',
  Resolved: '#45b7d1',
};

export default function IssueDetailScreen({ route }: any) {
  const { issue }: { issue: Issue } = route.params;
  const iconName = categoryIcons[issue.category] as keyof typeof Ionicons.glyphMap;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.categoryContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name={iconName} size={32} color="#3498DB" />
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{issue.title}</Text>
              <Text style={styles.category}>{issue.category}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColors[issue.status] }]}>
            <Text style={styles.statusText}>{issue.status}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{issue.description}</Text>
        </View>

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.detailText}>{issue.location}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <Text style={styles.detailText}>
              {new Date(issue.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="person-outline" size={20} color="#666" />
            <Text style={styles.detailText}>By {issue.userName}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status Timeline</Text>
          <View style={styles.timeline}>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: '#3498DB' }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Issue Reported</Text>
                <Text style={styles.timelineDate}>
                  {new Date(issue.createdAt).toLocaleString()}
                </Text>
              </View>
            </View>
            {issue.status !== 'Pending' && (
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, { backgroundColor: statusColors[issue.status] }]} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Status Updated to {issue.status}</Text>
                  <Text style={styles.timelineDate}>
                    {new Date(issue.updatedAt).toLocaleString()}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.upvoteButton}>
            <Ionicons name="thumbs-up-outline" size={20} color="#666" />
            <Text style={styles.upvoteText}>{issue.upvotes} Upvotes</Text>
          </TouchableOpacity>
          <Text style={styles.lastUpdated}>
            Last updated: {new Date(issue.updatedAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 20,
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
    marginBottom: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  category: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  detailsGrid: {
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  timeline: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timelineDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  upvoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  upvoteText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginLeft: 8,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#999',
  },
});