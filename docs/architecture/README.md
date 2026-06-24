# Arquitetura NeuroFlow

O NeuroFlow segue uma arquitetura orientada a Features para facilitar a manutenibilidade, escalabilidade e a separação de interesses.

## Core
Ponto de inicialização do Firebase e gerenciamento de estado global. 

## Features
Cada domínio de negócio principal (ex: Notificações, Onboarding) reside em `/src/features`. Isso significa que lógica, UI, e inicialização relacionadas àquela feature estão agrupadas (High Cohesion).

## Shared
Contém lógicas agnósticas (modais, toast, theme) que qualquer feature ou página pode utilizar livremente.
