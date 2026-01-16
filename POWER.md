---
name: "spec-manager"
displayName: "Spec Manager"
description: "Standardize spec creation with intelligent identifier auto-increment, URL pattern detection, GitHub Issues and Jira integration, and git-based assignee tracking for consistent project management across teams"
keywords: 
  - "specs"
  - "project-management"
  - "organization"
  - "workflow"
  - "traceability"
  - "naming-conventions"
  - "auto-increment"
  - "github"
  - "jira"
  - "tracking-systems"
  - "prefix-aware-input"
author: "Kiro Community"
---

# Spec Manager

A Knowledge Base Power that standardizes spec creation in Kiro with intelligent automation and consistent organization.

## Overview

The Spec Manager Power provides comprehensive workflows and documentation for creating specs with:

- **Intelligent Identifier Auto-increment**: Automatically suggests the next identifier based on your project's pattern (with or without zero-padding)
- **Prefix-Aware Input**: Type just numbers (e.g., `7`) instead of full identifiers (e.g., `GITHUB-7`) for faster spec creation
- **URL Pattern Detection**: Reconstructs external system URLs from previous specs
- **GitHub Issues Integration**: Synthetic identifiers (GITHUB-{number}) with automatic URL reconstruction
- **Jira Integration**: Direct use of Jira keys as identifiers with Cloud and Server support
- **Configuration Management**: Persistent tracking system preferences in spec-manager.json
- **Git-based Assignee Tracking**: Auto-detects assignee from git config
- **Date-based Organization**: Organizes specs by year-month for scalability
- **Metadata Query Capabilities**: Search and filter specs by tags, status, assignee, or identifier
- **Consistent Naming Conventions**: Enforces `IDENTIFIER+spec-name` format

This power helps teams maintain consistency across hundreds of specs while minimizing manual work through intelligent pattern detection and tracking system integration.


## Why Use Spec Manager?

**Problem**: Creating specs manually leads to inconsistent naming, scattered organization, and repetitive data entry.

**Solution**: Spec Manager automates the tedious parts while maintaining flexibility:

- **Save Time**: Auto-increment identifiers, detect URL patterns, pull assignee from git
- **Stay Consistent**: Enforces naming conventions across all specs
- **Scale Easily**: Date-based folders prevent cluttered directories
- **Find Quickly**: Query specs by tag, status, assignee, or identifier
- **Maintain Traceability**: Links specs to external systems (Jira, GitHub, Linear, etc.)

**Perfect for teams** managing multiple projects with dozens or hundreds of specs.


## Quick Start

### Creating Your First Spec

Simply tell Kiro you want to create a new spec:

```
You: "Create a new spec for user authentication feature"

Kiro: "Identifier? (Press Enter to auto-increment from last spec)"
You: [Enter]

Kiro: "Last spec: PROYECTO-100. Suggested: PROYECTO-101. Confirm?"
You: "Yes"

Kiro: "Spec name suggestion: user-authentication-feature. Confirm?"
You: "Yes"

Kiro: "External system URL? (Press Enter to auto-detect pattern)"
You: [Enter]

Kiro: "Detected: https://jira.company.com/browse/PROYECTO-101. Correct?"
You: "Yes"

Kiro: "Assignee detected from git: Manuel Lara. Confirm?"
You: "Yes"

Kiro: "✅ Spec created at: .kiro/specs/2026-01/PROYECTO-101+user-authentication-feature/"
```

### What Gets Created

```
.kiro/specs/2026-01/PROYECTO-101+user-authentication-feature/
├── requirements.md          # Your requirements document
├── design.md               # Your design document
├── tasks.md                # Your implementation tasks
├── metadata.json           # Tracking metadata
└── .work/                  # Temporary files
    ├── helpers/
    ├── tests/
    └── reports/
```


## Naming Conventions

### Identifier Format

**Rule**: Identifiers are always UPPERCASE and can contain letters, numbers, and hyphens.

**Examples**:
- ✅ `PROYECTO-100`
- ✅ `JIRA-KEY-5`
- ✅ `FEATURE-1`
- ✅ `SPEC-MANAGER-001`
- ❌ `proyecto-100` (will be converted to `PROYECTO-100`)
- ❌ `Project_100` (underscores not allowed)

### Identifier Auto-increment

When you don't provide an identifier, Kiro automatically suggests the next one:

**Pattern Detection**:
- Finds the most recent spec (current month first, then backwards)
- Extracts the identifier pattern
- Detects if it uses zero-padding
- Increments the number
- Preserves the padding style

**Examples**:

