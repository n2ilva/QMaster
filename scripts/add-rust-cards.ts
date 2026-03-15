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
  // ─── RUST FÁCIL 5–10 ────────────────────────────────────────────────────────
  {
    id: "linguagens-de-programacao__Rust__Fácil__5",
    tags: ["rust", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Rust",
    difficulty: "Fácil",
    question: "Como se declara uma variável imutável em Rust?",
    options: ["let x = 5;", "var x = 5;", "const x = 5;", "int x = 5;"],
    correctIndex: 0,
    explanation:
      "Em Rust, `let` declara variáveis imutáveis por padrão. Para mutabilidade, usa-se `let mut`.",
    example:
      "let x = 5;\nlet mut y = 10;\ny = 20; // OK\n// x = 6; // ERRO: não é mutável",
  },
  {
    id: "linguagens-de-programacao__Rust__Fácil__6",
    tags: ["rust", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Rust",
    difficulty: "Fácil",
    question: "Qual tipo representa um inteiro sem sinal de 32 bits em Rust?",
    options: ["u32", "i32", "uint", "unsigned int"],
    correctIndex: 0,
    explanation:
      "`u32` é o tipo para inteiro sem sinal de 32 bits. O prefixo `u` significa unsigned (sem sinal).",
    example: "let idade: u32 = 25;\nlet negativo: i32 = -10; // com sinal",
  },
  {
    id: "linguagens-de-programacao__Rust__Fácil__7",
    tags: ["rust", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Rust",
    difficulty: "Fácil",
    question: "Como se imprime texto no console em Rust?",
    options: [
      'println!("texto");',
      'print("texto");',
      'console.log("texto");',
      'echo "texto";',
    ],
    correctIndex: 0,
    explanation:
      "`println!` é uma macro que imprime texto seguido de nova linha. O `!` indica que é uma macro, não uma função.",
    example: 'println!("Olá, mundo!");\nprintln!("Valor: {}", 42);',
  },
  {
    id: "linguagens-de-programacao__Rust__Fácil__8",
    tags: ["rust", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Rust",
    difficulty: "Fácil",
    question: "Qual palavra-chave define uma função em Rust?",
    options: ["fn", "func", "function", "def"],
    correctIndex: 0,
    explanation: "Em Rust, funções são definidas com a palavra-chave `fn`.",
    example: "fn somar(a: i32, b: i32) -> i32 {\n    a + b\n}",
  },
  {
    id: "linguagens-de-programacao__Rust__Fácil__9",
    tags: ["rust", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Rust",
    difficulty: "Fácil",
    question: "Como se cria um vetor (array dinâmico) em Rust?",
    options: [
      "let v = vec![1, 2, 3];",
      "let v = [1, 2, 3];",
      "let v = new Vec(1, 2, 3);",
      "let v = list![1, 2, 3];",
    ],
    correctIndex: 0,
    explanation:
      "A macro `vec!` cria um `Vec<T>` — o tipo de vetor dinâmico do Rust. `[1,2,3]` cria um array de tamanho fixo.",
    example:
      'let mut v = vec![1, 2, 3];\nv.push(4);\nprintln!("{:?}", v); // [1, 2, 3, 4]',
  },
  {
    id: "linguagens-de-programacao__Rust__Fácil__10",
    tags: ["rust", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Rust",
    difficulty: "Fácil",
    question: "O que é o `Cargo` no ecossistema Rust?",
    options: [
      "Gerenciador de pacotes e build system",
      "Um framework web para Rust",
      "O compilador oficial da linguagem",
      "Uma biblioteca padrão de coleções",
    ],
    correctIndex: 0,
    explanation:
      "`Cargo` é o gerenciador de pacotes e build system do Rust. Ele compila projetos, gerencia dependências (crates) e executa testes.",
    example: "cargo new meu_projeto\ncargo build\ncargo run\ncargo test",
  },

  // ─── RUST MÉDIO 4–10 ────────────────────────────────────────────────────────
  {
    id: "linguagens-de-programacao__Rust__Médio__4",
    tags: ["rust", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Rust",
    difficulty: "Médio",
    question:
      "O que acontece quando você move um valor para outra variável em Rust?",
    options: [
      "A variável original fica inválida e não pode mais ser usada",
      "Ambas as variáveis apontam para o mesmo dado na memória",
      "O valor é copiado automaticamente para as duas variáveis",
      "Rust lança um erro em tempo de compilação sobre duplicação",
    ],
    correctIndex: 0,
    explanation:
      "Rust usa semântica de `move` por padrão: ao atribuir um valor heap a outra variável, a propriedade (ownership) é transferida e a original é invalidada.",
    example:
      'let s1 = String::from("hello");\nlet s2 = s1; // s1 é movido para s2\n// println!("{}", s1); // ERRO: s1 não é mais válido',
  },
  {
    id: "linguagens-de-programacao__Rust__Médio__5",
    tags: ["rust", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Rust",
    difficulty: "Médio",
    question: "Qual é a diferença entre `&str` e `String` em Rust?",
    options: [
      "`&str` é uma fatia de string imutável; `String` é uma string dinâmica na heap",
      "`String` é imutável e `&str` é mutável por padrão",
      "`&str` ocupa mais memória que `String` para textos longos",
      "Não há diferença prática; ambos são aliases do mesmo tipo",
    ],
    correctIndex: 0,
    explanation:
      "`&str` é uma referência para uma sequência de bytes UTF-8 (stack ou data segment), imutável e de tamanho fixo. `String` é um buffer alocado na heap, dinâmico e mutável.",
    example:
      'let s1: &str = "literal";       // no binário\nlet s2: String = String::from("heap"); // na heap\nlet s3: String = s1.to_string();   // converte',
  },
  {
    id: "linguagens-de-programacao__Rust__Médio__6",
    tags: ["rust", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Rust",
    difficulty: "Médio",
    question: "O que é uma `lifetime` em Rust e para que serve?",
    options: [
      "Anotação que garante que referências não sobrevivam ao dado que referenciam",
      "O tempo de execução de uma thread em programas concorrentes",
      "Um tipo especial de variável que persiste durante toda a execução",
      "Uma macro para medir o tempo de vida de objetos no profiler",
    ],
    correctIndex: 0,
    explanation:
      "Lifetimes (`'a`) são anotações que informam ao compilador por quanto tempo uma referência é válida, prevenindo dangling pointers sem garbage collector.",
    example:
      "fn maior<'a>(x: &'a str, y: &'a str) -> &'a str {\n    if x.len() > y.len() { x } else { y }\n}",
  },
  {
    id: "linguagens-de-programacao__Rust__Médio__7",
    tags: ["rust", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Rust",
    difficulty: "Médio",
    question:
      "O que é um `enum` com dados em Rust e como ele difere de enums em C?",
    options: [
      "Cada variante pode carregar tipos de dados diferentes, como uma union tipada",
      "Enums Rust são idênticos aos de C: apenas constantes inteiras nomeadas",
      "Enums Rust são apenas para erros; C usa enums para qualquer propósito",
      "Variantes de enum Rust não podem conter dados, apenas nomes",
    ],
    correctIndex: 0,
    explanation:
      "Enums Rust são tipos soma algébricos: cada variante pode ter dados de tipos distintos. Em C, enums são apenas inteiros nomeados sem dados associados.",
    example:
      "enum Mensagem {\n    Sair,\n    Mover { x: i32, y: i32 },\n    Escrever(String),\n}",
  },
  {
    id: "linguagens-de-programacao__Rust__Médio__8",
    tags: ["rust", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Rust",
    difficulty: "Médio",
    question:
      "Como Rust lida com operações que podem falhar, em vez de usar exceções?",
    options: [
      "Retornando `Result<T, E>` que deve ser tratado explicitamente pelo chamador",
      "Usando blocos try/catch idênticos aos de Java e C++",
      "Abortando o programa automaticamente com mensagem de erro",
      "Retornando -1 ou null como convenção de erro, igual à linguagem C",
    ],
    correctIndex: 0,
    explanation:
      "Rust usa o tipo `Result<T, E>` para erros recuperáveis. O compilador exige que o resultado seja tratado, eliminando erros silenciosos.",
    example:
      'fn dividir(a: f64, b: f64) -> Result<f64, String> {\n    if b == 0.0 { Err("divisão por zero".into()) }\n    else { Ok(a / b) }\n}',
  },
  {
    id: "linguagens-de-programacao__Rust__Médio__9",
    tags: ["rust", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Rust",
    difficulty: "Médio",
    question: "O que faz o operador `?` em Rust quando aplicado a um `Result`?",
    options: [
      "Retorna o erro imediatamente da função se for `Err`, ou extrai o valor se `Ok`",
      "Converte o `Result` em um `Option`, descartando o tipo do erro",
      "Imprime o erro no stderr e continua a execução normalmente",
      "É equivalente ao operador ternário `?:` de C e Java",
    ],
    correctIndex: 0,
    explanation:
      "O `?` é açúcar sintático para propagação de erro: se o `Result` for `Err`, retorna o erro da função atual; se for `Ok`, extrai o valor.",
    example:
      "fn ler_arquivo(path: &str) -> Result<String, std::io::Error> {\n    let conteudo = fs::read_to_string(path)?; // propaga erro\n    Ok(conteudo)\n}",
  },
  {
    id: "linguagens-de-programacao__Rust__Médio__10",
    tags: ["rust", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Rust",
    difficulty: "Médio",
    question: "O que são `traits` em Rust?",
    options: [
      "Interfaces que definem comportamentos que tipos podem implementar",
      "Atributos de performance que o compilador usa para otimizações",
      "Macros especiais para geração automática de código boilerplate",
      "Palavras-chave reservadas para herança de structs",
    ],
    correctIndex: 0,
    explanation:
      "Traits em Rust são similares a interfaces: definem um conjunto de métodos que um tipo deve implementar. Permitem polimorfismo sem herança.",
    example:
      'trait Animal {\n    fn som(&self) -> String;\n}\nstruct Cachorro;\nimpl Animal for Cachorro {\n    fn som(&self) -> String { "Au!".to_string() }\n}',
  },

  // ─── RUST DIFÍCIL 4–10 ──────────────────────────────────────────────────────
  {
    id: "linguagens-de-programacao__Rust__Difícil__4",
    tags: ["rust", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Rust",
    difficulty: "Difícil",
    question: "Qual é a diferença entre `Box<T>`, `Rc<T>` e `Arc<T>` em Rust?",
    options: [
      "`Box` tem único dono; `Rc` permite múltiplos donos em single-thread; `Arc` em multi-thread",
      "`Box` é para inteiros; `Rc` para strings; `Arc` para coleções grandes",
      "`Rc` e `Arc` são idênticos; `Box` é apenas um alias para ponteiro raw",
      "`Arc` é o mais lento e `Box` o mais rápido, mas todos usam contagem de referências",
    ],
    correctIndex: 0,
    explanation:
      "`Box<T>` aloca na heap com ownership único. `Rc<T>` usa contagem de referências para múltiplos donos (não é thread-safe). `Arc<T>` é como `Rc` mas com contador atômico, seguro para threads.",
    example:
      'let b = Box::new(5);\nlet rc = Rc::new(String::from("shared"));\nlet rc2 = Rc::clone(&rc);\nlet arc = Arc::new(Mutex::new(0));',
  },
  {
    id: "linguagens-de-programacao__Rust__Difícil__5",
    tags: ["rust", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Rust",
    difficulty: "Difícil",
    question: "O que é `unsafe` em Rust e quais operações ele permite?",
    options: [
      "Bloco que permite desreferenciar raw pointers, chamar funções unsafe e acessar mutáveis globais",
      "Modo de compilação sem otimizações para facilitar debugging",
      "Palavra-chave que desativa a verificação de tipos para blocos específicos",
      "Uma anotação de depreciação para funções que serão removidas",
    ],
    correctIndex: 0,
    explanation:
      "`unsafe` desativa certas garantias do compilador, permitindo: desreferenciar raw pointers (`*const T`, `*mut T`), chamar funções `unsafe`, implementar traits `unsafe` e acessar `static mut`.",
    example:
      'let x = 5;\nlet r = &x as *const i32;\nunsafe {\n    println!("valor: {}", *r); // desreferencia raw pointer\n}',
  },
  {
    id: "linguagens-de-programacao__Rust__Difícil__6",
    tags: ["rust", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Rust",
    difficulty: "Difícil",
    question:
      "O que é despacho dinâmico (`dyn Trait`) vs estático (`impl Trait`) em Rust?",
    options: [
      "`dyn` usa vtable em runtime com overhead; `impl` resolve o tipo em compile-time sem overhead",
      "`impl` é para structs e `dyn` é exclusivo para enums e unions",
      "`dyn` é mais rápido porque evita monomorphization; `impl` gera código duplicado",
      "Não há diferença de desempenho; são apenas sintaxes alternativas para o mesmo comportamento",
    ],
    correctIndex: 0,
    explanation:
      "`impl Trait` usa monomorphization: o compilador gera código especializado para cada tipo (zero overhead). `dyn Trait` usa um ponteiro gordo com vtable, resolvido em runtime (há overhead).",
    example:
      "fn processa_impl(x: impl Animal) { }      // estático\nfn processa_dyn(x: &dyn Animal) { }      // dinâmico\nfn retorna_animal() -> Box<dyn Animal> { } // necessário quando tipo não é conhecido",
  },
  {
    id: "linguagens-de-programacao__Rust__Difícil__7",
    tags: ["rust", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Rust",
    difficulty: "Difícil",
    question:
      "Como funciona o `Pin<T>` e por que ele é necessário para `async/await` em Rust?",
    options: [
      "Garante que um valor não será movido na memória, necessário pois futures auto-referenciais quebrariam com movimentação",
      "É um wrapper para sincronização entre threads, similar ao `Mutex<T>`",
      "Fixa o cache do processador para evitar cache miss em operações críticas",
      "Define que um tipo não pode ser dropado antes do fim do escopo da função",
    ],
    correctIndex: 0,
    explanation:
      "Futures async/await podem ser auto-referenciais (conter referências para si mesmas). Se movidas na memória, essas referências ficariam inválidas. `Pin<T>` previne a movimentação.",
    example:
      '// Futures geradas por async fn podem ser auto-referenciais\nasync fn exemplo() {\n    let x = 5;\n    alguma_io().await;\n    println!("{}", x); // x pode ser referenciado após await\n}',
  },
  {
    id: "linguagens-de-programacao__Rust__Difícil__8",
    tags: ["rust", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Rust",
    difficulty: "Difícil",
    question:
      "O que são `associated types` em traits e por que são preferíveis a generics em alguns casos?",
    options: [
      "Tipos definidos dentro do trait que cada implementação especifica; evitam parâmetros redundantes no chamador",
      "Tipos que só existem dentro de módulos privados associados a um trait",
      "São identicos a type aliases; escolha é puramente estética sem impacto técnico",
      "Permitem que um trait seja implementado múltiplas vezes para o mesmo tipo",
    ],
    correctIndex: 0,
    explanation:
      "Com `associated types`, o trait define `type Output;` e cada implementação especifica o tipo concreto uma única vez. Com generics, o código chamador precisaria especificar todos os tipos em cada uso.",
    example:
      "trait Soma {\n    type Resultado;\n    fn somar(&self, outro: &Self) -> Self::Resultado;\n}\nimpl Soma for i32 {\n    type Resultado = i32;\n    fn somar(&self, outro: &Self) -> i32 { self + outro }\n}",
  },
  {
    id: "linguagens-de-programacao__Rust__Difícil__9",
    tags: ["rust", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Rust",
    difficulty: "Difícil",
    question:
      "Como o compilador Rust garante ausência de data races sem um garbage collector?",
    options: [
      "Regras de ownership: só um `&mut` OU múltiplos `&` ao mesmo dado por vez, verificado em compile-time",
      "Usando um runtime de verificação de memória similar ao AddressSanitizer do GCC",
      "Proibindo completamente o uso de threads; concorrência é feita apenas com async",
      "Fazendo cópias automáticas de todos os dados acessados por múltiplas threads",
    ],
    correctIndex: 0,
    explanation:
      "O borrow checker impõe: `&` (referência imutável) pode existir em quantidades, mas `&mut` deve ser a única referência ativa. Isso previne leitura e escrita simultâneas — a definição de data race.",
    example:
      "let mut v = vec![1, 2, 3];\nlet r1 = &v;     // OK\nlet r2 = &v;     // OK: múltiplas ref imutáveis\n// let r3 = &mut v; // ERRO: não pode coexistir com r1/r2",
  },
  {
    id: "linguagens-de-programacao__Rust__Difícil__10",
    tags: ["rust", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "Rust",
    difficulty: "Difícil",
    question:
      "O que é `monomorphization` em Rust e qual seu impacto em binários e performance?",
    options: [
      "Gera código especializado para cada tipo concreto em tempo de compilação: binário maior, execução sem overhead de runtime",
      "Técnica que unifica todos os tipos genéricos em um único caminho de código para reduzir tamanho do binário",
      "Processo de converter código multi-thread para single-thread para evitar concorrência",
      "Otimização que remove funções não utilizadas do binário final (dead code elimination)",
    ],
    correctIndex: 0,
    explanation:
      "Monomorphization: para `fn foo<T>(x: T)` chamado com `i32` e `f64`, o compilador gera `foo_i32` e `foo_f64`. Performance igual a código hardcoded, mas o binário cresce com o número de instâncias.",
    example:
      "fn maior<T: PartialOrd>(a: T, b: T) -> T {\n    if a > b { a } else { b }\n}\n// Compilador gera versões para i32, f64, etc. separadamente",
  },
];

const updated = [...existing, ...newCards];
fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8");
console.log(`✅ Adicionados ${newCards.length} cards de Rust`);
console.log(`📦 Total: ${updated.length} cards`);

// Verificar distribuição Rust
const rust = updated.filter((c: any) => c.category === "Rust");
const f = rust.filter((c: any) => c.difficulty === "Fácil").length;
const m = rust.filter((c: any) => c.difficulty === "Médio").length;
const d = rust.filter((c: any) => c.difficulty === "Difícil").length;
console.log(
  `\nRust: total=${rust.length} | Fácil=${f} Médio=${m} Difícil=${d}`,
);
