import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private firebaseApp: admin.app.App;

  constructor() {
    this.initializeFirebaseApp();
  }

  private initializeFirebaseApp() {
    if (!process.env.SERVICE_ACCOUNT_PRIVATE_KEY) {
      throw new Error('SERVICE_ACCOUNT_PRIVATE_KEY is not defined');
    }

    if (!process.env.SERVICE_ACCOUNT_CLIENT_EMAIL) {
      throw new Error('SERVICE_ACCOUNT_CLIENT_EMAIL is not defined');
    }

    if (!process.env.SERVICE_ACCOUNT_PROJECT_ID) {
      throw new Error('SERVICE_ACCOUNT_PROJECT_ID is not defined');
    }

    if (!admin.apps.length) {
      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.SERVICE_ACCOUNT_PROJECT_ID,
          clientEmail: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
          privateKey: process.env.SERVICE_ACCOUNT_PRIVATE_KEY.replace(
            /\\n/g,
            '\n',
          ),
        }),
      });
    } else {
      this.firebaseApp = admin.app();
    }
  }

  getFirebaseApp(): admin.app.App {
    return this.firebaseApp;
  }
}
