<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getServerInfo } from '@/config.js'

const router = useRouter()

const serverData = ref({
  difficulty: 0,
  currentTime: '2024-06-23T05:53:45.740Z',
  totalEntries: 0,
  totalAddresses: 0,
  oldestEntryDate: '2024-06-23T02:33:45.581Z'
})

const pool = ref(localStorage.getItem('pool'))

const fetchServerInfo = async () => {
  try {
    const data = await getServerInfo(pool.value)
    if (data) {
      serverData.value = data
    } else {
      console.error('Failed to fetch server info')
    }
  } catch (error) {
    console.error('Error fetching server info:', error)
  }
}

const connect = async (event) => {
  event.preventDefault()
  localStorage.setItem('pool', pool.value)
  await fetchServerInfo()
  router.push('/timeline')
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen px-4">
    <div class="w-full mb-12 lg:w-1/2">
      <div class="lg:max-w-md">
        <div class="max-w-md py-10 mx-auto text-center">
          <div v-if="Object.keys(serverData).length > 0 && serverData.difficulty > 0">
            <h3 class="mb-4 text-2xl font-bold uppercase font-heading">Server Data</h3>
            <p>Current Time: {{ serverData.currentTime }}</p>
            <p>Total Entries: {{ serverData.totalEntries }}</p>
            <p>Total Addresses: {{ serverData.totalAddresses }}</p>
            <p>Oldest Entry Date: {{ serverData.oldestEntryDate }}</p>
            <p>Current Difficulty: {{ serverData.difficulty }}</p>
            <p>Server Status: {{ serverData.difficulty > 1 ? 'High' : 'Low' }}</p>
          </div>

          <h3 class="mb-8 text-2xl font-bold uppercase font-heading">Connect To Pool</h3>
          <input
            class="w-full py-3 pl-3 mb-4 bg-white border rounded-lg"
            type="text"
            v-model="pool"
          />
          <button
            @click="fetchServerInfo"
            class="inline-block w-full px-6 py-3 mb-4 text-sm font-bold leading-loose text-white transition duration-200 bg-gray-500 rounded hover:bg-gray-600"
          >
            Fetch
          </button>
          <button
            @click="connect"
            v-if="serverData.difficulty > 1"
            type="submit"
            class="inline-block w-full px-6 py-3 mb-4 text-sm font-bold leading-loose text-white transition duration-200 bg-gray-500 rounded hover:bg-gray-600"
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
