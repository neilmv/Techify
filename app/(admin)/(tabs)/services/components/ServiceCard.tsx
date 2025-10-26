import { API_URL } from "@/api/api";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
    Dimensions,
    Image,
    Modal,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { cardStyles } from "../styles/serviceStyles";
import { Service } from "../types/service.types";

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (serviceId: number) => void;
}

const { width } = Dimensions.get("window");
const CARD_MARGIN = 12;
const CARD_WIDTH = (width - 950) / 2;

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onEdit,
  onDelete,
}) => {
  console.log("Service data received:", {
    id: service.id,
    brand: service.brand,
    description: service.description,
    service_type: service.service_type,
    base_price: service.base_price,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(false);
    if (typeof onDelete === "function") {
      onDelete(service.id);
    } else {
      console.error("4. onDelete is not a function:", typeof onDelete);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const getServiceTypeColor = (serviceType: string) => {
    const colors: { [key: string]: string } = {
      "Laptop Repair": "#4f46e5",
      "Phone Repair": "#ec4899",
      "Desktop Repair": "#f59e0b",
      "Appliance Repair": "#10b981",
    };
    return colors[serviceType] || "#6b7280";
  };

  const getServiceTypeIcon = (serviceType: string) => {
    const icons: { [key: string]: string } = {
      "Laptop Repair": "laptop-outline",
      "Phone Repair": "phone-portrait-outline",
      "Desktop Repair": "desktop-outline",
      "Appliance Repair": "hardware-chip-outline",
    };
    return icons[serviceType] || "construct-outline";
  };

  return (
    <View style={[cardStyles.cardContainer, { width: CARD_WIDTH }]}>
      <View style={cardStyles.card}>
        {/* Image Section */}
        {service.image ? (
          <View style={cardStyles.imageContainer}>
            <Image
              source={{
                uri: `${API_URL.replace(
                  /\/api\/?$/,
                  ""
                )}/${service.image?.replace(/^\/?/, "")}`,
              }}
              style={cardStyles.image}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.2)"]}
              style={cardStyles.imageOverlay}
            />
          </View>
        ) : (
          <View style={cardStyles.placeholderImage}>
            <Ionicons name="image-outline" size={32} color="#9ca3af" />
            <Text>No Image</Text>
          </View>
        )}

        {/* Card Content */}
        <View style={cardStyles.content}>
          {/* Service Type */}
          <View style={cardStyles.serviceTypeRow}>
            <View
              style={[
                cardStyles.serviceTypeDot,
                {
                  backgroundColor: getServiceTypeColor(
                    service.service_type || ""
                  ),
                },
              ]}
            />
            <Text style={cardStyles.serviceTypeText} numberOfLines={1}>
              {service.service_type}
            </Text>
          </View>

          {/* Brand Name */}
          <Text style={cardStyles.brand} numberOfLines={1}>
            {service.brand}
          </Text>

          {/* Description */}
          <Text style={cardStyles.description} numberOfLines={2}>
            {service.description}
          </Text>

          {/* Price and Actions Row */}
          <View style={cardStyles.footer}>
            <View style={cardStyles.priceContainer}>
              <Text style={cardStyles.price}>
                ₱{service.base_price.toLocaleString()}
              </Text>
              <Text style={cardStyles.priceLabel}>Starting at</Text>
            </View>

            <View style={cardStyles.actions}>
              <TouchableOpacity
                style={[cardStyles.actionButton, cardStyles.editButton]}
                onPress={() => onEdit(service)}
              >
                <Ionicons name="create-outline" size={16} color="#4f46e5" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[cardStyles.actionButton, cardStyles.deleteButton]}
                onPress={handleDelete}
              >
                <Ionicons name="trash-outline" size={16} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Custom Delete Confirmation Modal */}
      <Modal
        visible={showDeleteConfirm}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelDelete}
      >
        <TouchableWithoutFeedback onPress={cancelDelete}>
          <View style={cardStyles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={cardStyles.confirmationModal}>
                <Ionicons
                  name="warning"
                  size={48}
                  color="#ef4444"
                  style={cardStyles.modalIcon}
                />
                <Text style={cardStyles.modalTitle}>Delete Service</Text>
                <Text style={cardStyles.modalMessage}>
                  Are you sure you want to delete{" "}
                  <Text style={cardStyles.brandHighlight}>{service.brand}</Text>
                  ? This action cannot be undone.
                </Text>
                <View style={cardStyles.modalButtons}>
                  <TouchableOpacity
                    style={[cardStyles.modalButton, cardStyles.cancelButton]}
                    onPress={cancelDelete}
                  >
                    <Text style={cardStyles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      cardStyles.modalButton,
                      cardStyles.confirmDeleteButton,
                    ]}
                    onPress={confirmDelete}
                  >
                    <Ionicons name="trash-outline" size={16} color="white" />
                    <Text style={cardStyles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
