# 应用打包指南

本指南将帮助你将提醒应用打包成 Android APK 和 iOS IPA。

## 前置要求

### Android 打包要求
- ✅ 安装 JDK 8 或更高版本
- ✅ 安装 Android SDK (API Level 34)
- ✅ 配置 ANDROID_HOME 环境变量
- ✅ 安装 Android Studio (可选)

### iOS 打包要求
- ✅ macOS 操作系统
- ✅ 安装 Xcode 14 或更高版本
- ✅ Xcode Command Line Tools
- ✅ Apple Developer 账号(用于正式签名)

---

## Android APK 打包

### 方法1: 使用打包脚本(推荐)

#### 1. 生成 Debug Keystore

```bash
cd android/app
generate-keystore.bat
```

或者在 Windows 命令行中:
```bash
cd android/app
generate-keystore.bat
```

#### 2. 打包 APK

```bash
cd android
build-apk.bat
```

打包完成后,APK 文件位于:
```
android/app/build/outputs/apk/release/app-release.apk
```

### 方法2: 手动打包

#### 1. 清理旧构建
```bash
cd android
./gradlew clean
```

#### 2. 构建 Release APK
```bash
./gradlew assembleRelease
```

#### 3. 查找 APK 文件
APK 文件位于:
```
android/app/build/outputs/apk/release/app-release.apk
```

### 方法3: 在 Android Studio 中打包

1. 打开 Android Studio
2. 选择 `Build` → `Generate Signed Bundle / APK`
3. 选择 `APK`
4. 选择或创建 keystore:
   - Keystore path: `android/app/debug.keystore`
   - Keystore password: `android`
   - Key alias: `androiddebugkey`
   - Key password: `android`
5. 选择 `release` 构建类型
6. 点击 `Finish`
7. 等待构建完成

### 安装 APK 到设备

#### 使用 ADB
```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

#### 手动安装
1. 将 APK 文件传输到 Android 设备
2. 在设备上点击 APK 文件安装
3. 可能需要允许"未知来源"安装

---

## iOS IPA 打包

### 前置步骤

#### 1. 安装 CocoaPods 依赖
```bash
cd ios
pod install
cd ..
```

#### 2. 打开 Xcode 项目
```bash
open ios/ReminderApp.xcworkspace
```

### 方法1: 使用命令行打包

#### 1. 构建 Archive
```bash
cd ios
./build-ipa.sh
```

#### 2. 查找 IPA 文件
IPA 文件位于:
```
ios/build/export/ReminderApp.ipa
```

### 方法2: 在 Xcode 中打包

#### 1. 打开项目
```bash
open ios/ReminderApp.xcworkspace
```

#### 2. 配置签名
- 选择项目 → Target → Signing & Capabilities
- 选择你的开发团队
- 配置 Bundle Identifier

#### 3. 选择设备
- 选择 `Any iOS Device (arm64)` 或连接真机

#### 4. 构建 Archive
- 选择 `Product` → `Archive`
- 等待构建完成

#### 5. 导出 IPA
- Archive 构建完成后,点击 `Distribute App`
- 选择分发方式:
  - **Ad Hoc**: 用于测试设备
  - **Development**: 用于开发测试
  - **App Store**: 用于正式发布
- 按照向导完成导出

### 方法3: 测试打包(不需要签名)

```bash
cd ios
xcodebuild -workspace ReminderApp.xcworkspace \
  -scheme ReminderApp \
  -configuration Release \
  -sdk iphonesimulator \
  -derivedDataPath build
```

### 安装 IPA 到设备

#### 使用 Xcode
1. 连接 iOS 设备
2. 在 Xcode 中选择设备
3. 选择 `Product` → `Run`
4. 应用将安装到设备

#### 使用 TestFlight
1. 上传 IPA 到 App Store Connect
2. 配置 TestFlight 测试
3. 邀请测试人员
4. 测试人员通过 TestFlight 安装

#### 使用第三方工具
- [AltStore](https://altstore.io/)
- [Cydia Impactor](http://www.cydiaimpactor.com/)
- [Sideloadly](https://sideloadly.io/)

---

## 签名配置

### Android 正式签名

#### 1. 生成 Release Keystore
```bash
keytool -genkey -v -keystore release.keystore \
  -alias reminderapp \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass YOUR_PASSWORD \
  -keypass YOUR_PASSWORD
```

#### 2. 配置 build.gradle
在 `android/app/build.gradle` 中:
```gradle
android {
    signingConfigs {
        release {
            storeFile file('release.keystore')
            storePassword 'YOUR_PASSWORD'
            keyAlias 'reminderapp'
            keyPassword 'YOUR_PASSWORD'
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}
```

#### 3. 将 keystore 添加到 .gitignore
```
*.keystore
*.jks
```

### iOS 正式签名

#### 1. 配置 Apple Developer 账号
- 登录 [Apple Developer](https://developer.apple.com/)
- 创建 App ID
- 创建 Provisioning Profile

#### 2. 配置 Xcode
- 选择项目 → Signing & Capabilities
- 选择你的开发团队
- 配置 Bundle Identifier
- 自动管理签名(推荐)

#### 3. 更新 ExportOptions.plist
```xml
<key>method</key>
<string>app-store</string>
<key>teamID</key>
<string>YOUR_TEAM_ID</string>
```

---

## 常见问题

### Android 打包问题

#### Q: keystore 生成失败
A: 确保 JDK 已安装并在 PATH 中:
```bash
java -version
keytool -help
```

#### Q: 构建失败,找不到 SDK
A: 配置 `local.properties` 文件:
```properties
sdk.dir=/path/to/Android/Sdk
```

#### Q: APK 安装失败
A: 确保设备已启用"开发者选项"和"USB调试"

### iOS 打包问题

#### Q: pod install 失败
A: 更新 CocoaPods:
```bash
sudo gem install cocoapods
cd ios
pod install
```

#### Q: 签名失败
A: 检查:
- Apple Developer 账号是否有效
- Bundle Identifier 是否唯一
- Provisioning Profile 是否匹配

#### Q: 构建失败,找不到依赖
A: 清理并重新安装:
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
```

---

## 版本管理

### 更新版本号

#### Android
在 `android/app/build.gradle` 中:
```gradle
defaultConfig {
    versionCode 2
    versionName "1.1.0"
}
```

#### iOS
在 Xcode 中:
- 选择项目 → Target → General
- 更新 `Version` 和 `Build` 字段

---

## 发布到应用商店

### Android (Google Play)

1. 创建 Google Play 开发者账号
2. 创建应用
3. 上传 signed APK 或 AAB
4. 填写应用信息
5. 提交审核

### iOS (App Store)

1. 创建 App Store Connect 记录
2. 上传 Archive
3. 填写应用信息
4. 提交审核
5. 等待审核通过

---

## 文件输出

### Android
- **Debug APK**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release APK**: `android/app/build/outputs/apk/release/app-release.apk`
- **AAB**: `android/app/build/outputs/bundle/release/app-release.aab`

### iOS
- **IPA**: `ios/build/export/ReminderApp.ipa`
- **Archive**: `ios/build/ReminderApp.xcarchive`

---

## 下一步

打包完成后:
1. ✅ 在真机上测试应用
2. ✅ 测试所有功能
3. ✅ 检查性能和内存使用
4. ✅ 修复发现的 bug
5. ✅ 准备发布到应用商店

---

## 需要帮助?

- Android 文档: https://developer.android.com/studio/publish
- iOS 文档: https://developer.apple.com/documentation/xcode/distributing-your-app-for-beta-testing-and-releases
- React Native 文档: https://reactnative.dev/docs/publishing-to-app-store
