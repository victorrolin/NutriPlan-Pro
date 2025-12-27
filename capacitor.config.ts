import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nutriplanpro.app',
  appName: 'NutriPlan Pro',
  webDir: 'out',
  server: {
    allowNavigation: ['*']
  }
};

export default config;
