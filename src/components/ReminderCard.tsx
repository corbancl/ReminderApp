import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Reminder } from '../types';
import { DateUtils } from '../utils/dateUtils';

interface ReminderCardProps {
  reminder: Reminder;
  onToggle: (reminderId: string) => void;
  onDelete: (reminderId: string) => void;
  onEdit: (reminder: Reminder) => void;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder,
  onToggle,
  onDelete,
  onEdit,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, !reminder.enabled && styles.disabled]}
      onPress={() => onEdit(reminder)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.mainInfo}>
          <Text style={[styles.title, !reminder.enabled && styles.disabledText]}>
            {reminder.title}
          </Text>
          <Text style={[styles.description, !reminder.enabled && styles.disabledText]}>
            {reminder.message}
          </Text>
          <Text style={styles.typeLabel}>
            {DateUtils.getReminderDescription(reminder)}
          </Text>
        </View>

        <View style={styles.rightSection}>
          <Switch
            value={reminder.enabled}
            onValueChange={() => onToggle(reminder.id)}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={reminder.enabled ? '#2196F3' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
          />

          {reminder.nextTrigger && reminder.enabled && (
            <Text style={styles.nextTrigger}>
              {DateUtils.formatRelativeTime(reminder.nextTrigger)}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.createdDate}>
          创建于 {DateUtils.formatDate(reminder.createdAt)}
        </Text>
        <TouchableOpacity onPress={() => onDelete(reminder.id)}>
          <Text style={styles.deleteButton}>删除</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabled: {
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  mainInfo: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  typeLabel: {
    fontSize: 12,
    color: '#2196F3',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  nextTrigger: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  createdDate: {
    fontSize: 12,
    color: '#999999',
  },
  deleteButton: {
    fontSize: 14,
    color: '#F44336',
    fontWeight: '500',
  },
  disabledText: {
    color: '#999999',
  },
});
