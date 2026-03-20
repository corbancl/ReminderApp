# 手动打包指南(当前环境)

## 当前状态

✅ **已完成的工作**:
- 项目代码开发完成
- 所有依赖已安装(npm install)
- Android配置文件已创建
- 打包脚本已准备

⚠️ **需要手动完成的工作**:
由于打包Android应用需要完整的开发环境,以下步骤需要你手动完成或在有完整环境的机器上执行。

---

## 📋 环境要求

### 必须安装的工具

1. **Java JDK 8 或更高版本**
   - 下载: https://www.oracle.com/java/technologies/downloads/
   - 安装后配置环境变量: `JAVA_HOME`

2. **Android SDK**
   - 推荐通过 Android Studio 安装
   - 下载: https://developer.android.com/studio
   - 安装 Android SDK Platform 34
   - 配置环境变量: `ANDROID_HOME`

3. **Node.js 和 npm**
   - ✅ 已安装

4. **Git**
   - ✅ 已安装

---

## 🚀 完整打包步骤

### 步骤1: 验证环境

打开命令行,运行以下命令验证环境:

```bash
# 检查Java
java -version

# 检查JAVA_HOME
echo %JAVA_HOME%

# 检查Android SDK
echo %ANDROID_HOME%

# 检查Gradle
cd android
gradlew.bat --version
```

如果以上命令都成功输出版本信息,说明环境配置正确。

### 步骤2: 生成Keystore(签名文件)

在 `android/app` 目录下运行:

```bash
cd android/app
keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"
```

如果 `keytool` 命令找不到,尝试使用完整路径:
```bash
"%JAVA_HOME%\bin\keytool.exe" -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"
```

### 步骤3: 构建APK

在项目根目录运行:

```bash
cd android
gradlew.bat clean
gradlew.bat assembleRelease
```

首次构建会下载Gradle和Android依赖,可能需要10-30分钟,请耐心等待。

### 步骤4: 查找APK文件

构建成功后,APK文件位于:
```
android/app/build/outputs/apk/release/app-release.apk
```

### 步骤5: 安装到设备

#### 方法1: 使用ADB
```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

#### 方法2: 直接安装
1. 将 `app-release.apk` 文件传输到Android手机
2. 在手机上点击安装
3. 如果提示"未知来源",在设置中允许安装

---

## 🎯 替代方案:使用在线构建平台

如果你不想配置本地环境,可以使用在线构建平台:

### 方案1: Expo Application Services (EAS)

1. 将项目转换为Expo项目(需要一些代码调整)
2. 在 `package.json` 中添加EAS依赖
3. 运行: `eas build --platform android`

### 方案2: CodePush / 其他CI/CD平台

- 使用GitHub Actions、GitLab CI等
- 配置自动构建流程

---

## 🔧 常见问题解决

### 问题1: Java未安装

**症状**: 运行 `java -version` 提示"不是内部或外部命令"

**解决**:
1. 下载并安装 JDK: https://adoptium.net/
2. 配置环境变量:
   - 右键"此电脑" → 属性 → 高级系统设置 → 环境变量
   - 新建系统变量: `JAVA_HOME` = `C:\Program Files\Eclipse Adoptium\jdk-11.x.x-hotspot` (根据实际安装路径)
   - 编辑系统变量 `Path`,添加 `%JAVA_HOME%\bin`

### 问题2: Gradle下载失败

**症状**: 构建时提示下载Gradle失败

**解决**:
1. 检查网络连接
2. 配置代理(如果在公司网络)
3. 或手动下载Gradle到 `C:\Users\用户名\.gradle\wrapper\dists\`

### 问题3: Android SDK未找到

**症状**: 提示"SDK not found"

**解决**:
1. 安装 Android Studio
2. 打开 Android Studio → SDK Manager
3. 安装 Android SDK Platform 34
4. 配置环境变量: `ANDROID_HOME` = `C:\Users\用户名\AppData\Local\Android\Sdk`

### 问题4: 构建失败,缺少依赖

**症状**: 构建时报错缺少某个库

**解决**:
```bash
cd android
gradlew.bat clean
cd ..
npm install
cd android
gradlew.bat assembleRelease
```

---

## 📱 推荐的简化方案

### 方案:在Android Studio中打开和构建

1. **打开项目**
   - 启动 Android Studio
   - 选择 "Open an Existing Project"
   - 选择 `ReminderApp/android` 目录

2. **等待Gradle同步**
   - 首次打开会自动下载依赖
   - 等待底部的进度条完成

3. **构建APK**
   - 选择菜单: `Build` → `Generate Signed Bundle / APK`
   - 选择 `APK`
   - 选择 `Create new...`
   - 配置keystore(或使用debug keystore)
   - 选择 `release` 构建类型
   - 点击 `Finish`

4. **查找APK**
   - 构建完成后点击提示中的 `locate`
   - APK文件会自动在文件管理器中打开

---

## 🎓 学习资源

- **React Native官方文档**: https://reactnative.dev/docs/publishing-to-app-store
- **Android打包指南**: https://developer.android.com/studio/publish
- **Gradle官方文档**: https://docs.gradle.org/current/userguide/userguide.html

---

## ✅ 打包检查清单

在开始打包前,确认以下条件:

- [ ] 已安装 JDK 8+
- [ ] 已配置 JAVA_HOME 环境变量
- [ ] 已安装 Android SDK
- [ ] 已配置 ANDROID_HOME 环境变量
- [ ] npm依赖已安装(npm install成功)
- [ ] 已生成 debug.keystore(或已有release keystore)
- [ ] 项目代码没有错误

---

## 💡 快速测试(可选)

如果你想快速测试应用功能而不打包,可以使用:

```bash
# 如果有Android模拟器或已连接Android设备
npx react-native run-android
```

这会在设备上运行开发版本,但需要先配置完整的Android开发环境。

---

## 📞 需要帮助?

如果遇到问题:
1. 查看错误日志
2. 参考本文档的"常见问题解决"部分
3. 搜索错误信息
4. 查看React Native社区论坛

---

**下一步**: 完成环境配置后,按照上述步骤开始打包APK。
