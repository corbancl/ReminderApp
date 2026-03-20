# 智能提醒应用

一款支持农历初一十五提醒和周期性提醒的跨平台移动应用。

## 功能特性

- ✅ **农历提醒**: 自动检测农历初一十五,无需重复设置
- ✅ **周期性提醒**: 支持每小时/每天的间隔提醒
- ✅ **固定时间提醒**: 每天固定时间提醒
- ✅ **自定义周期**: 支持每周几/每月几号提醒
- ✅ **离线优先**: 所有数据本地存储,无需网络
- ✅ **跨平台**: 支持 iOS 和 Android

## 技术栈

- **框架**: React Native 0.74.0 + TypeScript
- **状态管理**: React Hooks
- **数据存储**: AsyncStorage
- **通知**: react-native-push-notification
- **农历计算**: lunar-javascript

## 项目结构

```
ReminderApp/
├── src/
│   ├── components/       # UI组件
│   │   ├── ReminderCard.tsx
│   │   └── AddReminderModal.tsx
│   ├── screens/          # 页面
│   │   └── HomeScreen.tsx
│   ├── services/         # 业务逻辑
│   │   ├── reminderService.ts
│   │   ├── notificationService.ts
│   │   └── lunarService.ts
│   ├── storage/          # 数据存储
│   │   └── reminderStore.ts
│   ├── types/            # 类型定义
│   │   └── index.ts
│   └── utils/            # 工具函数
│       └── dateUtils.ts
├── android/              # Android原生代码
├── ios/                  # iOS原生代码
└── App.tsx               # 应用入口
```

## 安装依赖

```bash
npm install
```

## 安装必需的第三方库

```bash
npm install react-native-push-notification @react-native-async-storage/async-storage react-native-safe-area-context lunar-javascript
npm install --save-dev @types/react-native @types/react
```

## iOS 配置

1. 安装 pods:
```bash
cd ios && pod install
```

2. 在 `ios/YourProject/Info.plist` 中添加通知权限:
```xml
<key>UIBackgroundModes</key>
<array>
  <string>remote-notification</string>
</array>
```

## Android 配置

在 `android/app/src/main/AndroidManifest.xml` 中添加权限:

```xml
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

## 运行应用

### iOS
```bash
npx react-native run-ios
```

### Android
```bash
npx react-native run-android
```

## 使用说明

### 添加提醒

1. 点击右上角 "+ 添加" 按钮
2. 选择提醒类型:
   - **固定时间**: 每天固定时间提醒
   - **周期提醒**: 每隔几小时/几天提醒
   - **农历提醒**: 农历初一十五提醒
   - **自定义周期**: 每周几/每月几号提醒
3. 填写提醒标题和内容
4. 配置提醒参数
5. 点击保存

### 快速创建

使用预设模板快速创建常见提醒:
- 农历初一十五
- 每日早8点
- 每周一
- 每2小时

### 管理提醒

- **启用/禁用**: 点击提醒卡片右侧的开关
- **编辑**: 点击提醒卡片进入编辑模式
- **删除**: 点击卡片底部的"删除"按钮

## 提醒类型详解

### 农历提醒
- 自动检测农历初一和十五
- 每月自动触发,无需手动设置
- 支持选择初一、十五或两者

### 周期提醒
- 每小时提醒: 每隔N小时提醒一次
- 每天提醒: 每隔N天提醒一次

### 固定时间提醒
- 每天固定时间提醒(如每天早上8点)
- 格式: HH:mm (24小时制)

### 自定义周期
- **每周提醒**: 选择星期几(周一到周日)
- **每月提醒**: 选择每月几号(1-31号)

## 开发计划

- [x] 核心提醒功能
- [x] 农历提醒
- [x] 周期性提醒
- [x] 本地通知
- [x] 离线存储
- [ ] 提醒历史记录
- [ ] 提醒统计功能
- [ ] 提醒分类管理
- [ ] 云同步(可选)
- [ ] 深色模式
- [ ] 多语言支持

## 注意事项

1. **通知权限**: 首次使用需要授予通知权限
2. **后台任务**: 农历提醒需要后台任务支持,iOS 需要在设置中允许后台刷新
3. **时区**: 应用使用设备系统时区
4. **电池优化**: Android 建议将应用加入电池优化白名单

## 常见问题

### 通知没有收到?
- 检查通知权限是否已授予
- 检查提醒是否已启用
- Android 检查是否被电池优化阻止
- iOS 检查应用是否被允许后台刷新

### 农历日期不准确?
- 应用使用 `lunar-javascript` 库计算农历,通常准确
- 如有偏差,可能是闰月处理差异

### 应用关闭后提醒还能工作吗?
- 可以,提醒由系统通知服务管理
- Android 需要授予自启动权限
- iOS 会在应用启动时重新调度提醒

## License

MIT