| Last Spec | Pattern | Next Suggested |
|-----------|---------|----------------|
| `PROYECTO-100` | No padding | `PROYECTO-101` |
| `PROYECTO-001` | 3-digit padding | `PROYECTO-002` |
| `JIRA-KEY-5` | No padding | `JIRA-KEY-6` |
| `SPEC-01` | 2-digit padding | `SPEC-02` |
| `FEATURE-099` | 3-digit padding | `FEATURE-100` (natural overflow) |

**Padding Preservation**: The system respects your project's convention. If you use `001, 002, 003...`, it continues that pattern. If you use `1, 2, 3...`, it follows that style.

### Spec Name Format

**Rule**: Spec names are lowercase kebab-case, max 50 characters.

**Normalization Process**:
1. Convert to lowercase
2. Replace spaces with hyphens
3. Remove special characters (keep only a-z, 0-9, -)
4. Remove consecutive hyphens
5. Trim hyphens from start/end
6. Truncate if > 50 characters (preserving meaning)

**Examples**:

| Input | Output |
|-------|--------|
| "User Authentication" | `user-authentication` |
| "API Integration Module" | `api-integration-module` |
| "Create form that does XYZ" | `create-form-xyz` |
| "Payment Processing System!!!" | `payment-processing-system` |

**Good Names** (concise, clear):
- `user-auth`
- `payment-gateway`
- `api-integration`
- `dashboard-redesign`
- `data-migration`

**Names to Avoid** (too long, too vague):
- ❌ `create-a-form-that-handles-user-input-and-validates-it`
- ❌ `feature`
- ❌ `update`
- ❌ `fix-bug`

### Combined Format

**Rule**: Spec directories use `IDENTIFIER+spec-name` format.

The `+` sign clearly separates the identifier from the descriptive name.

**Examples**:
- `PROYECTO-100+user-authentication`
- `JIRA-KEY-5+payment-gateway`
- `FEATURE-1+dashboard-redesign`


## Directory Structure

### Date-based Organization

Specs are organized by year-month to prevent directory clutter:

```
.kiro/specs/
├── 2026-01/
│   ├── PROYECTO-100+user-auth/
│   ├── PROYECTO-101+payment-gateway/
│   └── FEATURE-5+dashboard/
├── 2026-02/
│   ├── PROYECTO-102+api-integration/
│   └── JIRA-KEY-10+data-migration/
└── 2025-12/
    └── PROYECTO-99+legacy-feature/
```

**Benefits**:
- Scales to thousands of specs
- Easy to find specs by creation date
- Clean, organized structure
- No single directory with hundreds of items

### Spec Directory Structure

Each spec contains:

```
IDENTIFIER+spec-name/
├── requirements.md          # EARS-formatted requirements
├── design.md               # Architecture and correctness properties
├── tasks.md                # Implementation task list
├── metadata.json           # Tracking and traceability data
└── .work/                  # Temporary files (not committed)
    ├── helpers/            # Utility scripts
    ├── tests/              # Test files
    └── reports/            # Execution reports
```

### The .work/ Directory

Use `.work/` for all temporary files generated during spec development:

