import { useEffect, useState } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import { useQuery, useApolloClient, useSubscription } from '@apollo/client';
import LoginForm from './components/LoginForm';
import { GET_USER_FAVORITE_GENRE, GET_BOOKS, ALL_AUTHORS, BOOK_ADDED } from "./queries"

const App = () => {
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('authors');
  const [errorMessage, setErrorMessage] = useState("")
  const [selectedGenre, setSelectedGenre] = useState(null);

  const { loading: authorsLoading, error: authorsError, data: allAuthorsData } = useQuery(ALL_AUTHORS);
  const { loading: booksLoading, error: booksError, data: allBooksData } = useQuery(GET_BOOKS);
  const { data: userData } = useQuery(GET_USER_FAVORITE_GENRE);
  console.log("🚀 ~ App ~ userData:", userData)

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      console.log(JSON.stringify(data, null, 4))
      // Read the current state of the books query from the cache
      const existingBooks = client.readQuery({
        query: GET_BOOKS,
        variables: { genre: selectedGenre }, // Make sure this matches your query variables
      });

      // Add the new book to the list
      const newBooks = existingBooks.allBooks.concat(data.data.bookAdded);

      // Write the updated list back to the cache
      client.writeQuery({
        query: GET_BOOKS,
        variables: { genre: selectedGenre }, // Make sure this matches your query variables
        data: { allBooks: newBooks },
      });
    }
  })

  // Effect for checking local storage for a token
  useEffect(() => {
    const storedToken = localStorage.getItem('user-token'); // Adjust 'user-token' based on your storage key
    if (storedToken) {
      setToken(storedToken);
    }
  }, []); // Empty dependency array means this effect runs once on mount

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
  // const allGenres = new Set()
  // allBooks.forEach(book => book.genres.forEach(genre => allGenres.add(genre)))
  const allGenres = [...new Set(allBooks.reduce((acc, book) => [...acc, ...book.genres], []))]

  // Function to handle genre selection
  const handleSelectGenre = (genre) => {
    if (genre === selectedGenre) {
      setSelectedGenre(null)
    }
    else {
      setSelectedGenre(genre);
    }
  };

  // Genre buttons with conditional styling based on selection
  const genreButtons = allGenres.map((genre) => (
    <button
      key={genre}
      onClick={() => handleSelectGenre(genre)}
      style={{
        margin: '5px',
        padding: '10px',
        border: selectedGenre === genre ? '3px solid' : '1px solid #ddd',
        backgroundColor: selectedGenre === genre ? '#fafafa' : 'transparent'
      }}
    >
      {genre}
    </button>
  ));

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => {
          setPage('books');
          setSelectedGenre(userData.me.favoriteGenre)
        }}>recommend</button>
        <button onClick={logout}>logout</button>
      </div>

      <Authors show={page === 'authors'} allAuthors={allAuthors} ALL_AUTHORS={ALL_AUTHORS} />

      <Books show={page === 'books'} genre={selectedGenre} />
      <div>{genreButtons}</div>

      <NewBook show={page === 'add'} />
    </div>
  );
};

export default App;
