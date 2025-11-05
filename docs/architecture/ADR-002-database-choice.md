# ADR-002: SQL Server as Primary Database

## Status
Accepted

## Context
Need to choose a database that supports complex queries, transactions, and government compliance requirements.

## Decision
Use Microsoft SQL Server 2019+ as the primary database.

## Consequences
### Positive:
- Enterprise-grade reliability
- Excellent tooling (SSMS, Azure Data Studio)
- Strong ACID compliance
- Built-in encryption (Always Encrypted)
- Government agency familiarity

### Negative:
- Licensing costs (production)
- Windows Server dependency (optional, supports Linux now)

## Alternatives Considered
- PostgreSQL: Good alternative, less familiar to gov IT teams
- MySQL: Lacks enterprise features
- MongoDB: Not suitable for relational data

## Date
2025-11-01