**helpers/**: Utility scripts, data generators, validation tools
**tests/**: Test files, test data, test reports
**reports/**: Execution logs, analysis results, performance reports

**Why separate?**
- Keeps spec root clean
- Easy to .gitignore temporary files
- Clear distinction between spec documents and working files


## Metadata Tracking

### metadata.json Schema

Each spec includes a `metadata.json` file for tracking and traceability:

```json
{
  "specIdentifier": "PROYECTO-101",
  "specName": "user-authentication",
  "displayName": "User Authentication",
  "created": "2026-01-16",
  "updated": "2026-01-16",
  "status": "draft",
  "url": "https://jira.company.com/browse/PROYECTO-101",
  "assignee": "Manuel Lara",
  "tags": ["authentication", "security", "api"],
  "notes": "Implements OAuth2 and JWT authentication"
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `specIdentifier` | string | Yes | Uppercase identifier (e.g., "PROYECTO-101") |
| `specName` | string | Yes | Kebab-case name (e.g., "user-authentication") |
| `displayName` | string | Yes | Human-readable name |
| `created` | string | Yes | ISO date of creation |
| `updated` | string | Yes | ISO date of last update |
| `status` | string | Yes | "draft", "in-progress", "completed", "archived" |
| `url` | string | No | External system URL (Jira, GitHub, Linear, etc.) |
| `assignee` | string | No | Person responsible for the spec |
| `tags` | array | No | Categorization tags |
| `notes` | string | No | Additional context or notes |

### Auto-detection Features

#### URL Pattern Detection

When creating a new spec, if you provide only an identifier, Kiro searches recent specs for URL patterns:

```
Last spec URL: https://jira.company.com/browse/PROYECTO-100
New identifier: PROYECTO-101
Reconstructed: https://jira.company.com/browse/PROYECTO-101
```

**How it works**:
1. Searches most recent specs (current month first, then backwards)
2. Finds a spec with a URL in metadata
3. Extracts the pattern
4. Replaces the identifier with your new one
5. Presents for confirmation

**You can always**:
- Provide the full URL manually
- Correct the auto-detected URL
- Leave it empty (optional field)

#### Assignee from Git Config

Kiro automatically detects the assignee from your git configuration:

```bash
$ git config user.name
Manuel Lara
```

**Workflow**:
1. Kiro runs `git config user.name`
2. Presents the detected name: "Assignee: Manuel Lara. Confirm?"
3. You can confirm or provide a different name
4. If git is not available, prompts manually

### Status Values

Use these standard status values for consistency:

- **draft**: Initial creation, requirements being gathered
- **in-progress**: Active development
- **completed**: Implementation finished
- **archived**: No longer active, kept for reference


## Querying Metadata

You can ask Kiro to search and retrieve spec information using natural language:

### Query by URL

```
You: "What's the URL for PROYECTO-101?"
Kiro: "The URL for PROYECTO-101 is: https://jira.company.com/browse/PROYECTO-101"
```

### Query by Tag

```
You: "Find all specs tagged with 'authentication'"
Kiro: "Found 3 specs with tag 'authentication':
- PROYECTO-101+user-authentication (in-progress)
- FEATURE-5+oauth-integration (completed)
- JIRA-KEY-8+sso-implementation (draft)"
```

### Query by Status

```
You: "Show me all in-progress specs"
Kiro: "Found 5 specs with status 'in-progress':
- PROYECTO-101+user-authentication
- PROYECTO-102+payment-gateway
- FEATURE-6+dashboard-redesign
..."
```

### Query by Assignee

```
You: "Show me all specs assigned to Manuel"
Kiro: "Found 4 specs assigned to Manuel Lara:
- PROYECTO-101+user-authentication (in-progress)
- PROYECTO-100+api-integration (completed)
..."
```

### Query by Identifier

```
You: "Where is the spec for PROYECTO-101?"
Kiro: "Spec PROYECTO-101 is located at:
.kiro/specs/2026-01/PROYECTO-101+user-authentication/"
```

### List Specs by Date

```
You: "List all specs from January 2026"
Kiro: "Found 12 specs in 2026-01:
- PROYECTO-100+user-auth
- PROYECTO-101+payment-gateway
..."
```

### How It Works

Kiro searches through your `.kiro/specs/` directory:
1. Scans date directories (most recent first)
2. Reads `metadata.json` files
3. Filters based on your query
4. Returns matching results

**Performance**: Queries are fast even with hundreds of specs since metadata files are small and organized by date.


## Work Directory Guidelines

### When to Use .work/

The `.work/` directory is for **temporary files** generated during spec development and execution. Use it for:

**helpers/**:
- Data generators
- Validation scripts
- Utility functions
- Mock data creators
- Test data builders

**tests/**:
- Unit test files
- Integration test files
- Property-based test files
- Test fixtures
- Test data

**reports/**:
- Execution logs
- Test results
- Performance reports
- Coverage reports
- Analysis outputs

### What NOT to Put in .work/

Keep these in the spec root:
- ❌ `requirements.md` - Core spec document
- ❌ `design.md` - Core spec document
- ❌ `tasks.md` - Core spec document
- ❌ `metadata.json` - Tracking data

### .gitignore Recommendation

Add to your `.gitignore`:

```gitignore
# Spec working directories
.kiro/specs/**/.work/
```

This keeps temporary files local while committing spec documents.

### Example Usage

```
.work/
├── helpers/
│   ├── generate-test-data.py
│   ├── validate-schema.js
│   └── mock-api-responses.json
├── tests/
│   ├── unit/
│   │   ├── test-validation.py
│   │   └── test-parsing.py
│   └── integration/
│       └── test-workflow.py
└── reports/
    ├── test-results-2026-01-16.json
    ├── coverage-report.html
    └── execution-log.txt
