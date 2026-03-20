import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Reminder, ReminderType, FrequencyType } from '../types';
import { ReminderService } from '../services/reminderService';

interface AddReminderModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (reminder: Reminder) => void;
  editReminder?: Reminder;
}

export const AddReminderModal: React.FC<AddReminderModalProps> = ({
  visible,
  onClose,
  onAdd,
  editReminder,
}) => {
  const [title, setTitle] = useState(editReminder?.title || '');
  const [message, setMessage] = useState(editReminder?.message || '');
  const [reminderType, setReminderType] = useState<ReminderType>(
    editReminder?.type || 'fixed-time'
  );
  const [enabled, setEnabled] = useState(editReminder?.enabled ?? true);
  const [time, setTime] = useState(editReminder?.time || '08:00');
  const [interval, setInterval] = useState(editReminder?.interval?.toString() || '1');
  const [frequency, setFrequency] = useState<FrequencyType>(
    editReminder?.frequency || 'hourly'
  );
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>(
    editReminder?.weekdays || []
  );
  const [selectedLunarDays, setSelectedLunarDays] = useState<number[]>(
    editReminder?.lunarDays || [1, 15]
  );
  const [selectedMonthDays, setSelectedMonthDays] = useState<number[]>(
    editReminder?.monthDays || []
  );

  const weekdays = [0, 1, 2, 3, 4, 5, 6]; // 周日到周六
  const weekdayNames = ['日', '一', '二', '三', '四', '五', '六'];

  const handleSave = async () => {
    if (!title.trim()) {
      alert('请输入提醒标题');
      return;
    }

    const reminderData: Partial<Reminder> = {
      title: title.trim(),
      message: message.trim() || '提醒',
      type: reminderType,
      enabled,
    };

    // 根据类型设置相应参数
    switch (reminderType) {
      case 'lunar':
        reminderData.lunarDays = selectedLunarDays.length > 0 ? selectedLunarDays : [1, 15];
        break;
      case 'interval':
        reminderData.frequency = frequency;
        reminderData.interval = parseInt(interval) || 1;
        break;
      case 'fixed-time':
        reminderData.time = time;
        break;
      case 'complex':
        if (frequency === 'weekly') {
          reminderData.weekdays = selectedWeekdays;
          reminderData.frequency = frequency;
        } else if (frequency === 'monthly') {
          reminderData.monthDays = selectedMonthDays;
          reminderData.frequency = frequency;
        }
        break;
    }

    const newReminder = await ReminderService.createReminder(reminderData as Omit<Reminder, 'id' | 'createdAt' | 'nextTrigger'>);
    onAdd(newReminder);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    // 重置表单
    setTitle('');
    setMessage('');
    setReminderType('fixed-time');
    setEnabled(true);
    setTime('08:00');
    setInterval('1');
    setFrequency('hourly');
    setSelectedWeekdays([]);
    setSelectedLunarDays([1, 15]);
    setSelectedMonthDays([]);
  };

  const toggleWeekday = (day: number) => {
    if (selectedWeekdays.includes(day)) {
      setSelectedWeekdays(selectedWeekdays.filter((d) => d !== day));
    } else {
      setSelectedWeekdays([...selectedWeekdays, day]);
    }
  };

  const toggleLunarDay = (day: number) => {
    if (selectedLunarDays.includes(day)) {
      setSelectedLunarDays(selectedLunarDays.filter((d) => d !== day));
    } else {
      setSelectedLunarDays([...selectedLunarDays, day]);
    }
  };

  const toggleMonthDay = (day: number) => {
    if (selectedMonthDays.includes(day)) {
      setSelectedMonthDays(selectedMonthDays.filter((d) => d !== day));
    } else {
      setSelectedMonthDays([...selectedMonthDays, day]);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose}>
              <Text style={styles.cancelButton}>取消</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {editReminder ? '编辑提醒' : '添加提醒'}
            </Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.saveButton}>保存</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            {/* 提醒标题 */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>标题 *</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="请输入提醒标题"
                placeholderTextColor="#999"
              />
            </View>

            {/* 提醒内容 */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>提醒内容</Text>
              <TextInput
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                placeholder="请输入提醒内容"
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
              />
            </View>

            {/* 提醒类型 */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>提醒类型</Text>
              <View style={styles.typeButtons}>
                {(['fixed-time', 'interval', 'lunar', 'complex'] as ReminderType[]).map(
                  (type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeButton,
                        reminderType === type && styles.activeTypeButton,
                      ]}
                      onPress={() => setReminderType(type)}
                    >
                      <Text
                        style={[
                          styles.typeButtonText,
                          reminderType === type && styles.activeTypeButtonText,
                        ]}
                      >
                        {type === 'fixed-time' && '固定时间'}
                        {type === 'interval' && '周期提醒'}
                        {type === 'lunar' && '农历提醒'}
                        {type === 'complex' && '自定义'}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>

            {/* 固定时间选项 */}
            {reminderType === 'fixed-time' && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>提醒时间</Text>
                <TextInput
                  style={styles.input}
                  value={time}
                  onChangeText={setTime}
                  placeholder="HH:mm (如 08:00)"
                  keyboardType="numbers-and-punctuation"
                  maxLength={5}
                />
              </View>
            )}

            {/* 周期提醒选项 */}
            {reminderType === 'interval' && (
              <>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>频率</Text>
                  <View style={styles.frequencyButtons}>
                    {(['hourly', 'daily'] as FrequencyType[]).map((freq) => (
                      <TouchableOpacity
                        key={freq}
                        style={[
                          styles.freqButton,
                          frequency === freq && styles.activeFreqButton,
                        ]}
                        onPress={() => setFrequency(freq)}
                      >
                        <Text
                          style={[
                            styles.freqButtonText,
                            frequency === freq && styles.activeFreqButtonText,
                          ]}
                        >
                          {freq === 'hourly' ? '每小时' : '每天'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>间隔</Text>
                  <TextInput
                    style={styles.input}
                    value={interval}
                    onChangeText={setInterval}
                    placeholder="间隔数量"
                    keyboardType="number-pad"
                  />
                </View>
              </>
            )}

            {/* 农历提醒选项 */}
            {reminderType === 'lunar' && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>农历日期</Text>
                <View style={styles.lunarDayButtons}>
                  {[1, 15].map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.lunarDayButton,
                        selectedLunarDays.includes(day) && styles.activeLunarDayButton,
                      ]}
                      onPress={() => toggleLunarDay(day)}
                    >
                      <Text
                        style={[
                          styles.lunarDayButtonText,
                          selectedLunarDays.includes(day) && styles.activeLunarDayButtonText,
                        ]}
                      >
                        {day === 1 ? '初一' : '十五'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* 自定义周期选项 */}
            {reminderType === 'complex' && (
              <>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>周期频率</Text>
                  <View style={styles.frequencyButtons}>
                    {(['weekly', 'monthly'] as FrequencyType[]).map((freq) => (
                      <TouchableOpacity
                        key={freq}
                        style={[
                          styles.freqButton,
                          frequency === freq && styles.activeFreqButton,
                        ]}
                        onPress={() => setFrequency(freq)}
                      >
                        <Text
                          style={[
                            styles.freqButtonText,
                            frequency === freq && styles.activeFreqButtonText,
                          ]}
                        >
                          {freq === 'weekly' ? '每周' : '每月'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {frequency === 'weekly' && (
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>选择星期</Text>
                    <View style={styles.weekdayButtons}>
                      {weekdays.map((day) => (
                        <TouchableOpacity
                          key={day}
                          style={[
                            styles.weekdayButton,
                            selectedWeekdays.includes(day) && styles.activeWeekdayButton,
                          ]}
                          onPress={() => toggleWeekday(day)}
                        >
                          <Text
                            style={[
                              styles.weekdayButtonText,
                              selectedWeekdays.includes(day) &&
                                styles.activeWeekdayButtonText,
                            ]}
                          >
                            {weekdayNames[day]}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                {frequency === 'monthly' && (
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>选择日期 (每月几号)</Text>
                    <View style={styles.monthDayButtons}>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <TouchableOpacity
                          key={day}
                          style={[
                            styles.monthDayButton,
                            selectedMonthDays.includes(day) && styles.activeMonthDayButton,
                          ]}
                          onPress={() => toggleMonthDay(day)}
                        >
                          <Text
                            style={[
                              styles.monthDayButtonText,
                              selectedMonthDays.includes(day) && styles.activeMonthDayButtonText,
                            ]}
                          >
                            {day}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              </>
            )}

            {/* 启用开关 */}
            <View style={styles.formGroup}>
              <View style={styles.switchRow}>
                <Text style={styles.label}>启用提醒</Text>
                <Switch
                  value={enabled}
                  onValueChange={setEnabled}
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={enabled ? '#2196F3' : '#f4f3f4'}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  cancelButton: {
    fontSize: 16,
    color: '#666666',
  },
  saveButton: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
  },
  form: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333333',
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeTypeButton: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#333333',
  },
  activeTypeButtonText: {
    color: '#FFFFFF',
  },
  frequencyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  freqButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeFreqButton: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  freqButtonText: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
  },
  activeFreqButtonText: {
    color: '#FFFFFF',
  },
  lunarDayButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  lunarDayButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeLunarDayButton: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  lunarDayButtonText: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
  },
  activeLunarDayButtonText: {
    color: '#FFFFFF',
  },
  weekdayButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  weekdayButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeWeekdayButton: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  weekdayButtonText: {
    fontSize: 14,
    color: '#333333',
  },
  activeWeekdayButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  monthDayButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  monthDayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeMonthDayButton: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  monthDayButtonText: {
    fontSize: 14,
    color: '#333333',
  },
  activeMonthDayButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
