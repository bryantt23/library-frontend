import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export const GET_USER_FAVORITE_GENRE = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`;

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
        name
        born
        bookCount
    }
  }
`;

export const ALL_BOOKS = gql`
  query {
    allBooks {
      author{
        name
      }
      title
      published
      genres
    }
  }
`;
