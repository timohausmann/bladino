import { parseAddresses } from '@/components/mails/parseAddresses';
import { SendEmailDocument, useGraphQLMutation } from '@/graphql';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

export function useMailComposer() {
  const queryClient = useQueryClient();
  const sendEmail = useGraphQLMutation(SendEmailDocument);

  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const toAddresses = parseAddresses(to);
  const canSend =
    toAddresses.length > 0 &&
    subject.trim().length > 0 &&
    body.trim().length > 0;

  const isDirty = Boolean(to || cc || bcc || subject || body);

  const reset = useCallback(() => {
    setTo('');
    setCc('');
    setBcc('');
    setSubject('');
    setBody('');
  }, []);

  const handleSend = useCallback(async () => {
    if (!canSend || sendEmail.isPending) {
      return false;
    }

    const ccAddresses = parseAddresses(cc);
    const bccAddresses = parseAddresses(bcc);

    try {
      await sendEmail.mutateAsync({
        to: toAddresses,
        subject: subject.trim(),
        body: body.trim(),
        cc: ccAddresses.length > 0 ? ccAddresses : undefined,
        bcc: bccAddresses.length > 0 ? bccAddresses : undefined,
      });
      await queryClient.invalidateQueries({ queryKey: ['Mails'] });
      reset();
      return true;
    } catch {
      return false;
    }
  }, [
    bcc,
    body,
    canSend,
    cc,
    queryClient,
    reset,
    sendEmail,
    subject,
    toAddresses,
  ]);

  return {
    to,
    setTo,
    cc,
    setCc,
    bcc,
    setBcc,
    subject,
    setSubject,
    body,
    setBody,
    canSend,
    isDirty,
    isSending: sendEmail.isPending,
    reset,
    handleSend,
  };
}
