# Spec Manager Power

Standardize spec creation in Kiro with intelligent automation and consistent organization.

## Installation

In Kiro, install the power using this URL:

```
https://github.com/unlimitechcloud/kiro.spec-manager/tree/dist-branch
```

## What It Does

Spec Manager automates specification creation with:

- **Auto-increment identifiers** - Detects your pattern and suggests the next ID
- **Prefix-aware input** - Type `7` instead of `GITHUB-7`
- **URL reconstruction** - Auto-detects URLs from previous specs
- **Date-based organization** - Specs organized by `YYYY-MM/`
- **Metadata tracking** - Links to Jira, GitHub, or other systems
- **Natural language queries** - Search by tag, status, assignee, or identifier

## Quick Start

### First-Time Setup

On first use, Kiro guides you through a 30-second setup:

```
Kiro: "Which tracking system do you use?"
1. GitHub
2. Jira
3. None

You: "1"

Kiro: "GitHub repository URL:"
You: "https://github.com/myorg/myproject"

Kiro: "Enable prefix-aware input? [Y/n]:"
You: "y"

Kiro: "✅ Configuration saved"
```

### Creating Specs

After setup, creating specs is fast:

```
You: "Create a new spec for user authentication"

Kiro: "Identifier (GITHUB-): [Press Enter for GITHUB-1]"
You: [Enter]

Kiro: "Spec name: user-authentication. Confirm?"
You: "y"

Kiro: "✅ Created: .kiro/specs/2026-01/GITHUB-1+user-authentication/"
```

## Key Features

### Intelligent Auto-increment

Kiro detects your identifier pattern and suggests the next one:

- Last spec: `PROJECT-100` → Suggests: `PROJECT-101`
- Last spec: `FEAT-001` → Suggests: `FEAT-002` (preserves padding)

### URL Reconstruction

After your first spec, Kiro remembers your tracking system:

```
You: "Create spec for issue 5"
Kiro: "Detected: https://github.com/myorg/myproject/issues/5"
```

### Prefix-Aware Input

Type just numbers instead of full identifiers:

```
Kiro: "Identifier (GITHUB-):"
You: "7"                    # Instead of "GITHUB-7"
Kiro: "Use GITHUB-7?"
```

### Natural Language Queries

Search specs easily:

```
"What's the URL for PROJECT-5?"
"Show me all specs tagged with 'auth'"
"List in-progress specs"
```

## GitHub Integration

GitHub issues use synthetic identifiers:

- GitHub issue #5 → Identifier: `GITHUB-5`
- URL: `https://github.com/owner/repo/issues/5`

Kiro auto-increments and reconstructs URLs for you.

## Jira Integration

Jira keys are used directly as identifiers:

- Jira issue `PROJECT-5` → Identifier: `PROJECT-5`
- URL: `https://company.atlassian.net/browse/PROJECT-5`

Supports both Jira Cloud and Server.

## Directory Structure

Specs are organized by date:

```
.kiro/specs/
├── 2026-01/
│   ├── GITHUB-1+user-authentication/
│   │   ├── requirements.md
│   │   ├── design.md
│   │   ├── tasks.md
│   │   ├── metadata.json
│   │   └── .work/
│   └── GITHUB-2+payment-gateway/
└── 2025-12/
    └── PROJECT-20+admin-panel/
```

## Naming Convention

Specs follow: `IDENTIFIER+spec-name`

- **IDENTIFIER**: Uppercase (e.g., `PROJECT-1`, `GITHUB-5`)
- **spec-name**: Lowercase kebab-case (e.g., `user-authentication`)

## Metadata

Each spec includes tracking metadata:

```json
{
  "specIdentifier": "GITHUB-5",
  "specName": "user-authentication",
  "displayName": "User Authentication",
  "created": "2026-01-16",
  "status": "in-progress",
  "url": "https://github.com/owner/repo/issues/5",
  "assignee": "John Doe",
  "tags": ["auth", "security"]
}
```

See **[metadata-schema.md](metadata-schema.md)** for complete metadata documentation.

## Configuration

Configuration is stored in `.kiro/spec-manager.json`:

**GitHub:**
```json
{
  "trackingSystem": "github",
  "githubRepository": "https://github.com/owner/repo",
  "usePrefix": true,
  "projectPrefix": "GITHUB-",
  "lastUpdated": "2026-01-16T10:30:00Z"
}
```

**Jira:**
```json
{
  "trackingSystem": "jira",
  "jiraBaseUrl": "https://company.atlassian.net",
  "jiraProject": "PROJECT",
  "usePrefix": true,
  "projectPrefix": "PROJECT-",
  "lastUpdated": "2026-01-16T10:30:00Z"
}
```

See **[spec-manager-schema.md](spec-manager-schema.md)** for complete configuration documentation.

## Documentation

For detailed documentation, see:

- **[POWER.md](POWER.md)** - Complete feature documentation and examples
- **[spec-manager-schema.md](spec-manager-schema.md)** - Configuration schema and validation rules
- **[metadata-schema.md](metadata-schema.md)** - Metadata field documentation
- **steering/** - Detailed workflow guides

## Development

### Building

```bash
npm run build
```

Builds the power to `dist/` directory.

### Local Installation

1. Clone the repository
2. Build: `npm run build`
3. In Kiro, install from: `/path/to/repo/dist`

See **[BUILD.md](BUILD.md)** for complete build instructions and development guidelines.

## License

MIT
