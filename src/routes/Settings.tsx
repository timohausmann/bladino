import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import {
  AccordionContent,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useTheme } from '@/components/ThemeProvider';
import { useUserStore } from '@/stores/userStore';
import * as Select from '@radix-ui/react-select';
import { Link } from '@tanstack/react-router';
import { ChevronDown, LogOut } from 'lucide-react';
import { useState } from 'react';

/**
 * Settings page with accordion-based settings groups
 */
export function Settings() {
  const currentUser = useUserStore((store) => store.currentUser);
  const { theme, setTheme } = useTheme();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleEmailChange = () => {
    // TODO: Implement email change logic
    console.log('Changing email to:', email);
  };

  const handlePasswordChange = () => {
    // TODO: Implement password change logic
    console.log('Changing password');
  };

  return (
    <>
      <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
        <h1 className="mb-6 text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          Settings
        </h1>

        <div className="space-y-6">
          {/* Account Settings */}
          <div className="border-b border-neutral-200 pb-4 dark:border-neutral-700">
            <h2 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Account Settings
            </h2>
            <p className="mb-4 text-neutral-600 dark:text-neutral-400">
              Manage your account preferences and security settings.
            </p>

            <AccordionRoot type="single" collapsible>
              {/* Change Email */}
              <AccordionItem value="email">
                <AccordionTrigger>Change Email Address</AccordionTrigger>
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
                    <Button variant="primary" onClick={handleEmailChange}>
                      Update Email
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Change Password */}
              <AccordionItem value="password">
                <AccordionTrigger>Change Password</AccordionTrigger>
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
                    <Button variant="primary" onClick={handlePasswordChange}>
                      Update Password
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Change Handle */}
              <AccordionItem value="handle">
                <AccordionTrigger>Change Handle</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <Input
                      label="Handle"
                      value={currentUser ? `@${currentUser.name}` : '@username'}
                      onChange={() => {}}
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
          <div className="border-b border-neutral-200 pb-4 dark:border-neutral-700">
            <h2 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Profile Settings
            </h2>
            <p className="mb-4 text-neutral-600 dark:text-neutral-400">
              Manage your public profile information and appearance.
            </p>
            <div className="rounded-lg bg-neutral-50 p-4 dark:bg-neutral-700">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Profile information is edited on your profile page.
                <Link
                  to="/u/$name"
                  params={{ name: currentUser?.name ?? '' }}
                  className="ml-1 text-cyan-600 hover:underline dark:text-cyan-400"
                >
                  Go to Profile →
                </Link>
              </p>
            </div>
          </div>

          {/* Theme Settings */}
          <div>
            <h2 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Theme Settings
            </h2>
            <p className="mb-4 text-neutral-600 dark:text-neutral-400">
              Customize your app appearance and theme preferences.
            </p>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">
                Color Theme
              </label>
              <Select.Root value={theme} onValueChange={setTheme}>
                <Select.Trigger className="flex w-full items-center justify-between rounded-lg border-none bg-black/10 p-3 transition-colors outline-none hover:bg-black/15 dark:bg-black/20 dark:hover:bg-black/30">
                  <Select.Value placeholder="Select theme" />
                  <Select.Icon>
                    <ChevronDown className="h-4 w-4 text-neutral-500" />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
                    <Select.Viewport className="p-1">
                      <Select.Item
                        value="dark"
                        className="relative flex cursor-pointer items-center rounded px-3 py-2 text-neutral-900 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-700"
                      >
                        <Select.ItemText>Dark Mode</Select.ItemText>
                        {theme === 'dark' && (
                          <div className="absolute right-2 h-2 w-2 rounded-full bg-cyan-500" />
                        )}
                      </Select.Item>
                      <Select.Item
                        value="light"
                        className="relative flex cursor-pointer items-center rounded px-3 py-2 text-neutral-900 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-700"
                      >
                        <Select.ItemText>Light Mode</Select.ItemText>
                        {theme === 'light' && (
                          <div className="absolute right-2 h-2 w-2 rounded-full bg-cyan-500" />
                        )}
                      </Select.Item>
                      <Select.Item
                        value="system"
                        className="relative flex cursor-pointer items-center rounded px-3 py-2 text-neutral-900 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-700"
                      >
                        <Select.ItemText>Automatic</Select.ItemText>
                        {theme === 'system' && (
                          <div className="absolute right-2 h-2 w-2 rounded-full bg-cyan-500" />
                        )}
                      </Select.Item>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-4 dark:border-neutral-700">
            <Link
              to="/logout"
              className="inline-flex items-center gap-2 text-sm font-medium text-rose-600 transition-colors hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
            >
              <LogOut size={16} aria-hidden />
              Logout
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
