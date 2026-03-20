import React, { useState } from 'react';
import './styles/App.css';

function App() {
  const [reminders, setReminders] = useState([
    {
      id: '1',
      title: '农历初一提醒',
      description: '每月农历初一提醒我',
      type: 'lunar',
      enabled: true,
      createdAt: Date.now()
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddReminder = () => {
    alert('添加提醒功能开发中');
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <div>
            <h1 className="header-title">⏰ 智能提醒</h1>
            <p className="header-subtitle">支持农历初一十五和周期性提醒</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleAddReminder}
          >
            <span>+</span> 添加提醒
          </button>
        </header>

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
                  <div className="reminder-icon">🌙</div>
                </div>

                <h3 className="reminder-title">{reminder.title}</h3>
                {reminder.description && (
                  <p className="reminder-description">{reminder.description}</p>
                )}

                <div className="reminder-meta">
                  <div className="reminder-status">
                    <div className="status-dot"></div>
                    <span>{reminder.enabled ? '已启用' : '已禁用'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content">
            <h2 className="modal-title">添加提醒</h2>
            <p>模态框开发中...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
