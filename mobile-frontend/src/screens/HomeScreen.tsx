import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Issue } from '../types';
import { issuesAPI } from '../services/api';
import { websocketService } from '../services/websocket';
import IssueCard from '../components/IssueCard';
import IssueMap from '../components/IssueMap';

export default function HomeScreen({ navigation }: any) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const fetchIssues = async () => {
    try {
      const data = await issuesAPI.getAll();
      setIssues(data);
      setFilteredIssues(data);
    } catch (error) {
      console.error('Failed to fetch issues:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterIssues = () => {
    let filtered = issues;
    
    if (searchQuery) {
      filtered = filtered.filter(issue => 
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(issue => issue.category === selectedCategory);
    }
    
    setFilteredIssues(filtered);
  };

  useEffect(() => {
    filterIssues();
  }, [searchQuery, selectedCategory, issues]);

  useEffect(() => {
    fetchIssues();
    
    // WebSocket listeners
    websocketService.connect();
    websocketService.on('issue_updated', (updatedIssue: Issue) => {
      setIssues(prev => prev.map(issue => 
        issue.id === updatedIssue.id ? updatedIssue : issue
      ));
    });
    
    websocketService.on('new_issue', (newIssue: Issue) => {
      setIssues(prev => [newIssue, ...prev]);
    });
    
    return () => {
      websocketService.disconnect();
    };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchIssues();
  };

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

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Loading issues...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Community Issues</Text>
        <Text style={styles.subtitle}>Report and track civic issues</Text>
        
        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search issues..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          {['All', 'Road', 'Water', 'Garbage', 'Electricity', 'Manholes', 'Water Shortage', 'Street Lights', 'Other'].map(category => (
            <TouchableOpacity
              key={category}
              style={[styles.filterButton, selectedCategory === category && styles.filterButtonActive]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[styles.filterText, selectedCategory === category && styles.filterTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <IssueMap 
        issues={filteredIssues} 
        onMarkerPress={(issue) => navigation.navigate('IssueDetail', { issue })}
      />

      <FlatList
        data={filteredIssues}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <IssueCard
            issue={item}
            onPress={() => navigation.navigate('IssueDetail', { issue: item })}
            onUpvote={() => handleUpvote(item.id)}
          />
        )}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#3498DB']}
            tintColor="#3498DB"
          />
        }
        contentContainerStyle={issues.length === 0 ? styles.emptyList : styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery || selectedCategory !== 'All' ? 'No matching issues found' : 'No issues found'}
            </Text>
          </View>
        }
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyList: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 8,
    fontSize: 16,
  },
  filterContainer: {
    marginTop: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
  },
  filterButtonActive: {
    backgroundColor: '#3498DB',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
});