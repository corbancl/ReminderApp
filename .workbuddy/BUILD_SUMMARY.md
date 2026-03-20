# 打包配置完成总结

## ✅ 已完成的工作

### Android 配置
- ✅ AndroidManifest.xml - 配置权限和通知
- ✅ MainActivity.java - 主Activity
- ✅ MainApplication.java - 应用入口
- ✅ MainApplicationPackage.java - React Native包
- ✅ build.gradle - 构建配置
- ✅ proguard-rules.pro - 混淆规则
- ✅ strings.xml - 字符串资源
- ✅ generate-keystore.bat - keystore生成脚本
- ✅ build-apk.bat - APK打包脚本

### iOS 配置
- ✅ Info.plist - 应用配置和权限
- ✅ ExportOptions.plist - 导出选项
- ✅ build-ipa.sh - IPA打包脚本

### 打包工具
- ✅ build.bat - 跨平台快速打包工具
- ✅ BUILD.md - 完整打包指南

---

## 📦 打包方式

### Android

#### 方式1: 快速打包脚本(推荐)
```bash
cd ReminderApp
build.bat
# 选择选项 1
```

#### 方式2: 直接运行打包脚本
```bash
cd android
build-apk.bat
```

#### 方式3: Gradle命令
```bash
cd android
./gradlew assembleRelease
```

#### 输出文件
- APK: `android/app/build/outputs/apk/release/app-release.apk`
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`

### iOS

#### 方式1: 快速打包脚本(macOS)
```bash
cd ReminderApp
build.bat
# 选择选项 3
```

#### 方式2: 直接运行打包脚本(macOS)
```bash
cd ios
./build-ipa.sh
```

#### 方式3: Xcode手动打包
```bash
open ios/ReminderApp.xcworkspace
# Product → Archive
```

#### 输出文件
- IPA: `ios/build/export/ReminderApp.ipa`

---

## 🚀 快速开始

### Android 打包步骤

#### 1. 安装依赖(首次)
```bash
cd ReminderApp
npm install
npm install react-native-push-notification @react-native-async-storage/async-storage react-native-safe-area-context lunar-javascript
```

#### 2. 生成keystore(首次)
```bash
cd android/app
generate-keystore.bat
```

#### 3. 打包APK
```bash
cd android
build-apk.bat
```

#### 4. 安装到设备
```bash
adb install app/build/outputs/apk/release/app-release.apk
```

### iOS 打包步骤

#### 1. 安装pods(首次,macOS)
```bash
cd ios
pod install
cd ..
```

#### 2. 打包IPA(macOS)
```bash
cd ios
./build-ipa.sh
```

#### 3. 安装到设备
- 使用Xcode直接安装
- 或使用TestFlight

---

## 📋 打包检查清单

### Android 打包前检查
- [ ] JDK 已安装
- [ ] Android SDK 已安装(API 34)
- [ ] 环境变量已配置(ANDROID_HOME)
- [ ] Keystore已生成
- [ ] npm依赖已安装

### iOS 打包前检查
- [ ] 在macOS上操作
- [ ] Xcode已安装
- [ ] CocoaPods已安装
- [ ] pods已安装(`pod install`)
- [ ] Apple Developer账号(用于正式签名)

---

## ⚠️ 注意事项

### Android
1. **Debug Keystore**: 已配置默认的debug keystore,用于测试
2. **正式签名**: 需要生成release keystore并配置签名
3. **API版本**: 使用API 34,支持Android 5.0+(minSdkVersion 21)
4. **通知权限**: 已配置POST_NOTIFICATIONS(Android 13+必需)

### iOS
1. **签名配置**: 开发测试可用开发签名,发布需要Apple Developer账号
2. **Bundle Identifier**: 确保唯一性
3. **版本号**: 在Xcode中更新Version和Build
4. **权限配置**: Info.plist已配置后台模式和通知权限

---

## 📚 文档说明

| 文档 | 说明 |
|------|------|
| BUILD.md | 完整的打包指南,包含详细的步骤和常见问题 |
| build.bat | 快速打包工具,支持Android和iOS |
| android/build-apk.bat | Android APK打包脚本 |
| android/generate-keystore.bat | keystore生成脚本 |
| ios/build-ipa.sh | iOS IPA打包脚本 |

---

## 🎯 下一步

打包完成后:

### 测试
1. 在真机上安装应用
2. 测试所有提醒功能
3. 测试通知权限
4. 测试不同场景

### 优化
1. 性能优化
2. 代码混淆(已配置ProGuard)
3. 资源压缩
4. APK大小优化

### 发布
1. 准备应用图标和截图
2. 填写应用描述
3. 准备隐私政策
4. 提交审核

---

## 📞 需要帮助?

- Android文档: `BUILD.md`
- React Native文档: https://reactnative.dev/docs/publishing-to-app-store
- Google Play: https://developer.android.com/studio/publish
- App Store: https://developer.apple.com/app-store/

---

## ✨ 打包配置完成!

现在你可以使用 `build.bat` 快速打包应用了!

```bash
cd ReminderApp
build.bat
```

选择你要打包的平台即可。
