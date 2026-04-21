import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.edugest.app',
  appName: 'EduGest - Gestion Scolaire',
  webDir: 'out',
  server: {
    // L'APK charge l'application depuis le serveur distant.
    // Remplacez cette URL par l'adresse de votre serveur déployé.
    // Pour tester en local : "http://10.0.2.2:3000" (émulateur) ou "http://192.168.x.x:3000"
    url: 'https://preview-3514487813.space.chatglm.site/',
    androidScheme: 'https'
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
