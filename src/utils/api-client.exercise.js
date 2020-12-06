function client(endpoint, customConfig = {}) {
  const config = {method: 'GET', ...customConfig}
  return window
    .fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`, config)
    .then(async res => {
      const data = await res.json()
      if (res.ok) return data
      else return Promise.reject(data)
    })
}

export {client}
