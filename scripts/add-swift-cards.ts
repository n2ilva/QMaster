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
  // ─── SWIFT FÁCIL 5–10 ───────────────────────────────────────────────────────
  {
    id: "linguagens-de-programacao__Swift__Fácil__5",
    tags: ["swift", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Swift",
    difficulty: "Fácil",
    question: "Como se declara uma constante em Swift?",
    options: [
      'let nome = "Ana"',
      'var nome = "Ana"',
      'const nome = "Ana"',
      'final nome = "Ana"',
    ],
    correctIndex: 0,
    explanation:
      "`let` declara constantes imutáveis em Swift. `var` declara variáveis mutáveis. `const` e `final` não existem para esse fim em Swift.",
    example:
      'let cidade = "São Paulo"  // constante\nvar temperatura = 25     // variável\ntemperatura = 30         // OK\n// cidade = "Rio"        // ERRO',
  },
  {
    id: "linguagens-de-programacao__Swift__Fácil__6",
    tags: ["swift", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Swift",
    difficulty: "Fácil",
    question:
      "Qual o tipo de dado para representar um número com casas decimais em Swift?",
    options: ["Double", "Float", "Decimal", "Number"],
    correctIndex: 0,
    explanation:
      "`Double` é o tipo padrão para decimais em Swift, com 64 bits de precisão. `Float` tem 32 bits. Swift infere `Double` para literais decimais.",
    example:
      "let pi = 3.14159          // inferido como Double\nlet pi32: Float = 3.14   // Float explícito",
  },
  {
    id: "linguagens-de-programacao__Swift__Fácil__7",
    tags: ["swift", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Swift",
    difficulty: "Fácil",
    question: "Como se interpola uma variável dentro de uma String em Swift?",
    options: [
      '"Olá, \\(nome)!"',
      '"Olá, ${nome}!"',
      '"Olá, %s!" % nome',
      '"Olá, " + nome + "!"',
    ],
    correctIndex: 0,
    explanation:
      "Swift usa `\\(expressão)` para interpolação de strings. Qualquer expressão pode ser interpolada, não só variáveis.",
    example:
      'let nome = "Maria"\nlet idade = 30\nprint("\\(nome) tem \\(idade) anos") // Maria tem 30 anos',
  },
  {
    id: "linguagens-de-programacao__Swift__Fácil__8",
    tags: ["swift", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Swift",
    difficulty: "Fácil",
    question:
      "Qual estrutura de controle em Swift percorre uma coleção elemento a elemento?",
    options: [
      "for item in colecao { }",
      "foreach item in colecao { }",
      "for (item : colecao) { }",
      "loop item in colecao { }",
    ],
    correctIndex: 0,
    explanation:
      "Swift usa `for ... in` para iterar sobre coleções, ranges e sequências. Não há `foreach` como palavra-chave dedicada.",
    example:
      'let frutas = ["maçã", "banana", "laranja"]\nfor fruta in frutas {\n    print(fruta)\n}',
  },
  {
    id: "linguagens-de-programacao__Swift__Fácil__9",
    tags: ["swift", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Swift",
    difficulty: "Fácil",
    question: "O que é um Optional em Swift e como se declara?",
    options: [
      "Um tipo que pode conter um valor ou nil, declarado com `?` após o tipo",
      "Uma função que pode ser chamada ou ignorada opcionalmente",
      "Um modificador de acesso para propriedades opcionais de uma classe",
      "Um protocolo que permite herança opcional de métodos",
    ],
    correctIndex: 0,
    explanation:
      "Optionals (`String?`, `Int?`) representam ausência de valor. Uma variável optional pode conter um valor ou `nil`. É necessário desembrulhar (`unwrap`) antes de usar.",
    example:
      'var nome: String? = "Ana"\nnome = nil          // válido para optional\nif let n = nome {\n    print(n)        // desembrulha com segurança\n}',
  },
  {
    id: "linguagens-de-programacao__Swift__Fácil__10",
    tags: ["swift", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Swift",
    difficulty: "Fácil",
    question: "Qual palavra-chave define uma função em Swift?",
    options: ["func", "fn", "function", "def"],
    correctIndex: 0,
    explanation:
      "Swift utiliza `func` para definir funções. A sintaxe inclui nome, parâmetros com labels e tipo de retorno indicado após `->`.",
    example:
      'func saudar(nome: String) -> String {\n    return "Olá, \\(nome)!"\n}\nprint(saudar(nome: "Carlos"))',
  },

  // ─── SWIFT MÉDIO 4–10 ───────────────────────────────────────────────────────
  {
    id: "linguagens-de-programacao__Swift__Médio__4",
    tags: ["swift", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Swift",
    difficulty: "Médio",
    question: "Qual é a diferença entre `struct` e `class` em Swift?",
    options: [
      "`struct` é value type (copiado); `class` é reference type (referência compartilhada)",
      "`class` suporta herança; `struct` não, mas ambos são reference types",
      "`struct` não pode ter métodos; `class` pode ter métodos e propriedades",
      "Não há diferença prática; `struct` é apenas uma sintaxe alternativa para `class`",
    ],
    correctIndex: 0,
    explanation:
      "Structs usam semântica de valor: ao atribuir, copia-se o dado. Classes usam semântica de referência: múltiplas variáveis apontam para o mesmo objeto na memória.",
    example:
      "struct Ponto { var x: Int; var y: Int }\nvar p1 = Ponto(x: 1, y: 2)\nvar p2 = p1  // cópia\np2.x = 99\nprint(p1.x) // ainda 1 — p1 não foi alterado",
  },
  {
    id: "linguagens-de-programacao__Swift__Médio__5",
    tags: ["swift", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Swift",
    difficulty: "Médio",
    question: "O que é `guard let` e em qual situação é preferido a `if let`?",
    options: [
      "`guard let` exige saída do escopo se nil; deixa o valor desembrulhado disponível no resto da função",
      "`guard let` é idêntico a `if let`, mas só funciona em closures assíncronas",
      "`guard let` não desembrulha optionals; apenas verifica se o valor não é nil",
      "`guard let` cria uma cópia defensiva do optional para uso seguro em múltiplas threads",
    ],
    correctIndex: 0,
    explanation:
      "`guard let` falha cedo e sai do escopo (`return`, `throw`, etc.), mantendo o fluxo principal sem indentação. O valor desembrulhado fica disponível após o guard.",
    example:
      'func processar(nome: String?) {\n    guard let n = nome else { return }\n    // n está disponível aqui\n    print("Olá, \\(n)")\n}',
  },
  {
    id: "linguagens-de-programacao__Swift__Médio__6",
    tags: ["swift", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Swift",
    difficulty: "Médio",
    question: "O que são `protocols` em Swift e qual sua principal função?",
    options: [
      "Contratos que definem métodos e propriedades que tipos conformantes devem implementar",
      "Regras de comunicação de rede usadas pelo URLSession internamente",
      "Modificadores que definem a visibilidade de métodos entre módulos",
      "Estruturas especiais que permitem herança múltipla entre classes Swift",
    ],
    correctIndex: 0,
    explanation:
      "Protocols definem uma interface (contrato) que structs, classes e enums podem adotar. São fundamentais no paradigma Protocol-Oriented Programming do Swift.",
    example:
      'protocol Descritivel {\n    var descricao: String { get }\n}\nstruct Livro: Descritivel {\n    var titulo: String\n    var descricao: String { "Livro: \\(titulo)" }\n}',
  },
  {
    id: "linguagens-de-programacao__Swift__Médio__7",
    tags: ["swift", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Swift",
    difficulty: "Médio",
    question: "Como funciona o gerenciamento de memória em Swift?",
    options: [
      "ARC (Automatic Reference Counting): o compilador insere retain/release automaticamente",
      "Garbage collector em runtime similar ao Java e C#",
      "Gerenciamento manual com malloc/free, como em C e C++",
      "Todas as variáveis são alocadas exclusivamente na stack, sem uso de heap",
    ],
    correctIndex: 0,
    explanation:
      "Swift usa ARC: o compilador rastreia referências a objetos e libera memória quando a contagem chega a zero. Não há pausas de GC. Ciclos podem ser quebrados com `weak` e `unowned`.",
    example:
      "class Pessoa {\n    var nome: String\n    weak var amigo: Pessoa? // weak evita ciclo de referência\n    init(nome: String) { self.nome = nome }\n}",
  },
  {
    id: "linguagens-de-programacao__Swift__Médio__8",
    tags: ["swift", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Swift",
    difficulty: "Médio",
    question:
      "O que é uma closure em Swift e como ela captura variáveis do escopo externo?",
    options: [
      "Bloco de código que pode capturar e armazenar referências a variáveis do contexto onde foi criado",
      "Um tipo de classe sem nome que só pode ser instanciado uma vez por escopo",
      "Uma função que não pode acessar variáveis externas ao seu corpo (escopo fechado)",
      "Uma sintaxe especial para declarar funções que retornam outras funções",
    ],
    correctIndex: 0,
    explanation:
      "Closures capturam variáveis do escopo circundante por referência (para tipos referência) ou por valor (com `[capture list]`). São equivalentes a lambdas em outras linguagens.",
    example:
      "var contador = 0\nlet incrementar = { contador += 1 } // captura contador\nincrementar()\nincrementar()\nprint(contador) // 2",
  },
  {
    id: "linguagens-de-programacao__Swift__Médio__9",
    tags: ["swift", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Swift",
    difficulty: "Médio",
    question:
      "O que é `@escaping` em uma closure de parâmetro de função Swift?",
    options: [
      "Indica que a closure pode ser armazenada e executada após o retorno da função",
      "Marca a closure para execução em background thread automaticamente",
      "Permite que a closure lance erros sem precisar de try/catch",
      "Define que a closure não captura nenhuma variável do escopo externo",
    ],
    correctIndex: 0,
    explanation:
      "Por padrão, closures em parâmetros são `@nonescaping`: executam durante a função e morrem. `@escaping` permite que a closure sobreviva à função (ex: callbacks assíncronos).",
    example:
      "var callbacks: [() -> Void] = []\nfunc registrar(cb: @escaping () -> Void) {\n    callbacks.append(cb) // closure escapa da função\n}",
  },
  {
    id: "linguagens-de-programacao__Swift__Médio__10",
    tags: ["swift", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Swift",
    difficulty: "Médio",
    question: "Como o `switch` em Swift difere do `switch` em C ou Java?",
    options: [
      "Não há fall-through implícito; cada case é independente e aceita pattern matching avançado",
      "O `switch` Swift é idêntico ao C; também requer `break` em cada case",
      "Swift não tem `switch`; usa apenas `if/else` para múltiplas condições",
      "O `switch` Swift só funciona com tipos numéricos, não com strings ou enums",
    ],
    correctIndex: 0,
    explanation:
      "Em Swift, cada `case` já é isolado (sem fall-through). Além disso, aceita pattern matching com ranges, tuples, condições `where`, e deve ser exaustivo.",
    example:
      'let nota = 85\nswitch nota {\ncase 90...100: print("A")\ncase 70..<90:  print("B")\ncase 60..<70:  print("C")\ndefault:        print("D")\n}',
  },

  // ─── SWIFT DIFÍCIL 4–10 ─────────────────────────────────────────────────────
  {
    id: "linguagens-de-programacao__Swift__Difícil__4",
    tags: ["swift", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Swift",
    difficulty: "Difícil",
    question:
      "O que é `@MainActor` em Swift Concurrency e quando deve ser usado?",
    options: [
      "Garante que código marcado execute na main thread; usado em UI e propriedades @Published",
      "Define uma classe como ponto de entrada principal do aplicativo iOS",
      "É um property wrapper para sincronizar acesso entre múltiplas actors",
      "Força a execução de funções async em background mesmo que chamadas da main thread",
    ],
    correctIndex: 0,
    explanation:
      "`@MainActor` é um global actor que garante execução serializada na main thread. Essencial para código que atualiza UI, pois UIKit/SwiftUI exigem main thread.",
    example:
      '@MainActor\nclass ViewModel: ObservableObject {\n    @Published var titulo = ""\n    func carregar() async {\n        titulo = await buscarDados() // atualiza na main thread\n    }\n}',
  },
  {
    id: "linguagens-de-programacao__Swift__Difícil__5",
    tags: ["swift", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Swift",
    difficulty: "Difícil",
    question: "O que são `actors` em Swift e como previnem data races?",
    options: [
      "Tipos de referência que serializam acesso às suas propriedades, permitindo apenas um acesso por vez",
      "Classes especiais que executam todos os seus métodos em threads separadas automaticamente",
      "Protocolo que deve ser adotado por classes que usam async/await",
      "Wrappers em torno de `DispatchQueue` para simplificar a sintaxe de concorrência",
    ],
    correctIndex: 0,
    explanation:
      "Actors isolam seu estado: só uma tarefa acessa suas propriedades por vez. O compilador garante isso — acessos externos exigem `await`. Previne data races sem locks manuais.",
    example:
      "actor Contador {\n    var valor = 0\n    func incrementar() { valor += 1 }\n}\nlet c = Contador()\nawait c.incrementar() // acesso serializado",
  },
  {
    id: "linguagens-de-programacao__Swift__Difícil__6",
    tags: ["swift", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Swift",
    difficulty: "Difícil",
    question:
      "O que é `Sendable` em Swift Concurrency e por que tipos precisam conformar com ele?",
    options: [
      "Protocolo que marca tipos seguros para transferência entre concurrency domains sem causar data races",
      "Interface para tipos que podem ser serializados e enviados via URLSession",
      "Protocolo obrigatório para qualquer tipo usado em funções marcadas com `async`",
      "Marcador que permite que structs sejam passadas entre diferentes módulos do app",
    ],
    correctIndex: 0,
    explanation:
      "`Sendable` garante que um tipo é thread-safe para cruzar fronteiras de concorrência (ex: passar para outra actor). Value types geralmente conformam automaticamente; classes precisam de cuidado.",
    example:
      "struct Mensagem: Sendable {\n    let texto: String // String é Sendable\n}\nfunc enviar(_ msg: Mensagem) async {\n    await minhaActor.processar(msg)\n}",
  },
  {
    id: "linguagens-de-programacao__Swift__Difícil__7",
    tags: ["swift", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Swift",
    difficulty: "Difícil",
    question:
      "Como Result Builders funcionam em Swift e qual é seu uso no SwiftUI?",
    options: [
      "Permitem DSLs de múltiplas expressões em um bloco que são combinadas em um único valor de retorno",
      "São macros que transformam código imperativo em funcional durante a compilação",
      "Definem a ordem de construção de objetos substituindo o uso de `init`",
      "Permitem que funções retornem múltiplos valores sem usar tuplas ou arrays",
    ],
    correctIndex: 0,
    explanation:
      "`@resultBuilder` permite que o compilador transforme um bloco de expressões em chamadas de `buildBlock`, `buildIf`, etc. SwiftUI usa `@ViewBuilder` para compor views hierarquicamente.",
    example:
      '@ViewBuilder\nvar body: some View {\n    Text("Título")   // sem vírgula ou return\n    Text("Subtítulo") // ViewBuilder combina em TupleView\n}',
  },
  {
    id: "linguagens-de-programacao__Swift__Difícil__8",
    tags: ["swift", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Swift",
    difficulty: "Difícil",
    question:
      "O que é `opaque type` (`some Protocol`) em Swift e como difere de `any Protocol`?",
    options: [
      "`some` preserva o tipo concreto para o compilador (mais eficiente); `any` apaga o tipo em runtime (existential)",
      "`some` é para tipos opcionais; `any` é para tipos que conformam com múltiplos protocolos",
      "`any` evita boxing e é sempre mais eficiente que `some` para collections",
      "São equivalentes; `some` é apenas uma sintaxe mais nova para `any`",
    ],
    correctIndex: 0,
    explanation:
      "`some View` usa type erasure estática: o compilador sabe o tipo concreto, gerando código eficiente. `any View` usa existential container com indireção dinâmica (boxing), adicionando overhead.",
    example:
      '// some: tipo concreto preservado no compile-time\nfunc criar() -> some View { Text("oi") }\n// any: tipo apagado em runtime, boxing\nfunc criar2() -> any View { Text("oi") }',
  },
  {
    id: "linguagens-de-programacao__Swift__Difícil__9",
    tags: ["swift", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Swift",
    difficulty: "Difícil",
    question:
      "Como funcionam os `property wrappers` em Swift e quais exemplos existem no SwiftUI?",
    options: [
      "Adicionam comportamento get/set a propriedades via tipo anotado com `@propertyWrapper`; ex: `@State`, `@Binding`, `@Published`",
      "São decorators que só servem para marking de propriedades como privadas ou públicas",
      "Wrappers que fazem boxing automático de value types quando usados em classes",
      "Macros de compilação que transformam propriedades stored em computed properties",
    ],
    correctIndex: 0,
    explanation:
      "Property wrappers (`@State`, `@Binding`, `@Published`, `@AppStorage`) encapsulam lógica de armazenamento e notificação. `@State` armazena na view; `@Binding` compartilha entre views.",
    example:
      'struct ContadorView: View {\n    @State private var count = 0  // wrapper gerencia o storage\n    var body: some View {\n        Button("\\(count)") { count += 1 }\n    }\n}',
  },
  {
    id: "linguagens-de-programacao__Swift__Difícil__10",
    tags: ["swift", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Swift",
    difficulty: "Difícil",
    question:
      "O que são `macros` em Swift 5.9+ e como diferem de funções e property wrappers?",
    options: [
      "Transformam código em tempo de compilação gerando novos AST nodes; não existem em runtime",
      "São funções que executam antes do `main()` para configurar o ambiente de execução",
      "Equivalentes a `#define` do C; substituição textual simples sem verificação de tipos",
      "São property wrappers com capacidade de acessar metadados de reflexão em runtime",
    ],
    correctIndex: 0,
    explanation:
      "Macros Swift (`@attached`, `#freestanding`) são plugins do compilador que recebem AST e emitem novo código Swift type-safe. Diferente de C macros (textual) e property wrappers (runtime).",
    example:
      '// @Observable (macro Swift 5.9) substitui boilerplate de ObservableObject\n@Observable\nclass Modelo {\n    var nome = "" // compilador gera tracking automático\n}',
  },
];

const updated = [...existing, ...newCards];
fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8");
console.log(`✅ Adicionados ${newCards.length} cards de Swift`);
console.log(`📦 Total: ${updated.length} cards`);

const swift = updated.filter((c: any) => c.category === "Swift");
const f = swift.filter((c: any) => c.difficulty === "Fácil").length;
const m = swift.filter((c: any) => c.difficulty === "Médio").length;
const d = swift.filter((c: any) => c.difficulty === "Difícil").length;
console.log(
  `\nSwift: total=${swift.length} | Fácil=${f} Médio=${m} Difícil=${d}`,
);
