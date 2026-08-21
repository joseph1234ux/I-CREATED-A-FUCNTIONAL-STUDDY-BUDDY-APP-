import React from 'react';

const ReaderSettings = ({ isOpen, settings, onSettingsChange, onClose }) => {
  const settingGroups = [
    {
      label: 'Font Size',
      key: 'fontSize',
      options: [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
        { value: 'extra-large', label: 'Extra Large' },
      ],
    },
    {
      label: 'Font Family',
      key: 'fontFamily',
      options: [
        { value: 'Merriweather', label: 'Merriweather' },
        { value: 'Georgia', label: 'Georgia' },
        { value: 'Lora', label: 'Lora' },
        { value: 'Inter', label: 'Inter' },
      ],
    },
    {
      label: 'Line Height',
      key: 'lineHeight',
      options: [
        { value: '1.4', label: '1.4' },
        { value: '1.6', label: '1.6' },
        { value: '1.8', label: '1.8' },
        { value: '2.0', label: '2.0' },
      ],
    },
    {
      label: 'Theme',
      key: 'theme',
      options: [
        { value: 'light', label: 'Light' },
        { value: 'sepia', label: 'Sepia' },
        { value: 'gray', label: 'Gray' },
        { value: 'dark', label: 'Dark' },
        { value: 'night', label: 'Night' },
      ],
    },
    {
      label: 'Content Width',
      key: 'width',
      options: [
        { value: 'narrow', label: 'Narrow' },
        { value: 'medium', label: 'Medium' },
        { value: 'wide', label: 'Wide' },
      ],
    },
  ];

  return (
    <div className={`reader-settings-modal ${isOpen ? 'open' : ''}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Reader Settings</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>
          ✕
        </button>
      </div>

      <div className="settings-grid">
        {settingGroups.map((group) => (
          <div key={group.key} className="settings-group">
            <label>{group.label}</label>
            <div className="options">
              {group.options.map((option) => (
                <button
                  key={option.value}
                  className={settings[group.key] === option.value ? 'active' : ''}
                  onClick={() => onSettingsChange(group.key, option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReaderSettings;