<script setup>
import { ref } from 'vue'
import { uploadFile } from '../services/Hit_Axios'
import ModalComponent from '../lib/Result.vue'

const taxonomies = [
  'C1 (Mengenal)',
  'C2 (Memahami)',
  'C3 (Menerapkan)',
  'C4 (Menganalisi)',
  'C5 (Menyintesis)',
  'C6 (Mengevaluasi)',
]

const selectedTaxonomy = ref([])
const selectedFile = ref(null)
const selectedNumber = ref()
const isLoading = ref(false)
const error = ref('')
const responseMessage = ref('')
const responseTime = ref('')
const isModalOpen = ref(false)

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file && file.type === 'application/pdf') {
    selectedFile.value = file
    error.value = ''
  } else {
    selectedFile.value = null
    error.value = 'Please select a valid PDF file.'
  }
}

const handleSubmit = async () => {
  if (!selectedFile.value) {
    error.value = 'Please upload a file before submitting.'
    return
  }

  isLoading.value = true
  error.value = ''
  responseMessage.value = ''
  responseTime.value = ''

  try {
    const response = await uploadFile(
      selectedFile.value,
      selectedTaxonomy.value,
      selectedNumber.value,
    )

    responseMessage.value = response.questions
    responseTime.value = response.generating_time

    isModalOpen.value = true
  } catch (err) {
    error.value = err
  } finally {
    isLoading.value = false
  }
}

const closeModal = () => {
  isModalOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-base-200 flex flex-col items-center justify-center">
    <img
      src="../../public/Logo.png"
      alt="SMP Nusaputera"
      class="w-64 h-64 block mx-auto bg-transparent"
    />
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl font-bold text-center mb-4">Essay Questions Generator</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-control">
            <label class="label" for="pdfUpload">
              <span class="label-text">Upload Modul Ajar</span>
            </label>
            <input
              id="pdfUpload"
              type="file"
              accept=".pdf"
              @change="handleFileChange"
              class="file-input file-input-bordered file-input-primary w-full max-w-xs"
              required
            />
            <p v-if="selectedFile" class="mt-2 text-sm text-gray-600">
              Selected file: {{ selectedFile.name }}
            </p>
          </div>

          <div class="form-control mt-4">
            <label class="label">
              <span class="label-text">Jumlah Soal</span>
            </label>

            <input
              type="number"
              v-model="selectedNumber"
              @input="handleInput"
              class="input input-bordered w-full"
              placeholder="Masukkan jumlah soal"
            />
          </div>

          <div class="form-control mt-4">
            <label class="label">
              <span class="label-text">Pilih Taksonomi</span>
            </label>

            <div class="rounded-lg p-3">
              <div v-for="taxonomy in taxonomies" :key="taxonomy" class="form-control">
                <label class="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    :value="taxonomy"
                    v-model="selectedTaxonomy"
                    class="checkbox checkbox-primary"
                  />
                  <span class="label-text">{{ taxonomy }}</span>
                </label>
              </div>
            </div>
          </div>

          <div class="form-control mt-6">
            <button type="submit" class="btn btn-primary" :disabled="isLoading">
              <span v-if="isLoading" class="loading loading-dots loading-md"></span>
              <span v-else>Generate Soal</span>
            </button>
          </div>
        </form>

        <div v-if="error" class="alert alert-error mt-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{{ error }}</span>
        </div>
      </div>
    </div>
  </div>

  <ModalComponent
    :isOpen="isModalOpen"
    :message="responseMessage"
    :time="responseTime"
    @close="closeModal"
  />
</template>
