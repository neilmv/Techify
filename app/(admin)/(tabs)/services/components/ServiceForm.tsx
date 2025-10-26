import { adminAPI, API_URL } from "@/api/api";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { formStyles } from "../styles/serviceStyles";
import {
  CreateServiceData,
  Service,
  ServiceFormErrors,
  ServiceType,
} from "../types/service.types";

interface ServiceFormProps {
  visible: boolean;
  service?: Service | null;
  serviceTypes: ServiceType[];
  onSubmit: (data: CreateServiceData) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({
  visible,
  service,
  serviceTypes,
  onSubmit,
  onClose,
  loading = false,
}) => {
  const [formData, setFormData] = useState<CreateServiceData>({
    service_type_id: 0,
    brand: "",
    description: "",
    base_price: 0,
    image: "",
  });

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<ServiceFormErrors>({});

  useEffect(() => {
    if (service) {
      setFormData({
        service_type_id: service.service_type_id,
        brand: service.brand,
        description: service.description,
        base_price: service.base_price,
        image: service.image || "",
      });
      if (service.image) {
        setImageUri(`${API_URL.replace(/\/api\/?$/, "")}${service.image}`);
      } else {
        setImageUri(null);
      }
    } else {
      setFormData({
        service_type_id: serviceTypes[0]?.id || 0,
        brand: "",
        description: "",
        base_price: 0,
        image: "",
      });
      setImageUri(null);
    }
    setErrors({});
  }, [service, serviceTypes, visible]);

  const blobToFile = async (blobUri: string, fileName: string, mimeType: string): Promise<File> => {
    try {
      const response = await fetch(blobUri);
      const blob = await response.blob();
      
      const file = new File([blob], fileName, { type: mimeType });
      return file;
    } catch (error) {
      console.error('Error converting blob to file:', error);
      throw new Error('Failed to process image');
    }
  };

  const uploadImage = async (uri: string): Promise<string> => {
    try {
      setUploading(true);

      const formData = new FormData();

      const filename = `service-image-${Date.now()}.jpg`;
      const fileType = 'image/jpeg';

      if (uri.startsWith('blob:')) {
        console.log("Converting blob URI to uploadable file...");
        
        try {
          const file = await blobToFile(uri, filename, fileType);
          
          formData.append("image", file);
        } catch (blobError) {
          console.error('Blob conversion failed, trying direct approach:', blobError);
          formData.append("image", {
            uri: uri,
            type: fileType,
            name: filename,
          } as any);
        }
      } else {
        formData.append("image", {
          uri: uri,
          type: fileType,
          name: filename,
        } as any);
      }

      console.log("Uploading to /api/admin/services/upload...");

      const response = await adminAPI.uploadServiceImage(formData);
      console.log("Upload successful:", response.data);

      return response.data.imageUrl;
    } catch (error: any) {
      console.error("Error uploading image:", error);
      throw new Error(
        error.response?.data?.message || "Failed to upload image"
      );
    } finally {
      setUploading(false);
    }
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to upload images."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        console.log("Selected image URI:", uri);
        setImageUri(uri);

        try {
          const uploadedImageUrl = await uploadImage(uri);
          console.log("Uploaded image URL:", uploadedImageUrl);
          setFormData((prev) => ({ ...prev, image: uploadedImageUrl }));
        } catch (uploadError: any) {
          console.error("Upload error:", uploadError);
          Alert.alert("Upload Error", uploadError.message);
          setImageUri(null);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const removeImage = () => {
    setImageUri(null);
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: ServiceFormErrors = {};

    if (!formData.service_type_id) {
      newErrors.service_type_id = "Service type is required";
    }

    if (!formData.brand.trim()) {
      newErrors.brand = "Brand is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.base_price || formData.base_price <= 0) {
      newErrors.base_price = "Valid base price is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      console.log("Submitting form data:", formData);
      await onSubmit(formData);
      onClose();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleClose = () => {
    if (loading || uploading) return;
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={formStyles.overlay}>
        <View style={formStyles.modal}>
          <View style={formStyles.modalHeader}>
            <Text style={formStyles.modalTitle}>
              {service ? "Edit Service" : "Add New Service"}
            </Text>
            <TouchableOpacity
              style={formStyles.closeButton}
              onPress={handleClose}
              disabled={loading || uploading}
            >
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={formStyles.form}>
            {/* Image Upload Section */}
            <View style={formStyles.inputGroup}>
              <Text style={formStyles.label}>Service Image</Text>
              <View style={{ alignItems: "center", marginBottom: 16 }}>
                {uploading ? (
                  <View style={{ alignItems: "center", padding: 20 }}>
                    <ActivityIndicator size="large" color="#4f46e5" />
                    <Text style={{ marginTop: 12, color: "#6b7280" }}>
                      Uploading image...
                    </Text>
                  </View>
                ) : imageUri ? (
                  <View style={{ alignItems: "center" }}>
                    <Image
                      source={{ uri: imageUri }}
                      style={{
                        width: 200,
                        height: 150,
                        borderRadius: 8,
                        marginBottom: 12,
                      }}
                    />
                    <TouchableOpacity
                      style={[
                        formStyles.actionButton,
                        { backgroundColor: "#ef4444" },
                      ]}
                      onPress={removeImage}
                      disabled={loading}
                    >
                      <Ionicons name="trash" size={16} color="#ffffff" />
                      <Text
                        style={[formStyles.actionText, { color: "#ffffff" }]}
                      >
                        Remove Image
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={{
                      borderWidth: 2,
                      borderColor: "#e2e8f0",
                      borderStyle: "dashed",
                      borderRadius: 8,
                      padding: 20,
                      alignItems: "center",
                      width: "100%",
                    }}
                    onPress={pickImage}
                    disabled={loading}
                  >
                    <Ionicons name="image-outline" size={40} color="#9ca3af" />
                    <Text style={{ color: "#6b7280", marginTop: 8 }}>
                      Tap to upload an image
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Rest of the form remains the same */}
            <View style={formStyles.inputGroup}>
              <Text style={formStyles.label}>Service Type *</Text>
              <View style={formStyles.picker}>
                <Picker
                  selectedValue={formData.service_type_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, service_type_id: value }))
                  }
                  enabled={!loading && !uploading}
                >
                  <Picker.Item label="Select Service Type" value={0} />
                  {serviceTypes.map((type) => (
                    <Picker.Item
                      key={type.id}
                      label={type.name}
                      value={type.id}
                    />
                  ))}
                </Picker>
              </View>
              {errors.service_type_id && (
                <Text style={{ color: "#ef4444", fontSize: 12 }}>
                  {errors.service_type_id}
                </Text>
              )}
            </View>

            <View style={formStyles.inputGroup}>
              <Text style={formStyles.label}>Brand *</Text>
              <TextInput
                style={[
                  formStyles.input,
                  errors.brand && { borderColor: "#ef4444" },
                ]}
                value={formData.brand}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, brand: text }))
                }
                placeholder="Enter brand name"
                editable={!loading && !uploading}
              />
              {errors.brand && (
                <Text style={{ color: "#ef4444", fontSize: 12 }}>
                  {errors.brand}
                </Text>
              )}
            </View>

