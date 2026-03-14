import { useState } from 'react';
import { Settings, User, Bell, Shield, Palette } from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { useAppStore } from '../../store/useAppStore';
import toast from 'react-hot-toast';

export const SettingsPage = () => {
    const { currentUser } = useAppStore();
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'Profile' },
        { id: 'security', label: 'Security' },
        { id: 'notifications', label: 'Notifications' },
        { id: 'preferences', label: 'Preferences' }
    ];

    const handleSave = (e) => {
        e.preventDefault();
        toast.success('Settings updated successfully', { style: { background: '#111', color: '#fff', border: '1px solid #1f1f1f' } });
    };

    return (
        <PageWrapper>
            <div className="mb-8">
                <h2 className="text-2xl font-orbitron font-bold text-white tracking-wide flex items-center">
                    <Settings size={24} className="mr-3 text-accent-yellow" /> System Settings
                </h2>
                <p className="text-text-secondary mt-1">Configure your personal profile and application preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 border-r border-border pr-4 hidden lg:block">
                    <nav className="space-y-2">
                        {[
                            { id: 'profile', icon: <User size={18} />, label: 'Personal Profile' },
                            { id: 'security', icon: <Shield size={18} />, label: 'Security & Access' },
                            { id: 'notifications', icon: <Bell size={18} />, label: 'Notifications' },
                            { id: 'preferences', icon: <Palette size={18} />, label: 'App Preferences' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${activeTab === tab.id
                                        ? 'bg-elevated text-accent-yellow border-l-2 border-accent-yellow shadow-[inset_0_0_10px_rgba(245,196,0,0.05)]'
                                        : 'text-text-secondary hover:text-white hover:bg-elevated/50 border-l-2 border-transparent'
                                    }`}
                            >
                                {tab.icon}
                                <span className="font-medium text-sm">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Mobile Tabs */}
                <div className="lg:hidden mb-6">
                    <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
                </div>

                <div className="lg:col-span-3">
                    <Card className="max-w-2xl border-border">
                        {activeTab === 'profile' && (
                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="flex items-center gap-6 mb-8 border-b border-border pb-6">
                                    <div className="relative">
                                        <img src={currentUser?.avatar} alt="Avatar" className="w-20 h-20 rounded-full border border-border" />
                                        <button type="button" className="absolute bottom-0 right-0 w-6 h-6 bg-accent-yellow text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                                            <Settings size={12} />
                                        </button>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-white">{currentUser?.name}</h3>
                                        <p className="text-xs text-text-secondary uppercase tracking-wider">{currentUser?.role}</p>
                                        <p className="text-sm text-text-secondary mt-1">{currentUser?.email}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="First Name" defaultValue={currentUser?.name?.split(' ')[0]} />
                                    <Input label="Last Name" defaultValue={currentUser?.name?.split(' ')[1] || ''} />
                                </div>

                                <Input label="Email Address" type="email" defaultValue={currentUser?.email} disabled />
                                <Input label="Phone Number" type="tel" placeholder="+1 (555) 000-0000" />

                                <div className="pt-4 border-t border-border flex justify-end">
                                    <Button type="submit">Save Profile</Button>
                                </div>
                            </form>
                        )}

                        {activeTab === 'security' && (
                            <form onSubmit={handleSave} className="space-y-6">
                                <h3 className="text-lg font-medium text-white mb-4 border-b border-border pb-2">Change Password</h3>
                                <Input label="Current Password" type="password" placeholder="••••••••" />
                                <Input label="New Password" type="password" placeholder="••••••••" />
                                <Input label="Confirm New Password" type="password" placeholder="••••••••" />

                                <div className="pt-4 border-t border-border flex justify-end">
                                    <Button type="submit">Update Password</Button>
                                </div>
                            </form>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-white mb-4 border-b border-border pb-2">Notification Preferences</h3>

                                <div className="space-y-4">
                                    {[
                                        { id: 'n1', label: 'Low Stock Alerts', desc: 'Receive immediate alerts when items hit reorder points.' },
                                        { id: 'n2', label: 'Delivery Dispatches', desc: 'Get notified when outgoing DOs leave the facility.' },
                                        { id: 'n3', label: 'System Updates', desc: 'Information about CoreInventory maintenance.' }
                                    ].map(notif => (
                                        <div key={notif.id} className="flex items-start justify-between p-3 bg-primary border border-border rounded hover:border-accent-yellow/30 transition-colors">
                                            <div>
                                                <div className="text-sm font-medium text-white">{notif.label}</div>
                                                <div className="text-xs text-text-secondary">{notif.desc}</div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer mt-1">
                                                <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                                                <div className="w-9 h-5 bg-border rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-yellow"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4 border-t border-border flex justify-end">
                                    <Button onClick={handleSave}>Save Preferences</Button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'preferences' && (
                            <div className="flex flex-col items-center justify-center py-8 text-text-secondary">
                                <Palette className="mb-4 opacity-50" size={32} />
                                <p>System is locked to Dark Theme intentionally.</p>
                                <p className="text-xs mt-2">Premium UX requirements strictly enforce Dark UI.</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </PageWrapper>
    );
};
