import axios from 'axios'

const POOL_URL = localStorage.getItem('pool')
const PER_PAGE = 3 * 8

const graphQLRequest = async (query, variables = {}) => {
  try {
    const response = await axios.post(
      POOL_URL,
      {
        query,
        variables
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (response.data.errors) {
      console.error('GraphQL errors:', response.data.errors)
      return null
    }

    return response.data.data
  } catch (error) {
    console.error('Request failed:', error)
    return null
  }
}

export const randomCommit = async () => {
  const query = `query GetRandomCommit {
    getRandomCommit {
      commitAt
      data
      address
      publicKey
      signature
      type
      nonce
      createdAt
      updatedAt
    }
  }`

  const data = await graphQLRequest(query)

  if (data.getRandomCommit.type === 'post') {
    return data.getRandomCommit
  } else {
    return []
  }
}

export const fetchCommits = async (page) => {
  const query = `query GetCommits($page: Int!, $perPage: Int!) {
    getCommits(page: $page, perPage: $perPage) {
      commitAt
      data 
      address
      publicKey
      signature
      type
      nonce
      createdAt
      updatedAt
    }
  }`

  const variables = { page, perPage: PER_PAGE }
  const data = await graphQLRequest(query, variables)
  if (!data || !Array.isArray(data.getCommits)) {
    return []
  }

  return data.getCommits.filter((commit) => commit.type === 'post')
}

export const commitbySignature = async (signature) => {
  const query = `query GetCommit($signature: String!) {
    getCommit(signature: $signature) {
      commitAt
      data
      address
      publicKey
      signature
      type
      nonce
      createdAt
      updatedAt
    }
  }`

  const variables = { signature }

  const data = await graphQLRequest(query, variables)

  if (!data) {
    console.error('No data returned from GraphQL request')
    return null
  }

  return data.getCommit
}

export const fetchCommitsByAddress = async (address, page) => {
  const query = `query GetCommitsByAddress($address: String!, $page: Int!, $perPage: Int!) {
    getCommitsByAddress(address: $address, page: $page, perPage: $perPage) {
      commitAt
      data
      address
      publicKey
      signature
      type
      nonce
      createdAt
      updatedAt
    }
  }`

  const variables = { address, page, perPage: PER_PAGE }
  const data = await graphQLRequest(query, variables)
  if (!data || !Array.isArray(data.getCommitsByAddress)) {
    return []
  }

  return data.getCommitsByAddress.filter((commit) => commit.type === 'post')
}

export const getServerInfo = async () => {
  const query = `query GetServerInfo {
    getServerInfo {
      difficulty
      currentTime
      totalEntries
      totalAddresses
      oldestEntryDate
    }
  }`

  // Call the graphQLRequest function with the query
  const data = await graphQLRequest(query)

  return data.getServerInfo // Return the specific data you need
}
