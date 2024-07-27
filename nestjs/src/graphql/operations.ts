export const INSERT_USER_MUTATION = `
  mutation ($id: numeric!, $name: String!, $username: String!) {
    insert_users_one(object: {
      id: $id,
      name: $name,
      username: $username,
      password: "password",
      created_at: "now()"
    }) {
      id,
      name
    }
  }
`;
