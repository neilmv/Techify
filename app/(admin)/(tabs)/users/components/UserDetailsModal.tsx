import { API_URL } from "@/api/api";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { User } from "../types/usersTypes";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface UserDetailsModalProps {
  visible: boolean;
  user: User | null;
  onClose: () => void;
  onDelete: (userId: number) => void;
  deleting?: boolean;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  visible,
  user,
  onClose,
  onDelete,
  deleting = false,
}) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  if (!user) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleDeleteClick = () => {
    console.log("🧩 Delete button pressed inside modal");
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    console.log("✅ Delete confirmed - Calling onDelete with ID:", user.id);
    setShowDeleteConfirmation(false);
    onDelete(user.id);
  };

  const handleCancelDelete = () => {
    console.log("❌ Delete cancelled");
    setShowDeleteConfirmation(false);
  };

  return (
    <>
      {/* Main User Details Modal */}
      <Modal
        visible={visible}
        animationType="fade"
        transparent={true}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>User Details</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Profile Section */}
              <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                  {user.profile_picture ? (
                    <Image
                      source={{
                        uri: `${API_URL.replace(/\/api$/, "")}${
                          user.profile_picture
                        }`,
                      }}
                      style={styles.largeAvatar}
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={[styles.largeAvatar, styles.avatarPlaceholder]}
                    >
                      <Text style={styles.largeAvatarText}>
                        {getInitials(user.name)}
                      </Text>
                    </View>
                  )}
                </View>

                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>

                <View style={styles.roleBadge}>
                  <Ionicons
                    name={
                      user.role === 1 ? "shield-checkmark" : "person-outline"
                    }
                    size={16}
                    color={user.role === 1 ? "#dc2626" : "#059669"}
                  />
                  <Text
                    style={[
                      styles.roleText,
                      { color: user.role === 1 ? "#dc2626" : "#059669" },
                    ]}
                  >
                    {user.role === 1 ? "Administrator" : "Regular User"}
                  </Text>
                </View>
              </View>

              {/* Contact Information */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Contact Information</Text>

                <View style={styles.detailItem}>
                  <Ionicons name="mail-outline" size={18} color="#4f46e5" />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Email Address</Text>
                    <Text style={styles.detailValue}>{user.email}</Text>
                  </View>
                </View>

                {user.phone && (
                  <View style={styles.detailItem}>
                    <Ionicons name="call-outline" size={18} color="#4f46e5" />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Phone Number</Text>
                      <Text style={styles.detailValue}>{user.phone}</Text>
                    </View>
                  </View>
                )}

                {user.address && (
                  <View style={styles.detailItem}>
                    <Ionicons
                      name="location-outline"
                      size={18}
                      color="#4f46e5"
                    />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Address</Text>
                      <Text style={styles.detailValue}>{user.address}</Text>
                    </View>
                  </View>
                )}

                {!user.phone && !user.address && (
                  <View style={styles.noInfoContainer}>
                    <Ionicons
                      name="information-circle-outline"
                      size={20}
                      color="#94a3b8"
                    />
                    <Text style={styles.noInfoText}>
                      No additional contact information provided
                    </Text>
                  </View>
                )}
              </View>

              {/* Account Information */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account Information</Text>

                <View style={styles.detailItem}>
                  <Ionicons name="calendar-outline" size={18} color="#4f46e5" />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Member Since</Text>
                    <Text style={styles.detailValue}>
                      {formatDate(user.created_at)}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailItem}>
                  <Ionicons
                    name="document-text-outline"
                    size={18}
                    color="#4f46e5"
                  />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Total Bookings</Text>
                    <Text style={styles.detailValue}>
                      {user.bookings_count || 0} bookings
                    </Text>
                  </View>
                </View>

                {user.last_booking_date && (
                  <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={18} color="#4f46e5" />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Last Booking</Text>
                      <Text style={styles.detailValue}>
                        {formatDate(user.last_booking_date)}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>

            {/* Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.deleteButton,
                  deleting && styles.deleteButtonDisabled,
                ]}
                onPress={handleDeleteClick}
                disabled={deleting}
              >
                {deleting ? (
                  <ActivityIndicator size="small" color="#ef4444" />
                ) : (
                  <Ionicons name="trash-outline" size={18} color="#ef4444" />
                )}
                <Text style={styles.deleteButtonText}>
                  {deleting ? "Deleting..." : "Delete User"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.closeActionButton]}
                onPress={onClose}
              >
                <Text style={styles.closeActionText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteConfirmation}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCancelDelete}
      >
        <View style={styles.confirmationOverlay}>
          <View style={styles.confirmationContainer}>
            <View style={styles.confirmationHeader}>
              <View style={styles.confirmationIcon}>
                <Ionicons name="warning" size={32} color="#ef4444" />
              </View>
              <Text style={styles.confirmationTitle}>Delete User</Text>
              <Text style={styles.confirmationMessage}>
                Are you sure you want to delete {user.name}? This action cannot
                be undone.
              </Text>
            </View>

            <View style={styles.confirmationActions}>
              <TouchableOpacity
                style={[styles.confirmationButton, styles.cancelButton]}
                onPress={handleCancelDelete}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmationButton, styles.confirmDeleteButton]}
                onPress={handleConfirmDelete}
              >
                <Ionicons name="trash-outline" size={18} color="#ffffff" />
                <Text style={styles.confirmDeleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    width: "100%",
    maxWidth: 500,
    maxHeight: SCREEN_HEIGHT * 0.85,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    backgroundColor: "#fafafa",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
  },
  closeButton: {
    padding: 4,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
  },
  modalContent: {
    maxHeight: SCREEN_HEIGHT * 0.6,
  },
  profileSection: {
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  avatarContainer: {
    marginBottom: 16,
  },
  deleteButtonDisabled: {
    backgroundColor: "#f3f4f6",
    borderColor: "#e5e7eb",
    opacity: 0.6,
  },
  largeAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    backgroundColor: "#4f46e5",
    justifyContent: "center",
    alignItems: "center",
  },
  largeAvatarText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 24,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 4,
    textAlign: "center",
  },
  userEmail: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 16,
    textAlign: "center",
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  roleText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  detailContent: {
    flex: 1,
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: "#0f172a",
    fontWeight: "500",
  },
  noInfoContainer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  noInfoText: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
  },
  modalActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    gap: 12,
    backgroundColor: "#fafafa",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  deleteButton: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  deleteButtonText: {
    color: "#ef4444",
    fontWeight: "600",
    fontSize: 14,
  },
  closeActionButton: {
    backgroundColor: "#4f46e5",
  },
  closeActionText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  confirmationOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  confirmationContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  confirmationHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  confirmationIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fef2f2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#fecaca",
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
    textAlign: "center",
  },
  confirmationMessage: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 22,
  },
  confirmationActions: {
    flexDirection: "row",
    gap: 12,
  },
  confirmationButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  cancelButton: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  confirmDeleteButton: {
    backgroundColor: "#ef4444",
    shadowColor: "#ef4444",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  confirmDeleteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});

export default UserDetailsModal;
