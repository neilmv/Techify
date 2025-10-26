import { adminAPI } from "@/api/api";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import UserCard from "./components/UserCard";
import UserDetailsModal from "./components/UserDetailsModal";
import UserFilters from "./components/UserFilters";
import { useUsers } from "./hooks/useUsers";
import { styles } from "./styles/userStyles";
import { User } from "./types/usersTypes";

const { width } = Dimensions.get("window");

export default function UsersScreen() {
  const {
    users,
    loading,
    error,
    filters,
    pagination,
    fetchUsers,
    updateFilters,
    searchUsers,
    refreshUsers,
    loadNextPage,
    loadPrevPage,
  } = useUsers();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const handleViewUserDetails = (user: User) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleCloseUserDetails = () => {
    setShowUserDetails(false);
    setSelectedUser(null);
  };
  const showAlert = (message: string) => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleDeleteUser = async (userId: number) => {
    console.log("🚀 DELETE USER STARTED - User ID:", userId);
    console.log("📱 Current deleting state:", deleting);

    try {
      setDeleting(true);
      const response = await adminAPI.deleteUser(userId);

      handleCloseUserDetails();
      refreshUsers();
    } catch (error: any) {
      showAlert(error.response?.data?.message || "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshUsers();
    setRefreshing(false);
  };

  // Calculate number of columns based on screen width
  const getNumberOfColumns = () => {
    if (width >= 1200) return 3;
    if (width >= 768) return 2;
    return 1;
  };

  const numColumns = getNumberOfColumns();

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.gridItem}>
      <UserCard user={item} onViewDetails={handleViewUserDetails} />
    </View>
  );

  const renderFooter = () => {
    if (!loading || users.length === 0) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#4f46e5" />
        <Text style={styles.footerLoaderText}>Loading more users...</Text>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="people-outline" size={64} color="#cbd5e1" />
      <Text style={styles.emptyStateTitle}>No Users Found</Text>
      <Text style={styles.emptyStateText}>
        {filters.search
          ? "No users match your search criteria"
          : "There are no users in the system yet"}
      </Text>
      {filters.search && (
        <TouchableOpacity
          style={styles.clearSearchButton}
          onPress={() => searchUsers("")}
        >
          <Text style={styles.clearSearchText}>Clear Search</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorState}>
      <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
      <Text style={styles.errorStateTitle}>Unable to Load Users</Text>
      <Text style={styles.errorStateText}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={refreshUsers}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  if (error && users.length === 0) {
    return renderErrorState();
  }

  return (
    <View style={styles.container}>
      {/* Updated Header */}
      <LinearGradient
        colors={['#4f46e5', '#6366f1']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Users Management</Text>
            <Text style={styles.headerSubtitle}>
              Manage and view all system users
            </Text>
          </View>
          <View style={styles.headerStats}>
            <Text style={styles.headerStatsText}>
              {pagination.totalUsers} total users
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Filters */}
      <UserFilters
        filters={filters}
        onFiltersChange={updateFilters}
        onSearch={searchUsers}
      />

      {/* Users Grid */}
      {users.length === 0 && !loading ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numColumns}
          contentContainerStyle={styles.gridContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#4f46e5"]}
              tintColor="#4f46e5"
            />
          }
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          key={`grid-${numColumns}`} 
        />
      )}

      {/* Pagination Controls */}
      {users.length > 0 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            style={[
              styles.paginationButton,
              !pagination.hasPrev && styles.paginationButtonDisabled,
            ]}
            onPress={loadPrevPage}
            disabled={!pagination.hasPrev || loading}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={pagination.hasPrev ? "#4f46e5" : "#94a3b8"}
            />
            <Text
              style={[
                styles.paginationButtonText,
                !pagination.hasPrev && styles.paginationButtonTextDisabled,
              ]}
            >
              Previous
            </Text>
          </TouchableOpacity>

          <View style={styles.paginationInfo}>
            <Text style={styles.paginationText}>
              Page {pagination.currentPage} of {pagination.totalPages}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.paginationButton,
              !pagination.hasNext && styles.paginationButtonDisabled,
            ]}
            onPress={loadNextPage}
            disabled={!pagination.hasNext || loading}
          >
            <Text
              style={[
                styles.paginationButtonText,
                !pagination.hasNext && styles.paginationButtonTextDisabled,
              ]}
            >
              Next
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={pagination.hasNext ? "#4f46e5" : "#94a3b8"}
            />
          </TouchableOpacity>
        </View>
      )}

      {/* User Details Modal */}
      <UserDetailsModal
        visible={showUserDetails}
        user={selectedUser}
        onClose={handleCloseUserDetails}
        onDelete={handleDeleteUser}
        deleting={deleting}
      />
      {alertVisible && (
        <View style={styles.webAlertOverlay}>
          <View style={styles.webAlert}>
            <Text style={styles.webAlertTitle}>Error</Text>
            <Text style={styles.webAlertMessage}>{alertMessage}</Text>
            <TouchableOpacity
              style={styles.webAlertButton}
              onPress={() => setAlertVisible(false)}
            >
              <Text style={styles.webAlertButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}