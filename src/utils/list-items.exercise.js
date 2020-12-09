import {queryCache, useMutation, useQuery} from 'react-query'
import {client} from 'utils/api-client'

function useListItem(user, bookId) {
  const listItems = useListItems(user)
  const listItem = listItems.find(li => li.bookId === bookId) ?? null
  return listItem
}

function useListItems(user) {
  const {data: listItems} = useQuery({
    queryKey: 'list-items',
    queryFn: () =>
      client('list-items', {token: user.token}).then(data => data.listItems),
  })
  return listItems ?? []
}

const defaultMutationOptions = {
  onSettled: () => queryCache.invalidateQueries('list-items'),
}

function useUpdateListItem({token}, options = {}) {
  const mutationOptions = {...defaultMutationOptions, ...options}
  return useMutation(
    data => client(`list-items/${data.id}`, {method: 'PUT', data, token}),
    mutationOptions,
  )
}

function useRemoveListItem({token}, options = {}) {
  const mutationOptions = {...defaultMutationOptions, ...options}
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
