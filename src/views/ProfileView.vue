<script setup>
import { onMounted, ref } from 'vue'
import { format } from 'timeago.js'
import { useRoute } from 'vue-router'
import { fetchCommitsByAddress } from '@/config.js'

const commits = ref([])
const meta = ref({
  hashtags: ['dummy'],
  name: 'Mr. Aberti',
  image: 'QmSsUfeS2EXfe6QJa5G3MYoJXmLhgr7kzUMo9cVJM6wfmq',
  about: 'Not Set !',
  website: '',
  updatedAt: 0
})
const page = ref(0)
const showloadmore = ref(true)
const route = useRoute()
const address = ref(route.params.address)

function scrollbind() {
  fetchCommitsByAddress(address.value, page.value).then((data) => {
    if (data.length > 0) {
      data.forEach((datax) => {
        if (datax.type === 'meta') {
          if (datax.updatedAt > meta.value.updatedAt) {
            meta.value = datax.data
            meta.value.updatedAt = datax.updatedAt
          }
        }
        if (datax.type === 'post') {
          commits.value.push(datax)
        }
      })

      page.value++
    } else {
      showloadmore.value = false
    }
  })

  commits.value = commits.value.filter(
    (commit, index, self) => index === self.findIndex((t) => t.signature === commit.signature)
  )
}

onMounted(() => {
  scrollbind()
})

window.onscroll = function () {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    scrollbind()
  }
}

import posts from '@/components/posts.vue'
</script>

<template>
  <div class="flex flex-wrap py-20">
    <div class="w-full lg:w-1/2">
      <img
        class="transition duration-500 transform hover:-translate-y-2"
        :src="`https://ipfs.io/ipfs/${meta.image}`"
        alt=""
      />
    </div>
    <div class="w-full lg:w-1/2">
      <div class="p-10 mx-auto text-left">
        <div v-if="meta.hashtags && meta.hashtags.length > 0" class="flex flex-wrap my-1">
          <span
            v-for="hashtag in meta.hashtags"
            :key="hashtag"
            class="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded"
          >
            {{ hashtag }}
          </span>
        </div>

        <h1 class="mb-6 text-5xl font-black tracking-tight text-gray-900 font-heading lg:text-6xl">
          {{ meta.name }}
        </h1>
        <p class="mb-8 text-xl font-bold">
          {{ meta.about }}
        </p>

        <div class="flex items-center space-x-4">
          <a
            v-if="meta.website"
            :href="meta.website"
            target="_blank"
            class="px-4 py-2 font-semibold text-white transition-colors duration-300 bg-blue-500 rounded-md shadow-md hover:bg-blue-600"
          >
            Visit Website
          </a>
        </div>
      </div>
    </div>
  </div>

  <posts :commits="commits" />

  <div class="mt-8 text-center" v-if="showloadmore">
    <button
      @click="scrollbind()"
      class="px-4 py-2 font-semibold text-white transition-colors duration-300 bg-blue-500 rounded-md shadow-md hover:bg-blue-600"
    >
      Load More
    </button>
  </div>
</template>
