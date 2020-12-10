import {queryCache, useMutation, useQuery} from 'react-query'
import {client} from 'utils/api-client'
import {setQueryDataForBook} from './books.extra-6'

function useListItem(user, bookId) {
  const listItems = useListItems(user)
  const listItem = listItems.find(li => li.bookId === bookId) ?? null
  console.log(listItem)
  return listItem
}

function useListItems(user) {
  const {data: listItems} = useQuery({
    queryKey: 'list-items',
    queryFn: () =>
      client('list-items', {token: user.token}).then(data => data.listItems),
    config: {
      onSuccess: listItems => {
        for (const listItem of listItems) {
          setQueryDataForBook(listItem.book)
        }
      },
    },
  })
  return listItems ?? []
}

const defaultMutationOptions = {
  onError: (err, variables, recover) =>
    typeof recover === 'function' ? recover() : null,
  onSettled: () => queryCache.invalidateQueries('list-items'),
}

function useUpdateListItem({token}, options = {}) {
  const mutationOptions = {
    onMutate(newItem) {
      const previousItems = queryCache.getQueryData('list-items')

      queryCache.setQueryData('list-items', old =>
        old.map(item =>
          item.id === newItem.id ? {...item, ...newItem} : item,
        ),
      )

      return () => queryCache.setQueryData('list-items', previousItems)
    },
    ...defaultMutationOptions,
    ...options,
  }

  return useMutation(
    data => client(`list-items/${data.id}`, {method: 'PUT', data, token}),
    mutationOptions,
  )
}

function useRemoveListItem({token}, options = {}) {
  const mutationOptions = {
    onMutate(removedItem) {
      const previousItems = queryCache.getQueryData('list-items')

      queryCache.setQueryData('list-items', old => {
        return old.filter(item => item.id !== removedItem.id)
      })

      return () => queryCache.setQueryData('list-items', previousItems)
    },
    ...defaultMutationOptions,
    ...options,
  }

  return useMutation(
    ({id}) => client(`list-items/${id}`, {method: 'DELETE', token}),
    mutationOptions,
  )
}

function useCreateListItem({token}, options = {}) {
  const mutationOptions = {...defaultMutationOptions, ...options}
  return useMutation(
    ({bookId}) => client(`list-items`, {data: {bookId}, token}),
    mutationOptions,
  )
}

export {
  useListItem,
  useListItems,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
}
