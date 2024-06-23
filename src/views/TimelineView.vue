<script setup>
import { onMounted, ref } from 'vue'
import { format } from 'timeago.js'

const commits = ref([])
const page = ref(0)
const showloadmore = ref(true)

import { fetchCommits, randomCommit } from '@/config.js'

function scrollbind() {
  fetchCommits(page.value).then((data) => {
    data = data.filter((commit) => commit.type === 'post')

    if (data.length > 0) {
      page.value++
      commits.value = commits.value.concat(data)
    } else {
      showloadmore.value = false
    }
  })

  randomCommit().then((data) => {
    if (data.length > 0) {
      commits.value = commits.value.concat(data)
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
