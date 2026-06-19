import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { AppShell } from '../components/layout/AppShell';
import { MobileFrame } from '../components/layout/MobileFrame';
import { AgendaPage } from '../features/agenda/AgendaPage';
import { AlbumPage } from '../features/album/AlbumPage';
import { HomePage } from '../features/home/HomePage';
import { MemoryDetailPage } from '../features/memories/MemoryDetailPage';
import { MemoriesPage } from '../features/memories/MemoriesPage';
import { JoinByCodePage } from '../features/onboarding/JoinByCodePage';
import { AuthPage } from '../features/onboarding/AuthPage';
import { OnboardingPage } from '../features/onboarding/OnboardingPage';
import { OnboardingTourPage } from '../features/onboarding/OnboardingTourPage';
import { PreferencesPage } from '../features/onboarding/PreferencesPage';
import { ReadyPage } from '../features/onboarding/ReadyPage';
import { CompletePlanPage } from '../features/plans/CompletePlanPage';
import { PlanDetailPage } from '../features/plans/PlanDetailPage';
import { PlansPage } from '../features/plans/PlansPage';
import { ProfilePage } from '../features/profile/ProfilePage';
import { RemindersPage } from '../features/reminders/RemindersPage';
import { useAppStore } from '../store/useAppStore';

const RootRedirect = () => {
  const onboardingCompleted = useAppStore((state) => state.onboardingCompleted);
  return <Navigate replace to={onboardingCompleted ? '/home' : '/onboarding'} />;
};

const PublicWrapper = () => (
  <MobileFrame>
    <Outlet />
  </MobileFrame>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/onboarding',
    element: <Outlet />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <OnboardingPage />,
      },
      {
        path: 'tour',
        element: <OnboardingTourPage />,
      },
      {
        path: 'auth',
        element: <AuthPage />,
      },
      {
        path: 'preferences',
        element: <PreferencesPage />,
      },
      {
        path: 'join',
        element: <JoinByCodePage />,
      },
      {
        path: 'ready',
        element: <ReadyPage />,
      },
    ],
  },
  {
    element: <AppShell />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '/home',
        element: <HomePage />,
      },
      {
        path: '/plans',
        element: <PlansPage />,
      },
      {
        path: '/agenda',
        element: <AgendaPage />,
      },
      {
        path: '/plans/:planId',
        element: <PlanDetailPage />,
      },
      {
        path: '/plans/:planId/complete',
        element: <CompletePlanPage />,
      },
      {
        path: '/memories',
        element: <MemoriesPage />,
      },
      {
        path: '/memories/:memoryId',
        element: <MemoryDetailPage />,
      },
      {
        path: '/reminders',
        element: <RemindersPage />,
      },
      {
        path: '/album',
        element: <AlbumPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: '*',
    element: <RootRedirect />,
    errorElement: <ErrorBoundary />,
  },
]);
