# CLIENT-INDEPENDENT-RUNTIME-001 — Client Independent Runtime Standard

**Status:** ACTIVE

## Purpose

RANI_OS must work consistently across phone, desktop, browser tabs, and new chat sessions by rebinding from repository state, not relying on chat memory or client cache.

## Core Principles

- Client is only an access surface.
- Repository state is the operational source of truth.
- Mobile and desktop may have different UI speed, cache, layout, and chat behavior.
- RANI_OS must remain operationally consistent by rebinding from `CURRENT_STATE.md` and repository state.

## Runtime Rebind Requirements

Runtime Rebind must identify:

- Source of Truth
- Current phase
- Active work item
- Last completed work item
- Next executable item
- Owner gate status
- Open risks
- Current environment and build when relevant

## Rules

1. Do not rely on chat memory as Source of Truth.
2. Do not rely on mobile browser cache as Source of Truth.
3. Do not rely on desktop browser cache as Source of Truth.
4. Do not rely on visible UI alone if repository state contradicts it.
5. Use `CURRENT_STATE.md` for operating status.
6. Use repository state for files, builds, commits, and artifacts.
7. Use Admin Web for owner-visible review, not as the canonical private Source of Truth.
8. Use cache-busting URLs for visual review when needed.

## Chat Modes

### Workflow Chat

Workflow Chat is tied to a work item, prompt, review, owner gate, or Source of Truth update.

### Free Chat

Free Chat is a general question or reasoning. It does not update Source of Truth unless captured through a workflow step.

## Application Context Rule

Every workflow must identify active application scope:

- RANI_OS
- ADMIN_WEB
- RANI_TRADING
- RANI_POOL

## Workflow Hub Requirements

Workflow Hub must:

- Show current workflow
- Show selected app/context
- Show what to open next
- Show what to copy
- Show where to paste it
- Show expected output
- Show return step
- Support Free Chat vs Workflow Chat
- Support app-specific workflows
