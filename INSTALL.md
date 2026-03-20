# 安装指南

## 第一步: 安装基础依赖

```bash
npm install
```

## 第二步: 安装必需的第三方库

```bash
# 核心依赖
npm install react-native-push-notification @react-native-async-storage/async-storage react-native-safe-area-context lunar-javascript

# 开发依赖
npm install --save-dev @types/react-native @types/react
```

## 第三步: iOS 配置

### 1. 安装 CocoaPods 依赖

```bash
cd ios
pod install
cd ..
```

### 2. 配置通知权限

在 `ios/ReminderApp/Info.plist` 中添加以下内容:

```xml
<key>UIBackgroundModes</key>
<array>
  <string>remote-notification</string>
</array>
```

### 3. 配置推送通知(如果需要远程推送)

在 Xcode 中:
1. 打开 `ios/ReminderApp.xcworkspace`
2. 选择项目 -> Signing & Capabilities
3. 添加 "Push Notifications" capability

## 第四步: Android 配置

### 1. 配置权限

在 `android/app/src/main/AndroidManifest.xml` 中添加:

```xml
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

### 2. 配置 MainActivity.java

在 `android/app/src/main/java/com/reminderapp/MainActivity.java` 中:

```java
package com.reminderapp;

import com.facebook.react.ReactActivity;
import android.os.Bundle;

public class MainActivity extends ReactActivity {
    @Override
    protected String getMainComponentName() {
        return "ReminderApp";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }
}
```

### 3. 配置 MainApplication.java

在 `android/app/src/main/java/com/reminderapp/MainApplication.java` 中添加推送通知初始化:

```java
package com.reminderapp;

import android.app.Application;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost =
        new DefaultReactNativeHost(this) {
            @Override
            public boolean getUseDeveloperSupport() {
                return BuildConfig.DEBUG;
            }

            @Override
            protected List<ReactPackage> getPackages() {
                @SuppressWarnings("UnnecessaryLocalVariable")
                List<ReactPackage> packages = new PackageList(this).getPackages();
                return packages;
            }

            @Override
            protected String getJSMainModuleName() {
                return "index";
            }

            @Override
            protected boolean isNewArchEnabled() {
                return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
            }

            @Override
            protected Boolean isHermesEnabled() {
                return BuildConfig.IS_HERMES_ENABLED;
            }
        };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            DefaultNewArchitectureEntryPoint.load();
        }
    }
}
```

### 4. 配置 build.gradle

在 `android/app/build.gradle` 中确保版本配置:

```gradle
android {
    compileSdkVersion 34

    defaultConfig {
        applicationId "com.reminderapp"
        minSdkVersion 21
        targetSdkVersion 34
        versionCode 1
        versionName "1.0"
    }
}
```

## 第五步: 运行应用

### iOS
```bash
npx react-native run-ios
```

### Android
```bash
npx react-native run-android
```

## 常见问题

### 1. iOS 构建失败

**问题**: `command not found: pod`

**解决**:
```bash
sudo gem install cocoapods
```

**问题**: pod install 失败

**解决**:
```bash
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
```

### 2. Android 构建失败

**问题**: SDK 版本不匹配

**解决**: 确保 Android Studio 安装了 Android 14 (API 34)

**问题**: Gradle 构建失败

**解决**:
```bash
cd android
./gradlew clean
cd ..
```

### 3. 依赖安装失败

**问题**: npm install 失败

**解决**:
```bash
# 清除缓存
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 4. 运行时崩溃

**问题**: Android 应用崩溃

**解决**: 检查是否正确配置了所有权限,特别是 POST_NOTIFICATIONS (Android 13+)

**问题**: iOS 应用崩溃

**解决**: 检查 Info.plist 是否正确配置了后台模式

## 测试通知

### 测试本地通知

在应用中:
1. 添加一个提醒
2. 观察通知栏是否收到通知

### 测试农历提醒

1. 添加农历初一十五提醒
2. 等待农历初一或十五
3. 观察是否收到通知

## 调试技巧

### 查看日志

```bash
# iOS
npx react-native log-ios

# Android
npx react-native log-android
```

### 检查通知权限

在代码中可以添加权限检查:

```typescript
const hasPermission = await NotificationService.requestPermissions();
console.log('通知权限:', hasPermission);
```

## 下一步

安装完成后,参考 [README.md](./README.md) 了解如何使用应用。
