import React, { useState, useEffect } from 'react';
import ReminderService from './services/reminderService';
import LunarService from './services/lunarService';
import { Reminder, ReminderFormData, ReminderType } from './types';
import './styles/App.css';

function App() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(false);

  // 加载提醒
  useEffect(() => {
    setReminders(ReminderService.getAllReminders());
  }, []);

  // 请求通知权限
  useEffect(() => {
    ReminderService.requestNotificationPermission().then(granted => {
      setNotificationPermission(granted);
    });
  }, []);

  // 添加提醒
  const handleAddReminder = (formData: ReminderFormData) => {
    const newReminder: Reminder = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      type: formData.type,
      enabled: true,
      createdAt: Date.now()
    };

    // 根据类型添加特定字段
    if (formData.type === 'lunar') {
      (newReminder as any).lunarDate = formData.lunarDate || 1;
    } else if (formData.type === 'periodic') {
      (newReminder as any).interval = formData.interval || 'daily';
    } else if (formData.type === 'fixed') {
      (newReminder as any).datetime = formData.datetime || new Date().toISOString();
    } else if (formData.type === 'custom') {
      (newReminder as any).customWeekday = formData.customWeekday;
      (newReminder as any).customMonthday = formData.customMonthday;
    }

    ReminderService.addReminder(newReminder);
    setReminders(ReminderService.getAllReminders());
    setIsModalOpen(false);
  };

  // 删除提醒
  const handleDeleteReminder = (id: string) => {
    if (confirm('确定要删除这个提醒吗?')) {
      ReminderService.deleteReminder(id);
      setReminders(ReminderService.getAllReminders());
    }
  };

  // 切换提醒状态
  const handleToggleReminder = (id: string) => {
    ReminderService.toggleReminder(id);
    setReminders(ReminderService.getAllReminders());
  };

  // 渲染提醒图标
  const getReminderIcon = (type: ReminderType) => {
    const icons = {
      lunar: '🌙',
      periodic: '🔄',
      fixed: '⏰',
      custom: '⭐'
    };
    return icons[type] || '📌';
  };

  // 渲染提醒描述
  const getReminderDescription = (reminder: Reminder) => {
    switch (reminder.type) {
      case 'lunar':
        const lunarDay = (reminder as any).lunarDate;
        return `农历${LunarService.getLunarDayName(lunarDay)}提醒 - ${LunarService.getMoonPhase(lunarDay)}`;
      case 'periodic':
        const interval = (reminder as any).interval;
        const intervalNames = {
          hourly: '每小时',
          daily: '每天',
          weekly: '每周',
          monthly: '每月'
        };
        return `${intervalNames[interval]}周期提醒`;
      case 'fixed':
        const datetime = new Date((reminder as any).datetime);
        return `固定时间提醒: ${datetime.toLocaleString('zh-CN')}`;
      case 'custom':
        const weekday = (reminder as any).customWeekday;
        const monthday = (reminder as any).customMonthday;
        const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        if (weekday !== undefined) {
          return `每周${weekdays[weekday]}提醒`;
        }
        if (monthday !== undefined) {
          return `每月${monthday}号提醒`;
        }
        return '自定义提醒';
      default:
        return '';
    }
  };

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="header">
          <div>
            <h1 className="header-title">⏰ 智能提醒</h1>
            <p className="header-subtitle">支持农历初一十五和周期性提醒</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            <span>+</span> 添加提醒
          </button>
        </header>

        {/* 提醒列表 */}
        {reminders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🌙</div>
            <p className="empty-text">还没有提醒,添加第一个吧~</p>
          </div>
        ) : (
          <div className="reminders-grid">
            {reminders.map((reminder, index) => (
              <div
                key={reminder.id}
                className="reminder-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="reminder-header">
                  <div className="reminder-icon">
                    {getReminderIcon(reminder.type)}
                  </div>
                  <button
                    className="btn btn-icon"
                    onClick={() => handleDeleteReminder(reminder.id)}
                    title="删除提醒"
                  >
                    ✕
                  </button>
                </div>

                <h3 className="reminder-title">{reminder.title}</h3>
                {reminder.description && (
                  <p className="reminder-description">{reminder.description}</p>
                )}
                <p className="reminder-description">
                  {getReminderDescription(reminder)}
                </p>

                <div className="reminder-meta">
                  <div className="reminder-status">
                    <div
                      className={`status-dot ${reminder.enabled ? '' : 'disabled'}`}
                    ></div>
                    <span>{reminder.enabled ? '已启用' : '已禁用'}</span>
                  </div>
                  <button
                    className="btn"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      padding: '4px 12px',
                      fontSize: '12px'
                    }}
                    onClick={() => handleToggleReminder(reminder.id)}
                  >
                    {reminder.enabled ? '禁用' : '启用'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 通知权限提示 */}
        {!notificationPermission && (
          <div
            style={{
              position: 'fixed',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(99, 102, 241, 0.9)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '14px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              animation: 'fadeInUp 0.3s ease-out',
              zIndex: 100
            }}
          >
            🔔 启用浏览器通知以接收提醒
          </div>
        )}
      </div>

      {/* 添加提醒模态框 */}
      {isModalOpen && (
        <AddReminderModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddReminder}
        />
      )}
    </div>
  );
}

