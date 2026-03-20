import { Reminder, ReminderType, FrequencyType } from '../types';
import { ReminderStore } from '../storage/reminderStore';
import { NotificationService } from './notificationService';
import { LunarService } from './lunarService';

/**
 * 提醒业务逻辑服务
 * 负责提醒的创建、调度、更新等核心逻辑
 */
export class ReminderService {
  /**
   * 创建新提醒
   */
  static async createReminder(reminder: Omit<Reminder, 'id' | 'createdAt' | 'nextTrigger'>): Promise<Reminder> {
    const newReminder: Reminder = {
      ...reminder,
      id: this.generateId(),
      createdAt: new Date(),
      nextTrigger: this.calculateNextTrigger(reminder as Reminder),
    };

    // 保存到存储
    await ReminderStore.addReminder(newReminder);

    // 调度通知
    if (newReminder.enabled && newReminder.nextTrigger) {
      NotificationService.scheduleReminder(newReminder, newReminder.nextTrigger);
    }

    return newReminder;
  }

  /**
   * 更新提醒
   */
  static async updateReminder(reminder: Reminder): Promise<void> {
    // 重新计算下次触发时间
    reminder.nextTrigger = this.calculateNextTrigger(reminder);

    // 保存更新
    await ReminderStore.updateReminder(reminder);

    // 取消旧通知,设置新通知
    if (reminder.enabled && reminder.nextTrigger) {
      NotificationService.cancelReminder(reminder.id);
      NotificationService.scheduleReminder(reminder, reminder.nextTrigger);
    } else {
      NotificationService.cancelReminder(reminder.id);
    }
  }

  /**
   * 删除提醒
   */
  static async deleteReminder(reminderId: string): Promise<void> {
    await ReminderStore.deleteReminder(reminderId);
    NotificationService.cancelReminder(reminderId);
  }

  /**
   * 启用/禁用提醒
   */
  static async toggleReminder(reminderId: string): Promise<void> {
    const reminder = await ReminderStore.getReminderById(reminderId);
    if (!reminder) return;

    reminder.enabled = !reminder.enabled;
    reminder.nextTrigger = reminder.enabled ? this.calculateNextTrigger(reminder) : undefined;

    await ReminderStore.updateReminder(reminder);

    if (reminder.enabled && reminder.nextTrigger) {
      NotificationService.scheduleReminder(reminder, reminder.nextTrigger);
    } else {
      NotificationService.cancelReminder(reminderId);
    }
  }

  /**
   * 计算下次触发时间
   */
  static calculateNextTrigger(reminder: Reminder): Date | undefined {
    if (!reminder.enabled) {
      return undefined;
    }

    const now = new Date();

    switch (reminder.type) {
      case 'lunar':
        return this.calculateLunarTrigger(reminder, now);

      case 'interval':
        return this.calculateIntervalTrigger(reminder, now);

      case 'fixed-time':
        return this.calculateFixedTimeTrigger(reminder, now);

      case 'complex':
        return this.calculateComplexTrigger(reminder, now);

      default:
        return undefined;
    }
  }

  /**
   * 计算农历提醒触发时间
   */
  private static calculateLunarTrigger(reminder: Reminder, now: Date): Date {
    if (!reminder.lunarDays || reminder.lunarDays.length === 0) {
      return new Date(now.getTime() + 24 * 60 * 60 * 1000); // 默认明天
    }

    const nextDates = LunarService.getNextLunarReminders(now, reminder.lunarDays);
    return nextDates[0] || new Date(now.getTime() + 24 * 60 * 60 * 1000);
  }

  /**
   * 计算间隔提醒触发时间
   */
  private static calculateIntervalTrigger(reminder: Reminder, now: Date): Date {
    if (!reminder.interval || reminder.interval <= 0) {
      return new Date(now.getTime() + 60 * 60 * 1000); // 默认1小时
    }

    switch (reminder.frequency) {
      case 'hourly':
        return new Date(now.getTime() + reminder.interval * 60 * 60 * 1000);

      case 'daily':
        return new Date(now.getTime() + reminder.interval * 24 * 60 * 60 * 1000);

      default:
        return new Date(now.getTime() + 60 * 60 * 1000);
    }
  }

  /**
   * 计算固定时间提醒
   */
  private static calculateFixedTimeTrigger(reminder: Reminder, now: Date): Date {
    if (!reminder.time) {
      return new Date(now.getTime() + 60 * 60 * 1000);
    }

    const [hours, minutes] = reminder.time.split(':').map(Number);
    const triggerDate = new Date(now);
    triggerDate.setHours(hours, minutes, 0, 0);

    // 如果今天的时间已经过了,则设为明天
    if (triggerDate <= now) {
      triggerDate.setDate(triggerDate.getDate() + 1);
    }

    return triggerDate;
  }

