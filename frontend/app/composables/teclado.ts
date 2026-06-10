export const useTeclado = () => {
  interface Tecla {
    key: string
    estado: 'neutral' | 'error' | 'success' | 'warning'
  }

  const teclas = ref<Tecla[]>([
    { key: 'a', estado: 'neutral' },
    { key: 'b', estado: 'neutral' },
    { key: 'c', estado: 'neutral' },
    { key: 'd', estado: 'neutral' },
    { key: 'e', estado: 'neutral' },
    { key: 'f', estado: 'neutral' },
    { key: 'g', estado: 'neutral' },
    { key: 'h', estado: 'neutral' },
    { key: 'i', estado: 'neutral' },
    { key: 'j', estado: 'neutral' },
    { key: 'k', estado: 'neutral' },
    { key: 'l', estado: 'neutral' },
    { key: 'm', estado: 'neutral' },
    { key: 'n', estado: 'neutral' },
    { key: 'o', estado: 'neutral' },
    { key: 'p', estado: 'neutral' },
    { key: 'q', estado: 'neutral' },
    { key: 'r', estado: 'neutral' },
    { key: 's', estado: 'neutral' },
    { key: 't', estado: 'neutral' },
    { key: 'u', estado: 'neutral' },
    { key: 'v', estado: 'neutral' },
    { key: 'w', estado: 'neutral' },
    { key: 'x', estado: 'neutral' },
    { key: 'y', estado: 'neutral' },
    { key: 'z', estado: 'neutral' },
    { key: 'Apagar', estado: 'neutral' },
    { key: 'Enviar', estado: 'neutral' }
  ])

  function chamarTecla(
    key: string,
    adicionarLetra: (l: string) => void,
    removerLetra: () => void,
    enviarPalavra: () => void
  ) {
    if (key === 'Apagar') {
      removerLetra()
    } else if (key === 'Enviar') {
      enviarPalavra()
    } else {
      adicionarLetra(key)
    }
  }

  function atualizarCores(novasLetras: { letter: string, result: 'success' | 'warning' | 'error' | 'neutral' }[]) {
    for (const { letter, result } of novasLetras) {
      const tecla = teclas.value.find(t => t.key === letter.toLowerCase())
      if (!tecla) continue

      const prioridade: Record<string, number> = {
        success: 3,
        warning: 2,
        error: 1,
        neutral: 0
      }

      if ((prioridade[result] ?? -1) > (prioridade[tecla.estado] ?? -1)) {
        tecla.estado = result
      }
    }
  }

  return {
    teclas,
    chamarTecla,
    atualizarCores
  }
}
