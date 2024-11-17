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

O projeto QR Caching é uma iniciativa que visa promover o turismo de forma intuitiva e interativa, utilizando códigos QR espalhados por pontos estratégicos de Lisboa. Além disso, tem como objetivo criar uma pseudo rede social, permitindo que os utilizadores partilhem as suas experiências e interajam entre si ao longo dos percursos. O sistema também é projetado para ser usado em eventos, como a WebSummit, oferecendo aos participantes uma forma dinâmica e inovadora de explorar o espaço através da criação de rotas de QR Codes. Através de uma aplicação móvel, os utilizadores podem dar scan aos códigos QR, enquanto o site oferece uma interface para a visualização do mapa, integração de inteligência artificial para otimização de rotas, e gestão de eventos.

---

## Componente de Cada Disciplina

### Engenharia de Software

A engenharia de software desempenha um papel essencial no desenvolvimento deste projeto, assegurando que o processo seja estruturado, eficiente e fácil de manter.

#### Funcionalidades:
- A adoção de metodologias ágeis para um desenvolvimento flexível, com iterações frequentes e foco no feedback contínuo.
- A criação de diagramas de arquitetura e fluxos de dados que descrevem como os componentes do sistema interagem, o que inclui a base de dados de QR Codes, o sistema de recomendação e o mapa interativo.

### Inteligência Artificial

O papel da Inteligência Artificial no projeto ainda está em fase de definição, com várias ideias preliminares a serem consideradas.

#### Funcionalidades:
- Possível método anti-spoofing: Utilizar IA para garantir a autenticidade da leitura dos QR Codes, prevenindo falsificações ou tentativas de burlar o sistema (spoofing).
- Possível pathfinding: IA aplicada para calcular rotas otimizadas, sugerindo os melhores caminhos para os utilizadores com base na sua localização atual e nos QR Codes disponíveis. Esta funcionalidade poderia também ser usada para facilitar a navegação em eventos como a WebSummit, ajudando os participantes a encontrar rotas lógicas e eficientes dentro de grandes espaços.

### Segurança Informática

A proteção dos dados dos utilizadores é uma prioridade no projeto. Para isso, serão implementadas várias medidas de segurança.

#### Funcionalidades:
- Encriptação de dados sensíveis, tanto durante a transmissão entre o cliente e o servidor, quanto no armazenamento da base de dados.
- Monitorização de segurança para identificar e mitigar potenciais vulnerabilidades.

### Sistemas Distribuídos

A escalabilidade e robustez do sistema serão garantidas através de uma arquitetura distribuída, o que permitirá a operação contínua e eficiente mesmo em períodos de alta demanda.

#### Funcionalidades:
- Distribuição dos servidores de backend para garantir que o sistema possa suportar um número de utilizadores elevado simultaneamente, sem comprometer o desempenho.
- Balanceamento de carga entre containers num servidor para assegurar que o tráfego seja distribuído de forma eficiente, evitando sobrecarga em qualquer ponto do sistema.

---

## Levantamento dos Requisitos Funcionais

- Mapa interativo de Lisboa, onde os utilizadores podem visualizar os QR Codes disponíveis.
- Criação de eventos que podem incluir QR Codes específicos e personalizados para o evento.
- Recomendações de QR Codes e rotas otimizadas através de IA.
- Distribuição e otimização de QR Codes em eventos de grande escala, para maximizar a interação com os participantes. (Não executada para fins académicos)

---

## Levantamento dos Requisitos Não Funcionais

- **Desempenho**: O sistema deve carregar o mapa e os QR Codes rapidamente, mesmo com um grande volume de utilizadores.
- **Segurança**: Proteção rigorosa dos dados dos utilizadores com encriptação e medidas de prevenção contra ataques.
- **Escalabilidade**: A arquitetura distribuída deve permitir que o sistema se expanda conforme necessário.
- **Usabilidade**: A interface deve ser intuitiva e fácil de usar. (Este requisito já foi abordado no semestre passado, mas acreditamos que podemos e devemos melhorar este campo)

