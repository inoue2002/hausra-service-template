import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { INSERT_USER_MUTATION } from './graphql/operations';
import { HasuraService } from './hasura/hasura.service';

interface InsertUserResponse {
  insert_users_one: {
    id: string;
    name: string;
    username: string;
  };
}

@Controller('signup')
export class AppController {
  constructor(private readonly hasuraService: HasuraService) {}

  @Post()
  async signup(
    @Body() body: { input: { id: number; name: string; username: string } },
    @Res() res: Response,
  ) {
    const { id, name, username } = body.input;

    console.log('DEBUG: Request Body: ', body);

    // Hasuraの操作を実行
    const { data, errors } =
      await this.hasuraService.execute<InsertUserResponse>(
        INSERT_USER_MUTATION,
        { id, name: '✨' + name + '✨', username },
      );

    console.log('DEBUG: Hasura Response: ', { data, errors });

    // Hasuraの操作にエラーがあれば、エラーを返す
    if (errors) {
      console.error('ERROR: ', errors);
      return res.status(400).json(errors[0]);
    }

    // 成功
    return res.json({
      ...data.insert_users_one,
    });
  }
}