// 添加提醒模态框组件
function AddReminderModal({ onClose, onSubmit }: any) {
  const [formData, setFormData] = useState<ReminderFormData>({
    title: '',
    description: '',
    type: 'lunar',
    lunarDate: 1,
    interval: 'daily',
    datetime: new Date().toISOString().slice(0, 16),
    customWeekday: 0,
    customMonthday: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('请输入提醒标题');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">添加提醒</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">标题 *</label>
            <input
              type="text"
              className="form-input"
              placeholder="例如: 查看农历日期"
              value={formData.title}
              onChange={e =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">描述 (可选)</label>
            <textarea
              className="form-textarea"
              placeholder="添加一些描述..."
              value={formData.description}
              onChange={e =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">提醒类型 *</label>
            <select
              className="form-select"
              value={formData.type}
              onChange={e =>
                setFormData({ ...formData, type: e.target.value as ReminderType })
              }
            >
              <option value="lunar">🌙 农历初一十五</option>
              <option value="periodic">🔄 周期性提醒</option>
              <option value="fixed">⏰ 固定时间提醒</option>
              <option value="custom">⭐ 自定义周期</option>
            </select>
          </div>

          {/* 农历类型 */}
          {formData.type === 'lunar' && (
            <div className="form-group">
              <label className="form-label">农历日期</label>
              <select
                className="form-select"
                value={formData.lunarDate}
                onChange={e =>
                  setFormData({ ...formData, lunarDate: Number(e.target.value) })
                }
              >
                <option value={1}>🌑 初一 (新月)</option>
                <option value={15}>🌕 十五 (满月)</option>
              </select>
            </div>
          )}

          {/* 周期类型 */}
          {formData.type === 'periodic' && (
            <div className="form-group">
              <label className="form-label">提醒周期</label>
              <select
                className="form-select"
                value={formData.interval}
                onChange={e =>
                  setFormData({
                    ...formData,
                    interval: e.target.value as any
                  })
                }
              >
                <option value="hourly">每小时</option>
                <option value="daily">每天</option>
                <option value="weekly">每周</option>
                <option value="monthly">每月</option>
              </select>
            </div>
          )}

          {/* 固定时间类型 */}
          {formData.type === 'fixed' && (
            <div className="form-group">
              <label className="form-label">提醒时间</label>
              <input
                type="datetime-local"
                className="form-input"
                value={formData.datetime}
                onChange={e =>
                  setFormData({ ...formData, datetime: e.target.value })
                }
                required
              />
            </div>
          )}

          {/* 自定义类型 */}
          {formData.type === 'custom' && (
            <>
              <div className="form-group">
                <label className="form-label">每周几</label>
                <select
                  className="form-select"
                  value={formData.customWeekday}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      customWeekday: Number(e.target.value)
                    })
                  }
                >
                  <option value={0}>周日</option>
                  <option value={1}>周一</option>
                  <option value={2}>周二</option>
                  <option value={3}>周三</option>
                  <option value={4}>周四</option>
                  <option value={5}>周五</option>
                  <option value={6}>周六</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">每月几号</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  max="31"
                  value={formData.customMonthday}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      customMonthday: Number(e.target.value)
                    })
                  }
                />
              </div>
            </>
          )}

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="btn btn-primary btn-submit">
              添加提醒
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
