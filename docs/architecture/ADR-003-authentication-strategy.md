# ADR-003: JWT with SSO Integration

## Status
Accepted

## Context
Government systems require secure authentication with integration to national identity systems (نفاذ).

## Decision
Use JWT (JSON Web Tokens) for API authentication with SSO integration:
- Primary: نفاذ الوطني (Nafath)
- Secondary: Azure AD / Entra ID
- Fallback: Username/Password with MFA

## Consequences
### Positive:
- Stateless authentication
- Easy to scale
- Government compliance
- Single Sign-On experience

### Negative:
- Token management complexity
- Need secure token storage
- Refresh token rotation required

## Alternatives Considered
- Session-based: Doesn't scale well
- OAuth2 only: More complex than needed
- SAML: Older protocol, more complex

## Date
2025-11-01
