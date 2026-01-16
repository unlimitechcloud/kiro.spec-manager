# Spec Manager Power

Standardize spec creation in Kiro with intelligent automation and consistent organization.

## Installation

### From GitHub (Distribution Branch)

```
https://github.com/unlimitechcloud/kiro.spec-manager/tree/dist-branch
```

### From Local Build

1. Clone the repository
2. Build the power: `npm run build`
3. In Kiro, install from local directory: `/path/to/repo/dist`

## Development

This repository contains both source files and build tools.

- **Source files**: Root directory
- **Distribution files**: `dist/` directory (generated)
- **Build instructions**: See [BUILD.md](BUILD.md)

## What It Does

Spec Manager automates and standardizes specification creation:

- **Intelligent Auto-increment**: Detects your identifier pattern and suggests the next one automatically
- **URL Pattern Detection**: Reconstructs URLs from external systems (Jira, GitHub, Linear) based on previous specs
- **Date-based Organization**: Organizes specs into `YYYY-MM/` directories for scalability
- **Metadata Tracking**: Links specs to external systems and tracks status, assignees, tags
- **Natural Language Queries**: Search specs by identifier, tag, status, assignee, or URL
- **Git Integration**: Automatically detects assignee from your git configuration

## Why Use Spec Manager?

**Problem**: Creating specs manually leads to inconsistent naming, scattered organization, and repetitive data entry.

**Solution**: Spec Manager automates the tedious parts while maintaining flexibility:

- **Save Time**: Auto-increments identifiers, detects URL patterns, pulls assignee from git
- **Stay Consistent**: Enforces naming conventions across all specs
- **Scale Easily**: Date-based folders prevent cluttered directories
- **Find Quickly**: Query specs by tag, status, assignee, or identifier
- **Maintain Traceability**: Links specs to external systems (Jira, GitHub, Linear, etc.)

**Perfect for teams** managing multiple projects with dozens or hundreds of specs.

## Configuration

### spec-manager.json

The Spec Manager Power uses a configuration file to store your tracking system preferences and enable automatic URL reconstruction.

**Location**: `.kiro/spec-manager.json`

**What it stores**:
- Which tracking system you're using (GitHub, Jira, or none)
- Repository URL (for GitHub) or base URL (for Jira)
- Project key (for Jira)

**How it works**:
1. When you create your first spec with a GitHub or Jira URL, Kiro automatically creates this file
2. For subsequent specs, Kiro uses the config to reconstruct URLs automatically
3. You can manually edit the file if needed

**Example configurations**:

GitHub:
```json
{
  "trackingSystem": "github",
  "githubRepository": "https://github.com/owner/repo",
  "lastUpdated": "2026-01-16T10:30:00Z"
}
```

Jira:
```json
{
  "trackingSystem": "jira",
  "jiraBaseUrl": "https://company.atlassian.net",
  "jiraProject": "PROJECT",
  "lastUpdated": "2026-01-16T10:30:00Z"
}
```

See `spec-manager-schema.md` for complete documentation of all fields and validation rules.

## GitHub Issues Integration

Spec Manager provides first-class support for GitHub Issues with automatic identifier generation and URL reconstruction.

### How GitHub Issues Work

GitHub uses a simple numeric system for issues:
- Each repository has its own issue sequence: `#1`, `#2`, `#3`, etc.
- Issue URLs follow the pattern: `https://github.com/{owner}/{repo}/issues/{number}`
- No prefixes or project keys - just consecutive numbers

### Synthetic Identifiers

Since GitHub issue numbers are repository-specific and have no prefix, Spec Manager generates **synthetic identifiers** with the format:

```
GITHUB-{number}
```

**Examples**:
- GitHub issue #1 → Identifier: `GITHUB-1`
- GitHub issue #42 → Identifier: `GITHUB-42`
- GitHub issue #123 → Identifier: `GITHUB-123`

This provides:
- **Consistency** with other tracking systems (Jira, Linear, etc.)
- **Clear identification** that this spec links to GitHub
- **Easy searching** and filtering of GITHUB-linked specs

### URL Detection

Kiro automatically detects GitHub URLs:

```
You: "Create a spec for https://github.com/owner/repo/issues/5"

Kiro: "Detected GitHub issue #5"
Kiro: "Suggested identifier: GITHUB-5. Confirm?"
```

