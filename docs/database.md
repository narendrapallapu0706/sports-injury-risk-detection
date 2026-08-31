# Database Documentation

## 1. Overview

The Sports Injury Risk Detection Platform currently uses PostgreSQL as its relational database.

SQLAlchemy is used as the Object-Relational Mapping (ORM) layer, and Alembic is used to manage database schema migrations.

### Technologies

- PostgreSQL
- SQLAlchemy
- Alembic
- Python

---

## 2. Current Database Schema

The current database contains the following application tables:

```text
users
  |
  | 1 : N
  |
  v
videos  