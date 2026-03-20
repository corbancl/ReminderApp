import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Reminder } from '../types';
import { ReminderStore } from '../storage/reminderStore';
import { ReminderService } from '../services/reminderService';
import { NotificationService } from '../services/notificationService';
import { ReminderCard } from '../components/ReminderCard';
import { AddReminderModal } from '../components/AddReminderModal';

export const HomeScreen: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editReminder, setEditReminder] = useState<Reminder | undefined>();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setLoading(true);

      // 初始化通知服务
      NotificationService.initialize();

      // 请求通知权限
      const hasPermission = await NotificationService.requestPermissions();
      if (!hasPermission) {
        Alert.alert(
          '通知权限',
          '需要通知权限才能发送提醒。请在设置中开启通知权限。',
          [{ text: '确定' }]
        );
      }

      // 加载提醒列表
      await loadReminders();

      // 重新调度所有提醒
      await ReminderService.rescheduleAllReminders();
    } catch (error) {
      console.error('初始化失败:', error);
      Alert.alert('错误', '初始化应用失败,请重试');
    } finally {
      setLoading(false);
    }
  };

  const loadReminders = async () => {
    try {
      const loadedReminders = await ReminderStore.getAllReminders();
      setReminders(loadedReminders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    } catch (error) {
      console.error('加载提醒失败:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReminders();
    setRefreshing(false);
  };

  const handleAddReminder = (reminder: Reminder) => {
    setReminders([reminder, ...reminders]);
  };

  const handleToggleReminder = async (reminderId: string) => {
    try {
      await ReminderService.toggleReminder(reminderId);
      await loadReminders();
    } catch (error) {
      console.error('切换提醒状态失败:', error);
      Alert.alert('错误', '切换提醒状态失败');
    }
  };

  const handleDeleteReminder = async (reminderId: string) => {
    Alert.alert('确认删除', '确定要删除这个提醒吗?', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          try {
            await ReminderService.deleteReminder(reminderId);
            await loadReminders();
          } catch (error) {
            console.error('删除提醒失败:', error);
            Alert.alert('错误', '删除提醒失败');
          }
        },
      },
    ]);
  };

  const handleEditReminder = (reminder: Reminder) => {
    setEditReminder(reminder);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditReminder(undefined);
  };

  const handleUseTemplate = async (templateId: string) => {
    try {
      const templates = ReminderService.getReminderTemplates();
      const template = templates.find((t) => t.id === templateId);

      if (template) {
        const newReminder = await ReminderService.createReminder(
          template.defaultSettings as Omit<Reminder, 'id' | 'createdAt' | 'nextTrigger'>
        );
        setReminders([newReminder, ...reminders]);
      }
    } catch (error) {
      console.error('使用模板失败:', error);
      Alert.alert('错误', '创建模板提醒失败');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>智能提醒</Text>
        <TouchableOpacity onPress={() => setShowAddModal(true)} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ 添加</Text>
        </TouchableOpacity>
      </View>

      {/* 快速模板 */}
      <View style={styles.templateSection}>
        <Text style={styles.sectionTitle}>快速创建</Text>
        <View style={styles.templateButtons}>
          <TouchableOpacity
            style={styles.templateButton}
            onPress={() => handleUseTemplate('lunar-1-15')}
          >
            <Text style={styles.templateButtonText}>农历初一十五</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.templateButton}
            onPress={() => handleUseTemplate('daily-8am')}
          >
            <Text style={styles.templateButtonText}>每日早8点</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 提醒列表 */}
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReminderCard
            reminder={item}
            onToggle={handleToggleReminder}
            onDelete={handleDeleteReminder}
            onEdit={handleEditReminder}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2196F3']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>还没有提醒</Text>
            <Text style={styles.emptySubtext}>点击右上角添加你的第一个提醒</Text>
          </View>
        }
        contentContainerStyle={reminders.length === 0 ? styles.emptyListContent : undefined}
      />

      {/* 添加/编辑提醒弹窗 */}
      <AddReminderModal
        visible={showAddModal}
        onClose={handleCloseModal}
        onAdd={handleAddReminder}
        editReminder={editReminder}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
  },
  addButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  templateSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  templateButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  templateButton: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  templateButtonText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#999999',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  emptyListContent: {
    flex: 1,
  },
});