**Supported URL formats**:
- Standard GitHub: `https://github.com/{owner}/{repo}/issues/{number}`
- GitHub Enterprise: `https://github.enterprise.com/{owner}/{repo}/issues/{number}`

### Auto-increment

When creating multiple specs for the same repository:

```
You: "Create a new spec for user authentication"

Kiro: "Identifier? (Press Enter to auto-increment)"
You: [Enter]

Kiro: "Last GitHub spec: GITHUB-5. Suggested: GITHUB-6. Confirm?"
You: "yes"

Kiro: "External URL? (Press Enter to auto-detect)"
You: [Enter]

Kiro: "Detected: https://github.com/owner/repo/issues/6. Correct?"
You: "yes"
```

**How it works**:
1. Kiro finds the most recent spec with a `GITHUB-` prefix
2. Extracts the issue number
3. Increments by 1
4. Reconstructs the URL using the repository from `spec-manager.json`

**Starting from scratch**:
If no GitHub specs exist, Kiro suggests `GITHUB-1` as the starting identifier.

### URL Reconstruction

After your first GitHub spec, Kiro stores the repository URL in `.kiro/spec-manager.json`:

```json
{
  "trackingSystem": "github",
  "githubRepository": "https://github.com/owner/repo",
  "lastUpdated": "2026-01-16T10:30:00Z"
}
```

For subsequent specs, you can just provide the issue number:

```
You: "Create spec for issue 10"

Kiro: "Identifier: GITHUB-10. Confirm?"
You: "yes"

Kiro: "Reconstructed URL: https://github.com/owner/repo/issues/10. Correct?"
You: "yes"
```

### Complete Workflow Example

**First spec with GitHub**:
```
You: "Create a spec for GitHub issue 1"

Kiro: "Provide the GitHub URL:"
You: "https://github.com/unlimitechcloud/kiro.spec-manager/issues/1"

Kiro: "Detected GitHub issue #1"
Kiro: "Suggested identifier: GITHUB-1. Confirm?"
You: "yes"

Kiro: "Spec name suggestion: github-issue-1. Provide a better name:"
You: "user-authentication"

Kiro: "Saving repository URL to config for future specs..."
Kiro: "✅ Created: .kiro/specs/2026-01/GITHUB-1+user-authentication/"
```

**Second spec (with auto-increment)**:
```
You: "Create a spec for payment gateway"

Kiro: "Identifier? (Press Enter to auto-increment)"
You: [Enter]

Kiro: "Last GitHub spec: GITHUB-1. Suggested: GITHUB-2. Confirm?"
You: "yes"

Kiro: "Spec name: payment-gateway. Confirm?"
You: "yes"

Kiro: "External URL? (Press Enter to auto-detect)"
You: [Enter]

Kiro: "Reconstructed: https://github.com/unlimitechcloud/kiro.spec-manager/issues/2. Correct?"
You: "yes"

Kiro: "✅ Created: .kiro/specs/2026-01/GITHUB-2+payment-gateway/"
```

### Querying GitHub Specs

Search by full identifier:
```
You: "What's the URL for GITHUB-5?"
Kiro: "GITHUB-5 (user-authentication) → https://github.com/owner/repo/issues/5"
```

Search by number only:
```
You: "Show me issue 5"
Kiro: "Found: GITHUB-5 (user-authentication) → https://github.com/owner/repo/issues/5"
```

List all GitHub specs:
```
You: "List all GitHub specs"
Kiro: "Found 3 GitHub specs:
- GITHUB-1+user-authentication
- GITHUB-2+payment-gateway
- GITHUB-5+api-integration"
```

### Metadata Example

```json
{
  "specIdentifier": "GITHUB-5",
  "specName": "user-authentication",
  "displayName": "User Authentication",
  "created": "2026-01-16",
  "updated": "2026-01-16",
  "status": "in-progress",
  "url": "https://github.com/unlimitechcloud/kiro.spec-manager/issues/5",
  "assignee": "John Doe",
  "tags": ["auth", "security", "github"]
}
```

See `example-metadata-github.json` for a complete example.

## Jira Integration

Spec Manager provides first-class support for Jira with direct use of Jira issue keys as identifiers.

### How Jira Works

Jira uses a key-based system for issues:
- Each project has a prefix: `PROJECT`, `FEAT`, `BUG`, etc.
- Issues are numbered within the project: `PROJECT-1`, `PROJECT-2`, etc.
- Issue URLs vary by Jira type (Cloud vs Server)

### Direct Key Usage

