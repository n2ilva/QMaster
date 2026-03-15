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
  // ─── DART FÁCIL 5–10 ────────────────────────────────────────────────────────
  {
    id: "linguagens-de-programacao__Dart__Fácil__5",
    tags: ["dart", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Dart",
    difficulty: "Fácil",
    question: "Como se declara uma variável de tipo inferido em Dart?",
    options: [
      "var nome = 'Ana';",
      "let nome = 'Ana';",
      "val nome = 'Ana';",
      "auto nome = 'Ana';",
    ],
    correctIndex: 0,
    explanation:
      "`var` em Dart declara uma variável com tipo inferido pelo compilador. Também é possível declarar com tipo explícito: `String nome = 'Ana';`.",
    example:
      "var nome = 'Ana';      // tipo inferido: String\nString cidade = 'SP'; // tipo explícito\nvar idade = 25;        // inferido: int",
  },
  {
    id: "linguagens-de-programacao__Dart__Fácil__6",
    tags: ["dart", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Dart",
    difficulty: "Fácil",
    question:
      "Qual é o framework principal para desenvolvimento mobile com Dart?",
    options: ["Flutter", "React Native", "Ionic", "Xamarin"],
    correctIndex: 0,
    explanation:
      "Flutter é o framework do Google que usa Dart para criar apps nativos para iOS, Android, Web e Desktop a partir de uma única base de código.",
    example:
      "// Exemplo básico Flutter/Dart\nimport 'package:flutter/material.dart';\nvoid main() => runApp(const MaterialApp(\n  home: Text('Olá, Flutter!'),\n));",
  },
  {
    id: "linguagens-de-programacao__Dart__Fácil__7",
    tags: ["dart", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Dart",
    difficulty: "Fácil",
    question: "Como se define uma lista em Dart?",
    options: [
      "List<int> numeros = [1, 2, 3];",
      "int[] numeros = {1, 2, 3};",
      "Array numeros = new Array(1, 2, 3);",
      "vector<int> numeros = [1, 2, 3];",
    ],
    correctIndex: 0,
    explanation:
      "Dart usa `List<T>` para listas tipadas. A sintaxe literal `[...]` cria uma lista. Com `var`, o tipo é inferido automaticamente.",
    example:
      "List<int> numeros = [1, 2, 3];\nvar frutas = ['maçã', 'banana']; // inferido como List<String>\nnumeros.add(4);",
  },
  {
    id: "linguagens-de-programacao__Dart__Fácil__8",
    tags: ["dart", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Dart",
    difficulty: "Fácil",
    question:
      "O que é `null safety` em Dart e como se declara uma variável que pode ser nula?",
    options: [
      "Garantia em compile-time de que variáveis não serão null; para nullable usa-se `String?`",
      "Um modo de execução que lança exceção sempre que null é encontrado",
      "Uma biblioteca que substitui null por valores padrão automaticamente",
      "Uma propriedade que só existe em tipos primitivos como int e double",
    ],
    correctIndex: 0,
    explanation:
      "Com null safety (padrão desde Dart 2.12), variáveis não são nullable por padrão. `String?` indica que pode ser null. O compilador impede acesso inseguro a valores possivelmente nulos.",
    example:
      "String nome = 'Ana';   // nunca null\nString? apelido;       // pode ser null\nprint(apelido?.length); // acesso seguro com ?.",
  },
  {
    id: "linguagens-de-programacao__Dart__Fácil__9",
    tags: ["dart", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Dart",
    difficulty: "Fácil",
    question: "Como se interpola uma variável em uma String em Dart?",
    options: [
      '"Olá, $nome!" ou "Resultado: ${a + b}"',
      '"Olá, \\(nome)!"',
      '"Olá, %(nome)s!"',
      '"Olá, {nome}!"',
    ],
    correctIndex: 0,
    explanation:
      "Dart usa `$variavel` para interpolação simples e `${expressao}` para expressões. As chaves são necessárias para expressões mais complexas.",
    example:
      "var nome = 'Dart';\nvar versao = 3;\nprint('Linguagem: $nome $versao'); // Linguagem: Dart 3\nprint('Dobro: ${versao * 2}');      // Dobro: 6",
  },
  {
    id: "linguagens-de-programacao__Dart__Fácil__10",
    tags: ["dart", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Dart",
    difficulty: "Fácil",
    question:
      "Qual palavra-chave torna uma variável imutável em tempo de compilação em Dart?",
    options: ["const", "final", "static", "readonly"],
    correctIndex: 0,
    explanation:
      "`const` é avaliado em compile-time e torna o valor completamente imutável. `final` só pode ser atribuído uma vez mas é avaliado em runtime.",
    example:
      "const pi = 3.14159;         // compile-time\nfinal agora = DateTime.now(); // runtime, uma vez\n// pi = 3.0; // ERRO: const não pode mudar",
  },

  // ─── DART MÉDIO 4–10 ────────────────────────────────────────────────────────
  {
    id: "linguagens-de-programacao__Dart__Médio__4",
    tags: ["dart", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Dart",
    difficulty: "Médio",
    question: "Qual é a diferença entre `Future` e `Stream` em Dart?",
    options: [
      "`Future` entrega um único valor assíncrono; `Stream` entrega uma sequência de valores ao longo do tempo",
      "`Stream` é síncrono e `Future` é assíncrono; ambos retornam múltiplos valores",
      "`Future` é para operações de rede; `Stream` é exclusivo para leitura de arquivos",
      "Ambos são idênticos; `Stream` é apenas o nome moderno para `Future`",
    ],
    correctIndex: 0,
    explanation:
      "`Future<T>` representa um valor que estará disponível no futuro (uma vez). `Stream<T>` é uma sequência assíncrona de eventos — como WebSocket, sensores ou leituras de arquivo.",
    example:
      "// Future: um resultado\nFuture<String> buscar() async => 'dados';\n\n// Stream: múltiplos resultados\nStream<int> contador() async* {\n  for (int i = 0; i < 5; i++) yield i;\n}",
  },
  {
    id: "linguagens-de-programacao__Dart__Médio__5",
    tags: ["dart", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Dart",
    difficulty: "Médio",
    question:
      "O que são `mixins` em Dart e qual o benefício em relação à herança tradicional?",
    options: [
      "Permitem reutilizar comportamentos em múltiplas classes sem herança única, evitando hierarquias rígidas",
      "São classes abstratas que obrigam subclasses a implementar todos os métodos",
      "Equivalentes a interfaces; servem apenas para definir contratos sem implementação",
      "São uma forma de herança múltipla completa que substitui a palavra-chave `extends`",
    ],
    correctIndex: 0,
    explanation:
      "Mixins (`mixin`) permitem adicionar funcionalidades a classes via `with`, sem precisar de herança direta. Uma classe pode usar múltiplos mixins, evitando o problema de herança única.",
    example:
      "mixin Voador {\n  void voar() => print('Voando!');\n}\nmixin Nadador {\n  void nadar() => print('Nadando!');\n}\nclass Pato with Voador, Nadador {}",
  },
  {
    id: "linguagens-de-programacao__Dart__Médio__6",
    tags: ["dart", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Dart",
    difficulty: "Médio",
    question: "O que é o operador `??` (null-coalescing) em Dart?",
    options: [
      "Retorna o valor da esquerda se não for null; caso contrário, retorna o da direita",
      "Verifica se dois valores são identicamente iguais, incluindo tipo e referência",
      "É um operador de concatenação para strings que podem ser null",
      "Converte automaticamente null em false em expressões booleanas",
    ],
    correctIndex: 0,
    explanation:
      "`a ?? b` retorna `a` se não for null; se `a` for null, retorna `b`. Útil para valores padrão. `??=` atribuição condicional: só atribui se a variável for null.",
    example:
      "String? nome;\nString exibir = nome ?? 'Anônimo'; // 'Anônimo'\n\nnome ??= 'Padrão'; // atribui só se null\nprint(nome); // 'Padrão'",
  },
  {
    id: "linguagens-de-programacao__Dart__Médio__7",
    tags: ["dart", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Dart",
    difficulty: "Médio",
    question: "Como funciona o `cascade notation` (`..`) em Dart?",
    options: [
      "Permite encadear múltiplas operações no mesmo objeto sem repetir a referência",
      "É o operador de herança que define a cadeia de protótipos entre classes",
      "Concatena duas listas em uma nova lista sem modificar as originais",
      "Define a ordem de precedência de operadores em expressões complexas",
    ],
    correctIndex: 0,
    explanation:
      "O operador `..` retorna o objeto receptor após cada operação, permitindo encadeamento de chamadas sem variável intermediária.",
    example:
      "final lista = <String>[]\n  ..add('um')\n  ..add('dois')\n  ..add('três');\n// equivale a criar a lista e chamar add três vezes",
  },
  {
    id: "linguagens-de-programacao__Dart__Médio__8",
    tags: ["dart", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Dart",
    difficulty: "Médio",
    question: "O que é `extension methods` em Dart e qual problema resolve?",
    options: [
      "Adiciona métodos a tipos existentes sem modificar ou herdar de sua classe original",
      "Estende o número máximo de métodos que uma classe pode ter além do limite padrão",
      "Define métodos que só existem na versão de extensão do SDK, não no núcleo",
      "Permite que métodos privados sejam acessados por classes filhas via extensão",
    ],
    correctIndex: 0,
    explanation:
      "Extensions permitem adicionar funcionalidade a qualquer tipo (inclusive tipos built-in como `String` ou `List`) sem subclassing. Resolvem o problema de não poder modificar bibliotecas externas.",
    example:
      "extension StringUtils on String {\n  String capitalizar() =>\n    this[0].toUpperCase() + substring(1);\n}\nprint('dart'.capitalizar()); // 'Dart'",
  },
  {
    id: "linguagens-de-programacao__Dart__Médio__9",
    tags: ["dart", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Dart",
    difficulty: "Médio",
    question:
      "Qual é a diferença entre `final` e `const` para objetos em Dart?",
    options: [
      "`const` cria objetos canonicalizados em compile-time; `final` aceita valores de runtime",
      "`final` é mais eficiente em memória; `const` usa mais espaço por ser avaliado em runtime",
      "`const` só funciona com tipos primitivos; `final` funciona com qualquer tipo",
      "São equivalentes para objetos; a diferença existe apenas para variáveis primitivas",
    ],
    correctIndex: 0,
    explanation:
      "`const` objetos são criados em compile-time e canonicalizados (instâncias com mesmos valores são idênticas na memória). `final` pode ser sobreviviência a runtime, mas não pode ser reatribuído.",
    example:
      "const a = Point(1, 2);\nconst b = Point(1, 2);\nprint(identical(a, b)); // true (mesma instância)\n\nfinal c = Point(1, 2);\nfinal d = Point(1, 2);\nprint(identical(c, d)); // false",
  },
  {
    id: "linguagens-de-programacao__Dart__Médio__10",
    tags: ["dart", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Dart",
    difficulty: "Médio",
    question: "O que é `Sound Null Safety` em Dart e como é verificado?",
    options: [
      "Garantia em compile-time de que nenhum valor não-nullable pode ser null, sem checagens de runtime desnecessárias",
      "Um modo de execução que converte NullPointerExceptions em avisos de log silenciosos",
      "Uma biblioteca que adiciona verificações de null em runtime para APIs legadas",
      "Um linter que sugere adicionar verificações de null apenas em código público",
    ],
    correctIndex: 0,
    explanation:
      "Sound null safety garante que o sistema de tipos é completamente confiável: se o compilador diz que um valor não é null, ele nunca será null. Elimina toda uma classe de erros em runtime.",
    example:
      "// Com sound null safety:\nString nome = obterNome(); // compilador garante: nunca null\nprint(nome.length);       // sem checagem de null necessária\n\nString? talvez = talvezNome();\nprint(talvez!.length);    // ! força unwrap (lança se null)",
  },

  // ─── DART DIFÍCIL 4–10 ──────────────────────────────────────────────────────
  {
    id: "linguagens-de-programacao__Dart__Difícil__4",
    tags: ["dart", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Dart",
    difficulty: "Difícil",
    question: "Como o isolate model do Dart difere de threads convencionais?",
    options: [
      "Isolates não compartilham memória; comunicam-se apenas por mensagens, eliminando data races por design",
      "Isolates são threads com GIL (Global Interpreter Lock) como no Python, mais lentas",
      "Isolates compartilham heap mas têm stacks separadas, como goroutines do Go",
      "Isolates são apenas um nome alternativo para `Future`, sem diferença de concorrência",
    ],
    correctIndex: 0,
    explanation:
      "Cada isolate tem seu próprio heap e não compartilha memória com outros. A comunicação é por mensagens via `SendPort/ReceivePort`. Isso elimina data races por design, mas exige serialização de dados.",
    example:
      "import 'dart:isolate';\nfuture<void> main() async {\n  final port = ReceivePort();\n  await Isolate.spawn(tarefa, port.sendPort);\n  print(await port.first); // recebe resultado\n}\nvoid tarefa(SendPort p) => p.send('pronto');",
  },
  {
    id: "linguagens-de-programacao__Dart__Difícil__5",
    tags: ["dart", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Dart",
    difficulty: "Difícil",
    question:
      "O que são `sealed classes` em Dart 3 e qual é seu principal uso com pattern matching?",
    options: [
      "Classes fechadas dentro de uma biblioteca; o compilador garante que switch cobre todos os subtipos",
      "Classes que herdam de `Object` e proíbem qualquer tipo de subclassing fora da própria classe",
      "Classes com campos finais que não podem ser modificados após a construção",
      "Classes que encapsulam lógica de segurança impedindo acesso externo a seus métodos",
    ],
    correctIndex: 0,
    explanation:
      "`sealed` restringe subclasses ao mesmo arquivo/biblioteca. O compilador usa isso para exaustividade em `switch`: sabe todos os subtipos possíveis, gerando erro se algum não for tratado.",
    example:
      "sealed class Forma {}\nclass Circulo extends Forma { final double raio; Circulo(this.raio); }\nclass Quadrado extends Forma { final double lado; Quadrado(this.lado); }\n\ndouble area(Forma f) => switch(f) {\n  Circulo c => 3.14 * c.raio * c.raio,\n  Quadrado q => q.lado * q.lado, // exaustivo!\n};",
  },
  {
    id: "linguagens-de-programacao__Dart__Difícil__6",
    tags: ["dart", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Dart",
    difficulty: "Difícil",
    question:
      "Como o Dart compila para diferentes plataformas e quais são os modos de compilação?",
    options: [
      "AOT para mobile/desktop (binário nativo), JIT para desenvolvimento (hot reload), JS para web",
      "Apenas JIT em todas as plataformas; binários nativos não são suportados",
      "Compilação para WebAssembly em todas as plataformas como alvo único",
      "Transpila para C++ que é então compilado para cada plataforma alvo",
    ],
    correctIndex: 0,
    explanation:
      "Dart usa JIT (Just-in-Time) no desenvolvimento para hot reload rápido. Em produção, usa AOT (Ahead-of-Time) gerando binários nativos (ARM/x64). Para web, compila para JavaScript ou WebAssembly.",
    example:
      "// Desenvolvimento (JIT):\n// flutter run  ← usa JIT, permite hot reload\n\n// Produção (AOT):\n// flutter build apk  ← compila AOT para ARM\n// flutter build web  ← compila para JS/WASM",
  },
  {
    id: "linguagens-de-programacao__Dart__Difícil__7",
    tags: ["dart", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Dart",
    difficulty: "Difícil",
    question: "O que são `records` em Dart 3 e como diferem de classes e Maps?",
    options: [
      "Tipos anônimos de valor imutáveis com campos nomeados ou posicionais, sem precisar definir uma classe",
      "Um alias para `Map<String, dynamic>` com verificação de tipos em tempo de compilação",
      "Classes geradas automaticamente pelo compilador para substituir `data classes` de Kotlin",
      "São mutáveis ao contrário das classes; usados internamente pelo compilador para otimização",
    ],
    correctIndex: 0,
    explanation:
      "Records (`(String, int)`) são value types anônimos imutáveis. Ao contrário de Maps, são tipados e verificados em compile-time. Ao contrário de classes, não precisam de declaração prévia.",
    example:
      "(String, int) getPessoa() => ('Ana', 25);\n\nfinal p = getPessoa();\nprint(p.$1); // 'Ana'\nprint(p.$2); // 25\n\n// Com campos nomeados:\n({String nome, int idade}) q = (nome: 'Ana', idade: 25);",
  },
  {
    id: "linguagens-de-programacao__Dart__Difícil__8",
    tags: ["dart", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Dart",
    difficulty: "Difícil",
    question: "Como funciona o `pattern matching` com `switch` em Dart 3?",
    options: [
      "Permite desestruturar e verificar tipos/valores simultaneamente em switch expressions e statements",
      "É apenas uma sintaxe alternativa para if/else encadeado sem novas capacidades",
      "Funciona somente com tipos primitivos como int e String, não com objetos customizados",
      "Requer que todos os tipos usados nos patterns implementem o protocolo `Matchable`",
    ],
    correctIndex: 0,
    explanation:
      "Dart 3 trouxe patterns: desestruturação, type testing, destructuring de records/objects e guards com `when`. Funciona em switch, if-case e declarações.",
    example:
      "Object valor = (42, 'olá');\nswitch (valor) {\n  case (int n, String s) when n > 0:\n    print('Positivo: $n, $s');\n  case (int n, _):\n    print('Int: $n');\n}",
  },
  {
    id: "linguagens-de-programacao__Dart__Difícil__9",
    tags: ["dart", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Dart",
    difficulty: "Difícil",
    question:
      "O que é `late` em Dart e quando seu uso é adequado vs problemático?",
    options: [
      "Adia a inicialização para o primeiro acesso; adequado para injeção de dependência, problemático se nunca inicializado",
      "Marca variáveis para inicialização em background thread assim que o isolate estiver disponível",
      "Indica ao compilador que a variável pode ser null mesmo sem o sufixo `?`",
      "É equivalente a `lazy val` do Kotlin, recalculando o valor a cada acesso",
    ],
    correctIndex: 0,
    explanation:
      "`late` diz 'confie em mim, isso será inicializado antes do uso'. Útil para campos inicializados fora do construtor (ex: `initState` no Flutter). Se acessado antes de inicializar, joga `LateInitializationError`.",
    example:
      "class Servico {\n  late DatabaseConnection db; // inicializado depois\n  \n  Future<void> init() async {\n    db = await DatabaseConnection.create();\n  }\n}",
  },
  {
    id: "linguagens-de-programacao__Dart__Difícil__10",
    tags: ["dart", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Dart",
    difficulty: "Difícil",
    question:
      "Como `async*` e `yield` funcionam em Dart para gerar streams síncronas e assíncronas?",
    options: [
      "`async*` cria geradores assíncronos (Stream); `sync*` cria síncronos (Iterable); `yield` emite um valor; `yield*` delega a outra stream/iterable",
      "`async*` é idêntico a `async`; `yield` é apenas um alias para `return` em funções assíncronas",
      "`yield` pausa a função e retorna ao chamador, que deve chamá-la novamente para continuar",
      "`sync*` e `async*` são apenas para funções recursivas; funções normais não podem usar `yield`",
    ],
    correctIndex: 0,
    explanation:
      "Dart tem dois tipos de geradores: `sync*` retorna `Iterable<T>` (síncrono), `async*` retorna `Stream<T>` (assíncrono). `yield` emite um valor; `yield*` delega para outra sequência inteira.",
    example:
      "// Gerador síncrono\nIterable<int> pares(int n) sync* {\n  for (int i = 0; i <= n; i += 2) yield i;\n}\n// Gerador assíncrono\nStream<int> timer() async* {\n  for (int i = 0; i < 3; i++) {\n    await Future.delayed(Duration(seconds: 1));\n    yield i;\n  }\n}",
  },
];

const updated = [...existing, ...newCards];
fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8");
console.log(`✅ Adicionados ${newCards.length} cards de Dart`);
console.log(`📦 Total: ${updated.length} cards`);

const dart = updated.filter((c: any) => c.category === "Dart");
const f = dart.filter((c: any) => c.difficulty === "Fácil").length;
const m = dart.filter((c: any) => c.difficulty === "Médio").length;
const d = dart.filter((c: any) => c.difficulty === "Difícil").length;
console.log(
  `\nDart: total=${dart.length} | Fácil=${f} Médio=${m} Difícil=${d}`,
);
