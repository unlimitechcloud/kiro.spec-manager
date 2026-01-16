# Configuration Management Guide

This steering file provides detailed guidance for managing the `spec-manager.json` configuration file.

## Overview

The `spec-manager.json` file stores tracking system preferences and enables automatic URL reconstruction. 

**Initial creation**: On first use, Kiro automatically runs an interactive setup wizard to create this file. See `initial-configuration-setup.md` for the setup process.

This guide covers how to update, validate, and troubleshoot the configuration file after initial setup.

## File Location

```
.kiro/spec-manager.json
```

**In monorepos** with multiple `.kiro/` directories:
```
/project-root/
  .kiro/
    spec-manager.json          # Root config
  packages/
    package-a/
      .kiro/
        spec-manager.json      # Package A config
    package-b/
      .kiro/
        spec-manager.json      # Package B config
```

**Resolution rule**: Use the config from the **closest** `.kiro/` directory to the current working location.

## When to Create Config

### Automatic Creation

Create the config file automatically when:

1. **User provides a GitHub URL** for the first time
2. **User provides a Jira URL** for the first time
3. **No config file exists** in `.kiro/`

**Process**:
1. Detect tracking system from URL
2. Extract necessary information (repository URL, base URL, project)
3. Create config file with detected values
4. Inform user: "Saving configuration for future specs..."

### Manual Creation

Users can manually create the config file:

```bash
# Create .kiro directory if it doesn't exist
mkdir -p .kiro

# Create config file
cat > .kiro/spec-manager.json << EOF
{
  "trackingSystem": "github",
  "githubRepository": "https://github.com/owner/repo",
  "lastUpdated": "2026-01-16T10:30:00Z"
}
EOF
```

## Config Structure

### Required Fields

All configs must have:

```json
{
  "trackingSystem": "github" | "jira" | "none",
  "lastUpdated": "ISO 8601 timestamp"
}
```

### GitHub Config

```json
{
  "trackingSystem": "github",
  "githubRepository": "https://github.com/owner/repo",
  "lastUpdated": "2026-01-16T10:30:00Z"
}
```

**Required when `trackingSystem` is `"github"`**:
- `githubRepository`: Base repository URL (without `/issues/`)

### Jira Config

```json
{
  "trackingSystem": "jira",
  "jiraBaseUrl": "https://company.atlassian.net",
  "jiraProject": "PROJECT",
  "lastUpdated": "2026-01-16T10:30:00Z"
}
```

**Required when `trackingSystem` is `"jira"`**:
- `jiraBaseUrl`: Jira instance base URL (without `/browse/`)
- `jiraProject`: Project key (uppercase)

### No Tracking System

```json
{
  "trackingSystem": "none",
  "lastUpdated": "2026-01-16T10:30:00Z"
}
```

## Validation Rules

### trackingSystem

- **Type**: string
- **Values**: `"github"`, `"jira"`, `"none"`
- **Required**: Yes

**Validation**:
```
if trackingSystem not in ["github", "jira", "none"]:
    error("Invalid trackingSystem value")
```

### githubRepository

- **Type**: string (URL)
- **Required**: When `trackingSystem` is `"github"`
- **Pattern**: `https://{domain}/{owner}/{repo}`

**Validation**:
```
if trackingSystem == "github":
    if not githubRepository:
        error("githubRepository required for GitHub")
    if not githubRepository.startswith("https://"):
        error("githubRepository must be HTTPS")
    if "/issues/" in githubRepository:
        error("githubRepository should not include /issues/")
```

### jiraBaseUrl

- **Type**: string (URL)
- **Required**: When `trackingSystem` is `"jira"`
- **Pattern**: `https://{domain}`

**Validation**:
```
if trackingSystem == "jira":
    if not jiraBaseUrl:
        error("jiraBaseUrl required for Jira")
    if not jiraBaseUrl.startswith("https://"):
        error("jiraBaseUrl must be HTTPS")
    if "/browse/" in jiraBaseUrl:
        error("jiraBaseUrl should not include /browse/")
```

### jiraProject

- **Type**: string
- **Required**: When `trackingSystem` is `"jira"`
- **Pattern**: `^[A-Z][A-Z0-9]*$`

**Validation**:
```
if trackingSystem == "jira":
    if not jiraProject:
        error("jiraProject required for Jira")
    if not jiraProject.isupper():
        error("jiraProject must be uppercase")
    if not re.match(r'^[A-Z][A-Z0-9]*$', jiraProject):
        error("jiraProject must be letters and numbers only")
```

### lastUpdated

- **Type**: string (ISO 8601 timestamp)
- **Required**: Yes
- **Pattern**: `YYYY-MM-DDTHH:MM:SSZ`

**Validation**:
```
if not lastUpdated:
    error("lastUpdated required")
try:
    datetime.fromisoformat(lastUpdated.replace('Z', '+00:00'))
except:
    error("lastUpdated must be ISO 8601 format")
```

## Reading Config

### Load Process

1. **Find .kiro directory**:
   - Start from current directory
   - Walk up parent directories
   - Find closest `.kiro/` directory

