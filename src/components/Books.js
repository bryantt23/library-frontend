import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_BOOKS } from "../queries"

const Books = ({ show, genre }) => {
  // Execute the query when the component mounts or when `genre` changes
  const { loading, error, data } = useQuery(GET_BOOKS, {
    variables: { genre },
    skip: !show, // Skip the query if the component is not being shown 
    fetchPolicy: "network-only",
  });

  if (!show) {
    return null;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Use `data.allBooks` instead of the `books` prop
  const books = data.allBooks;

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
