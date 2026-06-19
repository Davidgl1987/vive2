import { Outlet } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { BottomNav } from './BottomNav';
import { MobileFrame } from './MobileFrame';
import { PageTransition } from './PageTransition';
import { ScrollToTop } from './ScrollToTop';

export const AppShell = () => {
  const currentPartnerId = useAppStore((state) => state.currentPartnerId);
  const themeClass = currentPartnerId === 'partner_two' ? 'theme-partner-two' : 'theme-partner-one';

  return (
    <div className={themeClass}>
      <ScrollToTop />
      <MobileFrame withNav>
        <PageTransition>
          <Outlet />
        </PageTransition>
      </MobileFrame>
      <BottomNav />
    </div>
  );
};