Unlike GitHub, Jira keys are used **directly** as spec identifiers - no synthetic prefix needed:

```
Jira issue: PROJECT-123
Spec identifier: PROJECT-123
```

**Why?**
- Jira keys already include a project prefix
- Keys are globally unique within a Jira instance
- Direct mapping maintains consistency with your Jira workflow

### URL Detection

Kiro automatically detects Jira URLs from both Cloud and Server:

**Jira Cloud**:
```
https://company.atlassian.net/browse/PROJECT-123
```

**Jira Server**:
```
https://jira.company.com/browse/PROJECT-123
https://jira.company.com/projects/PROJECT/issues/PROJECT-123
```

```
You: "Create a spec for https://company.atlassian.net/browse/PROJECT-5"

Kiro: "Detected Jira issue PROJECT-5"
Kiro: "Suggested identifier: PROJECT-5. Confirm?"
```

### Auto-increment

When creating multiple specs for the same Jira project:

```
You: "Create a new spec for user authentication"

Kiro: "Identifier? (Press Enter to auto-increment)"
You: [Enter]

Kiro: "Last PROJECT spec: PROJECT-5. Suggested: PROJECT-6. Confirm?"
You: "yes"

Kiro: "External URL? (Press Enter to auto-detect)"
You: [Enter]

Kiro: "Detected: https://company.atlassian.net/browse/PROJECT-6. Correct?"
You: "yes"
```

**How it works**:
1. Kiro finds the most recent spec with the same project prefix (e.g., `PROJECT-`)
2. Extracts the issue number
3. Increments by 1
4. Reconstructs the URL using the Jira base URL from `spec-manager.json`

**Starting from scratch**:
If no specs exist for the project, Kiro suggests `PROJECT-1` as the starting identifier.

**Multiple projects**:
You can have specs from different Jira projects in the same workspace:
- `PROJECT-1`, `PROJECT-2`, `PROJECT-3`
- `FEAT-1`, `FEAT-2`
- `BUG-1`, `BUG-2`

Each project maintains its own sequence.

### URL Reconstruction

After your first Jira spec, Kiro stores the Jira configuration in `.kiro/spec-manager.json`:

```json
{
  "trackingSystem": "jira",
  "jiraBaseUrl": "https://company.atlassian.net",
  "jiraProject": "PROJECT",
  "lastUpdated": "2026-01-16T10:30:00Z"
}
```

For subsequent specs, you can just provide the issue key:

```
You: "Create spec for PROJECT-10"

Kiro: "Identifier: PROJECT-10. Confirm?"
You: "yes"

Kiro: "Reconstructed URL: https://company.atlassian.net/browse/PROJECT-10. Correct?"
You: "yes"
```

### Complete Workflow Example

**First spec with Jira**:
```
You: "Create a spec for Jira ticket PROJECT-1"

Kiro: "Provide the Jira URL:"
You: "https://company.atlassian.net/browse/PROJECT-1"

Kiro: "Detected Jira issue PROJECT-1"
Kiro: "Suggested identifier: PROJECT-1. Confirm?"
You: "yes"

Kiro: "Spec name suggestion: project-1. Provide a better name:"
You: "user-authentication"

Kiro: "Saving Jira config for future specs..."
Kiro: "✅ Created: .kiro/specs/2026-01/PROJECT-1+user-authentication/"
```

**Second spec (with auto-increment)**:
```
You: "Create a spec for payment gateway"

Kiro: "Identifier? (Press Enter to auto-increment)"
You: [Enter]

Kiro: "Last PROJECT spec: PROJECT-1. Suggested: PROJECT-2. Confirm?"
You: "yes"

Kiro: "Spec name: payment-gateway. Confirm?"
You: "yes"

Kiro: "External URL? (Press Enter to auto-detect)"
You: [Enter]

Kiro: "Reconstructed: https://company.atlassian.net/browse/PROJECT-2. Correct?"
You: "yes"

Kiro: "✅ Created: .kiro/specs/2026-01/PROJECT-2+payment-gateway/"
```

### Querying Jira Specs

Search by issue key:
```
You: "What's the URL for PROJECT-5?"
Kiro: "PROJECT-5 (user-authentication) → https://company.atlassian.net/browse/PROJECT-5"
```

Search by project:
```
You: "List all PROJECT specs"
Kiro: "Found 3 PROJECT specs:
- PROJECT-1+user-authentication
- PROJECT-2+payment-gateway
- PROJECT-5+api-integration"
```

