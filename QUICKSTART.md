# 快速启动指南

## 5分钟快速上手

### 第1步: 安装依赖 (1分钟)

```bash
cd ReminderApp
npm install
```

### 第2步: 安装必需的库 (1分钟)

```bash
npm install react-native-push-notification @react-native-async-storage/async-storage react-native-safe-area-context lunar-javascript
```

### 第3步: iOS 配置 (2分钟)

```bash
cd ios
pod install
cd ..
```

**重要**: 在 `ios/ReminderApp/Info.plist` 添加:

```xml
<key>UIBackgroundModes</key>
<array>
  <string>remote-notification</string>
</array>
```

### 第4步: Android 配置 (1分钟)

在 `android/app/src/main/AndroidManifest.xml` 添加:

```xml
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

### 第5步: 运行应用

```bash
# iOS
npx react-native run-ios

# Android
npx react-native run-android
```

## 首次使用

1. **授予权限**: 应用启动时会请求通知权限,点击"允许"
2. **创建提醒**: 点击右上角 "+ 添加" 按钮
3. **选择类型**: 选择提醒类型(农历/周期/固定时间/自定义)
4. **填写信息**: 输入标题和内容
5. **保存**: 点击保存按钮

## 快速创建提醒

使用预设模板一键创建:
- 🌙 **农历初一十五**: 每月农历初一和十五提醒
- ⏰ **每日早8点**: 每天早上8点提醒
- 📅 **每周一**: 每周一提醒
- 🔔 **每2小时**: 每隔2小时提醒

## 测试提醒

### 测试本地通知
1. 添加一个"每1分钟"的提醒
2. 等待1分钟
3. 观察通知栏

### 测试农历提醒
1. 添加"农历初一十五"提醒
2. 等待农历初一或十五
3. 观察通知栏

## 常见问题

### Q: 通知没有收到?
A: 检查以下几点:
- 系统设置中是否允许通知
- 应用中提醒是否已启用
- Android 是否被电池优化阻止
- iOS 是否允许后台刷新

### Q: 如何测试农历提醒?
A: 农历提醒需要等待真实的农历初一或十五,或者修改系统时间测试

### Q: 应用关闭后提醒还能工作吗?
A: 可以,提醒由系统通知服务管理,不依赖应用运行状态

## 下一步

- 📖 阅读 [README.md](./README.md) 了解完整功能
- 🔧 查看 [INSTALL.md](./INSTALL.md) 了解详细配置
- 📋 查看 [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) 了解技术细节

## 需要帮助?

遇到问题?检查:
1. 是否完成所有配置步骤
2. 依赖是否正确安装
3. 系统版本是否符合要求
4. 查看控制台日志
