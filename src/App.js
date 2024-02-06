import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { gql, useQuery } from '@apollo/client'

const ALL_AUTHORS = gql`
  query {
    allAuthors {
        name
        born
        bookCount
    }
  }
`
const ALL_BOOKS = gql`
  query  {
    allBooks {
      title
      author
      published
    }
  }
`

const App = () => {
  const [page, setPage] = useState('authors')
  const { loading, error, data: allAuthorsData } = useQuery(ALL_AUTHORS);
  const { loading, error, data: allBooksData } = useQuery(ALL_BOOKS);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const allAuthors = allAuthorsData.allAuthors;
  const allBooks = allBooksData.allBooks;

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Authors show={page === 'authors'} allAuthors={allAuthors} />

      <Books show={page === 'books'} allBooks={allBooks} />

      <NewBook show={page === 'add'} />
    </div>
  )
}

export default App
