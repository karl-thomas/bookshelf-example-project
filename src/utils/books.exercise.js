import {queryCache, useQuery} from 'react-query'
import {client} from './api-client'
import bookPlaceholderSvg from 'assets/book-placeholder.svg'

const loadingBook = {
  title: 'Loading...',
  author: 'loading...',
  coverImageUrl: bookPlaceholderSvg,
  publisher: 'Loading Publishing',
  synopsis: 'Loading...',
  loadingBook: true,
}

const loadingBooks = Array.from({length: 10}, (v, index) => ({
  id: `loading-book-${index}`,
  ...loadingBook,
}))

const setQueryDataForBook = book =>
  queryCache.setQueryData(['book', {bookId: book.id}], book)

const setQueryDataForBooks = books => books.forEach(setQueryDataForBook)

function getBookSearchQueryConfig(query, {token}) {
  return {
    queryKey: ['bookSearch', {query}],
    queryFn: () =>
      client(`books?query=${encodeURIComponent('')}`, {token}).then(
        data => data.books,
      ),
    config: {
      onSuccess: setQueryDataForBooks,
    },
  }
}

function useBookSearch(query, user) {
  const result = useQuery(getBookSearchQueryConfig(query, user))
  return {...result, books: result.data ?? loadingBooks}
}

function useBook(bookId, {token}) {
  const {data} = useQuery({
    queryKey: ['book', {bookId}],
    queryFn: () => client(`books/${bookId}`, {token}).then(data => data.book),
  })
  return data ?? loadingBook
}

async function refetchBookSearchQuery(user) {
  queryCache.removeQueries('bookSearch')
  await queryCache.prefetchQuery(getBookSearchQueryConfig('', user))
}

export {
  useBook,
  useBookSearch,
  refetchBookSearchQuery,
  setQueryDataForBook,
  setQueryDataForBooks,
}
