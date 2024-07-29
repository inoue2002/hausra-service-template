import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class LineAuthService {
  private readonly LINE_VERIFY_URL = 'https://api.line.me/oauth2/v2.1/verify';
  private readonly CLIENT_ID = process.env.LINE_CLIENT_ID;

  constructor(private readonly firebaseService: FirebaseService) {}

  async verifyLineToken(lineIdToken: string): Promise<string> {
    try {
      let lineUserId: string;

      if (lineIdToken === 'id_token') {
        // ローカル開発時のテストユーザー
        lineUserId = 'local_user';
        console.log('DEBUG: ローカル開発用テストユーザー');
      } else {
        // LINEのIDトークンを検証
        const response = await axios.post(
          this.LINE_VERIFY_URL,
          new URLSearchParams({
            id_token: lineIdToken,
            client_id: this.CLIENT_ID,
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        );
        const { sub, aud: clientId, exp: expiration } = response.data;
        lineUserId = sub;

        // クライアントIDの比較
        if (clientId !== this.CLIENT_ID) {
          throw new Error('Invalid client ID');
        }

        // 有効期限の確認
        const currentTime = Math.floor(Date.now() / 1000);
        if (expiration < currentTime) {
          throw new Error('Token has expired');
        }
      }

      console.log('DEBUG: LINE User ID: ', lineUserId);

      // Hasuraのカスタムクレームマップを使用してカスタムトークンを作成
      const customClaims = {
        'https://hasura.io/jwt/claims': {
          'x-hasura-default-role': 'user',
          'x-hasura-allowed-roles': ['user'],
          'x-hasura-user-id': lineUserId,
        },
      };

      // FirebaseServiceを使用してFirebaseアプリを取得
      const firebaseApp = this.firebaseService.getFirebaseApp();

      // Firebaseのカスタムトークンを作成
      const firebaseToken = await firebaseApp
        .auth()
        .createCustomToken(lineUserId, customClaims);

      console.log('DEBUG: Firebase Token1: ', firebaseToken);

      return firebaseToken;
    } catch (error) {
      console.error('LINEトークンの検証中にエラーが発生しました:', error);
      throw new Error('トークンの検証に失敗しました');
    }
  }
}
