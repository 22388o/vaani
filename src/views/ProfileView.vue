<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import { format } from "timeago.js";

const commits = ref([]);

const meta = ref({
  name: "",
  image: "QmSsUfeS2EXfe6QJa5G3MYoJXmLhgr7kzUMo9cVJM6wfmq",
  about: "",
  website: "",
});

const page = ref(0);

const showloadmore = ref(true);

import { useRoute } from "vue-router";

const route = useRoute();

const address = ref(route.params.address);

import { fetchCommitsByAddress } from "@/config.js";

function scrollbind() {
  fetchCommitsByAddress(address.value, page.value).then((data) => {
    if (data.length > 0) {
      page.value++;
      commits.value = commits.value.concat(data);
    } else {
      showloadmore.value = false;
    }
  });
}

onMounted(() => {
  scrollbind();
});

window.onscroll = function () {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    scrollbind();
  }
};
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
        <div
          v-if="meta.hashtags && meta.hashtags.length > 0"
          class="flex flex-wrap my-1"
        >
          <span
            v-for="hashtag in meta.hashtags"
            :key="hashtag"
            class="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded"
          >
            {{ hashtag }}
          </span>
        </div>

        <h1
          class="mb-6 text-5xl font-black tracking-tight text-gray-900 font-heading lg:text-6xl"
        >
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
            {{ commit.data.content || "" }}
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

        <div
          v-if="commit.data.attachments && commit.data.attachments.length > 0"
        >
          <div
            v-for="attachment in commit.data.attachments"
            :key="attachment.cid"
            class="mb-4"
          >
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

  {{ meta }}
</template>
