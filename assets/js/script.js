const CHAVE_STORAGE = 'pokepoint:receitas';
const CHAVE_MENSAGEM = 'pokepoint:mensagem';
const PAGINA = document.body.dataset.pagina;
const CAMINHOS = PAGINA === 'lista'
  ? { detalhes: 'pages/detalhes.html', cadastro: 'pages/cadastro.html', lista: 'index.html', imagens: 'assets/img/' }
  : { detalhes: 'detalhes.html', cadastro: 'cadastro.html', lista: '../index.html', imagens: '../assets/img/' };

const ROTULOS = {
  categoria: {
    sushi: 'Sushi',
    poke: 'Poke',
    temaki: 'Temaki',
    quente: 'Prato quente',
    entrada: 'Entrada',
    sobremesa: 'Sobremesa'
  },
  dificuldade: { facil: 'Fácil', media: 'Média', dificil: 'Difícil' },
  status: { 'em-teste': 'Em teste', 'no-cardapio': 'No cardápio', descontinuado: 'Descontinuado' }
};

const CLASSE_STATUS = {
  'em-teste': 'selo-teste',
  'no-cardapio': 'selo-cardapio',
  descontinuado: 'selo-descontinuado'
};

const RECEITAS_INICIAIS = [
  {
    id: 1,
    nome: 'Poke de salmão',
    categoria: 'poke',
    imagem: '',
    ingredientes: [
      '150 g de salmão fresco em cubos',
      '1 xícara de arroz japonês cozido',
      '1/2 pepino em fatias finas',
      '1/2 manga em cubos',
      '2 colheres de molho shoyu',
      '1 colher de gergelim torrado'
    ],
    modoPreparo: 'Tempere o salmão com shoyu e gergelim.\nMonte a base com o arroz japonês na tigela.\nDistribua o pepino, a manga e o salmão sobre o arroz.\nFinalize com gergelim e sirva imediatamente.',
    tempo: 15,
    custo: 14.5,
    dificuldade: 'facil',
    avaliacao: 4.8,
    status: 'no-cardapio',
    destaque: true
  },
  {
    id: 2,
    nome: 'Hot roll de salmão',
    categoria: 'sushi',
    imagem: '',
    ingredientes: [
      '2 folhas de nori',
      '1 xícara de arroz de sushi',
      '100 g de salmão em tiras',
      '50 g de cream cheese',
      '1 xícara de farinha panko'
    ],
    modoPreparo: 'Monte o uramaki com arroz, salmão e cream cheese.\nEmpane no panko.\nFrite em óleo quente até dourar e corte em 8 peças.',
    tempo: 25,
    custo: 11.2,
    dificuldade: 'media',
    avaliacao: 4.6,
    status: 'no-cardapio',
    destaque: false
  },
  {
    id: 3,
    nome: 'Temaki de atum',
    categoria: 'temaki',
    imagem: '',
    ingredientes: [
      '1 folha de nori',
      '1/2 xícara de arroz de sushi',
      '80 g de atum fresco',
      '1/2 pepino em tiras',
      '1 colher de maionese japonesa'
    ],
    modoPreparo: 'Abra a folha de nori e espalhe o arroz.\nAdicione o atum, o pepino e a maionese.\nEnrole em formato de cone e sirva na hora.',
    tempo: 10,
    custo: 9.8,
    dificuldade: 'facil',
    avaliacao: 4.4,
    status: 'no-cardapio',
    destaque: false
  },
  {
    id: 4,
    nome: 'Yakisoba misto',
    categoria: 'quente',
    imagem: '',
    ingredientes: [
      '250 g de macarrão para yakisoba',
      '100 g de frango em tiras',
      '100 g de carne em tiras',
      '1 xícara de repolho e cenoura',
      '3 colheres de molho shoyu'
    ],
    modoPreparo: 'Salteie as carnes em fogo alto.\nAcrescente os legumes e o macarrão cozido.\nTempere com shoyu e misture por 2 minutos.',
    tempo: 30,
    custo: 12,
    dificuldade: 'media',
    avaliacao: 4.2,
    status: 'no-cardapio',
    destaque: false
  },
  {
    id: 5,
    nome: 'Uramaki skin crocante',
    categoria: 'sushi',
    imagem: '',
    ingredientes: [
      '2 folhas de nori',
      '1 xícara de arroz de sushi',
      'Pele de salmão assada e crocante',
      '1/2 pepino',
      '1 colher de molho tarê'
    ],
    modoPreparo: 'Asse a pele de salmão até ficar crocante.\nMonte o uramaki com arroz, pepino e a pele.\nCorte em 8 peças e finalize com molho tarê.',
    tempo: 35,
    custo: 10.4,
    dificuldade: 'dificil',
    avaliacao: 4,
    status: 'em-teste',
    destaque: false
  },
  {
    id: 6,
    nome: 'Mochi de morango',
    categoria: 'sobremesa',
    imagem: '',
    ingredientes: [
      '1 xícara de farinha de arroz glutinoso',
      '1/2 xícara de açúcar',
      '1 xícara de água',
      '6 morangos pequenos',
      '200 g de pasta de feijão doce'
    ],
    modoPreparo: 'Misture a farinha, o açúcar e a água e cozinhe no micro-ondas.\nAbra a massa sobre amido de milho.\nEnvolva o morango com a pasta de feijão e feche com a massa.',
    tempo: 40,
    custo: 6.9,
    dificuldade: 'dificil',
    avaliacao: 3.9,
    status: 'descontinuado',
    destaque: false
  }
];


