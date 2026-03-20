import PushNotification, {
  Importance,
  ReceivedNotification,
} from 'react-native-push-notification';
import { Platform } from 'react-native';
import { Reminder } from '../types';

/**
 * 本地通知服务
 * 封装 react-native-push-notification,提供统一的通知接口
 */
export class NotificationService {
  private static initialized = false;

  /**
   * 初始化通知服务
   */
  static initialize() {
    if (this.initialized) {
      return;
    }

    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },

      onNotification: function (notification: ReceivedNotification) {
        console.log('NOTIFICATION:', notification);

        // 处理通知点击
        if (notification.userInteraction) {
          console.log('用户点击了通知');
        }

        // TODO: 触发回调重新计算下次提醒
        const reminderId = notification.data?.reminderId;
        if (reminderId) {
          // 这里需要调用 ReminderService.onNotificationTriggered(reminderId)
        }

        // 必须调用 finish
        notification.finish(PushNotification.FetchResult.NoData);
      },

      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);
      },

      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    // Android 配置
    PushNotification.createChannel({
      channelId: 'reminder-channel',
      channelName: '提醒通知',
      channelDescription: '智能提醒应用的通知频道',
      playSound: true,
      soundName: 'default',
      importance: Importance.HIGH,
      vibrate: true,
    });

    this.initialized = true;
  }

  /**
   * 请求通知权限
   */
  static async requestPermissions(): Promise<boolean> {
    return new Promise((resolve) => {
      PushNotification.requestPermissions((permissions) => {
        const granted = permissions.alert && permissions.badge && permissions.sound;
        resolve(granted);
      });
    });
  }

  /**
   * 调度提醒通知
   */
  static scheduleReminder(reminder: Reminder, triggerDate: Date) {
    const fireDate = triggerDate.getTime();

    PushNotification.localNotificationSchedule({
      id: reminder.id,
      title: reminder.title,
      message: reminder.message,
      date: new Date(fireDate),
      soundName: 'default',
      playSound: true,
      vibrate: true,
      vibration: 300,
      userInfo: {
        reminderId: reminder.id,
        type: reminder.type,
      },
    });

    console.log(`已调度提醒: ${reminder.title}, 时间: ${triggerDate.toLocaleString()}`);
  }

  /**
   * 取消提醒
   */
  static cancelReminder(reminderId: string) {
    PushNotification.cancelLocalNotifications({ id: reminderId });
    console.log(`已取消提醒: ${reminderId}`);
  }

  /**
   * 取消所有提醒
   */
  static cancelAllReminders() {
    PushNotification.cancelAllLocalNotifications();
    console.log('已取消所有提醒');
  }

  /**
   * 获取所有已调度的通知
   */
  static getScheduledNotifications(): Promise<any[]> {
    return new Promise((resolve) => {
      PushNotification.getScheduledLocalNotifications((notifications) => {
        resolve(notifications);
      });
    });
  }

  /**
   * 立即显示通知(用于测试)
   */
  static showImmediateNotification(title: string, message: string) {
    PushNotification.localNotification({
      title,
      message,
      soundName: 'default',
      playSound: true,
      vibrate: true,
    });
  }
}

export default NotificationService;
