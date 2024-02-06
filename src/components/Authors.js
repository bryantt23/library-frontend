import { useState } from 'react';
import { useMutation, gql } from '@apollo/client'

const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo){
      name
      born
      id
      bookCount
    }
  }`

const Authors = ({ show, allAuthors, ALL_AUTHORS }) => {
  const [selectedAuthor, setSelectedAuthor] = useState(null)
  const [updatedBirthYear, setUpdatedBirthYear] = useState("")

  const [editAuthor] = useMutation(EDIT_AUTHOR, { refetchQueries: [{ query: ALL_AUTHORS }] })

  if (!show) {
    return null
  }
  const authors = allAuthors

  const submitUpdatedBirthYear = async (event) => {
    event.preventDefault();
    if (updatedBirthYear) {
      await editAuthor({
        variables: {
          name: selectedAuthor,
          setBornTo: parseInt(updatedBirthYear)
        }
      })
      setUpdatedBirthYear("")
    }
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name} onClick={() => setSelectedAuthor(a.name)}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Set birth year</h2>
      {
        selectedAuthor && <div>
          <p>{selectedAuthor}</p>
          <form onSubmit={submitUpdatedBirthYear}>
            <input type="number" onChange={e => setUpdatedBirthYear(e.target.value)}></input>
            <input type="submit" value="update author" />
          </form>
        </div>
      }
    </div>
  )
}

export default Authors
