import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.plantation.tripangkut',
  appName: 'Trip Angkutan',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    url: 'http://10.0.2.2:8100',
    cleartext: true,
  },
};

export default config;
