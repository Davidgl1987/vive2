import { Settings2, X } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import type { PartnerId } from '../../types/plan';
import { Modal } from '../ui/Modal';

export const DebugMenu = () => {
  const [open, setOpen] = useState(false);
  const preferences = useAppStore((state) => state.preferences);
  const currentPartnerId = useAppStore((state) => state.currentPartnerId);
  const partnerInviteStatus = useAppStore((state) => state.partnerInviteStatus);
  const setCurrentPartner = useAppStore((state) => state.setCurrentPartner);
  const setPartnerLinked = useAppStore((state) => state.setPartnerLinked);
  const linked = partnerInviteStatus === 'linked';
  const partners: { id: PartnerId; name: string }[] = [
    { id: 'partner_one', name: preferences.partnerOneName },
    { id: 'partner_two', name: preferences.partnerTwoName },
  ];

  return (
    <>
      <button
        className="fixed right-[calc(50%-215px+1rem)] top-5 z-[90] grid h-11 w-11 place-items-center rounded-full border-2 border-surface/80 bg-surface/88 text-ink shadow-[0_12px_28px_rgb(var(--color-overlay)/0.14)] backdrop-blur-xl max-[430px]:right-4"
        type="button"
        aria-label="Abrir menú debug"
        title="Debug MVP"
        onClick={() => setOpen(true)}
      >
        <Settings2 size={18} />
      </button>

      <Modal open={open}>
        <div className="solid-card rounded-[28px] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-blush">
                Debug MVP
              </p>
              <h2 className="mt-2 text-xl font-extrabold text-ink">Controles de prueba</h2>
            </div>
            <button
              className="grid h-10 w-10 place-items-center rounded-full bg-eggshell text-ink"
              type="button"
              aria-label="Cerrar menú debug"
              onClick={() => setOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <p className="mb-2 text-sm font-semibold text-ink">Quién actúa ahora</p>
              <div className="rounded-[24px] bg-eggshell p-1.5">
                <div className="grid grid-cols-2 gap-1.5">
                  {partners.map((partner) => (
                    <button
                      key={partner.id}
                      className={`rounded-[18px] px-4 py-3 text-sm font-extrabold transition ${
                        partner.id === 'partner_one'
                          ? currentPartnerId === partner.id
                            ? 'bg-blush text-surface shadow-soft hover:bg-blushDark'
                            : 'bg-primarySoft text-blushDark hover:bg-surface/70'
                          : currentPartnerId === partner.id
                            ? 'bg-lightBlue text-surface shadow-[0_10px_22px_rgb(var(--color-accent-dark)/0.12)] hover:bg-accentDark'
                            : 'bg-icyAqua text-accentDark hover:bg-surface/70'
                      }`}
                      type="button"
                      onClick={() => setCurrentPartner(partner.id)}
                    >
                      {partner.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <label className="flex items-center justify-between gap-4 rounded-[20px] border-2 border-ink/10 bg-surface px-4 py-3">
              <span>
                <span className="block text-sm font-extrabold text-ink">
                  {linked ? 'Pareja vinculada' : 'Modo individual'}
                </span>
                <span className="mt-1 block text-xs leading-5 text-mist">
                  {linked
                    ? 'Los planes necesitan acuerdo de ambas personas.'
                    : 'Puedes cerrar planes sin esperar a la otra persona.'}
                </span>
              </span>
              <input
                checked={linked}
                className="control-checkbox"
                type="checkbox"
                aria-label="Simular pareja vinculada"
                onChange={(event) => setPartnerLinked(event.target.checked)}
              />
            </label>
          </div>
        </div>
      </Modal>
    </>
  );
};
