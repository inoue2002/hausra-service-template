import { Injectable } from '@nestjs/common';
import { User } from './user.model';

@Injectable()
export class UserService {
  async getUser(id: string): Promise<User> {
    // 複雑な処理をここに実装
    return { id, name: 'John Doe', email: 'john.doe@example.com' };
  }
}
