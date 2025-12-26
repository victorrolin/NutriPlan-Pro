import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.trainerworkout.app',
  appName: 'FitPlan Pro',
  webDir: 'out',
  server: {
    allowNavigation: ['*']
  }
};

export default config;