            <View style={formStyles.inputGroup}>
              <Text style={formStyles.label}>Description *</Text>
              <TextInput
                style={[
                  formStyles.input,
                  formStyles.textArea,
                  errors.description && { borderColor: "#ef4444" },
                ]}
                value={formData.description}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, description: text }))
                }
                placeholder="Enter service description"
                multiline
                numberOfLines={4}
                editable={!loading && !uploading}
              />
              {errors.description && (
                <Text style={{ color: "#ef4444", fontSize: 12 }}>
                  {errors.description}
                </Text>
              )}
            </View>

            <View style={formStyles.inputGroup}>
              <Text style={formStyles.label}>Base Price (₱) *</Text>
              <TextInput
                style={[
                  formStyles.input,
                  errors.base_price && { borderColor: "#ef4444" },
                ]}
                value={formData.base_price.toString()}
                onChangeText={(text) => {
                  const value = text.replace(/[^0-9]/g, "");
                  setFormData((prev) => ({
                    ...prev,
                    base_price: value ? parseFloat(value) : 0,
                  }));
                }}
                placeholder="0.00"
                keyboardType="numeric"
                editable={!loading && !uploading}
              />
              {errors.base_price && (
                <Text style={{ color: "#ef4444", fontSize: 12 }}>
                  {errors.base_price}
                </Text>
              )}
            </View>

            <View style={formStyles.formActions}>
              <TouchableOpacity
                style={formStyles.cancelButton}
                onPress={handleClose}
                disabled={loading || uploading}
              >
                <Text style={formStyles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  formStyles.submitButton,
                  (loading || uploading) && formStyles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={loading || uploading}
              >
                <Text style={formStyles.submitText}>
                  {loading
                    ? "Saving..."
                    : uploading
                    ? "Uploading..."
                    : service
                    ? "Update"
                    : "Create"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};