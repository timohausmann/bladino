import { Button } from '@/components/form/Button';
import { Input } from '@/components/form/Input';
import {
    AccordionContent,
    AccordionItem,
    AccordionRoot,
    AccordionTrigger
} from '@/components/ui/accordion';
import { Back } from '@/components/ui/Back';
import { useUserStore } from '@/stores/userStore';
import * as Select from '@radix-ui/react-select';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { ChevronDown } from 'react-feather';

/**
 * Settings page with accordion-based settings groups
 */
export function Settings() {
    // Get current user from Zustand store using selective store
    const currentUser = useUserStore(store => store.currentUser);

    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [theme, setTheme] = useState('dark');

    const handleEmailChange = () => {
        // TODO: Implement email change logic
        console.log('Changing email to:', email);
    };

    const handlePasswordChange = () => {
        // TODO: Implement password change logic
        console.log('Changing password');
    };

    return (
        <div className="min-h-screen pt-8">
            <div className="max-w-3xl mx-auto px-4 space-y-4">

                <Back />

                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                        Settings
                    </h1>

                    <div className="space-y-6">
                        {/* Account Settings */}
                        <div className="border-b border-neutral-200 dark:border-neutral-700 pb-4">
                            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                                Account Settings
                            </h2>
                            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                                Manage your account preferences and security settings.
                            </p>

                            <AccordionRoot type="single" collapsible>
                                {/* Change Email */}
                                <AccordionItem value="email">
                                    <AccordionTrigger>
                                        Change Email Address
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-3">
                                            <Input
                                                label="New Email Address"
                                                type="email"
                                                value={email}
                                                onChange={setEmail}
                                                placeholder="Enter new email address"
                                                required
                                                hint="We'll send a confirmation email to verify your new address."
                                            />
                                            <Button onClick={handleEmailChange}>
                                                Update Email
                                            </Button>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Change Password */}
                                <AccordionItem value="password">
                                    <AccordionTrigger>
                                        Change Password
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-3">
                                            <Input
                                                label="New Password"
                                                type="password"
                                                value={newPassword}
                                                onChange={setNewPassword}
                                                placeholder="Enter new password"
                                                showPasswordToggle
                                                required
                                                hint="Password must be at least 8 characters long."
                                            />
                                            <Button onClick={handlePasswordChange}>
                                                Update Password
                                            </Button>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Change Handle */}
                                <AccordionItem value="handle">
                                    <AccordionTrigger>
                                        Change Handle
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-3">
                                            <Input
                                                label="Handle"
                                                value={currentUser ? `@${currentUser.handle}` : '@username'}
                                                onChange={() => { }}
                                                placeholder="Enter new handle"
                                                disabled
                                                hint="Handle changes are currently locked. Contact support if you need to change your handle."
                                            />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </AccordionRoot>
                        </div>

                        {/* Profile Settings */}
                        <div className="border-b border-neutral-200 dark:border-neutral-700 pb-4">
                            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                                Profile Settings
                            </h2>
                            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                                Manage your public profile information and appearance.
                            </p>
                            <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4">
                                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                                    Profile information is edited on your profile page.
                                    <Link
                                        to={`/u/${currentUser?.handle}`}
                                        className="text-cyan-600 dark:text-cyan-400 hover:underline ml-1"
                                    >
                                        Go to Profile →
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Theme Settings */}
                        <div>
                            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                                Theme Settings
                            </h2>
                            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                                Customize your app appearance and theme preferences.
                            </p>

                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                    Color Theme
                                </label>
                                <Select.Root value={theme} onValueChange={setTheme}>
                                    <Select.Trigger className="flex w-full items-center justify-between p-3 bg-black/10 dark:bg-black/20 border-none rounded-lg outline-none hover:bg-black/15 dark:hover:bg-black/30 transition-colors">
                                        <Select.Value placeholder="Select theme" />
                                        <Select.Icon>
                                            <ChevronDown className="h-4 w-4 text-neutral-500" />
                                        </Select.Icon>
                                    </Select.Trigger>
                                    <Select.Portal>
                                        <Select.Content className="overflow-hidden bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700">
                                            <Select.Viewport className="p-1">
                                                <Select.Item value="dark" className="relative flex items-center px-3 py-2 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded cursor-pointer">
                                                    <Select.ItemText>Dark Mode</Select.ItemText>
                                                    {theme === 'dark' && (
                                                        <div className="absolute right-2 w-2 h-2 bg-cyan-500 rounded-full" />
                                                    )}
                                                </Select.Item>
                                                <Select.Item value="light" className="relative flex items-center px-3 py-2 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded cursor-pointer">
                                                    <Select.ItemText>Light Mode</Select.ItemText>
                                                    {theme === 'light' && (
                                                        <div className="absolute right-2 w-2 h-2 bg-cyan-500 rounded-full" />
                                                    )}
                                                </Select.Item>
                                                <Select.Item value="auto" className="relative flex items-center px-3 py-2 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded cursor-pointer">
                                                    <Select.ItemText>Automatic</Select.ItemText>
                                                    {theme === 'auto' && (
                                                        <div className="absolute right-2 w-2 h-2 bg-cyan-500 rounded-full" />
                                                    )}
                                                </Select.Item>
                                            </Select.Viewport>
                                        </Select.Content>
                                    </Select.Portal>
                                </Select.Root>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
