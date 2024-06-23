export const pool = "https://pool.albertiprotocol.org/graphql";

const perPage = 3 * 8;

import axios from "axios";

export async function randomCommit() {
  try {
    const response = await axios.post(
      pool,
      {
        query: `query GetRandomCommit {
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
  }`,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.errors) {
      console.error(response.data.errors);
      return [];
    }

    const commits = response.data.data.getRandomCommit;
    return commits.filter((commit) => commit.type === "post");
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchCommits(page) {
  try {
    const response = await axios.post(
      pool,
      {
        query: `query GetCommits($page: Int!, $perPage: Int!) {
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
          }`,
        variables: {
          page: page,
          perPage: perPage,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.errors) {
      console.error(response.data.errors);
      return [];
    }

    const commits = response.data.data.getCommits;
    return commits.filter((commit) => commit.type === "post");
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchCommitBySig(signature) {
  try {
    const response = await axios.post(
      pool,
      {
        query: `query GetCommit($signature: String!) {
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
  }
  `,
        variables: {
          signature: signature,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.errors) {
      console.error(response.data.errors);
      return [];
    }

    return response.data.data.getCommit;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchCommitsByAddress(address, page) {
  try {
    const response = await axios.post(
      pool,
      {
        query: `
          query GetCommitsByAddress($address: String!, $page: Int!, $perPage: Int!) {
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
  }
  
  `,
        variables: {
          address: address,
          page: page,
          perPage: perPage,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.errors) {
      console.error(response.data.errors);
      return [];
    }

    const commits = response.data.data.getCommitsByAddress;

    commits.forEach((commit) => {
      if (commit.type === "meta") {
        meta.value = commit.data;
      }
    });

    return commits.filter((commit) => commit.type === "post");
  } catch (error) {
    console.error(error);
    return [];
  }
}
