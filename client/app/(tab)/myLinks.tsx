/**
 * MyLinksScreen
 * Screen to view and manage user's shortened links
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Pressable,
  Alert,
  RefreshControl,
  Share,
  TextInput,
  Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { APP_CONFIG, apiCall } from '../../constants/config';
import * as Clipboard from 'expo-clipboard';

interface ShortenedLink {
  id: number;
  original_url: string;
  short_url: string;
  clicks: number;
  is_active: boolean;
  created_at: string;
}

export default function MyLinksScreen() {
  const [links, setLinks] = useState<ShortenedLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingUrl, setEditingUrl] = useState('');

  // Load links when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadLinks();
    }, [])
  );

  const loadLinks = async () => {
    setLoading(true);
    try {
      const res = await apiCall('/links/urls/list/', { method: 'GET' });

      if (!res.ok) {
        const txt = await res.text();
        console.warn('Failed loading links:', res.status, txt);
        Alert.alert('Error', 'Failed to load links');
        setLinks([]);
        return;
      }

      const data = await res.json();
      setLinks(data || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load links');
      console.error('Load links error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadLinks();
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleCopyLink = (shortUrl: string) => {
    try {
      if (!shortUrl) {
        Alert.alert('Error', 'Short link is not available');
        return;
      }
      Clipboard.setStringAsync(shortUrl);
      Alert.alert('Copied', `Short link copied to clipboard`);
    } catch (error) {
      console.error('Copy error:', error);
      Alert.alert('Error', 'Failed to copy link');
    }
  };

  const handleShareLink = async (shortUrl: string, originalUrl: string) => {
    try {
      if (!shortUrl) {
        Alert.alert('Error', 'Short link is not available');
        return;
      }
      
      await Share.share({
        message: `Check out this link: ${shortUrl}\n`,
        url: shortUrl,
        title: 'Share Short Link',
      });
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Failed to share link');
    }
  };

  const handleDeleteLink = (linkId: number) => {
    Alert.alert(
      'Delete Link',
      'Are you sure you want to delete this link?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const res = await apiCall(`/links/urls/${linkId}/delete/`, {
                method: 'DELETE',
              });

              if (!res.ok) {
                const txt = await res.text();
                console.warn('Delete failed:', res.status, txt);
                Alert.alert('Error', 'Failed to delete link');
                return;
              }

              setLinks(links.filter(l => l.id !== linkId));
              Alert.alert('Success', 'Link deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete link');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleToggleActive = async (link: ShortenedLink) => {
    try {
      console.log(`🔄 Toggling link ${link.id} active status`);
      const res = await apiCall(`/links/urls/${link.id}/update/`, {
        method: 'PUT',
        body: JSON.stringify({ is_active: !link.is_active }),
      });

      console.log(`📊 Toggle response: ${res.status}`);

      if (!res.ok) {
        const txt = await res.text();
        console.warn('Toggle active failed:', res.status, txt);
        Alert.alert('Error', `Failed to update link status (${res.status}): ${txt}`);
        return;
      }

      // Update local state - don't read response again
      setLinks(links.map(l => (l.id === link.id ? { ...l, is_active: !l.is_active } : l)));
      Alert.alert('Success', `Link ${!link.is_active ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Toggle error:', error);
      Alert.alert('Error', 'Failed to update link status');
    }
  };

  const handleEditLink = (link: ShortenedLink) => {
    setEditingId(link.id);
    setEditingUrl(link.original_url);
  };

  const handleSaveEdit = async () => {
    if (!editingUrl.trim()) {
      Alert.alert('Error', 'URL cannot be empty');
      return;
    }

    // Validate URL format
    try {
      new URL(editingUrl);
    } catch {
      Alert.alert('Error', 'Please enter a valid URL');
      return;
    }

    try {
      console.log(`✏️ Updating link ${editingId} URL`);
      const res = await apiCall(`/links/urls/${editingId}/update/`, {
        method: 'PUT',
        body: JSON.stringify({ original_url: editingUrl }),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.warn('Update failed:', res.status, txt);
        Alert.alert('Error', `Failed to update URL (${res.status})`);
        return;
      }

      // Update local state
      setLinks(
        links.map(l => (l.id === editingId ? { ...l, original_url: editingUrl } : l))
      );
      setEditingId(null);
      Alert.alert('Success', 'URL updated successfully');
    } catch (error) {
      console.error('Edit error:', error);
      Alert.alert('Error', 'Failed to update URL');
    }
  };

  const renderLinkItem = ({ item }: { item: ShortenedLink }) => (
    <View style={styles.linkCard}>
      <View style={styles.linkHeader}>
        <View style={styles.linkInfo}>
          <Text style={styles.shortCode} numberOfLines={1}>
            {item.short_url}
          </Text>
          <Text style={styles.originalUrl} numberOfLines={2}>
            {item.original_url}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            item.is_active && styles.statusBadgeActive,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              item.is_active && styles.statusTextActive,
            ]}
          >
            {item.is_active ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>

      <View style={styles.linkStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Clicks</Text>
          <Text style={styles.statValue}>{item.clicks}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Created</Text>
          <Text style={styles.statValue}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.linkActions}>
        <Pressable
          style={styles.actionButton}
          onPress={() => handleCopyLink(item.short_url)}
        >
          <MaterialCommunityIcons name="content-copy" size={24} color="#007AFF" />
        </Pressable>
        <Pressable
          style={styles.actionButton}
          onPress={() => handleEditLink(item)}
        >
          <MaterialCommunityIcons name="pencil" size={24} color="#007AFF" />
        </Pressable>
        <Pressable
          style={styles.actionButton}
          onPress={() => handleShareLink(item.short_url, item.original_url)}
        >
          <MaterialCommunityIcons name="share-variant" size={24} color="#007AFF" />
        </Pressable>
        <Pressable
          style={styles.actionButton}
          onPress={() => handleToggleActive(item)}
        >
          <MaterialCommunityIcons 
            name={item.is_active ? 'eye-off' : 'eye'} 
            size={24} 
            color="#007AFF" 
          />
        </Pressable>
        <Pressable
          style={styles.actionButton}
          onPress={() => handleDeleteLink(item.id)}
        >
          <MaterialCommunityIcons name="delete" size={24} color="#FF3B30" />
        </Pressable>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No links yet</Text>
      <Text style={styles.emptyStateDescription}>
        Create your first shortened URL from the Home tab
      </Text>
    </View>
  );

  return (
    <>
    <View style={styles.container}>
      <FlatList
        data={links}
        renderItem={renderLinkItem}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>

    {/* Edit Modal */}
    <Modal
      visible={editingId !== null}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {
        setEditingId(null);
        setEditingUrl('');
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit URL</Text>
          
          <TextInput
            style={styles.modalTextInput}
            placeholder="Enter new URL"
            value={editingUrl}
            onChangeText={setEditingUrl}
            placeholderTextColor="#999"
            editable={!loading}
          />
          
          <View style={styles.modalButtonContainer}>
            <Pressable
              style={[styles.modalButton, styles.modalButtonCancel]}
              onPress={() => {
                setEditingId(null);
                setEditingUrl('');
              }}
              disabled={loading}
            >
              <Text style={styles.modalButtonTextCancel}>Cancel</Text>
            </Pressable>
            
            <Pressable
              style={[styles.modalButton, styles.modalButtonSave]}
              onPress={handleSaveEdit}
              disabled={loading}
            >
              <Text style={styles.modalButtonTextSave}>
                {loading ? 'Saving...' : 'Save'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  linkCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  linkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  linkInfo: {
    flex: 1,
    marginRight: 12,
  },
  shortCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
  },
  originalUrl: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  statusBadge: {
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusBadgeActive: {
    backgroundColor: '#E5F5FF',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FF3B30',
  },
  statusTextActive: {
    color: '#007AFF',
  },
  linkStats: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E5EA',
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  divider: {
    width: 1,
    backgroundColor: '#E5E5EA',
  },
  linkActions: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  actionButton: {
    flex: 1,
    minWidth: '18%',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonDelete: {
    backgroundColor: '#FFE5E5',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  actionButtonDeleteText: {
    color: '#FF3B30',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalTextInput: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 14,
    color: '#000',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#F2F2F7',
  },
  modalButtonSave: {
    backgroundColor: '#007AFF',
  },
  modalButtonTextCancel: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  modalButtonTextSave: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
