import { zodResolver } from '@hookform/resolvers/zod';
import {
  BellRing,
  Copy,
  LogOut,
  Settings2,
  Sparkles,
  UserPlus,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ChallengeGoalSelector } from '../../components/challenge/ChallengeGoalSelector';
import { PartnerNameFields } from '../../components/profile/PartnerNameFields';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { FeedbackModal } from '../../components/ui/FeedbackModal';
import { Modal } from '../../components/ui/Modal';
import { PartnerIdentityStep } from '../../components/invite/PartnerIdentityStep';
import { interpolate, messages } from '../../i18n';
import {
  preferencesSchema,
  toCouplePreferences,
  type PreferencesFormValues,
} from '../preferences/preferences.schema';
import { useAppStore } from '../../store/useAppStore';
import type { PartnerId } from '../../types/plan';
import { buildInviteJoinUrl, validateInviteCodeInput } from '../../utils/invite';
import { normalizePreferences } from '../../utils/preferences';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<{ title: string; message: string } | null>(null);
  const [joinCode, setJoinCode] = useState('');
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [pendingPartnerChoice, setPendingPartnerChoice] = useState(false);
  const [unlinkConfirmOpen, setUnlinkConfirmOpen] = useState(false);
  const storedPreferences = useAppStore((state) => state.preferences);
  const preferences = normalizePreferences(storedPreferences);
  const reminderSettings = useAppStore((state) => state.reminderSettings);
  const activeChallenge = useAppStore((state) => state.activeChallenge);
  const inviteCode = useAppStore((state) => state.inviteCode);
  const partnerInviteStatus = useAppStore((state) => state.partnerInviteStatus);
  const individualModePromoDismissed = useAppStore((state) => state.individualModePromoDismissed);
  const redeemedInviteCode = useAppStore((state) => state.redeemedInviteCode);
  const updatePreferences = useAppStore((state) => state.updatePreferences);
  const setChallengeGoal = useAppStore((state) => state.setChallengeGoal);
  const updateReminderSettings = useAppStore((state) => state.updateReminderSettings);
  const setPairModeEnabled = useAppStore((state) => state.setPairModeEnabled);
  const setPartnerLinked = useAppStore((state) => state.setPartnerLinked);
  const redeemInviteCode = useAppStore((state) => state.redeemInviteCode);
  const signOut = useAppStore((state) => state.signOut);

  const defaultValues = useMemo<PreferencesFormValues>(
    () => ({
      partnerOneName: preferences.partnerOneName,
      partnerTwoName: preferences.partnerTwoName,
    }),
    [preferences],
  );

  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PreferencesFormValues>({
    defaultValues,
    resolver: zodResolver(preferencesSchema),
  });

  const selectedPartnerOneName = watch('partnerOneName');
  const selectedPartnerTwoName = watch('partnerTwoName');
  const notificationsEnabled = reminderSettings.enabled;
  const daysBeforePlan = reminderSettings.daysBeforePlan ?? 2;
  const linked = partnerInviteStatus === 'linked';
  const pairModeEnabled = !individualModePromoDismissed;

  useEffect(() => {
    const subscription = watch((values) => {
      const result = preferencesSchema.safeParse(values);
      if (!result.success) return;

      updatePreferences(toCouplePreferences(result.data));
    });

    return () => subscription.unsubscribe();
  }, [updatePreferences, watch]);

  const handleSignOut = () => {
    signOut();
    navigate('/onboarding');
  };

  const handleNotificationsToggle = (enabled: boolean) => {
    updateReminderSettings({
      ...reminderSettings,
      enabled,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleShareInvite = async () => {
    const joinUrl = buildInviteJoinUrl(inviteCode, preferences);
    const inviteText = `Únete a nuestra pareja en Vive2. Abre ${joinUrl}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Invitación a Vive2',
          text: inviteText,
        });
      } else {
        await navigator.clipboard.writeText(inviteText);
      }
      setFeedback({
        title: messages.pages.profile.feedback.inviteReadyTitle,
        message: messages.pages.profile.feedback.inviteReadyMessage,
      });
    } catch {
      await navigator.clipboard.writeText(joinUrl);
      setFeedback({
        title: messages.pages.profile.feedback.inviteCopiedTitle,
        message: messages.pages.profile.feedback.inviteCopiedMessage,
      });
    }
  };

  const handleCopyInviteCode = async () => {
    await navigator.clipboard.writeText(inviteCode);
    setFeedback({
      title: messages.pages.profile.feedback.codeCopiedTitle,
      message: messages.pages.profile.feedback.codeCopiedMessage,
    });
  };

  const handleOpenJoinModal = () => {
    setJoinCode('');
    setPendingPartnerChoice(false);
    setJoinModalOpen(true);
  };

  const handlePairModeToggle = (enabled: boolean) => {
    if (enabled) {
      setPairModeEnabled(true);
      return;
    }

    if (linked) {
      setUnlinkConfirmOpen(true);
      return;
    }

    setPairModeEnabled(false);
  };

  const handleConfirmUnlink = () => {
    setPartnerLinked(false);
    setPairModeEnabled(false);
    setUnlinkConfirmOpen(false);
    setFeedback({
      title: messages.pages.profile.feedback.singleModeTitle,
      message: messages.pages.profile.feedback.singleModeMessage,
    });
  };

  const handleSwapNames = () => {
    setValue('partnerOneName', selectedPartnerTwoName, { shouldDirty: true, shouldValidate: true });
    setValue('partnerTwoName', selectedPartnerOneName, { shouldDirty: true, shouldValidate: true });
  };

  const handleJoinCodeContinue = () => {
    const validation = validateInviteCodeInput(joinCode, inviteCode);
    if (!validation.ok) {
      setFeedback({
        title: messages.pages.profile.feedback.invalidCodeTitle,
        message: validation.message ?? messages.pages.profile.feedback.invalidCodeMessage,
      });
      return;
    }

    setJoinCode(validation.normalizedCode);
    setPendingPartnerChoice(true);
  };

  const handleRedeemCode = (partnerId: PartnerId) => {
    const result = redeemInviteCode(joinCode, { partnerId });

    if (!result.ok) {
      setFeedback({
        title: messages.pages.profile.feedback.invalidCodeTitle,
        message: result.message ?? messages.pages.profile.feedback.invalidCodeMessage,
      });
      return;
    }

    setJoinCode('');
    setPendingPartnerChoice(false);
    setJoinModalOpen(false);
    setFeedback({
      title: messages.pages.profile.feedback.pairEnabledTitle,
      message: messages.pages.profile.feedback.pairEnabledMessage,
    });
  };

  return (
    <div className="space-y-5 pb-4">
      <header className="pt-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-surface/80 py-1 pl-1 pr-3 shadow-[0_8px_22px_rgb(var(--color-overlay)/0.08)] backdrop-blur">
          <img alt="Vive2" className="h-7 w-7" src="/logo/vive2-icono-72x72.png" />
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blush">Vive2</p>
        </div>
        <h1 className="mt-2 font-heading text-[2.25rem] font-bold leading-none text-ink">
          {messages.pages.profile.title}
        </h1>
        <p className="page-subtitle mt-2">
          {messages.pages.profile.subtitle}
        </p>
      </header>

      <Card className="space-y-4">
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-bold text-ink">{messages.pages.profile.mode.title}</h2>
            <p className="mt-1 text-sm text-mist">
              {linked
                ? messages.pages.profile.mode.linkedDescription
                : pairModeEnabled
                  ? messages.pages.profile.mode.pairDescription
                  : messages.pages.profile.mode.singleDescription}
            </p>
          </div>
          {!linked ? (
            <label className="flex items-center justify-between rounded-[18px] bg-eggshell px-4 py-3 text-sm font-semibold text-ink">
              <span>{pairModeEnabled ? messages.pages.profile.mode.pair : messages.pages.profile.mode.single}</span>
              <input
                checked={pairModeEnabled}
                className="control-checkbox"
                type="checkbox"
                aria-label={messages.pages.profile.mode.ariaLabel}
                onChange={(event) => handlePairModeToggle(event.target.checked)}
              />
            </label>
          ) : (
            <label className="flex items-center justify-between rounded-[18px] bg-eggshell px-4 py-3 text-sm font-semibold text-ink">
              <span>{messages.pages.profile.mode.pair}</span>
              <input
                checked
                className="control-checkbox"
                type="checkbox"
                aria-label={messages.pages.profile.mode.ariaLabel}
                onChange={(event) => handlePairModeToggle(event.target.checked)}
              />
            </label>
          )}
        </div>

        {linked ? (
          <div className="grid grid-cols-[auto_1fr] items-center gap-3 rounded-[20px] bg-gradient-to-br from-secondarySoft to-primarySoft p-4">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-surface/80 text-blushDark">
              <UserPlus size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink">{messages.pages.profile.mode.linkedCardTitle}</h3>
              <p className="mt-1 text-sm text-mist">{messages.pages.profile.mode.linkedCardDescription}</p>
            </div>
          </div>
        ) : pairModeEnabled ? (
          <div className="space-y-3">
            <div className="grid grid-cols-[1fr_auto] items-center gap-3 p-1">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-mist">
                  {messages.pages.profile.mode.inviteCodeLabel}
                </p>
                <p className="mt-1 font-heading text-2xl font-bold text-ink">{inviteCode}</p>
              </div>
              <button
                className="grid h-12 w-12 place-items-center rounded-full bg-blush text-surface shadow-soft"
                type="button"
                aria-label={messages.common.actions.copy}
                onClick={handleCopyInviteCode}
              >
                <Copy size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="secondary" onClick={handleShareInvite}>
                {messages.pages.profile.mode.shareLink}
              </Button>
              <Button type="button" variant="secondary" onClick={handleOpenJoinModal}>
                {messages.pages.profile.mode.haveCode}
              </Button>
            </div>
          </div>
        ) : null}
      </Card>

      <Card className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <BellRing className="mt-1 text-blush" size={20} />
            <div>
              <h2 className="text-lg font-bold text-ink">{messages.pages.profile.notifications.title}</h2>
              <p className="mt-1 text-sm leading-6 text-mist">
                {notificationsEnabled
                  ? interpolate(messages.pages.profile.notifications.description, {
                      label:
                        daysBeforePlan === 0
                          ? messages.pages.profile.notifications.sameDay
                          : interpolate(messages.pages.profile.notifications.daysBefore, {
                              count: daysBeforePlan,
                              suffix: daysBeforePlan === 1 ? '' : 's',
                            }),
                    })
                  : messages.pages.profile.notifications.disabled}
              </p>
            </div>
          </div>
          <input
            checked={notificationsEnabled}
            className="control-checkbox"
            type="checkbox"
            aria-label={messages.pages.profile.notifications.ariaLabel}
            onChange={(event) => handleNotificationsToggle(event.target.checked)}
          />
        </div>

        {notificationsEnabled ? (
          <Link
            className="inline-flex w-full items-center justify-center rounded-full bg-blush px-5 py-3 text-sm font-semibold text-surface shadow-soft"
            to="/reminders"
          >
            <Settings2 className="mr-2" size={16} />
            {messages.pages.profile.notifications.configure}
          </Link>
        ) : (
          <div className="rounded-full bg-eggshell px-5 py-3 text-center text-sm font-semibold text-mist">
            {messages.pages.profile.notifications.enableHint}
          </div>
        )}
      </Card>

      <form className="space-y-4">
        <Card className="space-y-5">
          <div className="flex items-center gap-3">
            <Sparkles className="text-blush" size={20} />
            <div>
              <h2 className="text-lg font-bold text-ink">{messages.pages.profile.preferences.title}</h2>
            </div>
          </div>

          <section className="space-y-3">
            <PartnerNameFields
              partnerOneRegistration={register('partnerOneName')}
              partnerTwoRegistration={register('partnerTwoName')}
              onSwap={handleSwapNames}
            />
            {(errors.partnerOneName || errors.partnerTwoName) ? (
              <p className="text-sm text-blush">{messages.pages.profile.preferences.nameError}</p>
            ) : null}
          </section>

          <section className="space-y-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-mist">
              {messages.pages.profile.preferences.sectionChallenge}
            </p>
            <ChallengeGoalSelector
              minimumGoal={activeChallenge.memoryIds.length}
              value={activeChallenge.goal}
              onChange={setChallengeGoal}
            />
          </section>
        </Card>

        <Button type="button" variant="secondary" onClick={handleSignOut}>
          <LogOut className="mr-2" size={16} />
          {messages.pages.profile.signOut}
        </Button>
      </form>

      <FeedbackModal
        message={feedback?.message ?? ''}
        open={Boolean(feedback)}
        title={feedback?.title ?? ''}
        onClose={() => setFeedback(null)}
      />

      <Modal open={joinModalOpen}>
        <div className="solid-card rounded-[30px] p-5 shadow-soft">
          {!pendingPartnerChoice ? (
            <>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-blushDark">
                {messages.pages.profile.joinModal.eyebrow}
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold text-ink">{messages.pages.profile.joinModal.title}</h2>
              <input
                className="field mt-4 uppercase"
                placeholder={messages.pages.profile.joinModal.placeholder}
                value={joinCode}
                onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
              />
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Button type="button" fullWidth={false} onClick={handleJoinCodeContinue}>
                  {messages.common.actions.continue}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth={false}
                  onClick={() => setJoinModalOpen(false)}
                >
                  {messages.common.actions.cancel}
                </Button>
              </div>
            </>
          ) : (
            <PartnerIdentityStep
              description={messages.pages.profile.joinModal.description}
              preferences={preferences}
              onBack={() => setPendingPartnerChoice(false)}
              onSelect={handleRedeemCode}
            />
          )}
        </div>
      </Modal>

      <Modal open={unlinkConfirmOpen}>
        <div className="solid-card rounded-[30px] p-5 shadow-soft">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-blushDark">
            {messages.pages.profile.unlinkModal.eyebrow}
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-ink">
            {messages.pages.profile.unlinkModal.title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-mist">
            {messages.pages.profile.unlinkModal.description}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Button type="button" onClick={handleConfirmUnlink} fullWidth={false}>
              {messages.pages.profile.unlinkModal.confirm}
            </Button>
            <Button
              type="button"
              variant="secondary"
              fullWidth={false}
              onClick={() => setUnlinkConfirmOpen(false)}
            >
              {messages.common.actions.cancel}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
