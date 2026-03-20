# iOS 打包完整指南

## 📱 iOS 打包的特殊性

与Android不同,iOS打包有以下严格要求:

1. **必须使用Mac电脑** - Xcode只能在macOS上运行
2. **需要Apple Developer账号** - 免费账号可用于真机调试(7天过期),付费账号(99美元/年)可发布到App Store
3. **需要开发者证书** - 用于签名应用

---

## 🎯 三种iOS打包方案

### 方案A: 使用GitHub Actions自动构建(推荐,但需要付费)

**优点**: 完全自动化,无需Mac电脑
**缺点**: 需要:
   - Apple Developer付费账号(99美元/年)
   - Mac电脑用于配置证书(一次性的)
   - 或者使用第三方服务如AppCenter、Bitrise

**步骤**:
1. 注册Apple Developer账号(https://developer.apple.com/)
2. 创建开发者证书和Provisioning Profile
3. 将证书上传到GitHub Secrets
4. 配置GitHub Actions工作流

---

### 方案B: 使用Mac电脑本地打包(如果有Mac)

**优点**: 完全控制,可免费真机测试
**缺点**: 需要Mac电脑和Xcode

**步骤**:
1. 在Mac上安装Xcode(从App Store免费下载)
2. 连接iPhone到Mac
3. 用Xcode打开项目
4. 选择真机或模拟器
5. 点击运行或导出IPA

---

### 方案C: 使用在线构建服务

**优点**: 无需Mac,配置简单
**缺点**: 可能收费

推荐服务:
- **Bitrise** - 免费额度,CI/CD
- **AppCenter** - 微软提供,免费
- **CodePush** - 微软提供
- **Expo EAS** - 需要转换为Expo项目

---

## 📋 方案A详细步骤: GitHub Actions自动构建iOS

### 前置条件

1. ✅ 已有Apple Developer付费账号(99美元/年)
2. ✅ 已有Mac电脑(或借用)用于一次性配置
3. ✅ GitHub代码已推送完成

### 步骤1: 创建开发者证书和配置文件

在Mac电脑上操作:

#### 1.1 创建证书签名请求(CSR)

```bash
# 打开"钥匙串访问"
# 菜单: 钥匙串访问 -> 证书助理 -> 从证书颁发机构请求证书
# 保存为 CertificateSigningRequest.certSigningRequest
```

#### 1.2 在Apple Developer网站创建证书

1. 访问: https://developer.apple.com/account/
2. 登录Apple Developer账号
3. 进入: Certificates, Identifiers & Profiles
4. 点击 "+" 创建新证书
5. 类型选择: **iOS Distribution** (用于发布) 或 **iOS Development** (用于测试)
6. 上传CSR文件
7. 下载证书(.cer文件),双击安装到Mac的钥匙串

#### 1.3 创建App ID

1. 在Apple Developer网站,进入 Identifiers
2. 点击 "+" 创建新的App ID
3. 选择 **App IDs** → **App**
4. 填写:
   - Description: `ReminderApp`
   - Bundle ID: 选择 **Explicit**,输入 `com.corbancl.ReminderApp`
5. 勾选需要的Capabilities(如推送通知)
6. 保存

#### 1.4 创建Provisioning Profile

1. 进入 **Profiles** 页面
2. 点击 "+" 创建新Profile
3. 类型选择:
   - **iOS App Development** (用于测试)
   - **App Store** (用于发布)
4. 选择之前创建的App ID
5. 选择之前创建的证书
6. 选择测试设备(如果使用真机测试)
7. 命名为: `ReminderApp Development Profile`
8. 下载Profile文件(.mobileprovision)

### 步骤2: 导出证书和密钥

```bash
# 在Mac上导出P12证书
1. 打开"钥匙串访问"
2. 找到你的iOS Distribution证书
3. 右键 -> 导出
4. 选择 .p12 格式
5. 设置密码(记住这个密码!)
6. 保存为 ios-distribution.p12
```

### 步骤3: 上传到GitHub Secrets

访问: https://github.com/corbancl/ReminderApp/settings/secrets/actions

添加以下Secrets:

| Secret Name | 说明 |
|-------------|------|
| `IOS_CERTIFICATE_P12` | P12证书的Base64编码 |
| `IOS_CERTIFICATE_PASSWORD` | P12证书的密码 |
| `IOS_PROVISIONING_PROFILE` | Provisioning Profile的Base64编码 |
| `APP_STORE_CONNECT_API_KEY_ID` | App Store Connect API Key ID |
| `APP_STORE_CONNECT_API_ISSUER_ID` | App Store Connect Issuer ID |
| `APP_STORE_CONNECT_API_KEY_CONTENT` | API Key的Base64编码 |

**转换为Base64**:
```bash
# 在Mac上运行
base64 -i ios-distribution.p12 | pbcopy
# 粘贴到 IOS_CERTIFICATE_P12

base64 -i ReminderApp.mobileprovision | pbcopy
# 粘贴到 IOS_PROVISIONING_PROFILE
```

### 步骤4: 创建GitHub Actions工作流

我会为您创建一个iOS构建的工作流文件:

```yaml
name: Build iOS IPA

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    name: Build iOS IPA
    runs-on: macos-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm install

    - name: Setup Xcode
      uses: maxim-lobanov/setup-xcode@v1
      with:
        xcode-version: latest-stable

    - name: Install CocoaPods dependencies
      run: |
        cd ios
        pod install

    - name: Import Code Signing Certificates
      env:
        IOS_CERTIFICATE_BASE64: ${{ secrets.IOS_CERTIFICATE_P12 }}
        IOS_CERTIFICATE_PASSWORD: ${{ secrets.IOS_CERTIFICATE_PASSWORD }}
        IOS_PROVISIONING_PROFILE_BASE64: ${{ secrets.IOS_PROVISIONING_PROFILE }}
      run: |
        # Create variables
        CERTIFICATE_PATH=$RUNNER_TEMP/build_certificate.p12
        PP_PATH=$RUNNER_TEMP/build_profile.mobileprovision
        KEYCHAIN_PATH=$RUNNER_TEMP/app-signing.keychain-db
        KEYCHAIN_PASSWORD=$(openssl rand -base64 32)

        # Import certificate
        echo -n "$IOS_CERTIFICATE_BASE64" | base64 --decode -o $CERTIFICATE_PATH
        security create-keychain -p "$KEYCHAIN_PASSWORD" $KEYCHAIN_PATH
        security set-keychain-settings -lut 21600 $KEYCHAIN_PATH
        security unlock-keychain -p "$KEYCHAIN_PASSWORD" $KEYCHAIN_PATH
        security import $CERTIFICATE_PATH -P "$IOS_CERTIFICATE_PASSWORD" -A -t cert -f pkcs12 -k $KEYCHAIN_PATH
        security list-keychain -d user -s $KEYCHAIN_PATH

        # Import provisioning profile
        mkdir -p ~/Library/MobileDevice/Provisioning\ Profiles
        echo -n "$IOS_PROVISIONING_PROFILE_BASE64" | base64 --decode -o $PP_PATH
        cp $PP_PATH ~/Library/MobileDevice/Provisioning\ Profiles/

    - name: Build IPA
      run: |
        cd ios
        xcodebuild -workspace ReminderApp.xcworkspace \
          -scheme ReminderApp \
          -configuration Release \
          -archivePath $RUNNER_TEMP/ReminderApp.xcarchive \
          -allowProvisioningUpdates \
          -derivedDataPath $RUNNER_TEMP/derivedData \
          CODE_SIGN_IDENTITY="iPhone Distribution" \
          PROVISIONING_PROFILE_SPECIFIER="ReminderApp Development Profile"

        xcodebuild -exportArchive \
          -archivePath $RUNNER_TEMP/ReminderApp.xcarchive \
          -exportPath $RUNNER_TEMP/build \
          -exportOptionsPlist ExportOptions.plist

    - name: Upload IPA
      uses: actions/upload-artifact@v4
      with:
        name: ReminderApp.ipa
        path: ${{ runner.temp }}/build/ReminderApp.ipa
        retention-days: 30
```

### 步骤5: 推送代码,触发构建

```bash
# 创建iOS工作流文件
# 推送到GitHub,自动触发构建
```

---

## 📋 方案B详细步骤: Mac本地打包

### 前置条件

- Mac电脑
- Xcode(从App Store下载)
- iPhone(用于真机测试)或使用模拟器

### 步骤1: 克隆或打开项目

```bash
# 在Mac上
git clone https://github.com/corbancl/ReminderApp.git
cd ReminderApp/ios
```

### 步骤2: 安装依赖

```bash
# 在项目根目录
npm install

# 安装iOS依赖
cd ios
pod install
```

### 步骤3: 用Xcode打开项目

```bash
# 打开Xcode项目
open ReminderApp.xcworkspace
```

**注意**: 必须打开 `.xcworkspace` 文件,不是 `.xcodeproj`

### 步骤4: 配置Bundle ID

1. 在Xcode中选择项目
2. 选择 "ReminderApp" target
3. 在 "General" 标签中找到 "Bundle Identifier"
4. 修改为你在Apple Developer创建的App ID: `com.corbancl.ReminderApp`

### 步骤5: 配置签名

1. 在Xcode的 "Signing & Capabilities" 标签中
2. 选择你的Team (Apple ID或开发者账号)
3. Xcode会自动配置证书和Profile

### 步骤6: 连接真机(可选)

1. 用USB线连接iPhone到Mac
2. 在iPhone上信任这台电脑
3. 在Xcode顶部选择你的iPhone设备
4. 点击播放按钮运行

### 步骤7: 导出IPA(用于分发)

1. 菜单: Product -> Archive
2. 构建完成后,点击 "Distribute App"
3. 选择分发方式:
   - **Ad Hoc** - 用于测试
   - **App Store** - 用于发布
   - **Enterprise** - 企业分发
4. 按照提示导出IPA文件

---

## 📋 方案C: 使用在线构建服务

### Bitrise配置

1. 访问 https://www.bitrise.io/
2. 注册账号(使用GitHub登录)
3. 选择 "Add new app"
4. 选择GitHub仓库
5. 选择 "React Native" 模板
6. 配置iOS证书和Provisioning Profile
7. 触发构建

### AppCenter配置

1. 访问 https://appcenter.ms/
2. 注册Microsoft账号
3. 创建新应用
4. 连接GitHub仓库
5. 配置iOS证书
6. 自动构建

---

## 🎯 推荐方案对比

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| **GitHub Actions** | 自动化,无需Mac | 需要付费账号 | 有开发者账号,持续集成 |
| **Mac本地打包** | 完全控制,免费测试 | 需要Mac | 有Mac,个人开发 |
| **在线服务** | 无需Mac,简单 | 可能收费 | 团队协作,CI/CD |

---

## 💡 免费测试方案(无需付费账号)

如果您只是想测试应用,而不需要发布到App Store:

1. **使用模拟器** - 完全免费
   - 在Mac上打开Xcode
   - 选择iOS模拟器
   - 运行应用

2. **使用免费Apple ID测试** - 7天有效期
   - 免费Apple ID可用于真机测试
   - 但应用每7天需要重新签名
   - 不能发布到App Store

---

## 📱 安装IPA到iPhone

### 方式A: 使用Xcode

1. 连接iPhone到Mac
2. 在Xcode中选择真机
3. 点击运行

### 方式B: 使用AltStore(免费)

1. 在iPhone上安装AltStore (https://altstore.io/)
2. 在Mac上运行AltServer
3. 通过AltStore安装IPA

### 方式C: 使用TestFlight

1. 将IPA上传到App Store Connect
2. 创建TestFlight测试组
3. 邀请测试者
4. 测试者从TestFlight安装

---

## 🎯 我的建议

### 如果您有Mac电脑:
- **推荐方案B**: 本地打包,免费测试,最简单

### 如果您没有Mac但有开发者账号:
- **推荐方案A**: 使用GitHub Actions自动构建

### 如果您只是想测试:
- **使用模拟器**: 最简单,完全免费
- **借用Mac**: 临时借用朋友的Mac打包一次

---

## ❓ 常见问题

### Q: 能在Windows上打包iOS吗?
**A**: 不能。iOS打包必须使用Mac和Xcode。

### Q: 免费账号能发布到App Store吗?
**A**: 不能。必须使用付费Apple Developer账号(99美元/年)。

### Q: IPA文件能直接安装吗?
**A**: 不能直接安装,需要通过Xcode、AltStore或TestFlight。

### Q: 有没有绕过Apple限制的方法?
**A**: 有越狱安装,但不推荐,存在安全风险。

---

**下一步**: 根据您的实际情况选择合适的方案。如果您有Mac,我可以提供更详细的本地打包步骤!
