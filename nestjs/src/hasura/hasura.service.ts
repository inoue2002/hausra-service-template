import { Injectable } from '@nestjs/common';
import axios from 'axios';

interface GraphQLResponse<T> {
  data: T;
  errors?: any;
}

@Injectable()
export class HasuraService {
  private readonly HASURA_ENDPOINT =
    'https://hasura-service-zu7de5alhq-an.a.run.app/v1/graphql';

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
          'x-hasura-admin-secret': 'hasura!',
        },
      },
    );
    console.log('DEBUG: ', response.data);
    return response.data;
  }
}
