# 使用GitHub Actions自动打包APK(最简单方案)

## 🎯 优点
✅ **完全免费** - GitHub Actions提供免费的构建时间
✅ **无需本地环境** - 不需要安装JDK、Android SDK等
✅ **自动构建** - 推送代码后自动开始构建
✅ **云端构建** - 在GitHub服务器上构建,速度快
✅ **自动下载** - 构建完成后直接下载APK

---

## 📋 操作步骤

### 步骤1: 初始化Git仓库(如果还没有)

```bash
cd c:/Users/Administrator/WorkBuddy/20260320143335/ReminderApp

# 初始化Git仓库
git init

# 添加所有文件
git add .

# 创建初始提交
git commit -m "Initial commit - Reminder App"
```

### 步骤2: 创建GitHub仓库

1. 访问 https://github.com/new
2. 填写仓库名称(例如: `ReminderApp`)
3. 设置为**Public**(公开)或Private(私有)都可以
4. 不要勾选"Initialize this repository with a README"
5. 点击"Create repository"

### 步骤3: 推送代码到GitHub

```bash
# 在项目目录下运行
cd c:/Users/Administrator/WorkBuddy/20260320143335/ReminderApp

# 添加GitHub远程仓库(替换YOUR_USERNAME为你的GitHub用户名)
git remote add origin https://github.com/YOUR_USERNAME/ReminderApp.git

# 推送代码
git branch -M main
git push -u origin main
```

**提示**: 如果提示需要输入用户名和密码:
- 用户名: 输入你的GitHub用户名
- 密码: 输入GitHub的**Personal Access Token**(不是登录密码)
  - 创建Token: https://github.com/settings/tokens
  - 勾选 `repo` 权限
  - 生成后复制Token作为密码使用

### 步骤4: 等待自动构建

代码推送到GitHub后,构建会**自动开始**:

1. 访问你的GitHub仓库页面
2. 点击顶部的 **"Actions"** 标签
3. 你会看到构建正在运行
4. 构建大约需要10-15分钟

### 步骤5: 下载APK

构建完成后有两种方式下载:

#### 方式A: 从Actions页面下载(推荐)
1. 在Actions页面点击完成的构建任务
2. 滚动到页面底部,找到 **"Artifacts"** 区域
3. 点击 **app-release.apk** 下载
4. 解压下载的ZIP文件
5. 即可得到APK文件

#### 方式B: 从Release页面下载(仅main分支)
1. 访问仓库的 **"Releases"** 页面
2. 找到最新的Release(例如: Release v1)
3. 点击 `app-release.apk` 下载

---

## 🔄 重新构建的两种方式

### 方式1: 手动触发构建(推荐)
1. 访问仓库的 **Actions** 页面
2. 左侧选择 **"Build Android APK"** 工作流
3. 点击右侧的 **"Run workflow"** 按钮
4. 选择分支和构建类型(release或debug)
5. 点击 **"Run workflow"** 开始构建

### 方式2: 推送新代码
```bash
# 修改代码后
git add .
git commit -m "更新"
git push

# 推送后自动触发构建
```

---

## 📱 安装APK到手机

下载APK后:

1. 将APK文件发送到手机(微信/QQ/数据线)
2. 在手机文件管理器中找到APK
3. 点击安装
4. 如果提示"未知来源",在设置中允许

---

## ⚡ 加速构建(可选)

如果构建时间太长,可以修改`.github/workflows/build-apk.yml`:

将构建命令改为:
```yaml
- name: Build APK
  run: |
    cd android
    ./gradlew assembleRelease --no-daemon --parallel --build-cache
```

---

## 🔍 查看构建日志

如果构建失败:

1. 访问Actions页面
2. 点击失败的构建任务
3. 点击对应的步骤查看详细日志
4. 将错误信息告诉我,我可以帮您解决

---

## 💡 常见问题

### Q: 构建一直显示排队状态
**A**: GitHub Actions有免费限制,等待一会儿即可(通常几分钟内开始)

### Q: 构建失败了怎么办
**A**:
1. 查看构建日志找出错误原因
2. 告诉我错误信息,我帮您分析
3. 修改代码后再次推送即可重新构建

### Q: 如何修改应用的名称和图标
**A**:
1. 应用名称: 修改 `android/app/src/main/res/values/strings.xml` 中的 `<string name="app_name">`
2. 应用图标: 替换 `android/app/src/main/res/mipmap-*/ic_launcher.png` 文件
3. 修改后推送代码,触发新构建

### Q: APK文件太大怎么办
**A**: 可以启用ProGuard混淆和压缩,修改 `android/app/build.gradle`:
```gradle
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
    }
}
```

---

## 🎯 完整示例

假设你的GitHub用户名是 `zhangsan`,完整流程:

```bash
# 1. 初始化Git
cd c:/Users/Administrator/WorkBuddy/20260320143335/ReminderApp
git init
git add .
git commit -m "Initial commit"

# 2. 推送到GitHub
git remote add origin https://github.com/zhangsan/ReminderApp.git
git branch -M main
git push -u origin main

# 3. 访问 https://github.com/zhangsan/ReminderApp/actions 查看构建
# 4. 构建完成后下载APK
```

---

## 📞 需要帮助?

如果遇到任何问题:
1. 查看Actions页面的构建日志
2. 告诉我具体的错误信息
3. 我会帮您分析和解决

---

**推荐**: 这是目前最简单的打包方案,无需安装任何工具,只需要GitHub账号即可!