2. **Check for config file**:
   ```
   config_path = .kiro/spec-manager.json
   if not exists(config_path):
       return default_config()
   ```

3. **Read and parse**:
   ```
   try:
       config = json.load(config_path)
   except JSONDecodeError:
       log_warning("Config file corrupted")
       return default_config()
   ```

4. **Validate**:
   ```
   if not validate_config(config):
       log_warning("Config validation failed")
       return default_config()
   ```

5. **Return config**

### Default Config

If no config exists or validation fails:

```json
{
  "trackingSystem": "none",
  "lastUpdated": "2026-01-16T10:30:00Z"
}
```

## Updating Config

### When to Update

Update the config when:

1. **Tracking system changes**: User switches from GitHub to Jira or vice versa
2. **Repository changes**: User provides URL from different GitHub repository
3. **Jira project changes**: User provides key from different Jira project
4. **Base URL changes**: Jira instance URL changes

### Update Process

1. **Read current config**
2. **Detect changes** from user input
3. **Ask for confirmation**:
   ```
   "Config change detected:"
   "  Old: https://github.com/old/repo"
   "  New: https://github.com/new/repo"
   "Update config?"
   ```
4. **If confirmed, update fields**
5. **Update `lastUpdated` timestamp**
6. **Write config file**
7. **Preserve custom fields** (see below)

### Preserving Custom Fields

When updating config, preserve any custom fields:

**Before update**:
```json
{
  "trackingSystem": "github",
  "githubRepository": "https://github.com/old/repo",
  "lastUpdated": "2026-01-15T10:00:00Z",
  "customField": "my value",
  "team": "backend"
}
```

**After update**:
```json
{
  "trackingSystem": "github",
  "githubRepository": "https://github.com/new/repo",
  "lastUpdated": "2026-01-16T10:30:00Z",
  "customField": "my value",
  "team": "backend"
}
```

**Implementation**:
```python
# Read current config
current = read_config()

# Update only standard fields
current["trackingSystem"] = new_tracking_system
current["githubRepository"] = new_repository
current["lastUpdated"] = now()

# Custom fields are preserved automatically
write_config(current)
```

## Error Handling

### Missing Config File

**Scenario**: `.kiro/spec-manager.json` doesn't exist

**Action**:
1. Don't show error to user
2. Return default config silently
3. Create config when user first uses a tracking system

**User experience**:
```
# First spec creation - no config exists
User: "Create spec with GitHub URL"
Kiro: [detects GitHub, creates config automatically]
Kiro: "Saving configuration for future specs..."
```

### Corrupted Config File

**Scenario**: Config file exists but JSON is invalid

**Action**:
1. Log warning: "Config file corrupted, using defaults"
2. Return default config
3. On next update, overwrite with valid config

**User experience**:
```
User: "Create spec with GitHub URL"
Kiro: [detects corrupted config]
Kiro: "Config file was invalid, creating new one..."
Kiro: [creates fresh config]
```

### Invalid Field Values

**Scenario**: Config has invalid values (wrong type, invalid URL, etc.)

**Action**:
1. Log warning: "Config validation failed: {reason}"
2. Return default config
3. On next update, overwrite with valid config

**User experience**:
```
User: "Create spec with GitHub URL"
Kiro: [detects invalid config]
Kiro: "Config file had invalid values, resetting..."
Kiro: [creates fresh config]
```

### Missing Required Fields

**Scenario**: Config missing required fields for tracking system

**Action**:
1. Treat as invalid config
2. Return default config
3. Recreate on next use

**Example**:
```json
{
  "trackingSystem": "github"
  // Missing: githubRepository, lastUpdated
}
```

**Action**: Treat as invalid, use defaults

## Multiple .kiro/ Directories

### Resolution Logic

In a monorepo with multiple `.kiro/` directories:

```
/project-root/
  .kiro/
    spec-manager.json          # Config A
  packages/
    package-a/
      .kiro/
        spec-manager.json      # Config B
```

**When in `/project-root/`**: Use Config A
**When in `/project-root/packages/package-a/`**: Use Config B

**Implementation**:
```python
def find_kiro_root(start_path):
    current = start_path
    while current != '/':
        kiro_path = current / '.kiro'
        if kiro_path.exists():
            return kiro_path
        current = current.parent
    return None
```

### User Notification

When multiple configs exist, inform user which one is being used:

```
"Using config from: /project-root/packages/package-a/.kiro/"
```

Only show this if:
- Multiple `.kiro/` directories exist in parent paths
- User explicitly asks about config location

## Manual Editing

### When Users Should Edit

Users can manually edit config when:

1. **Changing tracking systems** without creating a new spec
2. **Updating repository URL** after a repo move
3. **Switching Jira projects** for future specs
4. **Adding custom fields** for team-specific metadata

### Editing Guidelines

**Tell users**:
1. Edit `.kiro/spec-manager.json` with a text editor
2. Ensure JSON is valid
3. Follow the schema (see `spec-manager-schema.md`)
4. Update `lastUpdated` timestamp
5. Test by creating a new spec

