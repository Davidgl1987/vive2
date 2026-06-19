import { CalendarHeart, Camera, MapPin, Sparkles } from 'lucide-react';

export const OnboardingShowcase = () => (
  <div className="relative mx-auto h-72 w-full max-w-[330px] overflow-hidden rounded-[34px] border-2 border-ink/10 bg-gradient-to-br from-eggshell via-secondarySoft to-accent p-5 shadow-soft">
    <div className="absolute -left-10 top-8 h-28 w-28 rounded-full bg-primary" />
    <div className="absolute -right-10 bottom-8 h-32 w-32 rounded-full bg-secondary" />

    <div className="relative grid h-full grid-rows-[auto_1fr_auto] gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-accentDark">
            Plan de hoy
          </p>
          <h2 className="mt-1 text-2xl font-extrabold leading-tight text-ink">
            Picnic al atardecer
          </h2>
        </div>
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-surface shadow-soft">
          <Sparkles size={22} />
        </span>
      </div>

      <div className="grid grid-cols-[1fr_0.78fr] gap-3">
        <div className="rounded-[26px] bg-surface p-4 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex h-20 items-end gap-2 rounded-[20px] bg-gradient-to-br from-secondary to-accent p-3">
            <span className="h-9 flex-1 rounded-t-full bg-eggshell" />
            <span className="h-14 flex-1 rounded-t-full bg-surface" />
            <span className="h-11 flex-1 rounded-t-full bg-primarySoft" />
          </div>
          <div className="space-y-2">
            <span className="block h-2.5 w-24 rounded-full bg-accent" />
            <span className="block h-2.5 w-16 rounded-full bg-primary" />
          </div>
        </div>

        <div className="grid gap-3">
          <div className="rounded-[22px] bg-primary p-3 text-surface shadow-[var(--shadow-card)]">
            <CalendarHeart size={21} />
            <p className="mt-3 text-sm font-extrabold">Tu reto</p>
            <p className="text-[11px] font-bold opacity-90">a vuestro ritmo</p>
          </div>
          <div className="rounded-[22px] bg-eggshell p-3 text-ink shadow-[var(--shadow-card)]">
            <Camera className="text-accentDark" size={21} />
            <p className="mt-3 text-[11px] font-bold text-mist">recuerdos</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-[22px] bg-surface px-4 py-3 shadow-[var(--shadow-card)]">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-secondary text-secondaryDark">
          <MapPin size={18} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold text-ink">Parque cercano</p>
          <p className="text-xs font-semibold text-mist">a 8 min de vosotros</p>
        </div>
      </div>
    </div>
  </div>
);
