import { Redirect } from 'expo-router';
import { useUserStore } from '../utils/store';

export default function Index() {
  const hasCompletedOnboarding = useUserStore((state) => state.hasCompletedOnboarding);
  const hasHydrated = useUserStore((state) => state.hasHydrated);

  // Wait for the async storage to hydrate local profile data before deciding where to route
  if (!hasHydrated) return null;

  if (!hasCompletedOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}