**Example edit**:
```bash
# Open in editor
nano .kiro/spec-manager.json

# Change repository
{
  "trackingSystem": "github",
  "githubRepository": "https://github.com/new-owner/new-repo",
  "lastUpdated": "2026-01-16T12:00:00Z"
}

# Save and test
# Create a new spec to verify URL reconstruction works
```

## Troubleshooting

### "Cannot find config file"

**Cause**: No `.kiro/` directory in current path or parents

**Solution**:
```
"No .kiro/ directory found."
"Create one with: mkdir -p .kiro"
"Config will be created automatically when you create your first spec."
```

### "Config validation failed"

**Cause**: Invalid field values

**Solution**:
```
"Config file has invalid values."
"Check: trackingSystem, URLs, project key"
"See spec-manager-schema.md for valid formats."
"Or delete the file and let Kiro recreate it."
```

### "Wrong repository in config"

**Cause**: Config has old repository URL

**Solution**:
```
"Config has: https://github.com/old/repo"
"You provided: https://github.com/new/repo"
"Update config? (enables URL reconstruction for new repo)"
```

### "Cannot reconstruct URL"

**Cause**: Config missing required fields

**Solution**:
```
"Config is missing repository URL."
"Please provide the full URL for this spec."
"Config will be updated automatically."
```

## Best Practices

### For Kiro

1. **Create automatically**: Don't ask user to create config manually
2. **Validate on read**: Always validate config structure
3. **Graceful degradation**: Use defaults if config is invalid
4. **Preserve custom fields**: Don't delete user's custom data
5. **Update timestamp**: Always update `lastUpdated` when modifying
6. **Confirm changes**: Ask before updating tracking system or URLs
7. **Clear messages**: Explain what's being saved to config

### For Users

1. **Let Kiro manage it**: Don't manually edit unless necessary
2. **One system per project**: Stick to GitHub or Jira, not both
3. **Commit to git**: Include `.kiro/spec-manager.json` in version control
4. **Team consistency**: Ensure all team members use same config
5. **Validate after editing**: Create a test spec after manual edits

## Examples

### Example 1: First GitHub Spec (Auto-create Config)

```
User: "Create spec for https://github.com/acme/app/issues/1"

# Kiro checks for config
config = read_config()  # Returns default (trackingSystem: "none")

# Kiro detects GitHub URL
tracking_system = "github"
repository = "https://github.com/acme/app"

# Kiro creates config
config = {
    "trackingSystem": "github",
    "githubRepository": "https://github.com/acme/app",
    "lastUpdated": now()
}
write_config(config)

Kiro: "Saving GitHub repository to config for future specs..."
Kiro: "✅ Config created: .kiro/spec-manager.json"
```

### Example 2: Switching from GitHub to Jira

```
User: "Create spec for https://company.atlassian.net/browse/PROJECT-1"

# Kiro reads current config
config = read_config()
# config["trackingSystem"] == "github"

# Kiro detects Jira URL
new_system = "jira"

# Kiro asks for confirmation
Kiro: "Config currently set to GitHub"
Kiro: "Switch to Jira? (removes GitHub config, adds Jira config)"
User: "yes"

# Kiro updates config
config = {
    "trackingSystem": "jira",
    "jiraBaseUrl": "https://company.atlassian.net",
    "jiraProject": "PROJECT",
    "lastUpdated": now()
}
write_config(config)

Kiro: "✅ Config updated to Jira"
```

### Example 3: Manual Edit

```
# User manually edits config
$ nano .kiro/spec-manager.json

# Changes repository
{
  "trackingSystem": "github",
  "githubRepository": "https://github.com/new-owner/new-repo",
  "lastUpdated": "2026-01-16T12:00:00Z"
}

# User creates new spec
User: "Create spec for feature X"

# Kiro reads updated config
config = read_config()
# config["githubRepository"] == "https://github.com/new-owner/new-repo"

# Kiro uses new repository for URL reconstruction
Kiro: "Identifier: GITHUB-5"
Kiro: "Reconstructed URL: https://github.com/new-owner/new-repo/issues/5"
```

### Example 4: Corrupted Config Recovery

```
# Config file is corrupted (invalid JSON)
$ cat .kiro/spec-manager.json
{
  "trackingSystem": "github"
  "githubRepository": "https://github.com/owner/repo"  # Missing comma
}

# User creates new spec
User: "Create spec for https://github.com/owner/repo/issues/10"

# Kiro tries to read config
config = read_config()
# JSON parse error

# Kiro logs warning and uses defaults
log_warning("Config file corrupted, using defaults")
config = default_config()

# Kiro detects GitHub URL and recreates config
Kiro: "Config file was invalid, creating new one..."
config = {
    "trackingSystem": "github",
    "githubRepository": "https://github.com/owner/repo",
    "lastUpdated": now()
}
write_config(config)

Kiro: "✅ Config recreated successfully"
```

## Summary

- **Location**: `.kiro/spec-manager.json`
- **Create**: Automatically on first tracking system use
- **Validate**: Always validate on read, use defaults if invalid
- **Update**: Ask for confirmation before changing tracking system or URLs
- **Preserve**: Keep custom fields when updating
- **Graceful**: Handle missing/corrupted configs without errors
- **Closest**: Use config from closest `.kiro/` directory in monorepos
