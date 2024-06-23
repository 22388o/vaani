import axios from "axios";

const POOL_URL = "https://pool.albertiprotocol.org/graphql";
const PER_PAGE = 3 * 8;

const graphQLRequest = async (query, variables = {}) => {
  try {
    const response = await axios.post(
      POOL_URL,
      {
        query,
        variables,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.errors) {
      console.error("GraphQL errors:", response.data.errors);
      return null;
    }

    return response.data.data;
  } catch (error) {
    console.error("Request failed:", error);
    return null;
  }
};

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
  }`;

  const data = await graphQLRequest(query);
  if (!data || !Array.isArray(data.getRandomCommit)) {
    return [];
  }
  
  return data.getRandomCommit.filter(commit => commit.type === "post");
};

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
  }`;

  const variables = { page, perPage: PER_PAGE };
  const data = await graphQLRequest(query, variables);
  if (!data || !Array.isArray(data.getCommits)) {
    return [];
  }

  return data.getCommits.filter(commit => commit.type === "post");
};

export const fetchCommitBySig = async (signature) => {
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
  }`;

  const variables = { signature };
  const data = await graphQLRequest(query, variables);
  if (!data || !data.getCommit) {
    return [];
  }
  
  return data.getCommit;
};

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
  }`;

  const variables = { address, page, perPage: PER_PAGE };
  const data = await graphQLRequest(query, variables);
  if (!data || !Array.isArray(data.getCommitsByAddress)) {
    return [];
  }

  return data.getCommitsByAddress.filter(commit => commit.type === "post");
};
