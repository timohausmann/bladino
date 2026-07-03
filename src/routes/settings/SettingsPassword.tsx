import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Banner } from '@/components/ui/Banner';
import { SettingsPanel } from '@/components/settings';
import {
  getGraphQLErrorMessage,
  isTransportError,
  UpdatePasswordDocument,
  useGraphQLMutation,
} from '@/graphql';
import { useUserStore } from '@/stores/userStore';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const MIN_PASSWORD_LENGTH = 8;

type PasswordBanner = {
  message: string;
  variant: 'positive' | 'negative';
};

export function SettingsPassword() {
  const { t } = useTranslation();
  const currentUser = useUserStore((store) => store.currentUser);

  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [passwordStepConfirmed, setPasswordStepConfirmed] = useState(false);
  const [passwordBanner, setPasswordBanner] = useState<PasswordBanner | null>(
    null,
  );
  const [passwordValidationError, setPasswordValidationError] = useState<
    string | null
  >(null);

  const updatePasswordMutation = useGraphQLMutation(UpdatePasswordDocument, {
    onSuccess: () => {
      setPasswordBanner({
        message: t('settings:changePassword.success'),
        variant: 'positive',
      });
      setNewPassword('');
      setCurrentPassword('');
      setPasswordStepConfirmed(false);
      setPasswordValidationError(null);
    },
    onError: (err) => {
      console.error('Password update failed:', err);
      setPasswordBanner({
        message: isTransportError(err)
          ? t('settings:changePassword.errorTransport')
          : (getGraphQLErrorMessage(err) ?? t('settings:changePassword.error')),
        variant: 'negative',
      });
    },
  });

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    setPasswordBanner(null);
    if (passwordStepConfirmed) {
      setPasswordStepConfirmed(false);
      setCurrentPassword('');
    }
    if (value.length >= MIN_PASSWORD_LENGTH) {
      setPasswordValidationError(null);
    }
  };

  const handleConfirmPasswordStep = () => {
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setPasswordValidationError(
        t('settings:changePassword.validationTooShort'),
      );
      return;
    }
    setPasswordValidationError(null);
    setPasswordBanner(null);
    setPasswordStepConfirmed(true);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.id || !passwordStepConfirmed) return;

    setPasswordBanner(null);
    updatePasswordMutation.mutate({
      id: currentUser.id,
      newpass: newPassword,
      oldpass: currentPassword,
    });
  };

  const newPasswordHint = passwordValidationError ? (
    <span className="text-rose-600 dark:text-rose-400">
      {passwordValidationError}
    </span>
  ) : (
    t('settings:changePassword.hint')
  );

  return (
    <SettingsPanel title={t('settings:changePassword.title')}>
      <form onSubmit={handlePasswordChange} className="space-y-3">
        {passwordBanner && (
          <Banner
            message={passwordBanner.message}
            variant={passwordBanner.variant}
          />
        )}
        <Input
          label={t('settings:changePassword.label')}
          type="password"
          value={newPassword}
          onChange={handleNewPasswordChange}
          placeholder={t('settings:changePassword.placeholder')}
          showPasswordToggle
          required
          hint={newPasswordHint}
        />
        {passwordStepConfirmed && (
          <Input
            label={t('settings:changePassword.currentLabel')}
            type="password"
            value={currentPassword}
            onChange={(value) => {
              setCurrentPassword(value);
              setPasswordBanner(null);
            }}
            placeholder={t('settings:changePassword.currentPlaceholder')}
            showPasswordToggle
            required
          />
        )}
        {passwordStepConfirmed ? (
          <Button
            type="submit"
            variant="primary"
            loading={updatePasswordMutation.isPending}
            disabled={!currentPassword}
          >
            {t('settings:changePassword.submit')}
          </Button>
        ) : (
          <Button
            type="button"
            variant="secondary"
            iconAfter={<ArrowRight size={16} aria-hidden />}
            onClick={handleConfirmPasswordStep}
            disabled={!newPassword}
          >
            {t('settings:changePassword.confirmWithCurrent')}
          </Button>
        )}
      </form>
    </SettingsPanel>
  );
}
