<script setup lang='ts'>
const { tentativas, adicionarLetra, removerLetra, enviarPalavra } = useTentativas()
const { teclas, chamarTecla, atualizarCores } = useTeclado()

async function lidarComTecla(key: string) {
  if (key === 'Enviar') {
    const resultado = await enviarPalavra()
    if (resultado) atualizarCores(resultado)
  } else {
    chamarTecla(key, adicionarLetra, removerLetra, () => {})
  }
}

onMounted(async () => {
  await $fetch('http://localhost:5000/word/start', {
    credentials: 'include',
    server: true // executa no servidor, uma única vez
  })
})
</script>

<template>
  <div class="flex flex-col">
    <div
      id="jogo"
      class="flex gap-2 flex-col justify-center items-center max-w-2xl mx-auto my-1 mb-4"
    >
      <div
        v-for="(tentativa, i) in tentativas"
        :key="i"
        class="flex gap-2"
      >
        <UBadge
          v-for="letra in tentativa.status"
          :key="i + letra.letter"
          :color="letra.result"
          size="xl"
          class="size-14 text-xl justify-center font-black uppercase"
        >
          {{ letra.letter }}
        </UBadge>
      </div>
    </div>

    <div
      id="teclado"
      class="flex gap-2 flex-wrap justify-center items-center max-w-2xl mx-auto mb-4"
    >
      <UButton
        v-for="tecla in teclas"
        :key="tecla.key"
        variant="subtle"
        :label="tecla.key.toUpperCase()"
        :color="tecla.estado"
        size="xl"
        class="h-13 min-w-13 text-xl justify-center font-black uppercase"
        @click="lidarComTecla(tecla.key)"
      />
    </div>
  </div>
</template>
