import { Lunar } from 'lunar-javascript';

/**
 * 农历服务
 * 负责农历日期计算和农历相关提醒逻辑
 */
export class LunarService {
  /**
   * 获取指定日期的农历信息
   */
  static getLunarDate(date: Date): {
    year: number;
    month: number;
    day: number;
    isLeapMonth: boolean;
  } {
    const lunar = Lunar.fromDate(date);
    return {
      year: lunar.getYear(),
      month: lunar.getMonth(),
      day: lunar.getDay(),
      isLeapMonth: lunar.isLeap(),
    };
  }

  /**
   * 检查指定日期是否是农历初一或十五
   */
  static isFirstOrFifteenth(date: Date): boolean {
    const lunar = Lunar.fromDate(date);
    const day = lunar.getDay();
    return day === 1 || day === 15;
  }

  /**
   * 检查指定日期是否匹配农历日期列表
   */
  static matchesLunarDays(date: Date, lunarDays: number[]): boolean {
    const lunar = Lunar.fromDate(date);
    return lunarDays.includes(lunar.getDay());
  }

  /**
   * 获取下一个农历特定日期
   * @param date 基准日期
   * @param lunarMonth 农历月份 (1-12)
   * @param lunarDay 农历日 (1-30)
   */
  static getNextLunarDate(date: Date, lunarMonth: number, lunarDay: number): Date {
    const lunar = Lunar.fromDate(date);
    const targetLunar = lunar.next(lunarMonth, lunarDay);
    return targetLunar.getSolar().toJsDate();
  }

  /**
   * 获取农历月初和月末提醒时间
   * @param date 基准日期
   * @param days [1, 15] 表示初一十五
   */
  static getNextLunarReminders(date: Date, days: number[]): Date[] {
    const reminders: Date[] = [];

    for (const day of days) {
      const lunar = Lunar.fromDate(date);
      const currentDay = lunar.getDay();

      if (day >= currentDay) {
        // 本月还没到
        const targetLunar = lunar.next(lunar.getMonth(), day);
        reminders.push(targetLunar.getSolar().toJsDate());
      } else {
        // 下月
        const nextMonthLunar = lunar.next(lunar.getMonth() + 1, day);
        reminders.push(nextMonthLunar.getSolar().toJsDate());
      }
    }

    return reminders.sort((a, b) => a.getTime() - b.getTime());
  }

  /**
   * 格式化农历日期显示
   */
  static formatLunarDate(date: Date): string {
    const lunar = Lunar.fromDate(date);
    return `农历${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`;
  }
}

export default LunarService;
