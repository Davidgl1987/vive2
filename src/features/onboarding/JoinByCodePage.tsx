import { useState } from 'react';
import { Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { PartnerIdentityStep } from '../../components/invite/PartnerIdentityStep';
import { MobileFrame } from '../../components/layout/MobileFrame';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { useAppStore } from '../../store/useAppStore';
import type { PartnerId } from '../../types/plan';
import { parseInvitePayload, validateInviteCodeInput } from '../../utils/invite';

export const JoinByCodePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState(() => searchParams.get('code')?.toUpperCase() ?? '');
  const [error, setError] = useState<string | null>(null);
  const [pendingPartnerId, setPendingPartnerId] = useState<PartnerId | null>(null);
  const redeemInviteCode = useAppStore((state) => state.redeemInviteCode);
  const inviteCode = useAppStore((state) => state.inviteCode);
  const preferences = useAppStore((state) => state.preferences);
  const invitePayload = parseInvitePayload(searchParams.get('setup'));
  const authenticated = Boolean(
    (location.state as { onboardingAuthenticated?: boolean } | null)?.onboardingAuthenticated,
  );

  if (!authenticated) {
    return (
      <Navigate
        replace
        state={{ pendingInvite: `${location.pathname}${location.search}` }}
        to="/onboarding/auth"
      />
    );
  }

  const handleSubmitCode = () => {
    const validation = validateInviteCodeInput(code, inviteCode);
    if (!validation.ok) {
      setError(validation.message);
      return;
    }

    setCode(validation.normalizedCode);
    setError(null);
    setPendingPartnerId('partner_two');
  };

  const handleRedeem = (partnerId: PartnerId) => {
    const result = redeemInviteCode(code, {
      partnerId,
      payload: invitePayload,
    });

    if (!result.ok) {
      setError(result.message ?? 'No hemos podido aceptar ese código.');
      setPendingPartnerId(null);
      return;
    }

    navigate('/home');
  };

  return (
    <MobileFrame>
      <div className="space-y-5 pb-4">
        <PageHeader
          backTo="/onboarding/auth"
          subtitle="Introduce el código que te han compartido para activar el modo en pareja en este dispositivo."
          title="Tengo un código"
        />

        <Card className="space-y-4">
          {pendingPartnerId ? (
            <PartnerIdentityStep
              description={invitePayload
                ? 'La configuración principal ya viene preparada desde la invitación.'
                : 'Si solo tienes el código, activaremos el modo pareja y podrás revisar el resto después.'}
              preferences={invitePayload?.preferences ?? preferences}
              onBack={() => setPendingPartnerId(null)}
              onSelect={handleRedeem}
            />
          ) : (
            <>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-ink">Código de invitación</span>
                <input
                  className="field uppercase"
                  placeholder="VIVE2-ABC123"
                  value={code}
                  onChange={(event) => {
                    setCode(event.target.value.toUpperCase());
                    if (error) setError(null);
                  }}
                />
              </label>

              {error ? (
                <p className="text-sm font-semibold text-blush">{error}</p>
              ) : (
                <p className="text-sm leading-6 text-mist">
                  En este MVP local, si llegas desde una invitación con enlace también reutilizamos la configuración que ya preparó la otra persona.
                </p>
              )}

              <Button type="button" onClick={handleSubmitCode}>
                Continuar
              </Button>
            </>
          )}
        </Card>

      </div>
    </MobileFrame>
  );
};
