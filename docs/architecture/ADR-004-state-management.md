# ADR-004: Redux Toolkit for Frontend State Management

## Status
Accepted

## Context
React application needs centralized state management for user data, goals, evaluations, and UI state.

## Decision
Use Redux Toolkit with RTK Query for:
- Global state management
- API caching
- Optimistic updates
- Type-safe state

## Consequences
### Positive:
- Predictable state updates
- Time-travel debugging
- Excellent DevTools
- Type safety with TypeScript
- Built-in caching

### Negative:
- Boilerplate code
- Learning curve
- Overkill for simple components

## Alternatives Considered
- Context API: Not suitable for complex state
- Zustand: Less mature ecosystem
- MobX: Less popular in enterprise

## Date
2025-11-01
