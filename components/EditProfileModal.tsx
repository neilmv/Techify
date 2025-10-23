import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    Modal,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from "react-native";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  profile_picture?: string;
  created_at: string;
}

interface EditProfileModalProps {
  visible: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (userData: { name: string; phone: string; address: string }) => Promise<void>;
  saving: boolean;
}

export default function EditProfileModal({
  visible,
  user,
  onClose,
  onSave,
  saving,
}: EditProfileModalProps) {
  const [editingUser, setEditingUser] = useState<User | null>(user);

  const handleSave = async () => {
    if (!editingUser) return;
    await onSave({
      name: editingUser.name,
      phone: editingUser.phone || "",
      address: editingUser.address || "",
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <ThemedView style={styles.modalContainer}>
        <ThemedView style={styles.modalHeader}>
          <ThemedText type="title" style={styles.modalTitle}>
            Edit Profile
          </ThemedText>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.form}>
          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Full Name</ThemedText>
            <TextInput
              style={styles.input}
              value={editingUser?.name || ""}
              onChangeText={(text) =>
                setEditingUser((prev) =>
                  prev ? { ...prev, name: text } : null
                )
              }
              placeholder="Enter your full name"
            />
          </ThemedView>

          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Email</ThemedText>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={editingUser?.email || ""}
              editable={false}
              placeholder="Email (cannot be changed)"
            />
          </ThemedView>

          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Phone Number</ThemedText>
            <TextInput
              style={styles.input}
              value={editingUser?.phone || ""}
              onChangeText={(text) =>
                setEditingUser((prev) =>
                  prev ? { ...prev, phone: text } : null
                )
              }
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </ThemedView>

          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Address</ThemedText>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={editingUser?.address || ""}
              onChangeText={(text) =>
                setEditingUser((prev) =>
                  prev ? { ...prev, address: text } : null
                )
              }
              placeholder="Enter your address"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </ThemedView>

          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            <ThemedText style={styles.saveButtonText}>
              {saving ? "Saving..." : "Save Changes"}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  modalTitle: {
    fontSize: 24,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    color: "#666",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#4A90E2",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonDisabled: {
    backgroundColor: "#ccc",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});