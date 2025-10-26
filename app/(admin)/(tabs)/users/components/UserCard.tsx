import { API_URL } from "@/api/api";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { User } from "../types/usersTypes";

interface UserCardProps {
  user: User;
  onViewDetails: (user: User) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onViewDetails }) => {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => onViewDetails(user)}
    >
      {/* Avatar + Basic Info */}
      <View style={styles.topRow}>
        {user.profile_picture ? (
          <Image
            source={{
              uri: `${API_URL.replace(/\/api$/, "")}${user.profile_picture}`,
            }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
          </View>
        )}

        <View style={styles.userDetails}>
          <Text style={styles.userName} numberOfLines={1}>
            {user.name}
          </Text>
          <Text style={styles.userEmail} numberOfLines={1}>
            {user.email}
          </Text>
          <Text style={styles.joinedText}>
            Joined {formatDate(user.created_at)}
          </Text>
        </View>

        <View
          style={[
            styles.roleBadge,
            { backgroundColor: user.role === 1 ? "#fee2e2" : "#dcfce7" },
          ]}
        >
          <Ionicons
            name={user.role === 1 ? "shield-checkmark" : "person-outline"}
            size={14}
            color={user.role === 1 ? "#b91c1c" : "#166534"}
          />
          <Text
            style={[
              styles.roleText,
              { color: user.role === 1 ? "#b91c1c" : "#166534" },
            ]}
          >
            {user.role === 1 ? "Admin" : "User"}
          </Text>
        </View>
      </View>

      {/* Contact Info */}
      <View style={styles.contactSection}>
        {user.phone ? (
          <View style={styles.contactItem}>
            <Ionicons name="call-outline" size={16} color="#475569" />
            <Text style={styles.contactText}>{user.phone}</Text>
          </View>
        ) : null}

        {user.address ? (
          <View style={styles.contactItem}>
            <Ionicons name="location-outline" size={16} color="#475569" />
            <Text style={styles.contactText}>{user.address}</Text>
          </View>
        ) : null}

        {!user.phone && !user.address && (
          <View style={styles.contactItem}>
            <Ionicons name="information-circle-outline" size={16} color="#94a3b8" />
            <Text style={styles.noInfoText}>No contact info</Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.statBox}>
          <Ionicons name="calendar-outline" size={16} color="#64748b" />
          <Text style={styles.statText}>
            {user.bookings_count || 0} bookings
          </Text>
        </View>

        <View style={styles.arrowBtn}>
          <Ionicons name="chevron-forward" size={22} color="#4f46e5" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    margin: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    flex: 1,
    minWidth: 300,
    maxWidth: 400,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    backgroundColor: "#4f46e5",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  userDetails: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#0f172a",
  },
  userEmail: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 2,
  },
  joinedText: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 4,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roleText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "600",
  },
  contactSection: {
    marginTop: 6,
    marginBottom: 14,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 10,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 3,
  },
  contactText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#475569",
    flexShrink: 1,
  },
  noInfoText: {
    fontSize: 13,
    color: "#94a3b8",
    fontStyle: "italic",
    marginLeft: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 12,
  },
  statBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    fontSize: 13,
    color: "#64748b",
    marginLeft: 6,
  },
  arrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#eef2ff",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UserCard;