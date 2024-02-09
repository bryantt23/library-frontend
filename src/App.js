import { useState } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import { gql, useQuery, useApolloClient } from '@apollo/client';
import LoginForm from './components/LoginForm';

const ALL_AUTHORS = gql`
  query {
    allAuthors {
        name
        born
        bookCount
    }
  }
`;

const ALL_BOOKS = gql`
  query {
    allBooks {
      author{
        name
      }
      title
      published
    }
  }
`;


const App = () => {
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('authors');
  const [errorMessage, setErrorMessage] = useState("")
  const { loading: authorsLoading, error: authorsError, data: allAuthorsData } = useQuery(ALL_AUTHORS);
  const { loading: booksLoading, error: booksError, data: allBooksData } = useQuery(ALL_BOOKS);
  const client = useApolloClient()

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const Notify = ({ errorMessage }) => {
    if (!errorMessage) {
      return null
    }
    return (
      <div style={{ color: 'red' }}>
        {errorMessage}
      </div>
    )
  }

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <h2>Login</h2>
        <LoginForm
          setToken={setToken}
          setError={notify}
        />
      </div>
    )
  }

  if (authorsLoading || booksLoading) {
    return <p>Loading...</p>;
  }

  if (authorsError || booksError) {
    return <p>Error: {authorsError ? authorsError.message : booksError.message}</p>;
  }

  const allAuthors = allAuthorsData.allAuthors;
  const allBooks = allBooksData.allBooks;

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={logout}>logout</button>
      </div>

      <Authors show={page === 'authors'} allAuthors={allAuthors} ALL_AUTHORS={ALL_AUTHORS} />

      <Books show={page === 'books'} allBooks={allBooks} />

      <NewBook show={page === 'add'} ALL_BOOKS={ALL_BOOKS} />
    </div>
  );
};

export default App;
