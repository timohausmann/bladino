import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import {
  AccordionContent,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useTheme } from '@/components/ThemeProvider';
import {
  normalizeLanguage,
  setLanguage,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from '@/i18n';
import { useUserStore } from '@/stores/userStore';
import * as Select from '@radix-ui/react-select';
import { Link } from '@tanstack/react-router';
import { ChevronDown, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Settings page with accordion-based settings groups
 */
export function Settings() {
  const { t, i18n } = useTranslation();
  const currentUser = useUserStore((store) => store.currentUser);
  const { theme, setTheme } = useTheme();
  const currentLanguage = normalizeLanguage(i18n.language);

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

  const handleLanguageChange = (language: SupportedLanguage) => {
    setLanguage(language);
  };

  return (
    <>
      <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
        <h1 className="mb-6 text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          {t('settings:title')}
        </h1>

        <div className="space-y-6">
          {/* Account Settings */}
          <div className="border-b border-neutral-200 pb-4 dark:border-neutral-700">
            <h2 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {t('settings:account.title')}
            </h2>
            <p className="mb-4 text-neutral-600 dark:text-neutral-400">
              {t('settings:account.description')}
            </p>

            <AccordionRoot type="single" collapsible>
              <AccordionItem value="email">
                <AccordionTrigger>
                  {t('settings:account.changeEmail.trigger')}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <Input
                      label={t('settings:account.changeEmail.label')}
                      type="email"
                      value={email}
                      onChange={setEmail}
                      placeholder={t(
                        'settings:account.changeEmail.placeholder',
                      )}
                      required
                      hint={t('settings:account.changeEmail.hint')}
                    />
                    <Button variant="primary" onClick={handleEmailChange}>
                      {t('settings:account.changeEmail.submit')}
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="password">
                <AccordionTrigger>
                  {t('settings:account.changePassword.trigger')}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <Input
                      label={t('settings:account.changePassword.label')}
                      type="password"
                      value={newPassword}
                      onChange={setNewPassword}
                      placeholder={t(
                        'settings:account.changePassword.placeholder',
                      )}
                      showPasswordToggle
                      required
                      hint={t('settings:account.changePassword.hint')}
                    />
                    <Button variant="primary" onClick={handlePasswordChange}>
                      {t('settings:account.changePassword.submit')}
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="handle">
                <AccordionTrigger>
                  {t('settings:account.changeHandle.trigger')}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <Input
                      label={t('settings:account.changeHandle.label')}
                      value={currentUser ? `@${currentUser.name}` : '@username'}
                      onChange={() => {}}
                      placeholder={t(
                        'settings:account.changeHandle.placeholder',
                      )}
                      disabled
                      hint={t('settings:account.changeHandle.hint')}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </AccordionRoot>
          </div>

          {/* Profile Settings */}
          <div className="border-b border-neutral-200 pb-4 dark:border-neutral-700">
            <h2 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {t('settings:profile.title')}
            </h2>
            <p className="mb-4 text-neutral-600 dark:text-neutral-400">
              {t('settings:profile.description')}
            </p>
            <div className="rounded-lg bg-neutral-50 p-4 dark:bg-neutral-700">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {t('settings:profile.hint')}
                <Link
                  to="/u/$name"
                  params={{ name: currentUser?.name ?? '' }}
                  className="ml-1 text-cyan-600 hover:underline dark:text-cyan-400"
                >
                  {t('settings:profile.goToProfileLink')}
                </Link>
              </p>
            </div>
          </div>

          {/* Language Settings */}
          <div className="border-b border-neutral-200 pb-4 dark:border-neutral-700">
            <h2 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {t('settings:language.title')}
            </h2>
            <p className="mb-4 text-neutral-600 dark:text-neutral-400">
              {t('settings:language.description')}
            </p>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {t('settings:language.label')}
              </label>
              <Select.Root
                value={currentLanguage}
                onValueChange={(value) =>
                  handleLanguageChange(value as SupportedLanguage)
                }
              >
                <Select.Trigger className="flex w-full items-center justify-between rounded-lg border-none bg-black/10 p-3 transition-colors outline-none hover:bg-black/15 dark:bg-black/20 dark:hover:bg-black/30">
                  <Select.Value
                    placeholder={t('settings:language.placeholder')}
                  />
                  <Select.Icon>
                    <ChevronDown className="h-4 w-4 text-neutral-500" />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
                    <Select.Viewport className="p-1">
                      {SUPPORTED_LANGUAGES.map((language) => (
                        <Select.Item
                          key={language}
                          value={language}
                          className="relative flex cursor-pointer items-center rounded px-3 py-2 text-neutral-900 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-700"
                        >
                          <Select.ItemText>
                            {t(`settings:language.options.${language}`)}
                          </Select.ItemText>
                          {currentLanguage === language && (
                            <div className="absolute right-2 h-2 w-2 rounded-full bg-cyan-500" />
                          )}
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
          </div>

          {/* Theme Settings */}
          <div>
            <h2 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {t('settings:theme.title')}
            </h2>
            <p className="mb-4 text-neutral-600 dark:text-neutral-400">
              {t('settings:theme.description')}
            </p>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {t('settings:theme.label')}
              </label>
              <Select.Root value={theme} onValueChange={setTheme}>
                <Select.Trigger className="flex w-full items-center justify-between rounded-lg border-none bg-black/10 p-3 transition-colors outline-none hover:bg-black/15 dark:bg-black/20 dark:hover:bg-black/30">
                  <Select.Value placeholder={t('settings:theme.placeholder')} />
                  <Select.Icon>
                    <ChevronDown className="h-4 w-4 text-neutral-500" />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
                    <Select.Viewport className="p-1">
                      {(['dark', 'light', 'system'] as const).map((option) => (
                        <Select.Item
                          key={option}
                          value={option}
                          className="relative flex cursor-pointer items-center rounded px-3 py-2 text-neutral-900 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-700"
                        >
                          <Select.ItemText>
                            {t(`settings:theme.options.${option}`)}
                          </Select.ItemText>
                          {theme === option && (
                            <div className="absolute right-2 h-2 w-2 rounded-full bg-cyan-500" />
                          )}
                        </Select.Item>
                      ))}
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
              {t('common:logout')}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
