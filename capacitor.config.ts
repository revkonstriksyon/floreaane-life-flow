import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.06cf441ee2014828b4bb2ddd83ba0d3a',
  appName: 'floreaane-life-flow',
  webDir: 'dist',
  server: {
    url: 'https://06cf441e-e201-4828-b4bb-2ddd83ba0d3a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;