  /**
   * 计算复杂周期提醒(每周几/每月几号)
   */
  private static calculateComplexTrigger(reminder: Reminder, now: Date): Date {
    if (reminder.frequency === 'weekly' && reminder.weekdays) {
      // 每周几提醒
      const currentDay = now.getDay();
      const sortedWeekdays = reminder.weekdays.sort((a, b) => a - b);

      // 找到下一个星期几
      const nextWeekday = sortedWeekdays.find((day) => day > currentDay);

      if (nextWeekday !== undefined) {
        // 本周还有
        const daysUntil = nextWeekday - currentDay;
        return new Date(now.getTime() + daysUntil * 24 * 60 * 60 * 1000);
      } else {
        // 下周
        const daysUntil = 7 - currentDay + sortedWeekdays[0];
        return new Date(now.getTime() + daysUntil * 24 * 60 * 60 * 1000);
      }
    } else if (reminder.frequency === 'monthly' && reminder.monthDays) {
      // 每月几号提醒
      const currentDay = now.getDate();
      const sortedDays = reminder.monthDays.sort((a, b) => a - b);

      const nextMonthDay = sortedDays.find((day) => day > currentDay);

      if (nextMonthDay !== undefined) {
        // 本月还有
        const nextDate = new Date(now);
        nextDate.setDate(nextMonthDay);
        return nextDate;
      } else {
        // 下月
        const nextDate = new Date(now);
        nextDate.setMonth(nextDate.getMonth() + 1);
        nextDate.setDate(sortedDays[0]);
        return nextDate;
      }
    }

    return new Date(now.getTime() + 24 * 60 * 60 * 1000);
  }

  /**
   * 通知触发后的回调
   * 用于重新调度下一次提醒
   */
  static async onNotificationTriggered(reminderId: string): Promise<void> {
    const reminder = await ReminderStore.getReminderById(reminderId);
    if (!reminder || !reminder.enabled) {
      return;
    }

    // 更新最后触发时间
    reminder.lastTriggered = new Date();

    // 重新计算下次触发时间
    reminder.nextTrigger = this.calculateNextTrigger(reminder);

    // 保存并重新调度
    await ReminderStore.updateReminder(reminder);
    if (reminder.nextTrigger) {
      NotificationService.scheduleReminder(reminder, reminder.nextTrigger);
    }
  }

  /**
   * 初始化时重新调度所有启用的提醒
   * 用于应用启动时恢复提醒
   */
  static async rescheduleAllReminders(): Promise<void> {
    const reminders = await ReminderStore.getEnabledReminders();
    for (const reminder of reminders) {
      const nextTrigger = this.calculateNextTrigger(reminder);
      if (nextTrigger) {
        reminder.nextTrigger = nextTrigger;
        await ReminderStore.updateReminder(reminder);
        NotificationService.scheduleReminder(reminder, nextTrigger);
      }
    }
  }

  /**
   * 生成唯一ID
   */
  private static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 获取预设提醒模板
   */
  static getReminderTemplates(): Array<{
    id: string;
    name: string;
    description: string;
    defaultSettings: Partial<Reminder>;
  }> {
    return [
      {
        id: 'lunar-1-15',
        name: '农历初一十五',
        description: '每月农历初一和十五提醒',
        defaultSettings: {
          type: 'lunar',
          title: '农历初一十五提醒',
          message: '今天是农历初一或十五',
          lunarDays: [1, 15],
          enabled: true,
        },
      },
      {
        id: 'daily-8am',
        name: '每日早8点',
        description: '每天早上8点提醒',
        defaultSettings: {
          type: 'fixed-time',
          title: '每日提醒',
          message: '记得检查事项',
          time: '08:00',
          enabled: true,
        },
      },
      {
        id: 'weekly-mon',
        name: '每周一',
        description: '每周一提醒',
        defaultSettings: {
          type: 'complex',
          frequency: 'weekly',
          title: '周一提醒',
          message: '新的一周开始了',
          weekdays: [1],
          enabled: true,
        },
      },
      {
        id: 'hourly-2',
        name: '每2小时',
        description: '每隔2小时提醒一次',
        defaultSettings: {
          type: 'interval',
          frequency: 'hourly',
          title: '定时提醒',
          message: '该做某事了',
          interval: 2,
          enabled: true,
        },
      },
    ];
  }
}

export default ReminderService;
