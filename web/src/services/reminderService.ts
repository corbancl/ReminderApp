import { Reminder, LunarReminder, PeriodicReminder, FixedReminder, CustomReminder } from '../types';
import { LunarService } from './lunarService';

/**
 * 提醒服务 - 管理提醒的存储、调度和触发
 */
export class ReminderService {
  private static STORAGE_KEY = 'reminder_app_reminders';

  /**
   * 获取所有提醒
   */
  static getAllReminders(): Reminder[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load reminders:', error);
      return [];
    }
  }

  /**
   * 保存所有提醒
   */
  static saveReminders(reminders: Reminder[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reminders));
    } catch (error) {
      console.error('Failed to save reminders:', error);
    }
  }

  /**
   * 添加提醒
   */
  static addReminder(reminder: Reminder): void {
    const reminders = this.getAllReminders();
    reminders.push(reminder);
    this.saveReminders(reminders);
  }

  /**
   * 删除提醒
   */
  static deleteReminder(id: string): void {
    const reminders = this.getAllReminders();
    const filtered = reminders.filter(r => r.id !== id);
    this.saveReminders(filtered);
  }

  /**
   * 切换提醒启用状态
   */
  static toggleReminder(id: string): void {
    const reminders = this.getAllReminders();
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      reminder.enabled = !reminder.enabled;
      this.saveReminders(reminders);
    }
  }

  /**
   * 获取应该触发的提醒
   */
  static getTriggeredReminders(): Reminder[] {
    const reminders = this.getAllReminders();
    return reminders.filter(r => r.enabled && this.shouldTrigger(r));
  }

  /**
   * 检查提醒是否应该触发
   */
  private static shouldTrigger(reminder: Reminder): boolean {
    const now = new Date();

    switch (reminder.type) {
      case 'lunar':
        return this.shouldTriggerLunar(reminder as LunarReminder, now);
      case 'periodic':
        return this.shouldTriggerPeriodic(reminder as PeriodicReminder, now);
      case 'fixed':
        return this.shouldTriggerFixed(reminder as FixedReminder, now);
      case 'custom':
        return this.shouldTriggerCustom(reminder as CustomReminder, now);
      default:
        return false;
    }
  }

  /**
   * 检查农历提醒是否应该触发
   */
  private static shouldTriggerLunar(reminder: LunarReminder, now: Date): boolean {
    return LunarService.isLunarDate(reminder.lunarDate);
  }

  /**
   * 检查周期性提醒是否应该触发
   */
  private static shouldTriggerPeriodic(reminder: PeriodicReminder, now: Date): boolean {
    const lastTriggered = reminder.lastTriggered || 0;
    const intervalMs = this.getIntervalMs(reminder.interval);
    const nowMs = now.getTime();
    
    return (nowMs - lastTriggered) >= intervalMs;
  }

  /**
   * 检查固定时间提醒是否应该触发
   */
  private static shouldTriggerFixed(reminder: FixedReminder, now: Date): boolean {
    const reminderTime = new Date(reminder.datetime);
    const nowMs = now.getTime();
    const reminderMs = reminderTime.getTime();
    
    // 如果提醒时间已过且在同一天内
    return reminderMs <= nowMs && reminderMs > nowMs - 24 * 60 * 60 * 1000;
  }

  /**
   * 检查自定义提醒是否应该触发
   */
  private static shouldTriggerCustom(reminder: CustomReminder, now: Date): boolean {
    const lastTriggered = reminder.lastTriggered || 0;
    const nowMs = now.getTime();
    const nowDate = new Date(nowMs);
    
    let shouldTrigger = false;

    // 每周几提醒
    if (reminder.customWeekday !== undefined) {
      if (nowDate.getDay() === reminder.customWeekday) {
        const lastDate = new Date(lastTriggered);
        shouldTrigger = nowDate.getDate() !== lastDate.getDate() ||
                       nowDate.getMonth() !== lastDate.getMonth();
      }
    }

    // 每月几号提醒
    if (reminder.customMonthday !== undefined) {
      if (nowDate.getDate() === reminder.customMonthday) {
        const lastDate = new Date(lastTriggered);
        shouldTrigger = nowDate.getMonth() !== lastDate.getMonth();
      }
    }

    return shouldTrigger;
  }

  /**
   * 更新提醒的触发时间
   */
  static updateTriggerTime(id: string): void {
    const reminders = this.getAllReminders();
    const reminder = reminders.find(r => r.id === id);
    
    if (reminder && (reminder.type === 'periodic' || reminder.type === 'custom')) {
      (reminder as any).lastTriggered = new Date().getTime();
      this.saveReminders(reminders);
    }
  }

  /**
   * 获取间隔时间的毫秒数
   */
  private static getIntervalMs(interval: string): number {
    const intervals: { [key: string]: number } = {
      'hourly': 60 * 60 * 1000,
      'daily': 24 * 60 * 60 * 1000,
      'weekly': 7 * 24 * 60 * 60 * 1000,
      'monthly': 30 * 24 * 60 * 60 * 1000
    };
    return intervals[interval] || 24 * 60 * 60 * 1000;
  }

  /**
   * 请求浏览器通知权限
   */
  static async requestNotificationPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  /**
   * 显示浏览器通知
   */
  static showNotification(title: string, body: string): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: `reminder-${Date.now()}`
      });
    }
  }
}
