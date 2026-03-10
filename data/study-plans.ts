/**
 * Sequências de estudo recomendadas por trilha e nível.
 * As categorias são listadas em ordem de complexidade crescente,
 * permitindo ao usuário aprender de forma progressiva e coesa.
 */

export type StudyLevel = "Iniciante" | "Intermediário" | "Avançado";

export interface StudyPlan {
  track: string;
  level: StudyLevel;
  /** Lista ordenada de categorias do mais básico ao mais avançado */
  sequence: string[];
  /** Dica contextual sobre o plano */
  tip: string;
}

const plans: StudyPlan[] = [
  // ─── Engenharia de Software ───────────────────────────────────────────────
  {
    track: "engenharia-de-software",
    level: "Iniciante",
    sequence: [
      "Git e Versionamento",
      "Algoritmos e Estruturas de Dados",
      "Clean Code e Boas Práticas",
      "Programação Orientada a Objetos",
      "Banco de Dados SQL",
      "APIs REST e GraphQL",
      "Testes de Software",
      "Metodologias Ágeis",
    ],
    tip: "Comece pelo controle de versão — é a base de qualquer projeto de software.",
  },
  {
    track: "engenharia-de-software",
    level: "Intermediário",
    sequence: [
      "Design Patterns",
      "Arquitetura de Software",
      "Banco de Dados NoSQL",
      "Docker e Containers",
      "CI/CD e DevOps",
      "Mensageria e Filas",
      "Autenticação e Autorização",
      "Segurança no Desenvolvimento",
    ],
    tip: "Com a base sólida, é hora de aprofundar em padrões e infraestrutura moderna.",
  },
  {
    track: "engenharia-de-software",
    level: "Avançado",
    sequence: [
      "System Design",
      "Arquitetura de Software",
      "Mensageria e Filas",
      "Segurança no Desenvolvimento",
      "CI/CD e DevOps",
      "Autenticação e Autorização",
      "Design Patterns",
      "Testes de Software",
    ],
    tip: "Foque em System Design e arquiteturas distribuídas — são os temas mais cobrados em empresas de tecnologia.",
  },

  // ─── Linguagens de Programação ────────────────────────────────────────────
  {
    track: "linguagens-de-programacao",
    level: "Iniciante",
    sequence: [
      "Python",
      "JavaScript",
      "React e React Native",
      "SQL",
      "Shell/Bash",
      "TypeScript",
      "Java",
      "C",
    ],
    tip: "Python e JavaScript são as linguagens com maior demanda para iniciantes.",
  },
  {
    track: "linguagens-de-programacao",
    level: "Intermediário",
    sequence: [
      "TypeScript",
      "Java",
      "C#",
      "React e React Native",
      "Django",
      "Spring Boot",
      "Go",
      "Kotlin",
    ],
    tip: "Typescript e frameworks robustos abrem portas para o mercado de trabalho.",
  },
  {
    track: "linguagens-de-programacao",
    level: "Avançado",
    sequence: [
      "Rust",
      "Go",
      "C++",
      "Kotlin",
      "Swift",
      "Dart",
      "Spring Boot",
      "React e React Native",
    ],
    tip: "Rust e Go são linguagens de alta performance valorizadas em sistemas distribuídos.",
  },

  // ─── Machine Learning e IA ────────────────────────────────────────────────
  {
    track: "machine-learning-e-ia",
    level: "Iniciante",
    sequence: [
      "Estatística para ML",
      "Pré-processamento de Dados",
      "Algoritmos de Regressão",
      "Algoritmos de Classificação",
      "Aprendizado Não Supervisionado",
      "Processamento de Linguagem Natural",
    ],
    tip: "Estatística é a fundação do Machine Learning — não pule essa etapa.",
  },
  {
    track: "machine-learning-e-ia",
    level: "Intermediário",
    sequence: [
      "Algoritmos de Regressão",
      "Algoritmos de Classificação",
      "Aprendizado Não Supervisionado",
      "Deep Learning e Redes Neurais",
      "Processamento de Linguagem Natural",
      "Visão Computacional",
      "MLOps e Deploy de Modelos",
    ],
    tip: "Com os algoritmos clássicos dominados, avance para redes neurais e deploy.",
  },
  {
    track: "machine-learning-e-ia",
    level: "Avançado",
    sequence: [
      "Deep Learning e Redes Neurais",
      "IA Generativa e LLMs",
      "Visão Computacional",
      "Processamento de Linguagem Natural",
      "MLOps e Deploy de Modelos",
      "Estatística para ML",
    ],
    tip: "LLMs e IA Generativa são os temas mais quentes do setor — explore com profundidade.",
  },

  // ─── Cloud ────────────────────────────────────────────────────────────────
  {
    track: "cloud",
    level: "Iniciante",
    sequence: [
      "Arquitetura em Nuvem",
      "AWS — Fundamentos",
      "Azure — Fundamentos",
      "Containers e Kubernetes",
      "Segurança em Cloud",
      "Monitoramento e Observabilidade",
    ],
    tip: "Comece pelos fundamentos de um único provedor (idealmente AWS ou Azure) antes de diversificar.",
  },
  {
    track: "cloud",
    level: "Intermediário",
    sequence: [
      "Containers e Kubernetes",
      "DevOps e CI/CD",
      "AWS — Serviços Avançados",
      "Azure — Serviços Avançados",
      "Infrastructure as Code",
      "Segurança em Cloud",
      "Monitoramento e Observabilidade",
    ],
    tip: "Kubernetes e IaC são habilidades cruciais para o mercado de Cloud intermediário.",
  },
  {
    track: "cloud",
    level: "Avançado",
    sequence: [
      "Infrastructure as Code",
      "DevOps e CI/CD",
      "Serverless e Functions",
      "Google Cloud Platform",
      "AWS — Serviços Avançados",
      "Azure — Serviços Avançados",
      "Monitoramento e Observabilidade",
      "Segurança em Cloud",
    ],
    tip: "Multi-cloud e Serverless diferenciam profissionais sênior no mercado.",
  },

  // ─── Redes de Computadores ────────────────────────────────────────────────
  {
    track: "rede-de-computadores",
    level: "Iniciante",
    sequence: [
      "Modelo OSI e TCP/IP",
      "Endereçamento IP e Sub-redes",
      "DNS, DHCP e NAT",
      "Equipamentos de Rede",
      "Cabeamento Estruturado",
      "Redes Sem Fio (Wi-Fi)",
    ],
    tip: "O modelo OSI é o vocabulário comum das redes — domine antes de avançar.",
  },
  {
    track: "rede-de-computadores",
    level: "Intermediário",
    sequence: [
      "Protocolos de Roteamento",
      "Firewall e Proxy",
      "Serviços de Rede (HTTP, FTP, SSH)",
      "VPN e Túneis",
      "Segurança de Redes",
      "VoIP e Comunicações Unificadas",
    ],
    tip: "Roteamento e segurança de rede são a espinha dorsal de ambientes corporativos.",
  },
  {
    track: "rede-de-computadores",
    level: "Avançado",
    sequence: [
      "Segurança de Redes",
      "VPN e Túneis",
      "Protocolos de Roteamento",
      "Firewall e Proxy",
      "VoIP e Comunicações Unificadas",
      "Serviços de Rede (HTTP, FTP, SSH)",
    ],
    tip: "Segurança de redes e SD-WAN são competências altamente valorizadas em ambientes avançados.",
  },

  // ─── Segurança da Informação ──────────────────────────────────────────────
  {
    track: "seguranca-da-informacao",
    level: "Iniciante",
    sequence: [
      "Criptografia",
      "Controle de Acesso e Identidade",
      "Políticas de Segurança",
      "LGPD e Regulamentações",
      "Malwares e Ameaças",
      "Gestão de Riscos",
    ],
    tip: "Criptografia e controle de acesso são os pilares da segurança da informação.",
  },
  {
    track: "seguranca-da-informacao",
    level: "Intermediário",
    sequence: [
      "Segurança em Aplicações Web",
      "Certificados Digitais e PKI",
      "Normas ISO 27001/27002",
      "Governança e Compliance",
      "Gestão de Riscos",
      "Cibersegurança Ofensiva e Defensiva",
    ],
    tip: "Segurança web e certificações são essenciais para atuar em empresas regularizadas.",
  },
  {
    track: "seguranca-da-informacao",
    level: "Avançado",
    sequence: [
      "Cibersegurança Ofensiva e Defensiva",
      "Forense Digital",
      "Segurança em Aplicações Web",
      "Certificados Digitais e PKI",
      "Normas ISO 27001/27002",
      "Governança e Compliance",
    ],
    tip: "Pentest e forense digital são as especialidades mais demandadas no nível sênior.",
  },

  // ─── Matemática ───────────────────────────────────────────────────────────
  {
    track: "matematica",
    level: "Iniciante",
    sequence: [
      "Razão e Proporção",
      "Porcentagem e Regra de Três",
      "Juros Simples e Compostos",
      "Equações e Inequações",
      "Funções",
      "Estatística e Probabilidade",
    ],
    tip: "Reforce as bases da aritmética antes de avançar para álgebra e análise.",
  },
  {
    track: "matematica",
    level: "Intermediário",
    sequence: [
      "Funções",
      "Geometria Plana",
      "Geometria Espacial",
      "Progressões (PA e PG)",
      "Lógica Matemática",
      "Análise Combinatória",
      "Estatística e Probabilidade",
    ],
    tip: "Geometria e progressões são temas recorrentes em provas e vestibulares.",
  },
  {
    track: "matematica",
    level: "Avançado",
    sequence: [
      "Matrizes e Determinantes",
      "Análise Combinatória",
      "Estatística e Probabilidade",
      "Lógica Matemática",
      "Progressões (PA e PG)",
      "Funções",
    ],
    tip: "Matrizes e combinatória são base para algoritmos avançados e IA.",
  },

  // ─── Português ────────────────────────────────────────────────────────────
  {
    track: "portugues",
    level: "Iniciante",
    sequence: [
      "Ortografia",
      "Classes de Palavras",
      "Acentuação Gráfica",
      "Pontuação",
      "Compreensão e Interpretação de Texto",
      "Coesão e Coerência Textual",
    ],
    tip: "Ortografia e pontuação são a base para uma comunicação escrita clara.",
  },
  {
    track: "portugues",
    level: "Intermediário",
    sequence: [
      "Concordância Nominal e Verbal",
      "Regência Nominal e Verbal",
      "Crase",
      "Figuras de Linguagem",
      "Sintaxe do Período Composto",
      "Coesão e Coerência Textual",
    ],
    tip: "Concordância e regência são os pontos mais cobrados em concursos e provas.",
  },
  {
    track: "portugues",
    level: "Avançado",
    sequence: [
      "Sintaxe do Período Composto",
      "Figuras de Linguagem",
      "Redação Oficial",
      "Coesão e Coerência Textual",
      "Compreensão e Interpretação de Texto",
      "Regência Nominal e Verbal",
    ],
    tip: "Redação oficial e sintaxe avançada são diferenciais em concursos públicos.",
  },

  // ─── Inglês ───────────────────────────────────────────────────────────────
  {
    track: "ingles",
    level: "Iniciante",
    sequence: [
      "Gramática Fundamental",
      "Vocabulário Essencial",
      "Tempos Verbais",
      "Preposições e Conectivos",
      "Compreensão de Texto",
    ],
    tip: "Gramática e vocabulário são os pilares do inglês. Pratique leitura diariamente.",
  },
  {
    track: "ingles",
    level: "Intermediário",
    sequence: [
      "Tempos Verbais",
      "Phrasal Verbs",
      "Expressões Idiomáticas",
      "Compreensão de Texto",
      "Preposições e Conectivos",
    ],
    tip: "Phrasal verbs são indispensáveis para ler código e documentação técnica.",
  },
  {
    track: "ingles",
    level: "Avançado",
    sequence: [
      "Expressões Idiomáticas",
      "Phrasal Verbs",
      "Pronúncia e Fonética",
      "Compreensão de Texto",
      "Tempos Verbais",
    ],
    tip: "No nível avançado, foque em nuances idiomáticas e pronúncia para comunicação fluente.",
  },
];

