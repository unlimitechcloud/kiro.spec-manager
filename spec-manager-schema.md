# spec-manager.json Configuration Schema

## Overview

The `spec-manager.json` file is automatically created in `.kiro/spec-manager.json` through an interactive setup wizard on first use. This file stores your preferences so Kiro can:

- Auto-detect which tracking system you're using
- Reconstruct URLs for new specs automatically
- Suggest appropriate identifier formats
- Provide system-specific guidance

## Initial Setup

When you first use the Spec Manager Power without a configuration file, Kiro will guide you through an interactive setup:

1. **Select tracking system** (GitHub, Jira, or None)
2. **Provide system-specific details** (repository URL, Jira base URL, project key)
3. **Configure prefix mode** (enable/disable prefix-aware input)
4. **Review and confirm** configuration summary
5. **Auto-create** `.kiro/spec-manager.json`

See `steering/initial-configuration-setup.md.

## File Location

```
.kiro/spec-manager.json
```

**Important**: If you have multiple `.kiro/` directories in parent paths (e.g., in a monorepo), Kiro uses the config file from the **closest** `.kiro/` directory.

## Schema Structure

```json
{
  "trackingSystem": "string",
  "githubRepository": "string (optional)",
  "jiraBaseUrl": "string (optional)",
  "jiraProject": "string (optional)",
  "usePrefix": "boolean (optional)",
  "projectPrefix": "string (optional)",
  "lastUpdated": "string (ISO 8601 datetime)"
}
```

## Field Descriptions

### Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `trackingSystem` | string | The tracking system: `"github"`, `"jira"`, or `"none"` | `"github"` |
| `lastUpdated` | string | ISO 8601 timestamp of last config update | `"2026-01-16T10:30:00Z"` |

### Optional Fields (System-Specific)

#### For GitHub

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `githubRepository` | string | Base repository URL (without `/issues/{number}`) | `"https://github.com/owner/repo"` |

#### For Jira

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `jiraBaseUrl` | string | Jira instance base URL | `"https://company.atlassian.net"` |
| `jiraProject` | string | Jira project key (uppercase) | `"PROJECT"` |

#### For Prefix-Aware Input

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `usePrefix` | boolean | Whether prefixe input mode is enabled | `true` |
| `projectPrefix` | string | The prefix to prepend to numeric identifiers | `"GITHUB-"` |

## Validation Rules

### trackingSystem
- Must be one of: `"github"`, `"jira"`, `"none"`
- Required field

### githubRepository
- Required when `trackingSystem` is `"github"`
- Must be valid HTTPS URL
- Pattern: `https://{domain}/{owner}/{repo}`
- Must NOT include `/issues/` or issue numbers

### jiraBaseUrl
- Required when `trackingSystem` is `"jira"`
- Must be valid HTTPS URL
- Pattern: `https://{domain}`
- Must NOT include `/browse/` or issue keys

### jiraProject
- Required when `trackingSystem` is `"jira"`
- Must be uppercase letters and numbers only
- Pattern: `^[A-Z][A-Z0-9]*$`
- Examples: `PROJECT`, `FEAT`, `BUG123`

### lastUpdated
- Must be ISO 8601 format
- Pattern: `YYYY-MM-DDTHH:MM:SSZ`
- Automatically updated by Kiro

