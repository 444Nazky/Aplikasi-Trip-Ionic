export const APP_CONSTANTS = {
  storageDbName: 'tripangkut_db',
  pinLength: 6,
  gpsAccuracyThresholdMeters: 50,
  syncIntervalMs: 15 * 60 * 1000, // 15 minutes
  maxSyncRetries: 5,
  // Retry backoff schedule matching docs/ionic/offline-sync.md
  retryBackoffMs: [0, 60_000, 5 * 60_000, 15 * 60_000, 30 * 60_000],
};

export const API_BASE_URL = 'https://api.tripangkut.com/v1';