Search by tag:
```
You: "Show me all Jira specs tagged with 'auth'"
Kiro: "Found 2 specs:
- PROJECT-1+user-authentication
- FEAT-10+oauth-integration"
```

### Metadata Example

```json
{
  "specIdentifier": "PROJECT-5",
  "specName": "user-authentication",
  "displayName": "User Authentication",
  "created": "2026-01-16",
  "updated": "2026-01-16",
  "status": "in-progress",
  "url": "https://company.atlassian.net/browse/PROJECT-5",
  "assignee": "John Doe",
  "tags": ["auth", "security", "jira"]
}
```

See `example-metadata-jira.json` for a complete example.

### Jira Cloud vs Server

Both are supported with automatic detection:

**Jira Cloud** (atlassian.net):
- URL pattern: `https://{company}.atlassian.net/browse/{key}`
- Automatically detected by the `.atlassian.net` domain

**Jira Server** (self-hosted):
- URL patterns:
  - `https://{domain}/browse/{key}`
  - `https://{domain}/projects/{project}/issues/{key}`
- Detected by the `/browse/` or `/projects/` path

Kiro handles both transparently - you don't need to specify which type you're using.

## GitHub vs Jira Comparison

| Feature | GitHub Issues | Jira |
|---------|--------------|------|
| **Identifier Format** | `GITHUB-{number}` (synthetic) | `{PROJECT}-{number}` (direct key) |
| **Example** | `GITHUB-5`, `GITHUB-42` | `PROJECT-5`, `FEAT-42` |
| **URL Pattern** | `https://github.com/{owner}/{repo}/issues/{number}` | `https://{domain}/browse/{KEY}` |
| **Auto-increment** | Finds last `GITHUB-*`, increments number | Finds last `{PROJECT}-*`, increments number |
| **Starting ID** | `GITHUB-1` | `{PROJECT}-1` |
| **Multiple Projects** | One repository per workspace | Multiple projects in same workspace |
| **Config Fields** | `githubRepository` | `jiraBaseUrl`, `jiraProject` |
| **URL Reconstruction** | `{repo}/issues/{number}` | `{baseUrl}/browse/{key}` |
| **Variants** | GitHub.com, GitHub Enterprise | Jira Cloud, Jira Server |

### When to Use Each

**Use GitHub Issues when**:
- Your team uses GitHub for code and issues
- You want simple numeric issue tracking
- You're working with open source projects on GitHub

**Use Jira when**:
- Your team uses Jira for project management
- You need multiple project prefixes (PROJECT-, FEAT-, BUG-)
- You're in an enterprise environment with Jira

**Use both when**:
- Different projects use different systems
- Each workspace/project uses one system consistently

## Quick Example

**Creating a spec**:
```
You: "Create a new spec for user authentication"

Kiro: "Identifier? (Press Enter to auto-increment)"
You: [Enter]

Kiro: "Last spec: PROJECT-100. Suggested: PROJECT-101. Confirm?"
You: "yes"

Kiro: "Spec name suggestion: user-authentication. Confirm?"
You: "yes"

Kiro: "External system URL? (Press Enter to auto-detect)"
You: [Enter]

Kiro: "Detected: https://jira.company.com/browse/PROJECT-101. Correct?"
You: "yes"

Kiro: "Assignee detected from git: John Doe. Confirm?"
You: "yes"

Kiro: "✅ Spec created at: .kiro/specs/2026-01/PROJECT-101+user-authentication/"
```

**Querying specs**:
```
You: "What's the Jira link for PROJECT-101?"

Kiro: "The Jira link for PROJECT-101 (user-authentication) is:
       https://jira.company.com/browse/PROJECT-101"
```

## Key Features

### Intelligent Identifier Auto-increment

- **Pattern Detection**: Finds the most recent spec and extracts the identifier pattern
- **Padding Preservation**: Maintains zero-padding style (001→002 or 1→2)
- **Pattern Recognition**: Detects patterns like `PROJECT-`, `FEAT-`, `BUG-`

### URL Pattern Detection

- **Auto-reconstruction**: Detects URL patterns from previous specs
- **Confirmation Workflow**: Suggests reconstructed URLs for user confirmation
- **Flexible Integration**: Works with any external system (Jira, GitHub, Linear, etc.)

### Git Integration

- **Auto-detect Assignee**: Reads `git config user.name` to suggest assignee
- **Confirmation**: Always confirms detected values with the user
- **Override Support**: Users can provide different assignees if needed

