import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Issue } from '../types';
import { issuesAPI } from '../services/api';
import IssueCard from '../components/IssueCard';

export default function MyIssuesScreen({ navigation }: any) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock user issues - in real app, filter by current user
    const fetchUserIssues = async () => {
      try {
        const allIssues = await issuesAPI.getAll();
        setIssues(allIssues.slice(0, 2)); // Mock user's issues
      } catch (error) {
        console.error('Failed to fetch user issues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserIssues();
  }, []);

  const handleUpvote = async (id: string) => {
    try {
      const updatedIssue = await issuesAPI.upvote(id);
      setIssues(prev => prev.map(issue => 
        issue.id === id ? updatedIssue : issue
      ));
    } catch (error) {
      console.error('Failed to upvote:', error);
    }
  };

  if (issues.length === 0 && !loading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Issues Reported</Text>
        <Text style={styles.emptySubtitle}>You haven't reported any issues yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Issues</Text>
        <Text style={styles.subtitle}>Track your reported issues</Text>
      </View>

      <FlatList
        data={issues}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <IssueCard
            issue={item}
            onPress={() => navigation.navigate('IssueDetail', { issue: item })}
            onUpvote={() => handleUpvote(item.id)}
          />
        )}
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
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  list: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});