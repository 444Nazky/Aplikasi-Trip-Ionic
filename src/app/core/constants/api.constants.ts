export const API_BASE_URL = 'https://api.tripangkut.com/v1';

export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',

  // Trips
  TRIPS: '/trips',
  TRIP_DETAIL: (id: string) => `/trips/${id}`,
  TRIP_COMPLETE: (id: string) => `/trips/${id}/complete`,
  TRIP_GENERATE_NO: '/trips/generate-no-trip',

  // Vehicles
  TRIP_VEHICLES: (tripId: string) => `/trips/${tripId}/vehicles`,

  // Reports
  REPORT_SUMMARY: '/reports/summary',
  REPORT_DAILY: '/reports/daily',
  REPORT_DETAIL: '/reports/detail-vehicles',
  REPORT_EXPORT: '/reports/export',
  REPORT_CHART: '/reports/chart-data',

  // Admin
  ADMIN_USERS: '/admin/users',
  ADMIN_USER_DETAIL: (id: string) => `/admin/users/${id}`,
  ADMIN_USER_RESET_PIN: (id: string) => `/admin/users/${id}/reset-pin`,
  ADMIN_REGIONS: '/admin/regions',
  ADMIN_TARIFFS: '/admin/tariffs',
  ADMIN_SYNC_STATUS: '/admin/sync-status',
};
