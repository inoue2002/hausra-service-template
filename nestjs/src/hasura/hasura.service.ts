import { Injectable } from '@nestjs/common';
import axios from 'axios';

interface GraphQLResponse<T> {
  data: T;
  errors?: any;
}

@Injectable()
export class HasuraService {
  private readonly HASURA_ENDPOINT = process.env.HASURA_ENDPOINT;
  private readonly HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET;

  async execute<T>(query: string, variables: any): Promise<GraphQLResponse<T>> {
    const response = await axios.post<GraphQLResponse<T>>(
      this.HASURA_ENDPOINT,
      {
        query,
        variables,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': this.HASURA_ADMIN_SECRET,
        },
      },
    );
    console.log('DEBUG: ', response.data);
    return response.data;
  }
}