```


## Integration with Kiro

### Compatible with Kiro Spec Workflow

Specs created with Spec Manager work seamlessly with Kiro's spec-driven development tools:

#### taskStatus Tool

Update task status in your `tasks.md`:

```
taskFilePath: ".kiro/specs/2026-01/PROYECTO-101+user-auth/tasks.md"
task: "1. Implement authentication module"
status: "completed"
```

#### updatePBTStatus Tool

Track property-based test results:

```
taskFilePath: ".kiro/specs/2026-01/PROYECTO-101+user-auth/tasks.md"
taskId: "2.1 Write property test for authentication"
status: "passed"
```

### Path References

Always use the full relative path when referencing spec files:

**Format**: `.kiro/specs/{YYYY-MM}/{IDENTIFIER}+{name}/{file}`

**Examples**:
```
.kiro/specs/2026-01/PROYECTO-101+user-auth/requirements.md
.kiro/specs/2026-01/PROYECTO-101+user-auth/design.md
.kiro/specs/2026-01/PROYECTO-101+user-auth/tasks.md
```

### EARS Requirements Format

Requirements documents follow EARS (Easy Approach to Requirements Syntax):

```markdown
### Requirement 1

**User Story:** As a user, I want to authenticate, so that I can access the system.

#### Acceptance Criteria

1. WHEN a user provides valid credentials, THE System SHALL grant access
2. WHEN a user provides invalid credentials, THE System SHALL deny access
3. THE System SHALL log all authentication attempts
```

### Correctness Properties

Design documents include testable correctness properties:

```markdown
### Property 1: Authentication Success

*For any* valid user credentials, authentication should succeed and return a valid token.

**Validates: Requirements 1.1**
```

### Task Format

Tasks use checkboxes for tracking:

```markdown
- [ ] 1. Implement authentication
  - [ ] 1.1 Create authentication module
  - [ ] 1.2 Write unit tests
  - [ ]* 1.3 Write property tests
```

Tasks marked with `*` are optional.


## Complete Examples

### Example 1: Simple Spec Creation

**Scenario**: Creating a basic spec with auto-increment

```
You: "Create a new spec for payment gateway integration"

Kiro: "Identifier? (Enter to auto-increment)"
You: [Enter]

Kiro: "Last: PROYECTO-100. Suggested: PROYECTO-101. Confirm?"
You: "yes"

Kiro: "Spec name: payment-gateway-integration. Confirm?"
You: "yes"

Kiro: "External URL? (Enter to auto-detect)"
You: [Enter]

Kiro: "No URL pattern found. Provide URL or leave empty?"
You: [Enter]

Kiro: "Assignee from git: Manuel Lara. Confirm?"
You: "yes"

Kiro: "✅ Created: .kiro/specs/2026-01/PROYECTO-101+payment-gateway-integration/"
```

**Result**:
```json
{
  "specIdentifier": "PROYECTO-101",
  "specName": "payment-gateway-integration",
  "displayName": "Payment Gateway Integration",
  "created": "2026-01-16",
  "status": "draft",
  "url": null,
  "assignee": "Manuel Lara"
}
```

### Example 2: Spec with External System Integration

**Scenario**: Creating a spec with Jira URL

```
You: "Create spec for user authentication, Jira ticket PROYECTO-102"

Kiro: "Identifier?"
You: "PROYECTO-102"

Kiro: "Spec name: user-authentication. Confirm?"
You: "yes"

Kiro: "External URL?"
You: "102"

Kiro: "Detected pattern: https://jira.company.com/browse/PROYECTO-102. Correct?"
You: "yes"

Kiro: "Assignee: Manuel Lara. Confirm?"
You: "yes"

Kiro: "✅ Created: .kiro/specs/2026-01/PROYECTO-102+user-authentication/"
```

**Result**:
```json
{
  "specIdentifier": "PROYECTO-102",
  "specName": "user-authentication",
  "displayName": "User Authentication",
  "created": "2026-01-16",
  "status": "draft",
  "url": "https://jira.company.com/browse/PROYECTO-102",
  "assignee": "Manuel Lara"
}
```

### Example 3: Long Name Truncation

**Scenario**: Spec name gets normalized and truncated

```
You: "Create spec for implementing a comprehensive user management system with role-based access control"

Kiro: "Identifier?"
You: "FEATURE-10"

Kiro: "Spec name suggestion: implementing-comprehensive-user-management. Confirm?"
You: "yes"

