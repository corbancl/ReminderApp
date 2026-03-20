# ReminderApp Web Version Design Specifications

## 🎯 Purpose
创建一个基于Web的提醒应用版本,让用户可以在浏览器中立即测试所有功能,无需等待Android APK或iOS设备。

## 🎨 Design Direction
**Aesthetic**: "Ethereal Time" - 空灵时间感
- 概念: 时间如流水般自然流动,提醒如月光般轻柔提示
- 风格: 极简主义 + 渐变光晕 + 柔和动画
- 情感: 平静、专注、优雅

## 🎨 Visual Language

### Color Palette
```css
--bg-primary: #0A0E27;       /* 深夜蓝 */
--bg-secondary: #131842;      /* 中夜蓝 */
--bg-card: rgba(255, 255, 255, 0.05);   /* 半透明白 */
--text-primary: #FFFFFF;     /* 纯白 */
--text-secondary: rgba(255, 255, 255, 0.7);  /* 半透明白 */
--accent-primary: #6366F1;   /* 靛蓝 */
--accent-secondary: #8B5CF6; /* 紫罗兰 */
--success: #10B981;           /* 翠绿 */
--warning: #F59E0B;           /* 琥珀 */
--danger: #EF4444;            /* 珊瑚红 */
```

### Gradients
- **主渐变**: `linear-gradient(135deg, #6366F1, #8B5CF6)`
- **背景渐变**: `radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.15), transparent 50%)`

### Typography
- **Display字体**: 'Playfair Display', serif (优雅的衬线体)
- **Body字体**: 'Inter', sans-serif (清晰的现代无衬线体)
- **等宽字体**: 'JetBrains Mono', monospace (用于时间显示)

### Shadows
- **卡片阴影**: `0 8px 32px rgba(99, 102, 241, 0.15)`
- **按钮阴影**: `0 4px 16px rgba(99, 102, 241, 0.3)`

### Border Radius
- **卡片**: `20px`
- **按钮**: `12px`
- **输入框**: `10px`

## 🎬 Animation System

### Page Load
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stagger-1 { animation-delay: 0.1s; }
.stagger-2 { animation-delay: 0.2s; }
.stagger-3 { animation-delay: 0.3s; }
```

### Micro-interactions
- **按钮悬停**: 轻微放大 + 阴影增强
- **卡片悬停**: Y轴轻微上浮 + 边框发光
- **删除确认**: 淡出 + 收缩

### Ambient Effects
- **背景光晕**: 缓慢移动的渐变光点
- **脉冲效果**: 重要提醒的呼吸灯效果
- **过渡动画**: 页面切换的淡入淡出

## 📐 Layout Strategy

### Desktop (> 768px)
- **最大宽度**: 900px
- **居中布局**: 内容居中,两侧留白
- **网格系统**: 2列提醒卡片网格

### Mobile (< 768px)
- **全宽布局**: 填满屏幕宽度
- **单列**: 提醒卡片单列显示
- **底部操作栏**: 添加按钮固定在底部

## 🧩 Component Design

### Header
- **高度**: 80px
- **内容**: Logo + 标题 + 月相图标
- **背景**: 渐变 + 玻璃拟态
- **动画**: 页面加载时的渐入动画

### Reminder Card
- **最小高度**: 120px
- **结构**:
  - 左侧: 图标(农历/周期/固定)
  - 中间: 标题 + 描述 + 时间
  - 右侧: 删除按钮
- **状态指示器**: 彩色圆点(绿色=启用,灰色=禁用)
- **悬停效果**: 边框发光 + 轻微上浮

### Add Reminder Modal
- **背景**: 半透明深色遮罩
- **内容区**: 白色卡片,居中
- **过渡**: 缩放 + 淡入
- **表单元素**: 
  - 选择器: 自定义下拉菜单
  - 时间选择器: 现代化时间选择
  - 按钮: 渐变背景

### Empty State
- **图标**: 大尺寸月相图标
- **文字**: "还没有提醒,添加第一个吧~"
- **动画**: 轻微的浮动效果

## 🎯 Accessibility

### Color Contrast
- 所有文本与背景对比度 ≥ 4.5:1
- 焦点状态清晰可见

### Keyboard Navigation
- Tab键可遍历所有交互元素
- 焦点指示器清晰

### Screen Readers
- 语义化HTML标签
- ARIA标签补充
- 焦点陷阱(Modal)

## 🚀 Performance

### Optimization
- 懒加载图片
- CSS动画使用transform和opacity
- 防抖搜索输入
- 虚拟滚动(超过100个提醒时)

### Bundle Size
- 目标: < 200KB (gzip后)
- 使用代码分割
- 按需加载字体

## 🎨 Visual Details

### Glassmorphism
- 使用 `backdrop-filter: blur(10px)`
- 半透明背景 + 细微边框
- 营造深度感

### Glow Effects
- 重要元素的边缘发光
- 使用 `box-shadow` 实现
- 颜色与主题色一致

### Custom Cursor (Optional)
- 悬停在按钮时显示自定义光标
- 增强交互反馈

## 📱 Responsive Breakpoints

```css
@media (max-width: 768px) {
  /* Mobile styles */
}

@media (min-width: 769px) and (max-width: 1024px) {
  /* Tablet styles */
}

@media (min-width: 1025px) {
  /* Desktop styles */
}
```

## 🎯 Implementation Notes

### Tech Stack
- **Framework**: React + Vite (快速开发,热更新)
- **Styling**: Tailwind CSS (实用优先) + Custom CSS
- **Icons**: Lucide React (轻量SVG图标)
- **Animation**: Framer Motion (流畅动画)
- **Storage**: localStorage (持久化数据)
- **Lunar Calendar**: lunar-javascript (与React Native版本一致)

### Feature Parity with Native
- ✅ 所有提醒类型(农历/周期/固定)
- ✅ 添加/删除提醒
- ✅ 切换提醒状态
- ✅ 本地存储持久化
- ⚠️ 浏览器通知权限(需要用户授权)

### Browser Compatibility
- Chrome/Edge: 完全支持
- Firefox: 完全支持
- Safari: 完全支持
- 不支持IE

## 🎨 Differentiation

What makes this Web version UNFORGETTABLE:
1. **月相背景**: 根据农历日期动态显示月相
2. **呼吸动画**: 重要提醒的呼吸灯效果
3. **流体过渡**: 页面切换的丝滑动画
4. **夜空主题**: 深色沉浸式体验
5. **手势交互**: 移动端的滑动手势删除

---

**Next Step**: Implement the Web version with this design specification.
