import AsyncStorage from '@react-native-async-storage/async-storage';
import { Reminder } from '../types';

const REMINDERS_KEY = '@reminders';

/**
 * 提醒数据存储服务
 * 使用 AsyncStorage 存储提醒数据
 */
export class ReminderStore {
  /**
   * 获取所有提醒
   */
  static async getAllReminders(): Promise<Reminder[]> {
    try {
      const remindersJson = await AsyncStorage.getItem(REMINDERS_KEY);
      if (!remindersJson) {
        return [];
      }
      const reminders = JSON.parse(remindersJson);
      // 将字符串日期转换回Date对象
      return reminders.map((r: any) => ({
        ...r,
        createdAt: new Date(r.createdAt),
        lastTriggered: r.lastTriggered ? new Date(r.lastTriggered) : undefined,
        nextTrigger: r.nextTrigger ? new Date(r.nextTrigger) : undefined,
      }));
    } catch (error) {
      console.error('获取提醒失败:', error);
      return [];
    }
  }

  /**
   * 保存所有提醒
   */
  static async saveAllReminders(reminders: Reminder[]): Promise<void> {
    try {
      await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
    } catch (error) {
      console.error('保存提醒失败:', error);
      throw error;
    }
  }

  /**
   * 添加提醒
   */
  static async addReminder(reminder: Reminder): Promise<void> {
    const reminders = await this.getAllReminders();
    reminders.push(reminder);
    await this.saveAllReminders(reminders);
  }

  /**
   * 更新提醒
   */
  static async updateReminder(reminder: Reminder): Promise<void> {
    const reminders = await this.getAllReminders();
    const index = reminders.findIndex((r) => r.id === reminder.id);
    if (index !== -1) {
      reminders[index] = reminder;
      await this.saveAllReminders(reminders);
    }
  }

  /**
   * 删除提醒
   */
  static async deleteReminder(reminderId: string): Promise<void> {
    const reminders = await this.getAllReminders();
    const filtered = reminders.filter((r) => r.id !== reminderId);
    await this.saveAllReminders(filtered);
  }

  /**
   * 根据ID获取提醒
   */
  static async getReminderById(reminderId: string): Promise<Reminder | undefined> {
    const reminders = await this.getAllReminders();
    return reminders.find((r) => r.id === reminderId);
  }

  /**
   * 根据类型获取提醒
   */
  static async getRemindersByType(type: string): Promise<Reminder[]> {
    const reminders = await this.getAllReminders();
    return reminders.filter((r) => r.type === type && r.enabled);
  }

  /**
   * 获取所有启用的提醒
   */
  static async getEnabledReminders(): Promise<Reminder[]> {
    const reminders = await this.getAllReminders();
    return reminders.filter((r) => r.enabled);
  }

  /**
   * 清空所有数据
   */
  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(REMINDERS_KEY);
    } catch (error) {
      console.error('清空数据失败:', error);
      throw error;
    }
  }
}

export default ReminderStore;
