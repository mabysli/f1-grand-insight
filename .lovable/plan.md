# Atualização visual e dos gráficos F1

## Entrega
- Expandir o painel para aproveitar toda a largura disponível, mantendo margens responsivas em telas menores.
- Trocar Orbitron/Inter por uma combinação mais legível e esportiva em títulos e textos.
- Restaurar a progressão de pontos com os dados disponíveis da temporada, evitando o gráfico vazio.
- Exibir imagem em todos os circuitos: usar primeiro a imagem fornecida pela API e manter os arquivos locais como alternativa.
- Completar o Race Position Chart com os 20 pilotos, preservando os dados existentes e gerando apenas as séries simuladas ausentes.

## Detalhes técnicos
- Propagar a URL de imagem do circuito pelo modelo de dados e pelo cartão de circuito.
- Reaproveitar a progressão estática validada para 2024; para temporadas sem histórico por etapa, criar uma progressão acumulada coerente até a pontuação final e identificá-la como estimativa.
- Completar as séries volta a volta de forma determinística para os pilotos ausentes, sem chamadas adicionais à API paga.
- Atualizar os tokens tipográficos e o carregamento das fontes no documento.
- Validar compilação e a apresentação em desktop e celular.