function salvarReceitas(receitas) {
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(receitas));
}

function carregarReceitas() {
  const texto = localStorage.getItem(CHAVE_STORAGE);

  if (texto === null) {
    salvarReceitas(RECEITAS_INICIAIS);
    return [...RECEITAS_INICIAIS];
  }

  try {
    const dados = JSON.parse(texto);
    return Array.isArray(dados) ? dados : [];
  } catch (erro) {
    console.error('Os dados salvos estão inválidos:', erro);
    return [];
  }
}

function gerarId(receitas) {
  let maior = 0;
  for (const receita of receitas) {
    if (receita.id > maior) {
      maior = receita.id;
    }
  }
  return maior + 1;
}

function buscarReceitaPorId(id) {
  return carregarReceitas().find((receita) => receita.id === id);
}

function obterIdDaUrl() {
  const valor = new URLSearchParams(window.location.search).get('id');
  const id = Number(valor);
  return valor !== null && Number.isInteger(id) ? id : null;
}

function formatarMoeda(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarNota(nota) {
  if (nota === null || nota === undefined) {
    return '—';
  }
  return Number(nota).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function normalizarTexto(texto) {
  return String(texto).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function criarElemento(tag, opcoes = {}, filhos = []) {
  const elemento = document.createElement(tag);
  if (opcoes.classe) {
    elemento.className = opcoes.classe;
  }
  if (opcoes.texto !== undefined) {
    elemento.textContent = opcoes.texto;
  }
  if (opcoes.atributos) {
    for (const [nome, valor] of Object.entries(opcoes.atributos)) {
      elemento.setAttribute(nome, valor);
    }
  }
  for (const filho of filhos) {
    elemento.append(filho);
  }
  return elemento;
}

function mostrarMensagem(tipo, texto) {
  const area = document.getElementById('area-mensagens');
  const mensagem = criarElemento('p', { classe: `mensagem mensagem-${tipo}`, texto });
  area.append(mensagem);
  setTimeout(() => mensagem.remove(), 5000);
}

function guardarMensagem(tipo, texto) {
  sessionStorage.setItem(CHAVE_MENSAGEM, JSON.stringify({ tipo, texto }));
}

function exibirMensagemGuardada() {
  const texto = sessionStorage.getItem(CHAVE_MENSAGEM);
  if (texto === null) {
    return;
  }
  sessionStorage.removeItem(CHAVE_MENSAGEM);
  const { tipo, texto: conteudo } = JSON.parse(texto);
  mostrarMensagem(tipo, conteudo);
}

const CRITERIOS_ORDENACAO = {
  'nome-asc': (a, b) => a.nome.localeCompare(b.nome, 'pt-BR'),
  'nome-desc': (a, b) => b.nome.localeCompare(a.nome, 'pt-BR'),
  'tempo-asc': (a, b) => a.tempo - b.tempo,
  'tempo-desc': (a, b) => b.tempo - a.tempo,
  'avaliacao-desc': (a, b) => (b.avaliacao ?? -1) - (a.avaliacao ?? -1),
  'custo-asc': (a, b) => a.custo - b.custo
};

function receitasParaExibir() {
  const termo = normalizarTexto(document.getElementById('busca').value.trim());
  const categoria = document.getElementById('filtro-categoria').value;
  const status = document.getElementById('filtro-status').value;
  const criterio = document.getElementById('ordenacao').value;
  let receitas = carregarReceitas();

  if (termo !== '') {
    receitas = receitas.filter((receita) => {
      const noNome = normalizarTexto(receita.nome).includes(termo);
      const noIngrediente = receita.ingredientes.some((item) => normalizarTexto(item).includes(termo));
      return noNome || noIngrediente;
    });
  }

  if (categoria !== '') {
    receitas = receitas.filter((receita) => receita.categoria === categoria);
  }

  if (status !== '') {
    receitas = receitas.filter((receita) => receita.status === status);
  }

  const comparar = CRITERIOS_ORDENACAO[criterio] || CRITERIOS_ORDENACAO['nome-asc'];
  return [...receitas].sort(comparar);
}

function criarLinhaReceita(receita) {
  const selo = criarElemento('span', {
    classe: `selo ${CLASSE_STATUS[receita.status]}`,
    texto: ROTULOS.status[receita.status]
  });

  const acoes = criarElemento('td', { atributos: { 'data-label': 'Ações' } }, [
    criarElemento('a', {
      classe: 'botao botao-secundario',
      texto: 'Ver detalhes',
      atributos: { href: `${CAMINHOS.detalhes}?id=${receita.id}` }
    }),
    criarElemento('a', {
      classe: 'botao botao-secundario',
      texto: 'Editar',
      atributos: { href: `${CAMINHOS.cadastro}?id=${receita.id}` }
    }),
    criarElemento('button', {
      classe: 'botao botao-perigo',
      texto: 'Excluir',
      atributos: { type: 'button', 'data-acao': 'excluir', 'data-id': receita.id }
    })
  ]);

  return criarElemento('tr', {}, [
    criarElemento('th', { texto: receita.nome, atributos: { scope: 'row' } }),
    criarElemento('td', { texto: ROTULOS.categoria[receita.categoria], atributos: { 'data-label': 'Categoria' } }),
    criarElemento('td', { texto: `${receita.tempo} min`, atributos: { 'data-label': 'Tempo de preparo' } }),
    criarElemento('td', { texto: ROTULOS.dificuldade[receita.dificuldade], atributos: { 'data-label': 'Dificuldade' } }),
    criarElemento('td', { texto: formatarMoeda(receita.custo), atributos: { 'data-label': 'Custo estimado' } }),
    criarElemento('td', { texto: formatarNota(receita.avaliacao), atributos: { 'data-label': 'Avaliação' } }),
    criarElemento('td', { atributos: { 'data-label': 'Status' } }, [selo]),
    acoes
  ]);
}

function atualizarResumo() {
  const todas = carregarReceitas();
  const contagem = { 'no-cardapio': 0, 'em-teste': 0, descontinuado: 0 };

  for (const receita of todas) {
    if (receita.status in contagem) {
      contagem[receita.status]++;
    }
  }

  document.getElementById('resumo-total').textContent = todas.length;
  document.getElementById('resumo-cardapio').textContent = contagem['no-cardapio'];
  document.getElementById('resumo-teste').textContent = contagem['em-teste'];
  document.getElementById('resumo-descontinuadas').textContent = contagem.descontinuado;
}

function renderizarLista() {
  const corpo = document.getElementById('lista-receitas');
  const receitas = receitasParaExibir();

  corpo.replaceChildren();
  for (const receita of receitas) {
    corpo.append(criarLinhaReceita(receita));
  }

  const total = receitas.length;
  document.getElementById('contagem').textContent =
    total === 1 ? 'Exibindo 1 receita.' : `Exibindo ${total} receitas.`;
  document.getElementById('estado-vazio').hidden = total > 0;
  document.querySelector('.painel-lista table').hidden = total === 0;

  atualizarResumo();
}

document.addEventListener('DOMContentLoaded', () => {
  if (PAGINA !== 'lista') {
    return;
  }
  exibirMensagemGuardada();
  renderizarLista();
});

function lerFormulario(formulario) {
  const dados = new FormData(formulario);
  const tempoTexto = String(dados.get('tempo')).trim();
  const custoTexto = String(dados.get('custo')).trim();
  const notaTexto = String(dados.get('avaliacao')).trim();

  return {
    nome: String(dados.get('nome')).trim(),
    categoria: dados.get('categoria'),
    imagem: String(dados.get('imagem')).trim(),
    ingredientes: String(dados.get('ingredientes'))
      .split('\n')
      .map((linha) => linha.trim())
      .filter((linha) => linha !== ''),
    modoPreparo: String(dados.get('modo-preparo')).trim(),
    tempo: tempoTexto === '' ? NaN : Number(tempoTexto),
    custo: custoTexto === '' ? NaN : Number(custoTexto),
    dificuldade: dados.get('dificuldade'),
    avaliacao: notaTexto === '' ? null : Number(notaTexto),
    status: dados.get('status'),
    destaque: dados.get('destaque') === 'sim'
  };
}

function validarReceita(receita) {
  const erros = {};

  if (receita.nome.length < 3) {
    erros.nome = 'Informe um nome com pelo menos 3 caracteres.';
  }
  if (!ROTULOS.categoria[receita.categoria]) {
    erros.categoria = 'Selecione uma categoria.';
  }
  if (receita.imagem !== '' && !/^https?:\/\//i.test(receita.imagem)) {
    erros.imagem = 'Informe um endereço que comece com http:// ou https://.';
  }
  if (receita.ingredientes.length === 0) {
    erros.ingredientes = 'Informe pelo menos um ingrediente.';
  }
  if (!Number.isFinite(receita.tempo) || receita.tempo < 1 || receita.tempo > 480) {
    erros.tempo = 'Informe um tempo entre 1 e 480 minutos.';
  }
  if (!Number.isFinite(receita.custo) || receita.custo < 0) {
    erros.custo = 'Informe um custo igual ou maior que zero.';
  }
  if (!ROTULOS.dificuldade[receita.dificuldade]) {
    erros.dificuldade = 'Escolha o nível de dificuldade.';
  }
  if (receita.avaliacao !== null && (!Number.isFinite(receita.avaliacao) || receita.avaliacao < 0 || receita.avaliacao > 5)) {
    erros.avaliacao = 'A avaliação deve estar entre 0 e 5.';
  }
  if (!ROTULOS.status[receita.status]) {
    erros.status = 'Selecione o status.';
  }

  return erros;
}

function limparErros(formulario) {
  for (const erro of formulario.querySelectorAll('.erro')) {
    const campo = formulario.querySelector(`[aria-describedby~="${erro.id}"]`);
    if (campo) {
      const restantes = campo.getAttribute('aria-describedby')
        .split(' ')
        .filter((id) => id !== erro.id)
        .join(' ');
      if (restantes) {
        campo.setAttribute('aria-describedby', restantes);
      } else {
        campo.removeAttribute('aria-describedby');
      }
    }
    erro.remove();
  }
  for (const campo of formulario.querySelectorAll('[aria-invalid]')) {
    campo.removeAttribute('aria-invalid');
  }
}

function mostrarErros(formulario, erros) {
  let primeiroCampo = null;

  for (const [nomeCampo, texto] of Object.entries(erros)) {
    const ehGrupo = nomeCampo === 'dificuldade'; 
    const campo = ehGrupo
      ? formulario.querySelector('#dificuldade-facil')
      : formulario.querySelector(`#${nomeCampo}`);
    const recipiente = ehGrupo ? campo.closest('fieldset') : campo.parentElement;
    const erro = criarElemento('small', { classe: 'erro', texto, atributos: { id: `erro-${nomeCampo}` } });

    recipiente.append(erro);
    const alvo = ehGrupo ? recipiente : campo;
    alvo.setAttribute('aria-describedby', [alvo.getAttribute('aria-describedby'), erro.id].filter(Boolean).join(' '));
    if (!ehGrupo) {
      campo.setAttribute('aria-invalid', 'true');
    }
    if (primeiroCampo === null) {
      primeiroCampo = campo;
    }
  }

  if (primeiroCampo !== null) {
    primeiroCampo.focus();
  }
}

function tratarEnvioFormulario(evento) {
  evento.preventDefault();
  const formulario = evento.target;

  limparErros(formulario);
  const dados = lerFormulario(formulario);
  const erros = validarReceita(dados);

  if (Object.keys(erros).length > 0) {
    mostrarErros(formulario, erros);
    mostrarMensagem('erro', 'Não foi possível salvar. Corrija os campos destacados.');
    return;
  }

  const receitas = carregarReceitas();

  if (idEmEdicao === null) {
    receitas.push({ id: gerarId(receitas), ...dados, criadaEm: Date.now() });
    guardarMensagem('sucesso', `Receita "${dados.nome}" cadastrada com sucesso.`);
  } else {

    const indice = receitas.findIndex((receita) => receita.id === idEmEdicao);
    if (indice === -1) {
      mostrarMensagem('erro', 'Receita não encontrada. Ela pode ter sido excluída.');
      return;
    }
    receitas[indice] = { ...receitas[indice], ...dados };
    guardarMensagem('sucesso', `Receita "${dados.nome}" atualizada com sucesso.`);
  }

  salvarReceitas(receitas);
  window.location.href = CAMINHOS.lista;
}

document.addEventListener('DOMContentLoaded', () => {
  if (PAGINA !== 'cadastro') {
    return;
  }
  const formulario = document.getElementById('form-receita');
  formulario.addEventListener('submit', tratarEnvioFormulario);
  formulario.addEventListener('reset', () => limparErros(formulario));
});

function preencherLista(lista, itens) {
  lista.replaceChildren();
  for (const item of itens) {
    lista.append(criarElemento('li', { texto: item }));
  }
}

function renderizarRelacionadas(receita) {
  const lista = document.getElementById('lista-relacionadas');
  const relacionadas = carregarReceitas()
    .filter((outra) => outra.categoria === receita.categoria && outra.id !== receita.id)
    .slice(0, 3);

  lista.replaceChildren();
  if (relacionadas.length === 0) {
    lista.append(criarElemento('li', { texto: 'Nenhuma outra receita nesta categoria.' }));
    return;
  }
  for (const outra of relacionadas) {
    const link = criarElemento('a', { texto: outra.nome, atributos: { href: `${CAMINHOS.detalhes}?id=${outra.id}` } });
    lista.append(criarElemento('li', {}, [link]));
  }
}

function renderizarDetalhes(receita) {
  const placeholder = `${CAMINHOS.imagens}placeholder-prato.svg`;
  const imagem = document.getElementById('detalhe-imagem');

  document.title = `${receita.nome} | Poke Point Receitas`;
  document.getElementById('titulo-receita').textContent = receita.nome;
  document.getElementById('detalhe-categoria').textContent = `Categoria: ${ROTULOS.categoria[receita.categoria]}`;

  imagem.src = receita.imagem || placeholder;
  imagem.alt = `Imagem do prato ${receita.nome}`;
  imagem.onerror = () => {
    imagem.onerror = null; 
    imagem.src = placeholder;
  };

  document.getElementById('detalhe-tempo').textContent = `${receita.tempo} minutos`;
  document.getElementById('detalhe-dificuldade').textContent = ROTULOS.dificuldade[receita.dificuldade];
  document.getElementById('detalhe-custo').textContent = formatarMoeda(receita.custo);
  document.getElementById('detalhe-avaliacao').textContent =
    receita.avaliacao === null ? 'Sem avaliação' : `${formatarNota(receita.avaliacao)} de 5`;
  document.getElementById('detalhe-destaque').textContent = receita.destaque ? 'Sim' : 'Não';

  const status = document.getElementById('detalhe-status');
  status.replaceChildren(criarElemento('span', {
    classe: `selo ${CLASSE_STATUS[receita.status]}`,
    texto: ROTULOS.status[receita.status]
  }));

  preencherLista(document.getElementById('detalhe-ingredientes'), receita.ingredientes);

  const passos = receita.modoPreparo
    .split('\n')
    .map((linha) => linha.trim())
    .filter((linha) => linha !== '');
  preencherLista(
    document.getElementById('detalhe-preparo'),
    passos.length > 0 ? passos : ['Modo de preparo não informado.']
  );

  document.getElementById('link-editar').href = `${CAMINHOS.cadastro}?id=${receita.id}`;
  renderizarRelacionadas(receita);

  document.getElementById('detalhe-receita').hidden = false;
  document.getElementById('detalhe-relacionadas').hidden = false;
}

document.addEventListener('DOMContentLoaded', () => {
  if (PAGINA !== 'detalhes') {
    return;
  }

  const id = obterIdDaUrl();
  const receita = id === null ? undefined : buscarReceitaPorId(id);

  if (receita === undefined) {
    document.getElementById('detalhe-vazio').hidden = false;
    return;
  }
  renderizarDetalhes(receita);
});

let idEmEdicao = null;

function preencherFormulario(receita) {
  const formulario = document.getElementById('form-receita');

  formulario.elements['nome'].value = receita.nome;
  formulario.elements['categoria'].value = receita.categoria;
  formulario.elements['imagem'].value = receita.imagem;
  formulario.elements['ingredientes'].value = receita.ingredientes.join('\n');
  formulario.elements['modo-preparo'].value = receita.modoPreparo;
  formulario.elements['tempo'].value = receita.tempo;
  formulario.elements['custo'].value = receita.custo;
  formulario.elements['dificuldade'].value = receita.dificuldade;
  formulario.elements['avaliacao'].value = receita.avaliacao ?? '';
  formulario.elements['status'].value = receita.status;
  formulario.elements['destaque'].checked = receita.destaque;
}

document.addEventListener('DOMContentLoaded', () => {
  if (PAGINA !== 'cadastro') {
    return;
  }

  const id = obterIdDaUrl();
  if (id === null) {
    return; 
  }

  const receita = buscarReceitaPorId(id);
  if (receita === undefined) {
    mostrarMensagem('erro', 'Receita não encontrada. Você pode cadastrar uma nova.');
    return;
  }

  idEmEdicao = id;
  preencherFormulario(receita);

  document.title = `Editar ${receita.nome} | Poke Point Receitas`;
  document.getElementById('titulo-formulario').textContent = 'Editar receita';
  document.getElementById('botao-salvar').textContent = 'Salvar alterações';
  const aviso = document.getElementById('aviso-edicao');
  aviso.textContent = `Você está editando "${receita.nome}".`;
  aviso.hidden = false;
});

let idParaExcluir = null;

function abrirDialogoExclusao(receita) {
  idParaExcluir = receita.id;
  document.getElementById('nome-exclusao').textContent = `"${receita.nome}"`;
  document.getElementById('dialogo-exclusao').showModal();
}

function excluirReceita(id) {
  const restantes = carregarReceitas().filter((receita) => receita.id !== id);
  salvarReceitas(restantes);
}

function configurarExclusao(aoConcluir) {
  const dialogo = document.getElementById('dialogo-exclusao');

  dialogo.addEventListener('close', () => {
    if (dialogo.returnValue === 'confirmar' && idParaExcluir !== null) {
      const receita = buscarReceitaPorId(idParaExcluir);
      excluirReceita(idParaExcluir);
      aoConcluir(receita);
    }
    idParaExcluir = null;
    dialogo.returnValue = '';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (PAGINA === 'lista') {
    configurarExclusao((receita) => {
      renderizarLista();
      mostrarMensagem('sucesso', `Receita "${receita.nome}" excluída.`);
    });

    document.getElementById('lista-receitas').addEventListener('click', (evento) => {
      const botao = evento.target.closest('[data-acao="excluir"]');
      if (botao === null) {
        return;
      }
      const receita = buscarReceitaPorId(Number(botao.dataset.id));
      if (receita !== undefined) {
        abrirDialogoExclusao(receita);
      }
    });
  }

  if (PAGINA === 'detalhes') {
    configurarExclusao((receita) => {
      guardarMensagem('sucesso', `Receita "${receita.nome}" excluída.`);
      window.location.href = CAMINHOS.lista;
    });

    document.getElementById('botao-excluir').addEventListener('click', () => {
      const receita = buscarReceitaPorId(obterIdDaUrl());
      if (receita !== undefined) {
        abrirDialogoExclusao(receita);
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  if (PAGINA !== 'lista') {
    return;
  }
  const formulario = document.getElementById('form-busca');
  document.getElementById('busca').addEventListener('input', renderizarLista);
  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    renderizarLista();
  });
  formulario.addEventListener('reset', () => setTimeout(renderizarLista, 0));
});

document.addEventListener('DOMContentLoaded', () => {
  if (PAGINA !== 'lista') {
    return;
  }

  for (const id of ['filtro-categoria', 'filtro-status']) {
    document.getElementById(id).addEventListener('change', renderizarLista);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  if (PAGINA !== 'lista') {
    return;
  }
  document.getElementById('ordenacao').addEventListener('change', renderizarLista);
});

const URL_API = 'https://www.themealdb.com/api/json/v1/1/search.php';

const CATEGORIAS_API = { Dessert: 'sobremesa', Starter: 'entrada', Side: 'entrada' };

async function buscarReceitasNaApi(termo) {
  const controle = new AbortController();
  const limite = setTimeout(() => controle.abort(), 8000); // desiste após 8 segundos

  try {
    const resposta = await fetch(`${URL_API}?s=${encodeURIComponent(termo)}`, { signal: controle.signal });
    if (!resposta.ok) {
      throw new Error(`A API respondeu com erro ${resposta.status}`);
    }
    const dados = await resposta.json();
    return dados.meals ?? []; // a API devolve null quando não encontra nada
  } finally {
    clearTimeout(limite);
  }
}

function converterRefeicao(refeicao) {
  const ingredientes = [];

  for (let i = 1; i <= 20; i++) {
    const ingrediente = (refeicao[`strIngredient${i}`] || '').trim();
    const medida = (refeicao[`strMeasure${i}`] || '').trim();
    if (ingrediente !== '') {
      ingredientes.push(medida !== '' ? `${medida} ${ingrediente}` : ingrediente);
    }
  }

  return {
    nome: refeicao.strMeal,
    categoria: CATEGORIAS_API[refeicao.strCategory] || 'quente',
    imagem: refeicao.strMealThumb || '',
    ingredientes,
    modoPreparo: (refeicao.strInstructions || '').replace(/\r\n/g, '\n').trim()
  };
}

function usarReceitaDaApi(dados) {
  const formulario = document.getElementById('form-receita');

  limparErros(formulario);
  formulario.elements['nome'].value = dados.nome;
  formulario.elements['categoria'].value = dados.categoria;
  formulario.elements['imagem'].value = dados.imagem;
  formulario.elements['ingredientes'].value = dados.ingredientes.join('\n');
  formulario.elements['modo-preparo'].value = dados.modoPreparo;

  mostrarMensagem('info', 'Dados importados. Complete tempo, custo, dificuldade e status antes de salvar.');
  formulario.elements['tempo'].focus();
}

function renderizarResultadosApi(refeicoes) {
  const lista = document.getElementById('resultados-api');
  lista.replaceChildren();

  for (const refeicao of refeicoes.slice(0, 6)) {
    const botao = criarElemento('button', {
      classe: 'botao botao-secundario',
      texto: 'Usar esta receita',
      atributos: { type: 'button' }
    });
    botao.addEventListener('click', () => usarReceitaDaApi(converterRefeicao(refeicao)));

    lista.append(criarElemento('li', { classe: 'resultado-api' }, [
      criarElemento('img', {
        atributos: { src: refeicao.strMealThumb, alt: '', width: '64', height: '64', loading: 'lazy' }
      }),
      criarElemento('span', { texto: `${refeicao.strMeal} (${refeicao.strCategory})` }),
      botao
    ]));
  }
}

async function tratarBuscaApi(evento) {
  evento.preventDefault();

  const termo = document.getElementById('busca-api').value.trim();
  const status = document.getElementById('status-api');
  const lista = document.getElementById('resultados-api');

  if (termo.length < 2) {
    status.textContent = 'Digite pelo menos 2 letras para buscar.';
    return;
  }

  status.textContent = 'Buscando receitas...';
  lista.replaceChildren();

  try {
    const refeicoes = await buscarReceitasNaApi(termo);

    if (refeicoes.length === 0) {
      status.textContent = `Nenhuma receita encontrada para "${termo}".`;
      return;
    }

    status.textContent = `${refeicoes.length} receita(s) encontrada(s). Escolha uma para preencher o formulário.`;
    renderizarResultadosApi(refeicoes);
    } catch (erro) {
    console.error(erro);
    status.textContent = erro.name === 'AbortError'
      ? 'A API demorou demais para responder. Tente novamente em instantes.'
      : 'Não foi possível consultar a API. Verifique sua conexão e tente novamente.';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (PAGINA !== 'cadastro') {
    return;
  }
  document.getElementById('form-api').addEventListener('submit', tratarBuscaApi);
});