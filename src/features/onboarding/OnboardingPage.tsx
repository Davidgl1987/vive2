import { motion } from 'framer-motion';
import { CalendarCheck2, Heart, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { OnboardingShowcase } from '../../components/illustrations/OnboardingShowcase';
import { MobileFrame } from '../../components/layout/MobileFrame';
import { Button } from '../../components/ui/Button';
import { messages } from '../../i18n';
import { getPublicAssetUrl } from '../../utils/assets';

const steps = [
  {
    icon: Sparkles,
    title: messages.pages.onboarding.steps.choose.title,
    text: messages.pages.onboarding.steps.choose.description,
  },
  {
    icon: CalendarCheck2,
    title: messages.pages.onboarding.steps.schedule.title,
    text: messages.pages.onboarding.steps.schedule.description,
  },
  {
    icon: Heart,
    title: messages.pages.onboarding.steps.remember.title,
    text: messages.pages.onboarding.steps.remember.description,
  },
];

export const OnboardingPage = () => {
  const navigate = useNavigate();

  return (
    <MobileFrame>
      <div className="flex min-h-full flex-col justify-between gap-7 px-2 pb-4 pt-6">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-10 inline-flex h-14 w-14 items-center justify-center rounded-[22px] bg-surface p-2 shadow-sm">
            <img alt="Vive2" className="h-full w-full" src={getPublicAssetUrl('logo/vive2-icono-120x120.png')} />
          </div>
          <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.24em] text-blush">
            {messages.common.appName}
          </p>
          <h1 className="page-title max-w-[12ch]">
            {messages.pages.onboarding.title.first}
            <br />
            {messages.pages.onboarding.title.second}
            <br />
            {messages.pages.onboarding.title.third}
            <span className="text-blush"> ♥</span>
          </h1>
          <p className="page-subtitle mt-5 max-w-[24ch]">
            {messages.pages.onboarding.description}
          </p>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="relative"
          initial={{ opacity: 0, y: 36 }}
          transition={{ delay: 0.15, duration: 0.55 }}
        >
          <OnboardingShowcase />
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-3"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.24, duration: 0.5 }}
        >
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="grid grid-cols-[auto_1fr] items-center gap-3 rounded-[22px] bg-surface/82 p-3 shadow-[0_10px_24px_rgb(var(--color-overlay)/0.07)] backdrop-blur"
              >
                <span className="grid h-11 w-11 place-items-center rounded-[18px] bg-primarySoft text-blushDark">
                  <Icon size={19} />
                </span>
                <div>
                  <h2 className="text-sm font-extrabold text-ink">{step.title}</h2>
                  <p className="text-xs leading-5 text-mist">{step.text}</p>
                </div>
              </div>
            );
          })}
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
          initial={{ opacity: 0, y: 24 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Button onClick={() => navigate('/onboarding/tour')}>
            {messages.pages.onboarding.start}
          </Button>
          <button
            className="w-full text-sm font-semibold text-blush"
            type="button"
            onClick={() => navigate('/onboarding/auth')}
          >
            {messages.pages.onboarding.signIn}
          </button>
          <p className="text-center text-xs leading-5 text-mist">
            {messages.pages.onboarding.hint}
          </p>
        </motion.div>
      </div>
    </MobileFrame>
  );
};
