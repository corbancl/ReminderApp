export interface Reminder {
  id: string;
  title: string;
  description?: string;
  type: 'lunar' | 'periodic' | 'fixed' | 'custom';
  enabled: boolean;
  createdAt: number;
}

export interface LunarReminder extends Reminder {
  type: 'lunar';
  lunarDate: number; // 1(初一) 或 15(十五)
}

export interface PeriodicReminder extends Reminder {
  type: 'periodic';
  interval: 'hourly' | 'daily' | 'weekly' | 'monthly';
  lastTriggered?: number;
}

export interface FixedReminder extends Reminder {
  type: 'fixed';
  datetime: string; // ISO 8601格式
}

export interface CustomReminder extends Reminder {
  type: 'custom';
  cronExpression: string; // 简化的cron表达式
  lastTriggered?: number;
}

export type ReminderType = Reminder['type'];

export interface ReminderFormData {
  title: string;
  description?: string;
  type: ReminderType;
  // Lunar
  lunarDate?: number;
  // Periodic
  interval?: 'hourly' | 'daily' | 'weekly' | 'monthly';
  // Fixed
  datetime?: string;
  // Custom
  customWeekday?: number; // 0-6 (周日到周六)
  customMonthday?: number; // 1-31
}
