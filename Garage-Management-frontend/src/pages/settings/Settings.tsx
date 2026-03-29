import React, { useState } from 'react';
import { Save, Building2, Bell, Shield, Palette, Users, Sun, Moon } from 'lucide-react';
import { toast } from 'sonner';
import { useSettings } from '@/context/SettingsContext';

export const Settings: React.FC = () => {
  const { theme, setTheme, currency, setCurrency, taxRate, setTaxRate } = useSettings();
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    garageName: 'AutoGarage Pro',
    email: 'contact@autogarage.com',
    phone: '+1 234-567-8900',
    address: '123 Main Street, City, State 12345',
    taxRate: String(taxRate),
    emailNotifications: true,
    smsNotifications: false,
    jobAlerts: true,
    lowStockAlerts: true,
  });

  const handleSave = () => {
    setTaxRate(parseFloat(formData.taxRate) || 0);
    toast.success('Settings saved successfully!');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'team', label: 'Team', icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your garage preferences</p>
        </div>
        <button onClick={handleSave} className="btn-primary">
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === tab.id
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-card rounded-xl border border-border p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Garage Name
                    </label>
                    <input
                      type="text"
                      value={formData.garageName}
                      onChange={(e) => setFormData({ ...formData, garageName: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Currency
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as any)}
                      className="input-field"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Business Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="input-field min-h-[100px]"
                    rows={3}
                  />
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Tax Settings</h3>
                <div className="max-w-xs">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    value={formData.taxRate}
                    onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                    className="input-field"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Notification Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, emailNotifications: !formData.emailNotifications })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      formData.emailNotifications ? 'bg-accent' : 'bg-border'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${
                        formData.emailNotifications ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, smsNotifications: !formData.smsNotifications })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      formData.smsNotifications ? 'bg-accent' : 'bg-border'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${
                        formData.smsNotifications ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Job Card Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified about job status changes</p>
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, jobAlerts: !formData.jobAlerts })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      formData.jobAlerts ? 'bg-accent' : 'bg-border'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${
                        formData.jobAlerts ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Low Stock Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified when inventory is low</p>
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, lowStockAlerts: !formData.lowStockAlerts })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      formData.lowStockAlerts ? 'bg-accent' : 'bg-border'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${
                        formData.lowStockAlerts ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Security Settings</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-medium text-foreground mb-2">Change Password</p>
                  <p className="text-sm text-muted-foreground mb-4">Update your account password</p>
                  <button className="btn-secondary">Change Password</button>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-medium text-foreground mb-2">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground mb-4">Add an extra layer of security to your account</p>
                  <button className="btn-secondary">Enable 2FA</button>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-medium text-foreground mb-2">Active Sessions</p>
                  <p className="text-sm text-muted-foreground mb-4">Manage your active login sessions</p>
                  <button className="btn-secondary">View Sessions</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Appearance Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Theme</p>
                    <p className="text-sm text-muted-foreground">Choose between light and dark mode</p>
                  </div>
                  <div className="flex items-center gap-2 bg-background rounded-lg p-1 border border-border">
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        theme === 'light' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Sun className="h-4 w-4" />
                      Light
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        theme === 'dark' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Moon className="h-4 w-4" />
                      Dark
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Team Management</h3>
              <p className="text-muted-foreground">Team management features coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
