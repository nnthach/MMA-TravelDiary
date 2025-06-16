import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';  // Import Picker đúng cách

const CreateScreen = () => {
  const [createForm, setCreateForm] = useState({
    title: '',
    content: '',
    province: '',
    district: '',
    ward: '',
    images: [],
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch provinces on mount
  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://api.vnappmob.com/api/v2/province/');
      setProvinces(response.data.results);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch provinces');
      setLoading(false);
      console.error(error);
    }
  };

  const fetchDistricts = async (provinceId) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api.vnappmob.com/api/v2/province/district/${provinceId}`);
      setDistricts(response.data.results);
      setWards([]); // Reset wards when district changes
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch districts');
      setLoading(false);
      console.error(error);
    }
  };

  const fetchWards = async (districtId) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api.vnappmob.com/api/v2/province/ward/${districtId}`);
      setWards(response.data.results);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch wards');
      setLoading(false);
      console.error(error);
    }
  };

  const handleChange = (value, field) => {
    setCreateForm({
      ...createForm,
      [field]: value,
    });
  };

  const handleProvinceChange = (provinceId) => {
    handleChange(provinceId, 'province');
    fetchDistricts(provinceId);
  };

  const handleDistrictChange = (districtId) => {
    handleChange(districtId, 'district');
    fetchWards(districtId);
  };

  const handleWardChange = (wardId) => {
    handleChange(wardId, 'ward');
  };

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setCreateForm({
        ...createForm,
        images: [...createForm.images, result.uri],
      });
    }
  };

  const handleSubmit = async () => {
    if (!createForm.title || !createForm.content) {
      Alert.alert('Error', 'Title and content are required!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3000/api/posts', createForm); // Đảm bảo URL API đúng
      Alert.alert('Success', 'Post created successfully!');
      setCreateForm({
        title: '',
        content: '',
        province: '',
        district: '',
        ward: '',
        images: [],
      });
      setLoading(false);
    } catch (err) {
      setError('Error creating post');
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Your Post</Text>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={createForm.title}
        onChangeText={(text) => handleChange(text, 'title')}
      />
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Content"
        value={createForm.content}
        multiline
        onChangeText={(text) => handleChange(text, 'content')}
      />

      {/* Select Province */}
      <Picker
        selectedValue={createForm.province}
        style={styles.picker}
        onValueChange={handleProvinceChange}
      >
        <Picker.Item label="Select Province" value="" />
        {provinces.map((province) => (
          <Picker.Item key={province.province_id} label={province.province_name} value={province.province_id} />
        ))}
      </Picker>

      {/* Select District */}
      <Picker
        selectedValue={createForm.district}
        style={styles.picker}
        onValueChange={handleDistrictChange}
      >
        <Picker.Item label="Select District" value="" />
        {districts.map((district) => (
          <Picker.Item key={district.district_id} label={district.district_name} value={district.district_id} />
        ))}
      </Picker>

      {/* Select Ward */}
      <Picker
        selectedValue={createForm.ward}
        style={styles.picker}
        onValueChange={handleWardChange}
      >
        <Picker.Item label="Select Ward" value="" />
        {wards.map((ward) => (
          <Picker.Item key={ward.ward_id} label={ward.ward_name} value={ward.ward_id} />
        ))}
      </Picker>

      {/* Add Images */}
      <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
        <Text>Add Images</Text>
      </TouchableOpacity>

      {createForm.images.length > 0 && (
        <View style={styles.imagePreview}>
          {createForm.images.map((imageUri, index) => (
            <Image key={index} source={{ uri: imageUri }} style={styles.image} />
          ))}
        </View>
      )}

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Create Post</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '100%', padding: 10, borderWidth: 1, borderColor: '#ccc', marginBottom: 20, backgroundColor: '#fff' },
  textarea: { height: 100, textAlignVertical: 'top' },
  picker: { width: '100%', height: 50, marginBottom: 20 },
  button: { backgroundColor: '#ff7733', padding: 15, alignItems: 'center', marginTop: 20, borderRadius: 5 },
  buttonText: { color: '#fff', fontSize: 18 },
  imageButton: { backgroundColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 15 },
  imagePreview: { flexDirection: 'row', marginBottom: 20 },
  image: { width: 100, height: 100, margin: 5, borderRadius: 5 },
  errorText: { color: 'red', marginBottom: 10 },
});

export default CreateScreen;
