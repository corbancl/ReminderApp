import * as Lunar from 'lunar-javascript';

/**
 * 农历服务 - 提供农历日期计算和检测功能
 */
export class LunarService {
  /**
   * 检查当前日期是否为指定的农历日期(初一或十五)
   */
  static isLunarDate(lunarDay: number): boolean {
    try {
      const lunar = Lunar.Lunar.fromDate(new Date());
      return lunar.getDay() === lunarDay;
    } catch (error) {
      console.error('Lunar calendar error:', error);
      return false;
    }
  }

  /**
   * 获取当前农历日期(日)
   */
  static getCurrentLunarDay(): number {
    try {
      const lunar = Lunar.Lunar.fromDate(new Date());
      return lunar.getDay();
    } catch (error) {
      console.error('Lunar calendar error:', error);
      return 1;
    }
  }

  /**
   * 获取当前农历月
   */
  static getCurrentLunarMonth(): number {
    try {
      const lunar = Lunar.Lunar.fromDate(new Date());
      return lunar.getMonth();
    } catch (error) {
      console.error('Lunar calendar error:', error);
      return 1;
    }
  }

  /**
   * 获取农历日期的中文描述
   */
  static getLunarDayName(day: number): string {
    const lunarNames = [
      '', '初一', '初二', '初三', '初四', '初五',
      '初六', '初七', '初八', '初九', '初十',
      '十一', '十二', '十三', '十四', '十五',
      '十六', '十七', '十八', '十九', '二十',
      '廿一', '廿二', '廿三', '廿四', '廿五',
      '廿六', '廿七', '廿八', '廿九', '三十'
    ];
    return lunarNames[day] || '';
  }

  /**
   * 获取农历月相名称
   */
  static getMoonPhase(day: number): string {
    if (day === 1) return '新月';
    if (day === 15) return '满月';
    if (day < 7) return '蛾眉月';
    if (day < 14) return '上弦月';
    if (day < 22) return '下弦月';
    return '残月';
  }

  /**
   * 计算距离下一个指定农历日期的天数
   */
  static daysUntilLunarDate(targetDay: number): number {
    try {
      const today = new Date();
      const lunarToday = Lunar.Lunar.fromDate(today);
      
      let days = 0;
      let checkDate = new Date(today);
      
      while (true) {
        const lunar = Lunar.Lunar.fromDate(checkDate);
        if (lunar.getDay() === targetDay && lunar.getMonth() !== lunarToday.getMonth()) {
          break;
        }
        checkDate.setDate(checkDate.getDate() + 1);
        days++;
        
        // 防止无限循环(最多查60天)
        if (days > 60) {
          return 0;
        }
      }
      
      return days;
    } catch (error) {
      console.error('Lunar calendar error:', error);
      return 0;
    }
  }
}
