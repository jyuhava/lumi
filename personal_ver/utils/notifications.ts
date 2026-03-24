import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Lazy load expo-notifications to avoid crashes on import in Expo Go SDK 53+
let Notifications: any = null;

function getNotifications() {
  if (!Notifications) {
    try {
      Notifications = require('expo-notifications');
    } catch (e) {
      console.warn('expo-notifications not available:', e);
    }
  }
  return Notifications;
}

const isExpoGo = Constants.executionEnvironment === 'storeClient';

export async function setupNotifications() {
  const lib = getNotifications();
  if (!lib) return;

  if (isExpoGo && Platform.OS === 'android') {
    // In Expo Go SDK 53+, remote notifications are removed.
    // Local notifications might still work, but we must be careful.
    console.warn('Note: Running in Expo Go. Notifications might have limited support.');
  }

  try {
    lib.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  } catch (e) {
    console.warn('Failed to set notification handler:', e);
  }
}

export async function requestPermissions() {
  const lib = getNotifications();
  if (!lib) return false;

  try {
    const { status: existingStatus } = await lib.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await lib.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === 'granted';
  } catch (e) {
    console.warn('Notification permissions request failed:', e);
    return false;
  }
}

export async function scheduleWaterReminder(seconds: number) {
  const lib = getNotifications();
  if (!lib) return;

  try {
    await lib.scheduleNotificationAsync({
      content: {
        title: "Waktunya Minum Air! 💧",
        body: "Jaga hidrasi tubuhmu. Yuk minum segelas air sekarang!",
      },
      trigger: {
        seconds,
      } as any,
    });
  } catch (e) {
    console.warn('Failed to schedule water reminder:', e);
  }
}

export async function scheduleNightlyReminder() {
  const lib = getNotifications();
  if (!lib) return;

  try {
    await lib.scheduleNotificationAsync({
      content: {
        title: "Peringatan Hidrasi ⚠️",
        body: "Kamu masih belum mencapai target minum air hari ini. Sempatkan minum sebelum tidur!",
      },
      trigger: {
        hour: 22,
        minute: 0,
        repeats: true,
      } as any,
    });
  } catch (e) {
    console.warn('Failed to schedule nightly reminder:', e);
  }
}

export async function cancelAllNotifications() {
  const lib = getNotifications();
  if (!lib) return;

  try {
    await lib.cancelAllScheduledNotificationsAsync();
  } catch (e) {
    console.warn('Failed to cancel notifications:', e);
  }
}
