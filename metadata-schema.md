# Metadata Schema Documentation

This document describes the structure and fields of the `metadata.json` file that should be placed in the root of each spec directory.

## Schema Structure

```json
{
  "specIdentifier": "string",
  "specName": "string",
  "displayName": "string",
  "created": "string (YYYY-MM-DD)",
  "updated": "string (YYYY-MM-DD)",
  "status": "string",
  "url": "string (optional)",
  "assignee": "string (optional)",
  "tags": ["string"] (optional),
  "notes": "string (optional)"
}
```

## Field Descriptions

### Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `specIdentifier` | string | Unique identifier for the spec (uppercase, alphanumeric, hyphens) | `"PROJECT-1"` |
| `specName` | string | Short, descriptive name (lowercase, kebab-case) | `"user-authentication"` |
| `displayName` | string | Human-readable title case name | `"User Authentication"` |
| `created` | string | ISO date when the spec was created (YYYY-MM-DD) | `"2026-01-16"` |
| `updated` | string | ISO date when the spec was last updated (YYYY-MM-DD) | `"2026-01-16"` |
| `status` | string | Current status: `"draft"`, `"in-progress"`, `"completed"`, `"archived"` | `"in-progress"` |

### Optional Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `url` | string | Link to external system (Jira, GitHub, Linear, etc.) | `"https://jira.example.com/PROJECT-1"` |
| `assignee` | string | Name of the person assigned to this spec (auto-detected from git config) | `"John Doe"` |
| `tags` | array | Array of tags for categorization and search | `["auth", "security", "frontend"]` |
| `notes` | string | Additional notes or description of the spec's purpose | `"Implement user authentication with OAuth 2.0"` |

## Status Values

Use these standard status values for consistency:

- **draft**: Initial creation, requirements being gathered
- **in-progress**: Active development
- **completed**: Implementation finished
- **archived**: No longer active, kept for reference

## Validation Rules

### specIdentifier
- Must contain only uppercase letters, numbers, and hyphens
- Cannot start or end with hyphen
- Cannot have consecutive hyphens
- Pattern: `^[A-Z0-9-]+$`

### specName
- Must contain only lowercase letters, numbers, and hyphens
- Cannot start or end with hyphen
- Cannot have consecutive hyphens
- Maximum length: 50 characters
- Pattern: `^[a-z0-9-]+$`

### created / updated
- Must be in ISO date format: YYYY-MM-DD
- Pattern: `^20[0-9]{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$`

### status
- Must be one of: `"draft"`, `"in-progress"`, `"completed"`, `"archived"`

## Complete Example

```json
{
  "specIdentifier": "PROJECT-1",
  "specName": "user-authentication",
  "displayName": "User Authentication",
  "created": "2026-01-16",
  "updated": "2026-01-16",
  "status": "in-progress",
  "url": "https://jira.example.com/PROJECT-1",
  "assignee": "John Doe",
  "tags": [
    "auth",
    "security",
    "frontend"
  ],
  "notes": "Implement user authentication with OAuth 2.0 and JWT tokens"
}
```

## Minimal Valid Example

```json
{
  "specIdentifier": "PROJECT-1",
  "specName": "user-authentication",
  "displayName": "User Authentication",
  "created": "2026-01-16",
  "updated": "2026-01-16",
  "status": "draft"
}
```