Kiro: "✅ Created: .kiro/specs/2026-01/FEATURE-10+implementing-comprehensive-user-management/"
```

**Note**: Name was truncated from 80+ characters to 50 while preserving meaning.


## Best Practices

### Identifier Naming

**Do**:
- ✅ Use consistent prefixes (`PROYECTO-`, `JIRA-KEY-`, `FEATURE-`)
- ✅ Include project/system identifier
- ✅ Use sequential numbers
- ✅ Stick to one padding style (all `001` or all `1`)

**Don't**:
- ❌ Mix different formats (`PROYECTO-1`, `proyecto_2`, `PROJ3`)
- ❌ Use special characters except hyphens
- ❌ Make identifiers too long (`VERY-LONG-PROJECT-NAME-2024-Q1-FEATURE-100`)

### Spec Name Selection

**Do**:
- ✅ Be concise (2-4 words ideal)
- ✅ Focus on the feature/capability
- ✅ Use clear, descriptive terms
- ✅ Examples: `user-auth`, `payment-gateway`, `api-integration`

**Don't**:
- ❌ Write full sentences
- ❌ Include implementation details
- ❌ Use vague terms (`feature`, `update`, `fix`)
- ❌ Make it too long (>50 characters)

### Metadata Maintenance

**Do**:
- ✅ Update `status` as work progresses
- ✅ Add relevant `tags` for categorization
- ✅ Keep `notes` concise and current
- ✅ Update `updated` field when making changes

**Don't**:
- ❌ Leave status as "draft" forever
- ❌ Add too many tags (3-5 is ideal)
- ❌ Write essays in `notes` field

### URL Management

**Do**:
- ✅ Use auto-detection when possible
- ✅ Confirm detected URLs before accepting
- ✅ Keep URLs consistent across project
- ✅ Link to specific tickets/issues

**Don't**:
- ❌ Mix different systems (Jira + GitHub in same project)
- ❌ Use temporary or local URLs
- ❌ Leave URLs pointing to deleted tickets

### .work/ Directory Usage

**Do**:
- ✅ Put all temporary files in `.work/`
- ✅ Organize by subdirectory (helpers/, tests/, reports/)
- ✅ Add `.work/` to `.gitignore`
- ✅ Clean up old reports periodically

**Don't**:
- ❌ Commit temporary files to git
- ❌ Mix working files with spec documents
- ❌ Let `.work/` grow indefinitely

### Team Conventions

**Establish**:
- Identifier prefix for your project
- Padding style (with or without zeros)
- External system for URLs (Jira, GitHub, etc.)
- Standard tags for categorization
- Status workflow (draft → in-progress → completed)

**Document** your team's conventions in a shared location.


## Troubleshooting

### "Invalid identifier characters"

**Problem**: Identifier contains special characters

**Solution**:
- Use only letters, numbers, and hyphens
- Example: `PROYECTO-100` ✅, `PROYECTO_100` ❌
- Kiro will prompt you to provide a valid identifier

### "Spec directory already exists"

**Problem**: A spec with that identifier+name already exists

**Solutions**:
1. Use a different identifier
2. Use a different spec name
3. Check if you meant to update the existing spec
4. Delete the existing spec if it's a duplicate

### "Cannot auto-detect assignee from git"

**Problem**: Git is not configured or not available

**Solutions**:
1. Configure git: `git config --global user.name "Your Name"`
2. Provide assignee manually when prompted
3. Leave assignee empty (it's optional)

### "No URL pattern found"

**Problem**: No previous specs have URLs to detect pattern from

**Solutions**:
1. Provide the full URL manually
2. Leave URL empty (it's optional)
3. Once you add a URL, future specs can auto-detect the pattern

### "Cannot increment identifier (no numeric suffix)"

**Problem**: Last spec identifier doesn't end with a number

**Example**: Last spec is `FEATURE-AUTH` (no number)

**Solutions**:
1. Provide identifier manually
2. Add a number to start a sequence: `FEATURE-1`

### "Spec name too long"

**Problem**: Suggested name exceeds 50 characters

**Solution**:
- Kiro automatically truncates while preserving meaning
- You can provide a shorter custom name
- Focus on 2-4 key words

### "Permission denied creating directory"

**Problem**: No write permissions in `.kiro/specs/`

**Solutions**:
1. Check workspace permissions
2. Ensure `.kiro/` directory exists
3. Run with appropriate permissions

### "Metadata validation error"

**Problem**: metadata.json doesn't match expected schema

**Solutions**:
1. Check for typos in field names
2. Ensure required fields are present
3. Verify date format is ISO (YYYY-MM-DD)
4. Check status is one of: draft, in-progress, completed, archived

## Available Steering Files

For more detailed guidance, see:

- **creating-specs.md**: Step-by-step workflow with validation rules
- **naming-conventions.md**: Deep dive into identifier and name formats
- **troubleshooting.md**: Extended troubleshooting guide
- **querying-metadata.md**: Advanced metadata query patterns

