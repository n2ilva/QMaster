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
  // ─── SQL FÁCIL 5–10 ─────────────────────────────────────────────────────────
  {
    id: "linguagens-de-programacao__SQL__Fácil__5",
    tags: ["sql", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "SQL",
    difficulty: "Fácil",
    question: "Qual comando SQL insere um novo registro em uma tabela?",
    options: [
      "INSERT INTO tabela (col1, col2) VALUES (val1, val2);",
      "ADD INTO tabela (col1, col2) VALUES (val1, val2);",
      "CREATE ROW tabela SET col1 = val1, col2 = val2;",
      "PUT INTO tabela (col1, col2) VALUES (val1, val2);",
    ],
    correctIndex: 0,
    explanation:
      "`INSERT INTO` adiciona novas linhas a uma tabela. É necessário especificar as colunas e os valores correspondentes.",
    example:
      "INSERT INTO clientes (nome, email, idade)\nVALUES ('Ana Silva', 'ana@email.com', 28);",
  },
  {
    id: "linguagens-de-programacao__SQL__Fácil__6",
    tags: ["sql", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "SQL",
    difficulty: "Fácil",
    question:
      "Como se atualiza o valor de uma coluna em registros existentes no SQL?",
    options: [
      "UPDATE tabela SET coluna = valor WHERE condicao;",
      "MODIFY tabela SET coluna = valor WHERE condicao;",
      "ALTER tabela CHANGE coluna = valor WHERE condicao;",
      "SET tabela.coluna = valor WHERE condicao;",
    ],
    correctIndex: 0,
    explanation:
      "`UPDATE ... SET` modifica registros existentes. A cláusula `WHERE` é essencial para evitar atualizar todos os registros da tabela.",
    example:
      "UPDATE clientes\nSET email = 'novo@email.com'\nWHERE id = 5;\n-- Sem WHERE: atualiza TODOS os registros!",
  },
  {
    id: "linguagens-de-programacao__SQL__Fácil__7",
    tags: ["sql", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "SQL",
    difficulty: "Fácil",
    question: "Qual cláusula SQL filtra linhas com base em uma condição?",
    options: ["WHERE", "HAVING", "FILTER", "CONDITION"],
    correctIndex: 0,
    explanation:
      "`WHERE` filtra linhas antes de qualquer agrupamento. `HAVING` filtra grupos após `GROUP BY`. São complementares mas usados em momentos diferentes.",
    example:
      "SELECT nome, salario\nFROM funcionarios\nWHERE salario > 5000\n  AND departamento = 'TI';",
  },
  {
    id: "linguagens-de-programacao__SQL__Fácil__8",
    tags: ["sql", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "SQL",
    difficulty: "Fácil",
    question: "Qual função SQL conta o número de linhas em um resultado?",
    options: ["COUNT(*)", "TOTAL(*)", "SUM(*)", "LENGTH(*)"],
    correctIndex: 0,
    explanation:
      "`COUNT(*)` conta todas as linhas incluindo NULLs. `COUNT(coluna)` conta apenas valores não-nulos. É uma função de agregação usada com `SELECT`.",
    example:
      "SELECT COUNT(*) AS total FROM pedidos;\nSELECT COUNT(email) AS com_email FROM clientes;\nSELECT departamento, COUNT(*) FROM func GROUP BY departamento;",
  },
  {
    id: "linguagens-de-programacao__SQL__Fácil__9",
    tags: ["sql", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "SQL",
    difficulty: "Fácil",
    question: "Como se ordena o resultado de uma consulta SQL por uma coluna?",
    options: [
      "ORDER BY coluna ASC|DESC",
      "SORT BY coluna ASC|DESC",
      "ARRANGE BY coluna ASC|DESC",
      "GROUP BY coluna ASC|DESC",
    ],
    correctIndex: 0,
    explanation:
      "`ORDER BY` ordena o resultado. `ASC` (crescente, padrão) e `DESC` (decrescente). Pode ordenar por múltiplas colunas separadas por vírgula.",
    example:
      "SELECT nome, salario\nFROM funcionarios\nORDER BY salario DESC, nome ASC;\n-- Salário maior primeiro; empate: ordem alfabética",
  },
  {
    id: "linguagens-de-programacao__SQL__Fácil__10",
    tags: ["sql", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "SQL",
    difficulty: "Fácil",
    question: "O que faz o comando `DELETE FROM tabela WHERE condicao`?",
    options: [
      "Remove as linhas que satisfazem a condição da tabela",
      "Apaga a tabela inteira do banco de dados permanentemente",
      "Remove as colunas especificadas na condição da tabela",
      "Marca as linhas como inativas sem removê-las fisicamente",
    ],
    correctIndex: 0,
    explanation:
      "`DELETE FROM` remove linhas de uma tabela. Sem `WHERE`, apaga todos os registros (mas mantém a estrutura da tabela). `DROP TABLE` apaga a tabela inteira.",
    example:
      "DELETE FROM pedidos WHERE status = 'cancelado';\n-- Cuidado: sem WHERE apaga tudo!\n-- DELETE FROM pedidos; ← remove TODOS os pedidos",
  },

  // ─── SQL MÉDIO 4–10 ─────────────────────────────────────────────────────────
  {
    id: "linguagens-de-programacao__SQL__Médio__4",
    tags: ["sql", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "SQL",
    difficulty: "Médio",
    question:
      "Qual é a diferença entre `INNER JOIN`, `LEFT JOIN` e `RIGHT JOIN`?",
    options: [
      "INNER: só linhas com correspondência em ambas; LEFT: todas da esquerda + correspondências; RIGHT: todas da direita + correspondências",
      "INNER JOIN é mais lento; LEFT e RIGHT JOIN são otimizados para grandes tabelas",
      "LEFT JOIN inclui apenas linhas sem correspondência; INNER JOIN inclui todas",
      "Não há diferença de resultado; são apenas aliases sintáticos para o mesmo JOIN",
    ],
    correctIndex: 0,
    explanation:
      "`INNER JOIN` retorna apenas linhas com match em ambas as tabelas. `LEFT JOIN` retorna todas as linhas da tabela esquerda (NULLs onde não há match). `RIGHT JOIN` faz o mesmo para a direita.",
    example:
      "-- INNER: só pedidos com cliente\nSELECT c.nome, p.valor\nFROM clientes c\nINNER JOIN pedidos p ON c.id = p.cliente_id;\n-- LEFT: todos clientes, mesmo sem pedido (NULL)\nSELECT c.nome, p.valor\nFROM clientes c\nLEFT JOIN pedidos p ON c.id = p.cliente_id;",
  },
  {
    id: "linguagens-de-programacao__SQL__Médio__5",
    tags: ["sql", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "SQL",
    difficulty: "Médio",
    question: "O que é uma `subquery` (subconsulta) em SQL e quando é usada?",
    options: [
      "Uma consulta aninhada dentro de outra, usada em WHERE, FROM ou SELECT para resultados dinâmicos",
      "Uma consulta secundária executada em paralelo à consulta principal via múltiplas threads",
      "Uma stored procedure chamada internamente pelo banco de dados durante INSERT/UPDATE",
      "Um tipo de índice composto que permite consultas em múltiplas colunas simultaneamente",
    ],
    correctIndex: 0,
    explanation:
      "Subqueries são consultas dentro de consultas. Podem aparecer em `WHERE` (filtro dinâmico), `FROM` (tabela derivada) ou `SELECT` (valor calculado). Correlacionadas referenciam a query externa.",
    example:
      "-- Subquery no WHERE\nSELECT nome FROM funcionarios\nWHERE salario > (SELECT AVG(salario) FROM funcionarios);\n\n-- Subquery no FROM\nSELECT dept, media FROM\n  (SELECT departamento dept, AVG(salario) media FROM func GROUP BY dept) sub\nWHERE media > 6000;",
  },
  {
    id: "linguagens-de-programacao__SQL__Médio__6",
    tags: ["sql", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "SQL",
    difficulty: "Médio",
    question: "O que é uma `transação` em SQL e quais comandos a controlam?",
    options: [
      "Conjunto de operações atômicas; controlada por BEGIN, COMMIT (confirma) e ROLLBACK (desfaz)",
      "Um tipo especial de consulta SELECT que trava tabelas para leitura exclusiva",
      "Um log automático do banco que registra todas as queries executadas em sequência",
      "Uma stored procedure que agrupa INSERT, UPDATE e DELETE em uma única chamada",
    ],
    correctIndex: 0,
    explanation:
      "Transações garantem ACID: Atomicidade, Consistência, Isolamento e Durabilidade. `COMMIT` persiste; `ROLLBACK` desfaz tudo desde o `BEGIN`. Essencial para integridade de dados.",
    example:
      "BEGIN;\n  UPDATE contas SET saldo = saldo - 1000 WHERE id = 1;\n  UPDATE contas SET saldo = saldo + 1000 WHERE id = 2;\n  -- Se algo falhar:\n  ROLLBACK; -- desfaz tudo\n  -- Se OK:\n  COMMIT;   -- persiste tudo",
  },
  {
    id: "linguagens-de-programacao__SQL__Médio__7",
    tags: ["sql", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "SQL",
    difficulty: "Médio",
    question: "O que são índices em SQL e qual o tradeoff ao criá-los?",
    options: [
      "Estruturas que aceleram consultas em colunas específicas, mas aumentam espaço e tornam writes mais lentos",
      "Chaves primárias alternativas que substituem o ID automático em tabelas grandes",
      "Metadados da tabela armazenados em cache que são recriados automaticamente a cada INSERT",
      "Apenas nomenclatura interna do banco de dados sem impacto real em performance",
    ],
    correctIndex: 0,
    explanation:
      "Índices (B-tree por padrão) aceleram `SELECT` em colunas indexadas. O custo: mais espaço em disco e cada `INSERT/UPDATE/DELETE` precisa atualizar o índice. Índices em colunas de alta cardinalidade e muito consultadas são os mais eficientes.",
    example:
      "-- Criar índice em coluna muito consultada\nCREATE INDEX idx_clientes_email ON clientes(email);\n-- Índice composto para queries frequentes\nCREATE INDEX idx_pedidos ON pedidos(cliente_id, data_pedido);\n-- Ver se consulta usa índice:\nEXPLAIN SELECT * FROM clientes WHERE email = 'a@b.com';",
  },
  {
    id: "linguagens-de-programacao__SQL__Médio__8",
    tags: ["sql", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "SQL",
    difficulty: "Médio",
    question: "O que faz `GROUP BY` e como se diferencia de `DISTINCT`?",
    options: [
      "`GROUP BY` agrupa linhas para funções de agregação (COUNT, SUM); `DISTINCT` remove duplicatas sem agrupar",
      "`DISTINCT` é mais rápido que `GROUP BY` e substitui completamente sua funcionalidade",
      "`GROUP BY` só funciona com funções numéricas; `DISTINCT` funciona com qualquer tipo",
      "Ambos são equivalentes; `GROUP BY` é apenas a versão mais antiga de `DISTINCT`",
    ],
    correctIndex: 0,
    explanation:
      "`GROUP BY` cria grupos de linhas para aplicar funções de agregação (`SUM`, `COUNT`, `AVG`). `DISTINCT` apenas remove linhas duplicadas no resultado sem possibilitar agregação.",
    example:
      "-- GROUP BY com agregação\nSELECT departamento, COUNT(*) qtd, AVG(salario) media\nFROM funcionarios\nGROUP BY departamento\nHAVING COUNT(*) > 3;\n\n-- DISTINCT: apenas remove duplicatas\nSELECT DISTINCT departamento FROM funcionarios;",
  },
  {
    id: "linguagens-de-programacao__SQL__Médio__9",
    tags: ["sql", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "SQL",
    difficulty: "Médio",
    question:
      "O que é `NULL` em SQL e como comparar corretamente valores nulos?",
    options: [
      "Ausência de valor; comparado com `IS NULL` ou `IS NOT NULL`, não com `= NULL`",
      "Zero para números e string vazia para texto; comparado normalmente com `= NULL`",
      "Um valor especial igual a -1 que indica campo não preenchido na maioria dos SGBDs",
      "Uma string literal 'NULL'; pode ser comparada com `= 'NULL'` ou `LIKE 'NULL'`",
    ],
    correctIndex: 0,
    explanation:
      "`NULL` representa ausência de valor, não zero nem string vazia. `NULL = NULL` retorna `NULL` (não `TRUE`). Por isso, usa-se `IS NULL` e `IS NOT NULL`. Funções como `COALESCE` tratam NULLs.",
    example:
      "-- Errado: não detecta NULL\nSELECT * FROM clientes WHERE email = NULL; -- retorna 0 linhas\n-- Correto:\nSELECT * FROM clientes WHERE email IS NULL;\n-- COALESCE: substitui NULL por valor padrão\nSELECT COALESCE(email, 'sem email') FROM clientes;",
  },
  {
    id: "linguagens-de-programacao__SQL__Médio__10",
    tags: ["sql", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "SQL",
    difficulty: "Médio",
    question:
      "O que são `views` em SQL e qual a diferença para tabelas temporárias?",
    options: [
      "Views são consultas nomeadas armazenadas (sem dados próprios); tabelas temporárias armazenam dados reais temporariamente",
      "Views armazenam dados em cache permanente; tabelas temporárias são apenas aliases de views",
      "Ambas armazenam dados reais; a diferença é que views são visíveis para todos os usuários",
      "Views são exatamente como tabelas normais, mas criadas com `CREATE VIEW` por convenção",
    ],
    correctIndex: 0,
    explanation:
      "Uma view é uma consulta SQL salva com nome — não armazena dados, apenas a definição. Tabelas temporárias (`TEMP TABLE`) armazenam dados reais, mas só existem durante a sessão.",
    example:
      "-- View: consulta reutilizável\nCREATE VIEW funcionarios_ativos AS\n  SELECT nome, cargo FROM funcionarios WHERE ativo = TRUE;\n\nSELECT * FROM funcionarios_ativos; -- usa a view\n\n-- Tabela temporária: dados reais, só nesta sessão\nCREATE TEMP TABLE resultado AS\n  SELECT * FROM pedidos WHERE valor > 1000;",
  },

  // ─── SQL DIFÍCIL 4–10 ───────────────────────────────────────────────────────
  {
    id: "linguagens-de-programacao__SQL__Difícil__4",
    tags: ["sql", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "SQL",
    difficulty: "Difícil",
    question:
      "O que são `Window Functions` em SQL e como diferem de `GROUP BY`?",
    options: [
      "Calculam valores sobre um conjunto de linhas relacionadas sem colapsá-las em grupos; GROUP BY colapsa",
      "São funções que operam em janelas de tempo em dados de séries temporais exclusivamente",
      "São um alias moderno para subqueries correlacionadas, com mesma funcionalidade e performance",
      "Apenas disponíveis em PostgreSQL; outros SGBDs usam GROUP BY para as mesmas operações",
    ],
    correctIndex: 0,
    explanation:
      "Window functions (`OVER`) calculam valores sobre uma 'janela' de linhas relacionadas mantendo todas as linhas visíveis. `GROUP BY` colapsa linhas em grupos. Permitem rankings, médias móveis, etc.",
    example:
      "SELECT nome, salario, departamento,\n  RANK() OVER (PARTITION BY departamento ORDER BY salario DESC) AS rank_dept,\n  AVG(salario) OVER (PARTITION BY departamento) AS media_dept\nFROM funcionarios;\n-- Todas as linhas permanecem; rank e média por dept calculados",
  },
  {
    id: "linguagens-de-programacao__SQL__Difícil__5",
    tags: ["sql", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "SQL",
    difficulty: "Difícil",
    question:
      "O que são `CTEs` (Common Table Expressions) e qual vantagem sobre subqueries?",
    options: [
      "Consultas nomeadas temporárias definidas com WITH; melhoram legibilidade e permitem referência múltipla e recursão",
      "Índices criados automaticamente pelo banco para otimizar queries repetitivas de subqueries",
      "Transações que encapsulam múltiplas queries em um bloco atômico nomeado e reutilizável",
      "São menos eficientes que subqueries, mas preferidas por serem mais legíveis em queries simples",
    ],
    correctIndex: 0,
    explanation:
      "CTEs (`WITH nome AS (...)`) criam resultados temporários nomeados reutilizáveis na mesma query. Vantagens: legibilidade, reutilização na mesma query e suporte a recursão (`WITH RECURSIVE`).",
    example:
      "WITH vendas_por_mes AS (\n  SELECT DATE_TRUNC('month', data) mes, SUM(valor) total\n  FROM pedidos GROUP BY 1\n),\ncrescimento AS (\n  SELECT mes, total,\n    LAG(total) OVER (ORDER BY mes) AS mes_anterior\n  FROM vendas_por_mes\n)\nSELECT mes, total, total - mes_anterior AS delta\nFROM crescimento;",
  },
  {
    id: "linguagens-de-programacao__SQL__Difícil__6",
    tags: ["sql", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "SQL",
    difficulty: "Difícil",
    question:
      "O que são os níveis de isolamento de transação em SQL e qual problema cada um previne?",
    options: [
      "READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ e SERIALIZABLE; cada nível previne dirty reads, non-repeatable reads e phantom reads",
      "São apenas configurações de performance sem impacto na consistência dos dados lidos",
      "São exclusivos para bancos NoSQL; SQL usa apenas ACID por padrão sem configuração necessária",
      "Definem permissões de acesso por usuário, controlando quem pode ler dados em transação aberta",
    ],
    correctIndex: 0,
    explanation:
      "Níveis de isolamento balanceiam consistência e performance: READ UNCOMMITTED permite dirty reads; READ COMMITTED previne dirty reads; REPEATABLE READ previne non-repeatable reads; SERIALIZABLE previne phantom reads.",
    example:
      "-- PostgreSQL default: READ COMMITTED\nSET TRANSACTION ISOLATION LEVEL SERIALIZABLE;\nBEGIN;\n  SELECT saldo FROM contas WHERE id = 1;\n  -- Em SERIALIZABLE: nenhuma outra transação\n  -- pode alterar dados lidos até COMMIT\nCOMMIT;",
  },
  {
    id: "linguagens-de-programacao__SQL__Difícil__7",
    tags: ["sql", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "SQL",
    difficulty: "Difícil",
    question:
      "O que é `EXPLAIN ANALYZE` e como interpretar o custo de uma query?",
    options: [
      "Executa a query mostrando o plano real de execução, custo estimado, rows, tempo e tipos de scan usados",
      "Analisa a sintaxe SQL e sugere reescritas automáticas para melhorar a performance",
      "Mostra apenas o custo estimado sem executar a query, útil para validar índices antes de produção",
      "É um comando exclusivo do MySQL; outros bancos usam QUERY PLAN ou SHOW EXECUTION PLAN",
    ],
    correctIndex: 0,
    explanation:
      "`EXPLAIN ANALYZE` executa a query e exibe o plano real: tipo de scan (Seq Scan, Index Scan), custo estimado vs real, linhas e tempo. Seq Scan em tabelas grandes indica falta de índice.",
    example:
      "EXPLAIN ANALYZE\nSELECT * FROM pedidos\nWHERE cliente_id = 42 AND data > '2025-01-01';\n-- Saída mostra:\n-- Index Scan using idx_pedidos  (custo baixo ✅)\n-- ou Seq Scan on pedidos        (custo alto ⚠️)",
  },
  {
    id: "linguagens-de-programacao__SQL__Difícil__8",
    tags: ["sql", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "SQL",
    difficulty: "Difícil",
    question:
      "O que é normalização em bancos de dados e o que significa estar na 3ª Forma Normal (3NF)?",
    options: [
      "Processo de organizar tabelas para reduzir redundância; 3NF: sem dependências transitivas entre atributos não-chave",
      "Processo de copiar dados em múltiplas tabelas para acelerar consultas de leitura",
      "3NF significa que todos os campos são strings normalizadas em UTF-8 sem caracteres especiais",
      "Normalização é exclusiva para bancos relacionais legados; bancos modernos usam desnormalização por padrão",
    ],
    correctIndex: 0,
    explanation:
      "1NF: valores atômicos. 2NF: sem dependências parciais da chave primária. 3NF: cada atributo não-chave depende apenas da chave primária, não de outros atributos não-chave (sem dependências transitivas).",
    example:
      "-- Violação 3NF: cidade depende de CEP, não do cliente_id\n-- Tabela: clientes(id, nome, cep, cidade)\n\n-- Correto em 3NF:\n-- clientes(id, nome, cep)\n-- enderecos(cep, cidade, estado)\n-- cidade agora depende da chave (cep) de sua própria tabela",
  },
  {
    id: "linguagens-de-programacao__SQL__Difícil__9",
    tags: ["sql", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "SQL",
    difficulty: "Difícil",
    question:
      "O que são `triggers` em SQL e quais são seus casos de uso e riscos?",
    options: [
      "Procedures executadas automaticamente em resposta a INSERT/UPDATE/DELETE; úteis para auditoria, mas difíceis de debugar",
      "Funções chamadas manualmente pelo programador para validar dados antes de uma transação",
      "Índices especiais que disparam a reindexação automática após um número definido de writes",
      "São restrições de integridade similares a `FOREIGN KEY`, mas para lógica de negócio complexa",
    ],
    correctIndex: 0,
    explanation:
      "Triggers executam código SQL automaticamente antes/depois de DML. Úteis para: auditoria, enforçar regras de negócio complexas e manter tabelas derivadas. Riscos: lógica oculta, cascata não intencional e performance.",
    example:
      "CREATE OR REPLACE FUNCTION registrar_audit() RETURNS TRIGGER AS $$\nBEGIN\n  INSERT INTO audit_log(tabela, operacao, usuario, data)\n  VALUES (TG_TABLE_NAME, TG_OP, current_user, NOW());\n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql;\n\nCREATE TRIGGER trig_audit_clientes\nAFTER INSERT OR UPDATE ON clientes\nFOR EACH ROW EXECUTE FUNCTION registrar_audit();",
  },
  {
    id: "linguagens-de-programacao__SQL__Difícil__10",
    tags: ["sql", "linguagens-de-programacao"],
    track: "linguagens-de-programacao",
    category: "SQL",
    difficulty: "Difícil",
    question:
      "O que é `MVCC` (Multi-Version Concurrency Control) e como ele evita locks de leitura?",
    options: [
      "Mantém múltiplas versões de linhas modificadas; readers veem snapshot consistente sem bloquear writers",
      "Um protocolo de replicação que mantém múltiplas cópias do banco em servidores diferentes",
      "Sistema de versionamento de esquema que rastreia migrações de tabelas ao longo do tempo",
      "Técnica que serializa todas as transações para garantir consistência, resultando em mais locks",
    ],
    correctIndex: 0,
    explanation:
      "MVCC (usado no PostgreSQL, Oracle, MySQL InnoDB) cria uma nova versão da linha a cada UPDATE. Leitores veem o snapshot do início de sua transação, sem precisar de locks de leitura, permitindo alta concorrência.",
    example:
      "-- Thread A: lê em T1\nBEGIN; -- snapshot em T1\nSELECT saldo FROM contas WHERE id = 1; -- vê versão T1\n\n-- Thread B: atualiza no mesmo momento\nUPDATE contas SET saldo = 999 WHERE id = 1; COMMIT;\n\n-- Thread A ainda vê o valor original (seu snapshot T1)\nSELECT saldo FROM contas WHERE id = 1; -- ainda retorna valor T1\nCOMMIT;",
  },
];

const updated = [...existing, ...newCards];
fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8");
console.log(`✅ Adicionados ${newCards.length} cards de SQL`);
console.log(`📦 Total: ${updated.length} cards`);

const sql = updated.filter((c: any) => c.category === "SQL");
const f = sql.filter((c: any) => c.difficulty === "Fácil").length;
const m = sql.filter((c: any) => c.difficulty === "Médio").length;
const d = sql.filter((c: any) => c.difficulty === "Difícil").length;
console.log(`\nSQL: total=${sql.length} | Fácil=${f} Médio=${m} Difícil=${d}`);
