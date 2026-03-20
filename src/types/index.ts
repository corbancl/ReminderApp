// 提醒类型定义
export type ReminderType = 'lunar' | 'interval' | 'fixed-time' | 'complex';

export type FrequencyType = 'hourly' | 'daily' | 'weekly' | 'monthly';

export interface Reminder {
  id: string;
  title: string;
  message: string;
  type: ReminderType;
  enabled: boolean;
  createdAt: Date;
  lastTriggered?: Date;
  nextTrigger?: Date;

  // 周期性提醒参数
  frequency?: FrequencyType;
  interval?: number; // 小时数

  // 固定时间提醒参数
  time?: string; // 'HH:mm' 格式

  // 复杂周期参数
  weekdays?: number[]; // 0-6 (周日到周六)
  monthDays?: number[]; // 1-31 (每月几号)

  // 农历提醒参数
  lunarDays?: number[]; // [1, 15] 表示初一十五
}

export interface ReminderTemplate {
  id: string;
  name: string;
  description: string;
  defaultSettings: Partial<Reminder>;
}

export interface NotificationSettings {
  enabled: boolean;
  sound: string;
  vibrate: boolean;
  notificationTime?: string; // 默认通知时间
}
