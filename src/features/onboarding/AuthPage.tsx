import { AtSign, LockKeyhole, Mail, UserPlus, UsersRound } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MobileFrame } from '../../components/layout/MobileFrame';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { messages } from '../../i18n';

type AuthProvider = 'google' | 'email';

export const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [provider, setProvider] = useState<AuthProvider | null>(null);
  const pendingInvite = (location.state as { pendingInvite?: string } | null)?.pendingInvite;

  const completePreparedAuthentication = (nextProvider: AuthProvider) => {
    if (pendingInvite) {
      navigate(pendingInvite, {
        replace: true,
        state: { onboardingAuthenticated: true, provider: nextProvider },
      });
      return;
    }

    setProvider(nextProvider);
  };

  const handleEmailSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    completePreparedAuthentication('email');
  };

  const authenticatedState = { onboardingAuthenticated: true, provider };

  return (
    <MobileFrame>
      <div className="space-y-5 pb-5">
        <PageHeader
          backTo="/onboarding/tour"
          subtitle={provider ? messages.pages.auth.next.subtitle : messages.pages.auth.subtitle}
          title={provider ? messages.pages.auth.next.title : messages.pages.auth.title}
        />

        {provider ? (
          <div className="space-y-3">
            <Card className="overflow-hidden bg-gradient-to-br from-primarySoft via-surface to-secondarySoft text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-[24px] bg-surface text-blushDark shadow-soft">
                <UsersRound size={28} />
              </div>
              <p className="mt-4 text-sm leading-6 text-mist">{messages.pages.auth.next.description}</p>
            </Card>
            <Button
              onClick={() => navigate('/onboarding/preferences', { state: authenticatedState })}
            >
              <span className="inline-flex items-center gap-2">
                <UserPlus size={18} />
                {messages.pages.auth.next.create}
              </span>
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/onboarding/join', { state: authenticatedState })}
            >
              <span className="inline-flex items-center gap-2">
                <AtSign size={18} />
                {messages.pages.auth.next.join}
              </span>
            </Button>
          </div>
        ) : (
          <Card className="space-y-5">
            <Button variant="secondary" onClick={() => completePreparedAuthentication('google')}>
              <span className="inline-flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="grid h-7 w-7 place-items-center rounded-full bg-surface font-black text-accentDark shadow-sm"
                >
                  G
                </span>
                {messages.pages.auth.google}
              </span>
            </Button>

            <div className="flex items-center gap-3 text-xs font-semibold text-mist">
              <span className="h-px flex-1 bg-ink/10" />
              {messages.pages.auth.or}
              <span className="h-px flex-1 bg-ink/10" />
            </div>

            <form className="space-y-4" onSubmit={handleEmailSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-ink">{messages.pages.auth.email}</span>
                <span className="relative block">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-mist" size={18} />
                  <input className="field pl-11" required type="email" />
                </span>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-ink">{messages.pages.auth.password}</span>
                <span className="relative block">
                  <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-mist" size={18} />
                  <input className="field pl-11" minLength={6} required type="password" />
                </span>
              </label>
              <Button type="submit">{messages.pages.auth.emailAction}</Button>
            </form>

            <p className="text-center text-xs leading-5 text-mist">{messages.pages.auth.legal}</p>
          </Card>
        )}
      </div>
    </MobileFrame>
  );
};
