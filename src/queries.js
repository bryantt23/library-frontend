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

export const GET_BOOKS = gql`
  query AllBooks($genre: String) {
    allBooks(genre: $genre) {
      author {
        name
      }
      title
      published
      genres
    }
  }
`;

export const ADD_BOOK = gql`
  mutation addBook(
    $title: String!
    $published: Int
    $author: String!
    $genres: [String]!
  ) {
    addBook(
      title: $title
      published: $published
      author: $author
      genres: $genres
    ) {
      id
      title
      published
      genres
      author {
        name
        id
        born
        bookCount
      }
    }
  }
`;