### usePrefix
- Optional boolean field (default: `false`)
- When `true`, enables prefix-aware input mode
- Automatica` when GitHub or Jira is detected

### projectPrefix
- Optional string field
- Required when `usePrefix` is `true`
- Must end with separator (`-` or `_`)
- Must contain only alphanumeric characters and separators
- Pattern: `^[A-Za-z0-9]+[-_]$`
- Examples: `GITHUB-`, `PROJECT-`, `FEAT_`

## Complete Examples

**GitHub:**
```json
{
  "trackingSystem": "github",
  "githubRepository": "https://github.com/unlimitechcloud/kiro.spec-manager",
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

**None with custom prefix:**
```json
{
  "trackingSystem": "none",
  "usePrefix": true,
  "projectPrefix": "FEAT-",
  "lastUpdated": "2026-01-16T10:30:00Z"
}
```

## How Kiro Uses This File

### Automatic Creation

On first use, Kiro runs an interactive setup wizard:

1. Detects that no configuration exists
2. Prompts for tracking system selection
3. Collects system-specific information
4. Validates all inputs
5. Shows configuration summary
6. Creates `.kiro/spec-manager.json` with confirmed values

### URL Reconstruction

When creating subsequent specs:

```
You: "Create a new spec for feature X"

Kiro: "Identifier (GITHUB-): [Press Enter for GITHUB-6, or type '7' for GITHUB-7]"
You: "7"

Kiro: "Use identifier 'GITHUB-7'? (y/n)"
You: "y"

Kiro: "External URL? (er to auto-detect)"
You: [Enter]

Kiro: "Detected: https://github.com/owner/repo/issues/7. Correct?"
You: "yes"
```

Kiro reconstructed the URL using:
- `githubRepository` from config: `https://github.com/owner/repo`
- New issue number: `7` (from your numeric input)
- Result: `https://github.com/owner/repo/issues/7`

**Prefix-aware input**: When `usePrefix` is enabled, you can provide just the number (`7`) instead of the full identifier (`GITHUB-7`). Kiro automatically combines it with the configured prefix.

 Identifier Suggestions

Based on `trackingSystem`:

- **GitHub**: Suggests `GITHUB-{number}` format
- **Jira**: Suggests `{PROJECT}-{number}` format
- **None**: Uses your project's existing pattern

### Fallback Behavior

When you don't provide a URL:

1. Kiro checks if `trackingSystem` is configured
2. If yes, uses the config to reconstruct the URL
3. If no, prompts you to provide the URL manually

## Manual Editing

You can manually edit `.kiro/spec-manager.json` if needed:

### Changing Tracking Systems

switch from GitHub to Jira:

```json
{
  "trackingSystem": "jira",
  "jiraBaseUrl": "https://company.atlassian.net",
  "jiraProject": "PROJECT",
  "lastUpdated": "2026-01-16T12:00:00Z"
}
```

Remove the `githubRepository` field and add Jira fields.

### Updating Repository URL

If your repository moves:

```json
{
  "trackingSystem": "github",
  "githubRepository": "https://github.com/new-owner/new-repo",
  "lastUpdated": "2026-01-16T12:00:00Z"
}
```

### Disabling Tracking System

acking:

```json
{
  "trackingSystem": "none",
  "lastUpdated": "2026-01-16T12:00:00Z"
}
```

### Enabling/Disabling Prefix Mode

To enable prefix-aware input with a custom prefix:

```json
{
  "trackingSystem": "none",
  "usePrefix": true,
  "projectPrefix": "FEAT-",
  "lastUpdated": "2026-01-16T12:00:00Z"
}
```

To disable prefix-aware input:

```json
{
  "trackingSystem": "github",
  "githubRepository": "https://github.com/owner/repo",
  "usePrefix": false,
  "lastUpdated": "2026-01-16T12:00:00Z"
}
```

# Custom Fields

You can add custom fields to the config file. Kiro preserves them when updating:

```json
{
  "trackingSystem": "github",
  "githubRepository": "https://github.com/owner/repo",
  "lastUpdated": "2026-01-16T10:30:00Z",
  "customField": "my custom value",
  "team": "backend"
}
```

## Error Handling

### Invalid Config File

If the config file is corrupted or invalid:

1. Kiro logs a warning
2. Creates a new config with default values
3. Continues operation normally

**Default config**:
n
{
  "trackingSystem": "none",
  "lastUpdated": "2026-01-16T10:30:00Z"
}
```

### Missing Config File

If no config file exists:

1. Kiro runs the interactive setup wizard
2. Creates configuration based on user input

### Multiple .kiro/ Directories

In a monorepo with multiple `.kiro/` directories:

```
/project-root/
  .kiro/
    spec-manager.json          # Root config
  packages/
    package-a/
      .kiro/
        spec-manager.json      # Package A config (used when in package-a/)
    package-b/
      .kiro/
        spec-manager.json      # Package B config (used when in package-b/)
```

Kiro uses the config from the **closest** `.kiro/` directory to your current location.

## Troubleshooting

### "Config file validation failed"

**Cause**: Invalid field values or missing required fields

**Solution**:
1. Check that `trackingSystem` is one of: `"github"`, `"jira"`, `"none"`
2. Verify GitHub repository URL doesn't include `/issues/`
3. Verify Jira base URL doesn't include `/browse/`
4. Ensure Jira project key ispercase
5. Delete the file and let Kiro recreate it via setup wizard

### "Cannot reconstruct URL"

**Cause**: Missing repository URL or Jira base URL in config

**Solution**:
1. Check that `githubRepository` or `jiraBaseUrl` is present
2. Verify the URL is valid
3. Manually add the missing field
4. Or provide the URL manually when creating the spec

### "Wrong tracking system detected"

**Cause**: Config has wrong `trackingSystem` value

**Solution**:
1. Manually edit `.kiro/spec-manager.json`
gSystem` to the correct value
3. Add/remove system-specific fields as needed
4. Update `lastUpdated` timestamp

### "Invalid prefix format"

**Cause**: `projectPrefix` doesn't end with separator or contains invalid characters

**Solution**:
1. Check that `projectPrefix` ends with `-` or `_`
2. Ensure it contains only alphanumeric characters and separators
3. Examples of valid prefixes: `GITHUB-`, `PROJECT-`, `FEAT_`

### "Prefix required when usePrefix is true"

 is missing

**Solution**:
1. Add a `projectPrefix` field with a valid prefix
2. Or set `usePrefix` to `false`

## Best Practices

1. **Let Kiro manage it**: Use the interactive setup wizard instead of manual editing
2. **One system per project**: Stick to either GitHub or Jira, not both
3. **Commit to git**: Include `.kiro/spec-manager.json` in version control
4. **Team consistency**: Ensure all team members use the same config
5. **Use prefix mode**: Enable `usePrefix` for faster identifier input
6. **Consistent prefix format**: Always use uppercase for prefixes and end with `-` or `_`

## See Also

- **steering/initial-configuration-setup.md**: Detailed interactive setup guide
- **steering/prefix-aware-input.md**: Detailed guide on prefix-aware input mode
- **steering/github-integration.md**: Detailed GitHub workflow
- **steering/jira-integration.md**: Detailed Jira workflow
- **steering/config-management.md**: Advanced config management
- **README.md**: General Spec Manager documentation