### Date-based Organization

- **Automatic Grouping**: Specs organized into `YYYY-MM/` directories
- **Chronological Search**: Always searches most recent month first
- **Scalable**: Prevents thousands of specs at the same level

### Metadata Tracking

- **Structured Data**: JSON metadata for each spec
- **Queryable**: Search specs by any metadata field
- **Extensible**: Add custom fields as needed

### Natural Language Queries

- "Find all specs tagged with 'auth'"
- "Show me in-progress specs assigned to John"
- "What's the URL for PROJECT-5?"
- "List specs from January 2026"

## Naming Convention

Specs follow the format: `IDENTIFIER+spec-name`

- **IDENTIFIER**: Uppercase, alphanumeric with hyphens (e.g., `PROJECT-1`)
- **spec-name**: Lowercase, kebab-case, concise description (e.g., `user-authentication`)
- **Separator**: Plus sign (`+`) clearly separates identifier from name

**Examples**:
- `PROJECT-1+user-authentication`
- `FEAT-123+dashboard-redesign`
- `BUG-456+fix-login-error`

## Directory Structure

```
.kiro/specs/
├── 2026-01/
│   ├── PROJECT-1+user-authentication/
│   │   ├── requirements.md      # Requirements
│   │   ├── design.md           # Design
│   │   ├── tasks.md            # Tasks
│   │   ├── metadata.json       # Tracking metadata
│   │   └── .work/              # Temporary files
│   │       ├── helpers/        # Utility scripts
│   │       ├── tests/          # Test files
│   │       └── reports/        # Execution reports
│   ├── PROJECT-2+dashboard-layout/
│   └── PROJECT-3+api-optimization/
└── 2025-12/
    ├── PROJECT-20+admin-panel/
    └── PROJECT-21+user-roles/
```

### What Gets Created?

Each spec includes:

- **requirements.md**: Requirements document (EARS format)
- **design.md**: Architecture and correctness properties
- **tasks.md**: Implementation task list
- **metadata.json**: Tracking and traceability data
- **.work/**: Directory for temporary files (not committed)

## Metadata Schema

Each spec includes a `metadata.json` file for tracking:

```json
{
  "specIdentifier": "PROJECT-101",
  "specName": "user-authentication",
  "displayName": "User Authentication",
  "created": "2026-01-16",
  "updated": "2026-01-16",
  "status": "draft",
  "url": "https://jira.company.com/browse/PROJECT-101",
  "assignee": "John Doe",
  "tags": ["auth", "security", "frontend"],
  "notes": "Implements OAuth 2.0 authentication"
}
```

**Key fields**:
- `specIdentifier`: Unique identifier (required)
- `specName`: Short kebab-case name (required)
- `displayName`: Human-readable title (required)
- `created`, `updated`: ISO dates YYYY-MM-DD (required)
- `status`: Current status - "draft", "in-progress", "completed", "archived" (required)
- `url`: Link to external system (optional)
- `assignee`: Assigned person (optional)
- `tags`: Tags for categorization (optional)
- `notes`: Additional description (optional)

See `metadata-schema.md` for complete field documentation and validation rules.

## Use Cases

- **Specification-Driven Development**: Create and track implementation specs
- **Jira Integration**: Link specs to Jira tickets for traceability
- **GitHub Issues**: Connect specs to GitHub issues
- **Team Collaboration**: Track who's working on what
- **Project Management**: Query specs by status, tags, or assignee
- **Documentation**: Maintain organized, searchable spec library

## Best Practices

1. **Let Kiro Auto-increment**: Use suggested identifiers for consistency
2. **Use Descriptive Names**: Keep names concise but meaningful
3. **Tag Consistently**: Establish a tag taxonomy for your team
4. **Update Status**: Keep status fields current
5. **Include URLs**: Always link to external systems for traceability
6. **Use .work/ Directory**: Keep temporary files organized

## Getting Started

Simply ask Kiro:

```
"Create a new spec for [your feature]"
```

Kiro will guide you through the process, suggesting intelligent values based on your previous specs. You can accept suggestions by pressing Enter or provide custom values.

To query existing specs:

```
"What's the URL for PROJECT-5?"
"Show me all specs tagged with 'auth'"
"List in-progress specs"
```

For complete documentation, see **POWER.md** which includes detailed examples, troubleshooting guides, and complete workflows.
