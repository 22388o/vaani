<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { format } from 'timeago.js'

const commits = ref([])

const meta = ref({
  name: '',
  image: 'QmSsUfeS2EXfe6QJa5G3MYoJXmLhgr7kzUMo9cVJM6wfmq',
  about: '',
  website: ''
})

const page = ref(0)
const showloadmore = ref(true)

import { useRoute } from 'vue-router'

const route = useRoute()

const address = ref(route.params.address)

import { pool } from '@/config.js'

async function fetchCommits(page) {
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
          address: address.value,
          page: page,
          perPage: 9
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

    const commits = response.data.data.getCommitsByAddress

    commits.forEach((commit) => {
      if (commit.type === 'meta') {
        meta.value = commit.data
      }
    })

    return commits.filter((commit) => commit.type === 'post')
  } catch (error) {
    console.error(error)
    return []
  }
}

function scrollbind() {
  fetchCommits(page.value).then((data) => {
    if (data.length > 0) {
      page.value++
      commits.value = commits.value.concat(data)
    } else {
      showloadmore.value = false
    }

    if (data.length < 9) {
      showloadmore.value = false
    }
  })
}

onMounted(() => {
  scrollbind()
})

window.onscroll = function () {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    scrollbind()
  }
}
</script>

<template>
  {{ meta }}

  <div class="w-full px-4 mx-auto lg:w-1/2">
    <div
      class="relative flex flex-col w-full min-w-0 mt-16 mb-6 break-words bg-white rounded-lg shadow-xl"
    >
      <div class="px-6">
        <div class="flex flex-wrap justify-center">
          <div class="flex justify-center w-full px-4">
            <div class="relative">
              <img
                :src="`https://ipfs.io/ipfs/${meta.image}`"
                class="absolute h-auto -m-16 -ml-20 align-middle border-none rounded-full shadow-xl lg:-ml-16 max-w-150-px"
              />
            </div>
          </div>
        </div>
        <div class="mt-12 text-center">
          <h3 class="mb-2 text-xl font-semibold leading-normal text-blueGray-700">
            {{ meta.name || '' }}
          </h3>
          <div class="mt-0 mb-2 text-sm font-bold leading-normal uppercase text-blueGray-400">
            <i class="mr-2 text-lg fas fa-map-marker-alt text-blueGray-400"></i>
            {{ meta.about || '' }}
          </div>
          <div class="mt-10 mb-2 text-blueGray-600">
            <i class="mr-2 text-lg fas fa-briefcase text-blueGray-400"></i>
            Solution Manager - Creative Tim Officer
          </div>
          <div class="mb-2 text-blueGray-600">
            <i class="mr-2 text-lg fas fa-university text-blueGray-400"></i>
            University of Computer Science
          </div>
        </div>
        <div class="py-10 mt-10 text-center border-t border-blueGray-200">
          <div class="flex flex-wrap justify-center">
            <div class="w-full px-4 lg:w-9/12">
              <a :href="`${meta.website}`" class="font-normal text-pink-500">
                {{ meta.website }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
    <div
      v-for="commit in commits"
      :key="commit.signature"
      class="p-5 py-8 text-left transition-transform duration-300 bg-white rounded-md shadow-md cursor-pointer hover:shadow-xl hover:-translate-y-1"
    >
      <RouterLink :to="`/post/${commit.signature}`">
        <div class="mb-4">
          <p class="text-xs font-bold text-gray-500">
            {{ commit.address }} - {{ format(commit.updatedAt) }}
          </p>
          <h1 class="mt-2 mb-4 text-xl font-extrabold text-gray-800">
            {{ commit.data.content || '' }}
          </h1>
        </div>

        <div
          v-if="commit.data.hashtags && commit.data.hashtags.length > 0"
          class="flex flex-wrap mb-4"
        >
          <span
            v-for="hashtag in commit.data.hashtags"
            :key="hashtag"
            class="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded"
          >
            {{ hashtag }}
          </span>
        </div>

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
      </RouterLink>
    </div>
  </div>

  <div class="mt-8 text-center" v-if="showloadmore">
    <button
      @click="scrollbind()"
      class="px-4 py-2 font-semibold text-white transition-colors duration-300 bg-blue-500 rounded-md shadow-md hover:bg-blue-600"
    >
      Load More
    </button>
  </div>
</template>
