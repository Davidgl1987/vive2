import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MobileFrame } from '../../components/layout/MobileFrame';
import { Button } from '../../components/ui/Button';
import { useAppStore } from '../../store/useAppStore';

export const ReadyPage = () => {
  const preferences = useAppStore((state) => state.preferences);

  return (
    <MobileFrame>
      <div className="flex min-h-full flex-col items-center justify-center gap-8 px-3 text-center">
        <motion.div
          animate={{ scale: [0.95, 1.02, 1], opacity: 1 }}
          className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-secondarySoft to-primarySoft text-5xl shadow-soft"
          initial={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.6 }}
        >
          🎉
        </motion.div>
        <div className="space-y-3">
          <h1 className="page-title text-center text-[2.2rem]">¡Listo!</h1>
          <p className="page-subtitle">
            Ya podéis empezar a llenar vuestra Agenda de planes para {preferences.coupleName}.
          </p>
        </div>
        <div className="w-full space-y-3">
          <Link to="/home">
            <Button>Ir a Inicio</Button>
          </Link>
          <Link className="block text-sm font-semibold text-blush" to="/plans">
            Explorar planes
          </Link>
        </div>
      </div>
    </MobileFrame>
  );
};
