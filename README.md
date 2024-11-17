# QR-Caching_Web

## Índice
1. [Resumo do Projeto](#resumo-do-projeto)
2. [Componente de Cada Disciplina](#componente-de-cada-disciplina)
   - [Engenharia de Software](#engenharia-de-software)
   - [Inteligência Artificial](#inteligência-artificial)
   - [Segurança Informática](#segurança-informática)
   - [Sistemas Distribuídos](#sistemas-distribuídos)
3. [Levantamento dos Requisitos Funcionais](#levantamento-dos-requisitos-funcionais)
4. [Levantamento dos Requisitos Não Funcionais](#levantamento-dos-requisitos-não-funcionais)
5. [Use Cases](#use-cases)
6. [Guiões e Personas](#guiões-e-personas)
7. [Descrição da Arquitetura Tecnológica](#descrição-da-arquitetura-tecnológica)
8. [Plano de Testes para Integração do Sistema](#plano-de-testes-para-integração-do-sistema)
9. [Contribuintes](#contribuintes)

---

## Resumo do Projeto

O projeto QR Caching é uma iniciativa que visa promover o turismo de forma intuitiva e interativa, utilizando códigos QR espalhados por pontos estratégicos de Lisboa. Além disso, busca criar uma pseudo-rede social, permitindo que os utilizadores compartilhem suas experiências e interajam entre si ao longo dos percursos. O sistema também foi projetado para ser utilizado em eventos, como a WebSummit, oferecendo aos participantes uma forma dinâmica e inovadora de explorar o espaço, com a criação de rotas de QR Codes. Através de uma aplicação móvel, os utilizadores podem escanear os códigos QR, enquanto o site oferece uma interface para visualização do mapa, integração de inteligência artificial para otimização de rotas e gestão de eventos.

---

## Componente de Cada Disciplina

### Engenharia de Software
A Engenharia de Software é essencial para o desenvolvimento deste projeto, garantindo um processo estruturado, eficiente e fácil de manter.

#### Funcionalidades:
- Adoção de metodologias ágeis para desenvolvimento flexível, com iterações frequentes e foco no feedback contínuo.
- Criação de diagramas de arquitetura e fluxos de dados que descrevem como os componentes do sistema interagem.

### Inteligência Artificial
O papel da Inteligência Artificial no projeto ainda está em fase de definição.

#### Funcionalidades:
- **Anti-spoofing**: Garantir a autenticidade dos QR Codes utilizando IA.
- **Pathfinding**: Cálculo de rotas otimizadas com base na localização e QR Codes disponíveis.

### Segurança Informática
A segurança dos dados dos utilizadores é uma prioridade.

#### Funcionalidades:
- Encriptação de dados durante a transmissão e armazenamento.
- Monitorização de segurança para prevenir vulnerabilidades.

### Sistemas Distribuídos
A arquitetura distribuída permite escalabilidade e robustez ao sistema.

#### Funcionalidades:
- Servidores backend distribuídos para suportar alto número de utilizadores simultâneos.
- Balanceamento de carga entre containers Docker.

---

## Levantamento dos Requisitos Funcionais

- Mapa interativo de Lisboa com visualização de QR Codes.
- Criação de eventos com QR Codes personalizados.
- Recomendações de rotas otimizadas por IA.
- Distribuição de QR Codes em eventos de grande escala.

---

## Levantamento dos Requisitos Não Funcionais

- **Desempenho**: O sistema deve carregar rapidamente, mesmo com grande volume de utilizadores.
- **Segurança**: Proteção rigorosa dos dados dos utilizadores.
- **Escalabilidade**: Sistema que se expande conforme necessário.
- **Usabilidade**: Interface intuitiva e fácil de usar.

---

## Use Cases

![image](https://github.com/user-attachments/assets/d6501131-a8a8-426a-821a-c0a42d904a64)

---

## Guiões e Personas

### Personas

1. **Diogo (Turista)**
   - **Idade**: 21 anos
   - **Motivação**: Explorar pontos turísticos em Lisboa de forma eficiente.
   - **Interação**: Utiliza a aplicação para otimizar seu tempo e descobrir locais históricos.

2. **Tiago (Organizador de Eventos)**
   - **Idade**: 30 anos
   - **Motivação**: Gerir interações de QR Codes no WebSummit.
   - **Interação**: Utiliza o sistema para configurar rotas para participantes.

### Guiões

- **Cenário 1**: O Diogo planeja sua rota de visitação em Lisboa utilizando a aplicação, passando por pontos turísticos.
- **Cenário 2**: O Tiago configura rotas de QR Codes para participantes do WebSummit.

---

## Descrição da Arquitetura Tecnológica

### Componentes

1. **Frontend**: Interface interativa para visualização do mapa e gestão de eventos.
2. **Backend**: Processa dados e comunica-se com a base de dados.
3. **Base de Dados (MongoDB)**: Armazena dados de QR Codes, eventos e interações.
4. **Containers**: Uso de Docker para modularidade e tolerância a falhas.

### Configuração no Ubuntu Server

- **Sistema Operativo**: Ubuntu Server
- **Orquestração**: Docker Compose
- **Comunicação**: Rede interna Docker entre os serviços.

---

## Plano de Testes para Integração do Sistema

### Objetivos

- Validar comunicação entre backend e MongoDB.
- Garantir a consistência de dados entre componentes.

### Cenários de Teste

1. **Acesso à Base de Dados**: Consultar MongoDB por QR Codes.
2. **Integração Frontend**: Seleção de QR Code no mapa e exibição dos detalhes.
3. **Gestão de Eventos**: Adicionar evento e visualizar no sistema.

---

## Contribuintes

- **João Moniz (Número 20220550)**
- **Tomás Salgueiro (Número 20220589)**