---

## Use Cases

![image](https://github.com/user-attachments/assets/d6501131-a8a8-426a-821a-c0a42d904a64)

---

## Guiões e Personas

### Personas

1. **Diogo (Turista)**
   - **Idade**: 21 anos
   - **Motivação**: Explorar pontos turísticos culturais em Lisboa de forma eficiente e divertida.
   - **Interação**: Utiliza a aplicação para otimizar seu tempo e descobrir locais históricos.

2. **Tiago (Organizador de Eventos)**
   - **Idade**: 30 anos
   - **Motivação**: Gerir interações de códigos QR para participantes do WebSummit.
   - **Interação**: Utiliza o sistema para configurar rotas de QR Codes que guiem participantes por grandes espaços.

### Guiões

- **Cenário 1: Experiência do Turista**
  - O Diogo visita Lisboa e planeja uma rota antes de sair do seu hotel. Ele segue o caminho sugerido pelo website para passar por todas as caches em locais históricos na zona que ele planeja visitar naquele dia.

- **Cenário 2: Configuração de Evento**
  - O Tiago configura uma série de QR Codes para o WebSummit em locais importantes, como saídas de emergência, casas de banho e hotspots.

---

## Descrição da Arquitetura Tecnológica

### Componentes

1. **Frontend**: Interface interativa para visualização do mapa e gestão de eventos.
2. **Backend**: Processa dados e comunica-se com a base de dados e serviços auxiliares.
3. **Base de Dados (MongoDB)**: Armazena todos os dados relacionados a códigos QR, eventos e interações de utilizadores.
4. **Containers**: Cada componente opera num container Docker separado para modularidade e tolerância a falhas.

### Configuração no Ubuntu Server

- **Sistema Operativo**: Ubuntu Server
- **Orquestração**: Docker Compose para gerir containers do backend, MongoDB e outros serviços.
- **Comunicação**: Rede interna Docker para garantir interações seguras e eficientes entre serviços.

---

## Plano de Testes para Integração do Sistema

### Objetivos

- Validar a comunicação entre o backend e o MongoDB.
- Garantir a consistência de dados entre os componentes.

### Cenários de Teste

1. **Acesso à Base de Dados**:
   - **Ação**: Consultar MongoDB por uma lista de códigos QR.
   - **Resultado Esperado**: O backend retorna os dados corretamente em até 100ms.

2. **Integração Frontend**:
   - **Ação**: O utilizador seleciona um QR Code no mapa.
   - **Resultado Esperado**: O sistema exibe os detalhes do código QR em tempo real.

3. **Gestão de Eventos**:
   - **Ação**: Adicionar um novo evento com múltiplos códigos QR.
   - **Resultado Esperado**: O evento é salvo e visível no sistema.

4. **Componentes de IA**:
   - Para garantir que os componentes de IA funcionem corretamente e se integrem bem com o sistema final, será realizado um plano de testes com várias fases: 
   
   *Testes Unitários*: 
   - Algoritmo A: Testar a precisão do algoritmo A em encontrar o caminho mais curto entre pontos, considerando diferentes mapas.
   
   *Testes de Usabilidade*:
   - Interface do Usuário: Testar se a interface permite ao usuário selecionar os QR codes a serem coletados de forma intuitiva.
   - Ajustes no Sistema: Testar se, ao modificar a disposição dos QR codes ou alterar o caminho no mapa, o sistema consegue reagir de forma eficiente, recalculando o percurso e reconfigurando a distribuição dos QR codes.

   *Testes de Performance*:
   - Escalabilidade: Testar como o sistema se comporta com diferentes números de QR codes e tamanhos de espaço, garantindo que a performance não seja comprometida.

---

## Contribuintes

- **João Moniz (Número 20220550)**
  
- **Tomás Salgueiro (Número 20220589)**
