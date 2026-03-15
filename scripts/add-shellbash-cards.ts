import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(
  __dirname,
  "../data/cards/linguagens-de-programacao.json",
);
const existing: any[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));

const newCards = [
  // ─── SHELL/BASH FÁCIL 5–10 ──────────────────────────────────────────────────
  {
    id: "linguagens-de-programacao__Shell/Bash__Fácil__5",
    tags: ["shell", "bash", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Shell/Bash",
    difficulty: "Fácil",
    question: "Como se declara e usa uma variável em Bash?",
    options: [
      'NOME="valor" para declarar e $NOME para utilizar',
      'var NOME = "valor" para declarar e $NOME para utilizar',
      'let NOME = "valor" para declarar e NOME para utilizar',
      'NOME := "valor" para declarar e @NOME para utilizar',
    ],
    correctIndex: 0,
    explanation:
      'Em Bash, variáveis são declaradas sem espaços: `NOME="valor"`. Para usar o valor, adiciona-se `$` na frente: `$NOME` ou `${NOME}`. Sem `$`, é tratado como texto literal.',
    example:
      'NOME="João"\nIDADE=30\necho "Olá, $NOME!"\necho "Você tem ${IDADE} anos."',
  },
  {
    id: "linguagens-de-programacao__Shell/Bash__Fácil__6",
    tags: ["shell", "bash", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Shell/Bash",
    difficulty: "Fácil",
    question: "Qual comando lista os arquivos e diretórios do diretório atual?",
    options: ["ls", "dir", "list", "show"],
    correctIndex: 0,
    explanation:
      "`ls` lista o conteúdo do diretório. `ls -l` mostra detalhes (permissões, tamanho, data). `ls -a` mostra arquivos ocultos. `ls -la` combina ambos.",
    example:
      "ls             # lista básica\nls -l          # lista detalhada\nls -la         # com arquivos ocultos\nls -lh /var/log # tamanhos legíveis (KB, MB)",
  },
  {
    id: "linguagens-de-programacao__Shell/Bash__Fácil__7",
    tags: ["shell", "bash", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Shell/Bash",
    difficulty: "Fácil",
    question: "O que faz o operador `>` em Shell?",
    options: [
      "Redireciona a saída de um comando para um arquivo, sobrescrevendo-o",
      "Compara dois valores e retorna verdadeiro se o primeiro for maior",
      "Redireciona a entrada de um arquivo para um comando",
      "Concatena dois arquivos e exibe o resultado no terminal",
    ],
    correctIndex: 0,
    explanation:
      "`>` redireciona stdout para um arquivo (sobrescreve). `>>` adiciona ao final sem apagar. `<` lê de um arquivo. `2>` redireciona stderr.",
    example:
      'ls -la > lista.txt       # salva output em arquivo\necho "linha" >> log.txt  # adiciona ao final\ncat < arquivo.txt        # lê de arquivo\ncomando 2> erro.log      # redireciona erros',
  },
  {
    id: "linguagens-de-programacao__Shell/Bash__Fácil__8",
    tags: ["shell", "bash", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Shell/Bash",
    difficulty: "Fácil",
    question: "O que é o pipe `|` em Shell e como funciona?",
    options: [
      "Conecta a saída de um comando à entrada do próximo, encadeando processamentos",
      "Executa dois comandos em paralelo e combina seus resultados",
      "Separa múltiplos comandos em uma mesma linha para execução sequencial",
      "Redireciona a saída de erro de um comando para o próximo",
    ],
    correctIndex: 0,
    explanation:
      "O pipe (`|`) conecta stdout do comando à esquerda ao stdin do comando à direita. Permite encadear ferramentas Unix para processamento de texto poderoso.",
    example:
      "cat arquivo.txt | grep 'erro' | wc -l\n# cat: lê o arquivo\n# grep: filtra linhas com 'erro'\n# wc -l: conta as linhas filtradas\n\nps aux | grep nginx | head -5",
  },
  {
    id: "linguagens-de-programacao__Shell/Bash__Fácil__9",
    tags: ["shell", "bash", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Shell/Bash",
    difficulty: "Fácil",
    question:
      "Como se verifica se um arquivo existe antes de processá-lo em Bash?",
    options: [
      'if [ -f "arquivo.txt" ]; then ... fi',
      'if exists("arquivo.txt"); then ... fi',
      'if file "arquivo.txt" != null; then ... fi',
      'if check -file "arquivo.txt"; then ... fi',
    ],
    correctIndex: 0,
    explanation:
      "`[ -f arquivo ]` testa se é um arquivo regular. `-d` para diretório, `-e` para qualquer existência, `-r` para leitura permitida, `-w` para escrita.",
    example:
      'if [ -f "config.txt" ]; then\n    echo "Arquivo existe"\n    cat config.txt\nelse\n    echo "Arquivo não encontrado"\nfi\n\n[ -d "/tmp" ] && echo "Diretório /tmp existe"',
  },
  {
    id: "linguagens-de-programacao__Shell/Bash__Fácil__10",
    tags: ["shell", "bash", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Shell/Bash",
    difficulty: "Fácil",
    question: "O que é o shebang (`#!/bin/bash`) no início de um script Shell?",
    options: [
      "Indica ao sistema operacional qual interpretador deve executar o script",
      "Um comentário obrigatório que documenta o autor e a versão do script",
      "Um comando que importa a biblioteca padrão do Bash para o script",
      "Define as permissões de execução do arquivo para o usuário atual",
    ],
    correctIndex: 0,
    explanation:
      "O shebang (`#!`) na primeira linha informa ao kernel qual programa deve interpretar o script. `#!/bin/bash` usa Bash, `#!/usr/bin/env python3` usa Python, etc. Sem ele, o shell padrão do sistema é assumido.",
    example:
      "#!/bin/bash\n# Este script usa Bash\necho \"Olá do Bash!\"\n\n#!/usr/bin/env python3\n# Este script usa Python 3\nprint('Olá do Python!')",
  },

  // ─── SHELL/BASH MÉDIO 4–10 ──────────────────────────────────────────────────
  {
    id: "linguagens-de-programacao__Shell/Bash__Médio__4",
    tags: ["shell", "bash", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Shell/Bash",
    difficulty: "Médio",
    question: "O que são variáveis especiais `$0`, `$1`, `$@` e `$#` em Bash?",
    options: [
      "$0: nome do script; $1..$N: argumentos posicionais; $@: todos os args; $#: quantidade de args",
      "$0: primeiro argumento; $1: segundo; $@: último argumento; $#: tamanho do maior argumento",
      "$0: PID do processo; $1: usuário atual; $@: diretório atual; $#: número de linhas do script",
      "$0: saída do último comando; $#: código de erro; $@: variáveis de ambiente; $1: hostname",
    ],
    correctIndex: 0,
    explanation:
      "Variáveis especiais Bash: `$0` nome do script, `$1`-`$9` argumentos posicionais, `$@` todos os argumentos como lista, `$#` quantidade de argumentos, `$?` código de saída do último comando, `$$` PID atual.",
    example:
      '#!/bin/bash\n# ./script.sh arg1 arg2 arg3\necho "Script: $0"       # ./script.sh\necho "Primeiro: $1"    # arg1\necho "Todos: $@"       # arg1 arg2 arg3\necho "Quantidade: $#" # 3',
  },
  {
    id: "linguagens-de-programacao__Shell/Bash__Médio__5",
    tags: ["shell", "bash", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Shell/Bash",
    difficulty: "Médio",
    question: "Como se itera sobre arquivos de um diretório em Bash?",
    options: [
      'for arquivo in /caminho/*.log; do echo "$arquivo"; done',
      'foreach arquivo in ls /caminho; do echo "$arquivo"; done',
      'for arquivo = ls /caminho; do echo "$arquivo"; done',
      'loop arquivo in /caminho; do echo "arquivo"; done',
    ],
    correctIndex: 0,
    explanation:
      "Em Bash, `for var in glob` itera sobre arquivos que correspondem ao padrão glob. O shell expande `*.log` para uma lista de arquivos antes do loop.",
    example:
      '# Processar todos os .log\nfor arquivo in /var/log/*.log; do\n    echo "Processando: $arquivo"\n    gzip "$arquivo"\ndone\n\n# Iterar números\nfor i in {1..5}; do\n    echo "Número: $i"\ndone',
  },
  {
    id: "linguagens-de-programacao__Shell/Bash__Médio__6",
    tags: ["shell", "bash", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Shell/Bash",
    difficulty: "Médio",
    question:
      "O que é `set -e` e `set -u` em scripts Bash e por que são boas práticas?",
    options: [
      "`set -e` encerra o script ao primeiro erro; `set -u` trata variáveis não definidas como erro",
      "`set -e` ativa modo de depuração com echo de cada comando; `set -u` desativa warnings de variáveis",
      "`set -e` e `set -u` são equivalentes; ambos ativam modo seguro de execução",
      "`set -u` ordena variáveis alfabeticamente; `set -e` as converte para maiúsculas automaticamente",
    ],
    correctIndex: 0,
    explanation:
      "`set -e` (errexit): o script para imediatamente se qualquer comando retornar erro. `set -u` (nounset): tratar variáveis não definidas como erro. `set -o pipefail` faz o pipe falhar se qualquer comando falhar.",
    example:
      '#!/bin/bash\nset -euo pipefail  # combinação recomendada\n\nARQUIVO="/tmp/dados.txt"\ncp "$ARQUIVO" /backup/    # se falhar, script encerra\necho "Backup concluído"\n# Sem set -e: continuaria mesmo após erro no cp',
  },
  {
    id: "linguagens-de-programacao__Shell/Bash__Médio__7",
    tags: ["shell", "bash", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Shell/Bash",
    difficulty: "Médio",
    question: "O que faz o comando `find` e como combinar com `xargs`?",
    options: [
      "`find` busca arquivos por critérios; `xargs` converte stdin em argumentos de outro comando",
      "`find` localiza texto dentro de arquivos; `xargs` executa comandos em paralelo",
      "`find` cria atalhos simbólicos; `xargs` remove duplicatas da saída de `find`",
      "`find` é equivalente a `locate`; `xargs` é igual ao operador pipe `|`",
    ],
    correctIndex: 0,
    explanation:
      "`find` localiza arquivos por nome, tipo, tamanho, data, etc. `xargs` pega linhas do stdin e as passa como argumentos para outro comando — mais eficiente que loops em grandes volumes.",
    example:
      "# Deletar arquivos .tmp com mais de 7 dias\nfind /tmp -name '*.tmp' -mtime +7 -type f | xargs rm -f\n\n# Contar linhas em todos os .py\nfind . -name '*.py' | xargs wc -l\n\n# Com espaços em nomes de arquivos (seguro)\nfind . -name '*.log' -print0 | xargs -0 gzip",
  },
  {
    id: "linguagens-de-programacao__Shell/Bash__Médio__8",
    tags: ["shell", "bash", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Shell/Bash",
    difficulty: "Médio",
    question: "Como funcionam funções em Bash e como retornar valores delas?",
    options: [
      "Definidas com `nome() { }` ou `function nome { }`; retornam código de saída via `return`; valores via echo e substituição de comando",
      "Definidas com `def nome():` igual ao Python; retornam qualquer tipo com `return valor`",
      "Funções Bash não existem; scripts complexos devem usar scripts separados para cada operação",
      'Retornam strings diretamente com `return "texto"` igual a outras linguagens de programação',
    ],
    correctIndex: 0,
    explanation:
      "`return` em Bash só retorna códigos de saída (0-255). Para 'retornar' um valor string, usa-se `echo` dentro da função e captura com `$(funcao)` (substituição de comando).",
    example:
      'somar() {\n    local resultado=$(( $1 + $2 ))\n    echo "$resultado"  # \'retorna\' via stdout\n}\n\ntotal=$(somar 10 20)\necho "Total: $total" # Total: 30\n\nverificar() { [ -f "$1" ] && return 0 || return 1; }\nverificar arquivo.txt && echo \'existe\'',
  },
  {
    id: "linguagens-de-programacao__Shell/Bash__Médio__9",
    tags: ["shell", "bash", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Shell/Bash",
    difficulty: "Médio",
    question:
      "O que é `process substitution` (`<(comando)`) em Bash e quando usar?",
    options: [
      "Trata a saída de um comando como se fosse um arquivo temporário, permitindo uso em contextos que esperam arquivos",
      "Substitui o processo atual pelo comando especificado, economizando memória com exec",
      "Executa um comando em background e armazena seu PID em uma variável automaticamente",
      "Redireciona tanto stdout quanto stderr para o mesmo destino em uma única sintaxe",
    ],
    correctIndex: 0,
    explanation:
      "`<(comando)` cria um named pipe com a saída do comando, usado onde se espera um arquivo. Útil para `diff` entre outputs de comandos ou `comm` sem criar arquivos temporários.",
    example:
      "# Comparar outputs de dois comandos diretamente\ndiff <(ls /dir1 | sort) <(ls /dir2 | sort)\n\n# join duas listas ordenadas sem arquivos temp\ncomm <(sort lista1.txt) <(sort lista2.txt)\n\n# while lendo um comando\nwhile IFS= read -r linha; do\n  echo \"$linha\"\ndone < <(grep 'ERROR' app.log)",
  },
  {
    id: "linguagens-de-programacao__Shell/Bash__Médio__10",
    tags: ["shell", "bash", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Shell/Bash",
    difficulty: "Médio",
    question: "Como se usam arrays em Bash e como iterar sobre eles?",
    options: [
      "Declarados com `arr=(a b c)`; acessados com `${arr[0]}`; todos os elementos com `${arr[@]}`",
      "Declarados com `arr = [a, b, c]`; acessados com `arr[0]`; iterados com `for item in arr`",
      "Bash não tem arrays nativos; listas são simuladas com strings separadas por vírgula",
      "Declarados com `declare arr a b c`; acessados com `$arr.0`; tamanho com `$arr.length`",
    ],
    correctIndex: 0,
    explanation:
      "Arrays Bash: `arr=(item1 item2 item3)`. Acesso: `${arr[0]}`. Todos: `${arr[@]}`. Tamanho: `${#arr[@]}`. Fatia: `${arr[@]:1:2}`. Associativos (dicionários) com `declare -A`.",
    example:
      'frutas=("maçã" "banana" "laranja")\necho "${frutas[0]}"     # maçã\necho "${frutas[@]}"    # todos\necho "${#frutas[@]}"   # 3\n\nfor fruta in "${frutas[@]}"; do\n    echo "Fruta: $fruta"\ndone',
  },

  // ─── SHELL/BASH DIFÍCIL 4–10 ────────────────────────────────────────────────
  {
    id: "linguagens-de-programacao__Shell/Bash__Difícil__4",
    tags: ["shell", "bash", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Shell/Bash",
    difficulty: "Difícil",
    question:
      "O que é `trap` em Bash e como usar para garantir limpeza ao encerrar um script?",
    options: [
      "Registra handlers para sinais (SIGINT, SIGTERM) e EXIT, permitindo limpeza de recursos ao encerrar",
      "Captura erros de comando e os converte em variáveis para processamento posterior",
      "É um depurador interativo que para o script no ponto onde um erro ocorreu",
      "Previne que o script seja encerrado por sinais externos como CTRL+C",
    ],
    correctIndex: 0,
    explanation:
      "`trap 'comando' SINAL` executa código ao receber sinais. `trap '...' EXIT` sempre executa ao sair (mesmo com erro). Essencial para remover arquivos temporários e liberar locks.",
    example:
      '#!/bin/bash\nTMP=$(mktemp)\ntrap \'rm -f "$TMP"; echo "Limpeza feita"\' EXIT\ntrap \'echo "Interrompido!"; exit 1\' INT TERM\n\n# O rm do TMP é garantido mesmo se o script falhar\necho \'dados\' > "$TMP"\nprocessar "$TMP"\n# EXIT trap executa aqui automaticamente',
  },
  {
    id: "linguagens-de-programacao__Shell/Bash__Difícil__5",
    tags: ["shell", "bash", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Shell/Bash",
    difficulty: "Difícil",
    question:
      "Como fazer processamento paralelo em Bash com controle do número de jobs simultâneos?",
    options: [
      "Usando `&` para background e `wait` para sincronizar; semáforos com named pipes ou arrays de PIDs para limitar concorrência",
      "Usando a flag `--parallel` nativa do Bash que gerencia automaticamente um pool de threads",
      "Com `xargs --parallel N` que roda N processos mas sem necessidade de controle adicional",
      "Bash é single-thread por design; paralelismo real exige Python ou Node.js como substituto",
    ],
    correctIndex: 0,
    explanation:
      "Bash não tem primitivas de pool nativas, mas `&` + `wait` + controle de PID permitem paralelismo controlado. `GNU parallel` é a ferramenta mais completa. `xargs -P N` também paraleliza.",
    example:
      '#!/bin/bash\nMAX_JOBS=4\ncount=0\nfor arquivo in *.log; do\n    processar "$arquivo" &  # background\n    (( count++ ))\n    if (( count >= MAX_JOBS )); then\n        wait -n  # aguarda qualquer job terminar\n        (( count-- ))\n    fi\ndone\nwait  # aguarda todos os jobs restantes',
  },
  {
    id: "linguagens-de-programacao__Shell/Bash__Difícil__6",
    tags: ["shell", "bash", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Shell/Bash",
    difficulty: "Difícil",
    question:
      "O que é `IFS` em Bash e como afeta a divisão de strings e iteração?",
    options: [
      "Internal Field Separator: define os caracteres usados para dividir palavras; padrão é espaço, tab e newline",
      "Initial Function Set: define as funções carregadas automaticamente no início de cada script",
      "Index File System: controla como Bash acessa e indexa variáveis em arrays grandes",
      "Input Filter String: define expressões regulares para validar entradas de usuário no read",
    ],
    correctIndex: 0,
    explanation:
      "`IFS` controla como Bash divide strings em palavras. Alterar `IFS` é crucial ao ler CSVs, iterar linhas com espaços ou usar `read` para parse específico. Sempre restaurar após modificar.",
    example:
      "# Ler CSV corretamente\nwhile IFS=',' read -r nome email idade; do\n    echo \"Nome: $nome | Email: $email\"\ndone < usuarios.csv\n\n# Iterar linhas sem quebrar em espaços\nIFS=$'\\n'\nfor linha in $(cat arquivo.txt); do\n    echo \"Linha: $linha\"\ndone\nunset IFS  # restaura padrão",
  },
  {
    id: "linguagens-de-programacao__Shell/Bash__Difícil__7",
    tags: ["shell", "bash", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Shell/Bash",
    difficulty: "Difícil",
    question:
      "Como usar `sed` e `awk` para transformação de texto em pipeline?",
    options: [
      "`sed` faz substituições e transformações por linha; `awk` processa campos estruturados com lógica por coluna",
      "`sed` lê arquivos binários e `awk` processa apenas texto; ambos são limitados a 1000 linhas",
      "`awk` é a versão moderna de `sed` que o substitui completamente nas distribuições atuais",
      "`sed` filtra linhas por padrão como `grep`; `awk` apenas formata a saída sem processar lógica",
    ],
    correctIndex: 0,
    explanation:
      "`sed` (stream editor): substitui, deleta e transforma texto linha por linha. `awk`: linguagem por colunas com `$1`, `$2`, lógica `if/print`, agregação. São complementares e poderosos juntos.",
    example:
      "# sed: substituir e filtrar\nsed 's/erro/ERRO/g' app.log          # global replace\nsed -n '/ERROR/p' app.log             # só linhas com ERROR\nsed '1,5d' arquivo.txt                # deletar linhas 1 a 5\n\n# awk: processar campos\nawk '{print $1, $3}' access.log        # colunas 1 e 3\nawk -F',' '$3 > 1000 {print $1}' data.csv  # filtro + campo",
  },
  {
    id: "linguagens-de-programacao__Shell/Bash__Difícil__8",
    tags: ["shell", "bash", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Shell/Bash",
    difficulty: "Difícil",
    question:
      "O que são `here documents` e `here strings` em Bash e quando usar cada um?",
    options: [
      "Here doc (`<< EOF`): bloco de texto multilinha como stdin; here string (`<<<`): string única como stdin",
      "Here doc cria arquivos temporários no /tmp; here string cria variáveis temporárias na sessão",
      "São equivalentes; here string é apenas a sintaxe abreviada para here doc em uma linha",
      "Here doc é para scripts interativos; here string é exclusivo para comandos de rede como ssh e curl",
    ],
    correctIndex: 0,
    explanation:
      "Here doc (`<< DELIM`) passa um bloco multilinha como stdin para um comando. Here string (`<<<`) passa uma única string. Úteis para evitar arquivos temporários e manter código organizado.",
    example:
      "# Here document: bloco multilinha\ncat << EOF > config.txt\nhost=localhost\nport=5432\ndb=producao\nEOF\n\n# Here string: string direto\ngrep 'email' <<< \"usuario: joao@email.com\"\n\n# Enviar comandos para outro processo\nmysql -u root << SQL\nCREATE DATABASE teste;\nUSE teste;\nSQL",
  },
  {
    id: "linguagens-de-programacao__Shell/Bash__Difícil__9",
    tags: ["shell", "bash", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Shell/Bash",
    difficulty: "Difícil",
    question:
      "Como implementar um sistema de lock em Bash para evitar execução simultânea do mesmo script?",
    options: [
      "Usando `flock` em um arquivo de lock ou verificando/criando um arquivo PID atomicamente com `mkdir`",
      "Usando a variável `$BASH_LOCK` nativa que é definida automaticamente ao iniciar o script",
      "Locks em Shell só são possíveis via programas externos como Python ou Node.js",
      "Verificando se um processo com o mesmo nome existe via `pgrep` e encerrando se encontrado",
    ],
    correctIndex: 0,
    explanation:
      "`flock` é a forma mais robusta: adquire um lock de arquivo com operação atômica do kernel. `mkdir` também é atômico no Unix. `pgrep` não é atômico e pode ter race condition.",
    example:
      '#!/bin/bash\nLOCKFILE="/var/run/meu_script.lock"\n\n# Com flock (recomendado)\nexec 200>"$LOCKFILE"\nflock -n 200 || { echo \'Script já em execução\'; exit 1; }\necho $$ > "$LOCKFILE"\n\n# Processo exclusivo aqui\necho \'Executando task única...\'\nsleep 10\n\n# Lock liberado automaticamente ao encerrar',
  },
  {
    id: "linguagens-de-programacao__Shell/Bash__Difícil__10",
    tags: ["shell", "bash", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Shell/Bash",
    difficulty: "Difícil",
    question:
      "O que é `coprocess` em Bash e quando é preferível a pipes normais?",
    options: [
      "Um processo em background com pipes bidirecionais nomeados; permite comunicação interativa bidirecional",
      "Um script que copia sua própria execução para múltiplos núcleos do processador automaticamente",
      "Um subshell que compartilha variáveis com o processo pai, diferente de subshells normais",
      "É o mesmo que executar um comando com `&`; coprocess é apenas um alias mais descritivo",
    ],
    correctIndex: 0,
    explanation:
      "`coproc` cria um processo com dois pipes nomeados (`${COPROC[0]}` para ler, `${COPROC[1]}` para escrever). Pipes normais são unidirecionais. Ideal para comunicação contínua com um processo externo.",
    example:
      '#!/bin/bash\n# Coprocess para comunicação bidirecional\ncoproc BC { bc -l; }\n\n# Escreve para o coprocess\necho \'3.14 * 2\' >&"${BC[1]}"\n# Lê a resposta\nread -r resultado <&"${BC[0]}"\necho "Resultado: $resultado" # 6.28...\n\necho \'10 / 3\' >&"${BC[1]}"\nread -r resultado <&"${BC[0]}"\necho "Resultado: $resultado"',
  },
];

const updated = [...existing, ...newCards];
fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8");
console.log(`✅ Adicionados ${newCards.length} cards de Shell/Bash`);
console.log(`📦 Total: ${updated.length} cards`);

const shell = updated.filter((c: any) => c.category === "Shell/Bash");
const f = shell.filter((c: any) => c.difficulty === "Fácil").length;
const m = shell.filter((c: any) => c.difficulty === "Médio").length;
const d = shell.filter((c: any) => c.difficulty === "Difícil").length;
console.log(
  `\nShell/Bash: total=${shell.length} | Fácil=${f} Médio=${m} Difícil=${d}`,
);
