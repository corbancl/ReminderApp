import { Reminder } from '../types';
import { LunarService } from '../services/lunarService';

/**
 * 日期工具函数
 */
export class DateUtils {
  /**
   * 格式化日期显示
   */
  static formatDate(date: Date): string {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * 格式化时间显示
   */
  static formatTime(date: Date): string {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * 格式化相对时间(如:3天后)
   */
  static formatRelativeTime(date: Date): string {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) {
      return `${days}天后`;
    } else if (hours > 0) {
      return `${hours}小时后`;
    } else if (minutes > 0) {
      return `${minutes}分钟后`;
    } else {
      return '刚刚';
    }
  }

  /**
   * 检查日期是否过期
   */
  static isExpired(date: Date): boolean {
    return date.getTime() < Date.now();
  }

  /**
   * 获取提醒的下次触发时间显示文本
   */
  static getNextTriggerText(reminder: Reminder): string {
    if (!reminder.nextTrigger) {
      return reminder.enabled ? '计算中...' : '已禁用';
    }

    if (this.isExpired(reminder.nextTrigger)) {
      return '已过期';
    }

    return this.formatRelativeTime(reminder.nextTrigger);
  }

  /**
   * 解析时间字符串为Date对象
   */
  static parseTime(timeStr: string): Date {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  /**
   * 获取星期几的中文名称
   */
  static getWeekdayName(day: number): string {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekdays[day];
  }

  /**
   * 格式化星期几列表
   */
  static formatWeekdays(weekdays: number[]): string {
    if (!weekdays || weekdays.length === 0) {
      return '';
    }
    return weekdays.map((day) => this.getWeekdayName(day)).join(', ');
  }

  /**
   * 格式化农历日期列表
   */
  static formatLunarDays(lunarDays: number[]): string {
    if (!lunarDays || lunarDays.length === 0) {
      return '';
    }

    const lunarDayNames: { [key: number]: string } = {
      1: '初一',
      15: '十五',
    };

    return lunarDays.map((day) => lunarDayNames[day] || `${day}日`).join(', ');
  }

  /**
   * 获取提醒类型的显示名称
   */
  static getReminderTypeName(type: string): string {
    const typeNames: { [key: string]: string } = {
      'lunar': '农历提醒',
      'interval': '周期提醒',
      'fixed-time': '固定时间',
      'complex': '自定义周期',
    };
    return typeNames[type] || type;
  }

  /**
   * 获取提醒描述文本
   */
  static getReminderDescription(reminder: Reminder): string {
    const typeName = this.getReminderTypeName(reminder.type);

    switch (reminder.type) {
      case 'lunar':
        return `${typeName}: ${this.formatLunarDays(reminder.lunarDays || [])}`;

      case 'interval':
        const intervalText = reminder.frequency === 'hourly' ? '每小时' : '每天';
        return `${typeName}: 每${reminder.interval || 1}${reminder.frequency === 'hourly' ? '小时' : '天'}`;

      case 'fixed-time':
        return `${typeName}: 每天 ${reminder.time}`;

      case 'complex':
        if (reminder.frequency === 'weekly') {
          return `${typeName}: 每周 ${this.formatWeekdays(reminder.weekdays || [])}`;
        } else if (reminder.frequency === 'monthly') {
          return `${typeName}: 每月 ${reminder.monthDays?.join('日, ')}日`;
        }
        return typeName;

      default:
        return typeName;
    }
  }
}

export default DateUtils;
