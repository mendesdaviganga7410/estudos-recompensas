# Produto: NeuroFlow

Este documento centraliza o conhecimento de negócios, a ideia e as funcionalidades do NeuroFlow, servindo de base para que qualquer desenvolvedor humano ou agente de IA entenda o propósito do sistema.

## 1. Visão Geral (A Ideia)
O **NeuroFlow** é um gerenciador de tarefas altamente gamificado, desenvolvido para aumentar a produtividade através de dinâmicas de RPG. O foco é transformar o ato de estudar e concluir tarefas cotidianas em uma jornada heroica (o *Hero Hub*).

## 2. Principais Módulos da Aplicação

### 2.1. Hero Hub (`index.html`)
- **Objetivo:** É a Landing Page e o centro (hub) principal para os usuários entrarem na jornada. 
- **Lógica:** Contém autenticação (Google/Email via Firebase) e decide se o usuário tem acesso ao modo Herói (gamificado) ou se é um Visitante.

### 2.2. Painel / Dashboard (`panel.html`)
- **Objetivo:** O gerenciador de tarefas em si.
- **Lógica:** Onde o usuário adiciona, edita e conclui missões (tarefas). Inclui o sistema de notificações, ganho de experiência (XP) e configuração de conta.

### 2.3. Modo Estudo / Pomodoro (`study.html`)
- **Objetivo:** Ferramenta de imersão e foco.
- **Lógica:** Provavelmente utiliza a técnica Pomodoro ou timers dedicados para contabilizar tempo profundo de foco (Deep Work), recompensando o jogador pelo tempo investido.

### 2.4. Comunidade (`comunidade.html`)
- **Objetivo:** O elemento social do jogo.
- **Lógica:** Permite que os usuários compartilhem conquistas, vejam o progresso de outros "heróis" e interajam, aumentando o senso de engajamento e responsabilidade (accountability).

## 3. Pilares Técnicos e Tecnologias
- **Autenticação e Banco de Dados:** Firebase (Auth e Firestore/Realtime DB).
- **Interface:** HTML, CSS e Javascript puro focado em alta interatividade (Modais customizados, sistema de Toasts, Troca de Temas).
- **Gamificação:** Sistema embutido (features) que gerencia o estado do jogador, níveis, recompensas e métricas.

## 4. Evolução do Projeto
Ao adicionar novas features, lembre-se:
- O design deve ser vibrante, engajador e recompensador.
- A experiência do usuário (UX) deve ter micro-interações que simulem ganhos (como ao concluir missões).
- A base de código deve permanecer estática para hospedar facilmente em CDNs, garantindo performance e acessibilidade imediata.
