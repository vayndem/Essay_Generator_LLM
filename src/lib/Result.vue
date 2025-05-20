<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable no-unused-vars -->
<script setup>
import { computed } from 'vue'
import { jsPDF } from 'jspdf'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
})

const formattedTime = computed(() => {
  return parseFloat(props.time).toFixed(2)
})

const formattedMessage = computed(() => {
  return props.message.replace(/\*/g, '').replace(/\n/g, '<br>')
})

const formattedHTML = computed(() => {
  return props.message.replace(/\*/g, '').replace(/\n/g, '\n')
})

const emit = defineEmits(['close'])

const exportPDF = () => {
  const pdf = new jsPDF()

  pdf.setFont('Times New Roman', 'bold')
  pdf.setFontSize(14)
  const pageWidth = pdf.internal.pageSize.width
  const pageHeight = pdf.internal.pageSize.height
  const margin = 20
  const lineHeight = 7
  const title = 'Hasil Soal Uraian'
  const titleWidth = pdf.getTextWidth(title)
  const centerX = (pageWidth - titleWidth) / 2
  let currentY = margin

  // Judul
  pdf.text(title, centerX, currentY)
  currentY += 20

  pdf.setFont('Times New Roman', 'normal')
  pdf.setFontSize(12)

  // Split text biar otomatis wrap ke maxWidth
  const lines = pdf.splitTextToSize(formattedHTML.value, pageWidth - 2 * margin)

  lines.forEach((line) => {
    if (currentY + lineHeight > pageHeight - margin) {
      pdf.addPage()
      currentY = margin
    }
    pdf.text(line, margin, currentY)
    currentY += lineHeight
  })

  pdf.save('Hasil Soal.pdf')
}
</script>

<template>
  <div :class="['modal', props.isOpen ? 'modal-open' : '']">
    <div class="modal-box">
      <h3 class="text-lg font-bold">Hasil Soal Uraian</h3>
      <p id="formattedMessage" class="py-4" v-html="formattedMessage"></p>
      <p class="py-4 font-bold">Time Consume</p>
      <form method="dialog" class="flex justify-between">
        <button class="btn">{{ formattedTime }} Detik</button>
        <button type="button" class="btn btn-primary" @click="exportPDF">Download As PDF</button>
      </form>
    </div>

    <form method="dialog" class="modal-backdrop" @click="$emit('close')">
      <button>close</button>
    </form>
  </div>
</template>
