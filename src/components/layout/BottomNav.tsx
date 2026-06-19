import { motion } from 'framer-motion';
import { CalendarCheck2, Heart, Home, Settings2, Sparkles } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { messages } from '../../i18n';

const items = [
  { label: messages.components.bottomNav.home, to: '/home', icon: Home },
  { label: messages.components.bottomNav.plans, to: '/plans', icon: Sparkles },
  { label: messages.components.bottomNav.agenda, to: '/agenda', icon: CalendarCheck2 },
  { label: messages.components.bottomNav.memories, to: '/memories', icon: Heart },
  { label: messages.components.bottomNav.profile, to: '/profile', icon: Settings2 },
];

export const BottomNav = () => (
  <nav className="fixed bottom-4 left-0 right-0 z-50 mx-auto w-full max-w-[430px] px-6 pb-[env(safe-area-inset-bottom)]">
    <div className="relative grid grid-cols-5 items-center gap-0.5 overflow-visible rounded-[30px] border-2 border-surface/75 bg-gradient-to-b from-lightBlue/40 via-surface/72 to-powderBlush/35 px-1 py-1.5 shadow-[0_18px_46px_rgb(var(--color-overlay)/0.18)] backdrop-blur-2xl">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            className="relative flex min-w-0 items-center justify-center"
            to={item.to}
          >
            {({ isActive }) => (
              <span
                className={`relative z-10 flex min-w-0 flex-col items-center gap-1 rounded-[24px] text-[10px] font-extrabold transition ${
                  isActive ? 'text-surface' : 'text-ink/65'
                } ${isActive ? 'px-2 py-2.5' : 'px-1 py-2'}`}
              >
                {isActive ? (
                  <motion.span
                    className="active-nav-pill absolute inset-0 -z-10 rounded-[24px] border-2 border-surface bg-gradient-to-b from-blush to-blushDark shadow-[0_12px_30px_rgb(var(--color-primary-dark)/0.28)]"
                    layoutId="bottom-nav-active-pill"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                ) : null}
                <Icon size={17} />
                {item.label}
              </span>
            )}
          </NavLink>
        );
      })}
    </div>
  </nav>
);
