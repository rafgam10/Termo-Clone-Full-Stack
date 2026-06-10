export const useTentativas = () => {
  interface letra {
    letter: string
    result: 'success' | 'warning' | 'neutral' | 'error'
  }

  interface Tentativa {
    status: letra[]
    won: boolean
  }

  function criarVazia(): Tentativa {
    return {
      status: [
        { letter: '', result: 'neutral' },
        { letter: '', result: 'neutral' },
        { letter: '', result: 'neutral' },
        { letter: '', result: 'neutral' },
        { letter: '', result: 'neutral' }
      ],
      won: false
    }
  }

  const tentativas = ref<Tentativa[]>(
    Array.from({ length: 6 }, () => criarVazia())
  )

  const tentativaAtual = ref(0)
  const acabou = ref(false)

  function adicionarLetra(letra: string) {
    if (acabou.value) return
    const linha = tentativas.value[tentativaAtual.value]!.status
    const pos = linha.findIndex(l => l.letter === '')
    if (pos !== -1) linha[pos]!.letter = letra.toUpperCase()
  }

  function removerLetra() {
    if (acabou.value) return
    const linha = tentativas.value[tentativaAtual.value]!.status
    for (let i = linha.length - 1; i >= 0; i--) {
      if (linha[i]!.letter !== '') {
        linha[i]!.letter = ''
        break
      }
    }
  }

  function getPalavraAtual(): string {
    return tentativas.value[tentativaAtual.value]!.status
      .map(l => l.letter).join('')
  }

  async function enviarPalavra(): Promise<letra[] | null> {
    if (acabou.value) return null
    if (getPalavraAtual().length !== 5) return null

    try {
      const resposta: any = await $fetch('http://localhost:5000/word/check', {
        method: 'POST',
        credentials: 'include',
        body: { word: getPalavraAtual() }
      })

      const status = resposta.status.map((s: any) => ({
        letter: s.letter.toUpperCase(),
        result: s.result === 'sucess' ? 'success' as const : s.result
      }))

      tentativas.value[tentativaAtual.value] = {
        status,
        won: resposta.won
      }

      acabou.value = resposta.won
      tentativaAtual.value++

      if (tentativaAtual.value >= 6) acabou.value = true

      return status
    } catch {
      return null
    }
  }

  return {
    tentativas,
    tentativaAtual,
    acabou,
    adicionarLetra,
    removerLetra,
    enviarPalavra
  }
}
