<template>
  <div>
    <div class="flex flex-col items-center sm:px-5 md:flex-row">
      <div class="w-full md:w-1/2">
        <div v-if="commit.data.attachments && commit.data.attachments.length > 0">
          <div v-for="attachment in commit.data.attachments" :key="attachment.cid" class="mb-4">
            <img
              v-if="attachment.type === 'image' && attachment.cid"
              :src="`https://ipfs.io/ipfs/${attachment.cid}`"
              alt="Attachment Image"
              class="w-full rounded-lg"
            />
            <img
              v-if="attachment.type === 'image' && attachment.url"
              :src="`${attachment.url}`"
              alt="Attachment Image"
              class="w-full rounded-lg"
            />
          </div>
        </div>
      </div>
      <div
        class="flex flex-col items-start justify-center w-full h-full py-6 mb-6 md:mb-0 md:w-1/2"
      >
        <div
          class="flex flex-col items-start justify-center h-full space-y-3 transform md:pl-10 lg:pl-16 md:space-y-5"
        >
          <div
            v-if="commit.data.hashtags && commit.data.hashtags.length > 0"
            class="flex flex-wrap my-1"
          >
            <span
              v-for="hashtag in commit.data.hashtags"
              :key="hashtag"
              class="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded"
            >
              {{ hashtag }}
            </span>
          </div>

          <h1 class="text-4xl font-bold leading-none lg:text-5xl xl:text-6xl">
            {{ commit.data.content || '' }}
          </h1>
          <p class="pt-2 text-sm font-medium">
            by <RouterLink :to="`/profile/${commit.address}`">{{ commit.address }}</RouterLink> -
            {{ format(commit.createdAt) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import { format } from 'timeago.js'

import axios from 'axios'

import { pool } from '@/config.js'

async function fetchCommit(signature) {
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
          signature: signature
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (response.data.errors) {
      console.error(response.data.errors)
      return []
    }

    return response.data.data.getCommit
  } catch (error) {
    console.error(error)
    return []
  }
}

import { useRoute } from 'vue-router'
const route = useRoute()

const id = route.params.id

const commit = ref({
  commitAt: '',
  data: '',
  address: '',
  publicKey: '',
  signature: '',
  type: '',
  nonce: '',
  createdAt: '',
  updatedAt: ''
})

onMounted(() => {
  fetchCommit(id).then((data) => {
    console.log(data)

    commit.value = data
  })
})
</script>
