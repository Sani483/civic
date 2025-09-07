import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Issue } from '../types';

interface IssueMapProps {
  issues: Issue[];
  onMarkerPress: (issue: Issue) => void;
}

export default function IssueMap({ issues, onMarkerPress }: IssueMapProps) {
  const initialRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const getMarkerColor = (category: string) => {
    const colors = {
      Road: '#3498DB',
      Water: '#1abc9c',
      Garbage: '#2ecc71',
      Electricity: '#f39c12',
      Manholes: '#e74c3c',
      'Water Shortage': '#9b59b6',
      'Street Lights': '#f1c40f',
      Other: '#95a5a6',
    };
    return colors[category as keyof typeof colors] || '#95a5a6';
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {issues.map((issue) => (
          <Marker
            key={issue.id}
            coordinate={{
              latitude: issue.latitude || initialRegion.latitude,
              longitude: issue.longitude || initialRegion.longitude,
            }}
            title={issue.title}
            description={issue.category}
            pinColor={getMarkerColor(issue.category)}
            onPress={() => onMarkerPress(issue)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: {
    flex: 1,
  },
});