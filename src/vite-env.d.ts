/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_PASSWORD: string
  readonly VITE_EMAIL_SERVICE_ID: string
  readonly VITE_EMAIL_TEMPLATE_ID: string
  readonly VITE_EMAIL_PUBLIC_KEY: string
  readonly VITE_WELCOME_TEMPLATE_ID: string
  readonly VITE_UPDATE_NOTIFICATION_TEMPLATE_ID: string
  
  // Firebase Configuration
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
