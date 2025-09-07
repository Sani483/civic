import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { issuesAPI } from '../services/api';

const categories = [
  { id: 'Road', label: 'Road', icon: 'car-outline', color: '#3498DB' },
  { id: 'Water', label: 'Water', icon: 'water-outline', color: '#1abc9c' },
  { id: 'Garbage', label: 'Garbage', icon: 'trash-outline', color: '#2ecc71' },
  { id: 'Electricity', label: 'Electricity', icon: 'flash-outline', color: '#f39c12' },
  { id: 'Manholes', label: 'Manholes', icon: 'warning-outline', color: '#e74c3c' },
  { id: 'Water Shortage', label: 'Water Shortage', icon: 'water', color: '#9b59b6' },
  { id: 'Street Lights', label: 'Street Lights', icon: 'bulb-outline', color: '#f1c40f' },
  { id: 'Other', label: 'Other', icon: 'ellipsis-horizontal', color: '#95a5a6' },
];

export default function ReportScreen({ navigation }: any) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);

  const handleCategorySelect = (category: string) => {
    setFormData(prev => ({ ...prev, category }));
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address[0]) {
        const locationString = `${address[0].street || ''} ${address[0].city || ''}`.trim();
        setFormData(prev => ({ ...prev, location: locationString }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get location');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.category || !formData.location) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      let imageUrl;
      if (photo) {
        imageUrl = await issuesAPI.uploadImage(photo);
      }
      
      await issuesAPI.create({
        ...formData,
        category: formData.category as any,
        userId: 'current-user',
        userName: 'Current User',
        imageUrl,
      });
      
      Alert.alert('Success', 'Issue reported successfully', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);
      
      // Reset form
      setFormData({ title: '', description: '', category: '', location: '' });
      setPhoto(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to report issue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Report an Issue</Text>
        <Text style={styles.subtitle}>Help improve your community</Text>
      </View>

      <View style={styles.form}>
        {/* Category Selection */}
        <Text style={styles.label}>Category *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryButton,
                  formData.category === cat.id && styles.categoryButtonSelected
                ]}
                onPress={() => handleCategorySelect(cat.id)}
              >
                <Ionicons 
                  name={cat.icon as keyof typeof Ionicons.glyphMap} 
                  size={20} 
                  color={formData.category === cat.id ? '#fff' : cat.color} 
                />
                <Text style={[
                  styles.categoryText,
                  formData.category === cat.id && styles.categoryTextSelected
                ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Title */}
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          value={formData.title}
          onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
          placeholder="Brief description of the issue"
        />

        {/* Description */}
        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
          placeholder="Provide detailed information"
          multiline
          numberOfLines={4}
        />

        {/* Location */}
        <Text style={styles.label}>Location *</Text>
        <View style={styles.locationContainer}>
          <TextInput
            style={[styles.input, styles.locationInput]}
            value={formData.location}
            onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
            placeholder="Enter location or address"
          />
          <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
            <Ionicons name="location-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Photo */}
        <Text style={styles.label}>Photo (Optional)</Text>
        {photo ? (
          <View style={styles.photoContainer}>
            <Image source={{ uri: photo }} style={styles.photo} />
            <TouchableOpacity style={styles.removePhoto} onPress={() => setPhoto(null)}>
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
            <Ionicons name="camera" size={24} color="#666" />
            <Text style={styles.photoButtonText}>Take Photo</Text>
          </TouchableOpacity>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Submitting...' : 'Submit Report'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  categoryScroll: {
    marginBottom: 8,
  },
  categoryGrid: {
    flexDirection: 'row',
    paddingHorizontal: 4,
  },
  categoryButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    minWidth: 100,
  },
  categoryButtonSelected: {
    backgroundColor: '#3498DB',
    borderColor: '#3498DB',
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryTextSelected: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationInput: {
    flex: 1,
    marginRight: 12,
  },
  locationButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
  },
  submitButton: {
    backgroundColor: '#3498DB',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  photoButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 40,
    alignItems: 'center',
    marginBottom: 16,
  },
  photoButtonText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removePhoto: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 4,
  },
});