/** Busca o plano de estudos para uma trilha e nível específicos */
export function getStudyPlan(
  track: string,
  level: StudyLevel,
): StudyPlan | null {
  return plans.find((p) => p.track === track && p.level === level) ?? null;
}

export const STUDY_LEVELS: StudyLevel[] = [
  "Iniciante",
  "Intermediário",
  "Avançado",
];

export const STUDY_LEVEL_DESCRIPTIONS: Record<StudyLevel, string> = {
  Iniciante: "Estou começando agora ou tenho pouco contato com o tema.",
  Intermediário: "Já conheço os conceitos básicos e quero aprofundar.",
  Avançado: "Tenho boa base e busco dominar tópicos complexos.",
};

export const STUDY_LEVEL_ICONS: Record<StudyLevel, string> = {
  Iniciante: "🌱",
  Intermediário: "🚀",
  Avançado: "⚡",
};

// ─── Agrupamento de linguagens e seus frameworks ────────────────────────────
export interface LanguageGroup {
  language: string;
  emoji: string;
  icon: string;
  color: string;
  /** Categorias: a própria linguagem + frameworks/ferramentas relacionados */
  categories: string[];
}

export const LANGUAGE_GROUPS: LanguageGroup[] = [
  {
    language: "TypeScript",
    emoji: "🟦",
    icon: "language-typescript",
    color: "#3178C6",
    categories: [
      "TypeScript",
      "React e React Native",
      "Angular",
      "Next.js",
      "Vue.js",
    ],
  },
  {
    language: "JavaScript",
    emoji: "🟨",
    icon: "language-javascript",
    color: "#F0DB4F",
    categories: [
      "JavaScript",
      "React e React Native",
      "Angular",
      "Next.js",
      "Vue.js",
    ],
  },
  {
    language: "Python",
    emoji: "🐍",
    icon: "language-python",
    color: "#3776AB",
    categories: ["Python", "Django"],
  },
  {
    language: "Java",
    emoji: "☕",
    icon: "language-java",
    color: "#E76F00",
    categories: ["Java", "Spring Boot"],
  },
  {
    language: "Kotlin",
    emoji: "🟣",
    icon: "language-kotlin",
    color: "#7F52FF",
    categories: ["Kotlin", "Spring Boot"],
  },
  {
    language: "PHP",
    emoji: "🐘",
    icon: "language-php",
    color: "#777BB4",
    categories: ["PHP", "Laravel"],
  },
  {
    language: "Dart",
    emoji: "🎯",
    icon: "language-dart",
    color: "#0175C2",
    categories: ["Dart", "Flutter"],
  },
  {
    language: "C#",
    emoji: "🟪",
    icon: "language-csharp",
    color: "#68217A",
    categories: ["C#"],
  },
  {
    language: "C",
    emoji: "⚙️",
    icon: "language-c",
    color: "#555555",
    categories: ["C"],
  },
  {
    language: "C++",
    emoji: "🔧",
    icon: "language-cpp",
    color: "#00599C",
    categories: ["C++"],
  },
  {
    language: "Go",
    emoji: "🐹",
    icon: "language-go",
    color: "#00ADD8",
    categories: ["Go"],
  },
  {
    language: "Rust",
    emoji: "🦀",
    icon: "language-rust",
    color: "#CE422B",
    categories: ["Rust"],
  },
  {
    language: "Swift",
    emoji: "🍎",
    icon: "language-swift",
    color: "#FA7343",
    categories: ["Swift"],
  },
  {
    language: "SQL",
    emoji: "🗃️",
    icon: "database",
    color: "#336791",
    categories: ["SQL"],
  },
  {
    language: "Shell/Bash",
    emoji: "💻",
    icon: "console",
    color: "#4EAA25",
    categories: ["Shell/Bash"],
  },
];
