# Jira Integration Guide

This steering file provides detailed guidance for working with Jira in the Spec Manager Power.

## Overview

When a user wants to create a spec linked to a Jira issue, the Spec Manager uses configuration from `.kiro/spec-manager.json` to automatically reconstruct URLs and use Jira keys as identifiers.

**First-time setup**: If no configuration exists, Kiro will run the interactive setup wizard. See `initial-configuration-setup.md` for details.

## Jira URL Patterns

Detect these patterns as Jira:

**Jira Cloud** (Atlassian-hosted):
```
https://{company}.atlassian.net/browse/{KEY}
```

**Jira Server** (Self-hosted):
```
https://{domain}/browse/{KEY}
https://{domain}/projects/{PROJECT}/issues/{KEY}
```

**Pattern matching rules**:
- Must be HTTPS
- Must contain `/browse/` or `/projects/.../issues/` in the path
- Key format: `{PROJECT}-{number}` (e.g., `PROJECT-123`)
- Cloud: domain ends with `.atlassian.net`
- Server: any custom domain

## Identifier Handling Rules

### Direct Key Usage

Jira keys are used **directly** as spec identifiers - no synthetic prefix:

```
Jira issue: PROJECT-123
Spec identifier: PROJECT-123
```

**Rules**:
1. Use the Jira key exactly as-is
2. Preserve the format: `{PROJECT}-{number}`
3. No modifications or prefixes
4. Examples:
   - `PROJECT-1`
   - `FEAT-42`
   - `BUG-123`

### Why Direct Keys?

Unlike GitHub, Jira keys don't need synthetic identifiers because:
1. **Already prefixed**: Keys include project identifier (PROJECT-, FEAT-, etc.)
2. **Globally unique**: Keys are unique within a Jira instance
3. **Standard format**: Everyone recognizes PROJECT-123 as a Jira key
4. **Consistency**: Matches how teams already refer to Jira issues

## Step-by-Step Workflow

### First Spec with Jira URL

When a user provides a Jira URL for the first time:

1. **Detect the URL pattern**:
   ```
   User input: "https://company.atlassian.net/browse/PROJECT-5"
   ```

2. **Extract components**:
   - Domain: `company.atlassian.net`
   - Issue key: `PROJECT-5`
   - Project: `PROJECT`
   - Issue number: `5`
   - Base URL: `https://company.atlassian.net`

3. **Use key directly as identifier**:
   ```
   Identifier: PROJECT-5
   ```

4. **Inform the user**:
   ```
   "Detected Jira issue PROJECT-5"
   "Jira keys are used directly as identifiers"
   "Suggested identifier: PROJECT-5. Confirm?"
   ```

5. **Save configuration**:
   Create or update `.kiro/spec-manager.json`:
   ```json
   {
     "trackingSystem": "jira",
     "jiraBaseUrl": "https://company.atlassian.net",
     "jiraProject": "PROJECT",
     "lastUpdated": "2026-01-16T10:30:00Z"
   }
   ```

6. **Create metadata**:
   ```json
   {
     "specIdentifier": "PROJECT-5",
     "specName": "user-provided-name",
     "url": "https://company.atlassian.net/browse/PROJECT-5",
     ...
   }
   ```

### Subsequent Specs (Auto-increment)

When a user wants to create another Jira spec for the same project:

1. **Check for existing specs from the same project**:
   - Search for specs with identifiers matching `PROJECT-*`
   - Find the most recent one (highest number)

2. **Extract and increment**:
   ```
   Last spec: PROJECT-5
   Extract project: PROJECT
   Extract number: 5
   Increment: 6
   New identifier: PROJECT-6
   ```

3. **Suggest to user**:
   ```
   "Last PROJECT spec: PROJECT-5. Suggested: PROJECT-6. Confirm?"
   ```

4. **Reconstruct URL**:
   - Read `jiraBaseUrl` from config
   - Append `/browse/{key}`
   ```
   Config: "https://company.atlassian.net"
   Key: PROJECT-6
   Result: "https://company.atlassian.net/browse/PROJECT-6"
   ```

5. **Present reconstructed URL**:
   ```
   "Reconstructed URL: https://company.atlassian.net/browse/PROJECT-6. Correct?"
   ```

### Starting from Scratch

If no Jira specs exist for the project:

1. **Suggest starting identifier**:
   ```
   "No previous PROJECT specs found. Suggested: PROJECT-1. Confirm?"
   ```

2. **Require URL**:
   Since there's no config yet, the user must provide the full URL:
   ```
   "Please provide the Jira issue URL:"
   ```

3. **Follow first-time workflow** (above)

### Multiple Projects

Users can have specs from different Jira projects:

```
Specs:
- PROJECT-1, PROJECT-2, PROJECT-3
- FEAT-1, FEAT-2
- BUG-1, BUG-2
```

**Auto-increment per project**:
- Each project maintains its own sequence
- `PROJECT-5` → `PROJECT-6`
- `FEAT-10` → `FEAT-11`
- `BUG-3` → `BUG-4`

**Config stores one project**:
- The most recently used project is in config
- URL reconstruction works for that project
- For other projects, user provides full URL

## URL Reconstruction

### When to Reconstruct

Reconstruct URLs when:
1. User presses Enter at the "External URL?" prompt
2. Config file has `trackingSystem: "jira"`
3. Config file has `jiraBaseUrl` field
4. Identifier matches the project in config

### Reconstruction Logic

```
Base URL: {jiraBaseUrl from config}
Issue key: {identifier}
Reconstructed URL: {jiraBaseUrl}/browse/{key}
```

**Example**:
```
Config: "https://company.atlassian.net"
Identifier: PROJECT-10
Result: "https://company.atlassian.net/browse/PROJECT-10"
```

### Validation

After reconstruction, always:
1. Present the URL to the user
2. Ask for confirmation
3. Allow the user to provide a different URL if incorrect

## Jira Cloud vs Server Detection

### Automatic Detection

Detect Jira type from URL:

**Jira Cloud**:
- Domain ends with `.atlassian.net`
- Example: `https://company.atlassian.net/browse/PROJECT-1`

**Jira Server**:
- Any other domain
- Examples:
  - `https://jira.company.com/browse/PROJECT-1`
  - `https://jira.internal/projects/PROJECT/issues/PROJECT-1`

### URL Format Differences

**Cloud** uses:
```
https://{company}.atlassian.net/browse/{KEY}
```

**Server** can use:
```
https://{domain}/browse/{KEY}
https://{domain}/projects/{PROJECT}/issues/{KEY}
```

**Reconstruction** always uses `/browse/` format (works for both):
```
{baseUrl}/browse/{KEY}
```

## User Guidance

### Explaining Jira Identifiers

When suggesting a Jira identifier, explain:

```
"Jira uses keys with format: {PROJECT}-{number}"
"Spec Manager uses Jira keys directly as identifiers"
"No synthetic prefix needed - PROJECT-5 is the identifier"
```

### Allowing Overrides

Always allow users to override the suggested identifier:

```
"Suggested identifier: PROJECT-5. Confirm? (or provide custom identifier)"
```

If user provides custom identifier:
- Accept it
- Don't enforce the Jira key format
- Store it as-is in metadata

## Querying and Search

### Search Patterns

Support these search patterns:

1. **Full key**:
   ```
   User: "What's the URL for PROJECT-5?"
   Response: "PROJECT-5 → https://company.atlassian.net/browse/PROJECT-5"
   ```

2. **Project prefix**:
   ```
   User: "List all PROJECT specs"
   Search for: identifiers matching "PROJECT-*"
   ```

3. **By tag**:
   ```
   User: "Show me all Jira specs tagged with 'auth'"
   Search for: specs with "jira" tag or Jira-format identifiers
   ```

### Search Implementation

When searching:
1. Check exact match first: `PROJECT-5`
2. Support wildcard: `PROJECT-*` matches all PROJECT specs
3. Return spec with identifier and URL

## Troubleshooting

### "Invalid Jira URL"

**Cause**: URL doesn't match expected pattern

**Check**:
- Does it contain `/browse/` or `/projects/.../issues/`?
- Does the key match format `{PROJECT}-{number}`?
- Is it HTTPS?

**Solution**:
```
"URL doesn't match Jira pattern."
"Expected: https://{domain}/browse/{KEY}"
"Please provide a valid Jira issue URL."
```

### "Cannot reconstruct URL"

**Cause**: No `jiraBaseUrl` in config

**Solution**:
```
"No Jira base URL configured."
"Please provide the full Jira issue URL."
```

After receiving URL, save base URL to config.

### "Identifier conflict"

**Cause**: Suggested identifier already exists

**Solution**:
```
"Identifier PROJECT-5 already exists."
"Suggested alternative: PROJECT-6. Confirm?"
```

Or allow user to provide custom identifier.

### "Wrong project"

**Cause**: User wants different project than configured

**Solution**:
```
"Config has project: PROJECT"
"You provided: FEAT-1"
"Update config to FEAT? (URL reconstruction will use FEAT)"
```

If confirmed, update `jiraProject` in config.

### "Wrong issue number"

**Cause**: Auto-increment suggested wrong number

**Solution**:
```
"Suggested: PROJECT-6. Is this correct?"
"If not, provide the correct issue key."
```

User can override with correct key.

## Configuration Management

### Creating Config

On first Jira spec:
```json
{
  "trackingSystem": "jira",
  "jiraBaseUrl": "https://company.atlassian.net",
  "jiraProject": "PROJECT",
  "lastUpdated": "2026-01-16T10:30:00Z"
}
```

### Updating Config

If project changes:
1. Detect new project from user-provided key
2. Ask: "Project changed from PROJECT to FEAT. Update config?"
3. If confirmed, update `jiraProject` field

If base URL changes:
1. Detect new base URL from user-provided URL
2. Ask: "Jira URL changed. Update config? (old → new)"
3. If confirmed, update `jiraBaseUrl` field

### Multiple Projects

If user has specs from multiple Jira projects:
- Config stores only one project (the most recent)
- URL reconstruction works only for that project
- For other projects, user must provide full URL or update config

**Recommendation**: 
- Use one project per workspace, OR
- Manually update config when switching projects

## Best Practices

1. **Always confirm**: Present suggested identifiers and URLs for user confirmation
2. **Explain once**: On first Jira spec, explain that keys are used directly
3. **Allow overrides**: Never force the Jira key format if user wants something else
4. **Validate URLs**: Check pattern before accepting
5. **Save config**: Always save base URL and project for future use
6. **Per-project sequences**: Track auto-increment separately for each project
7. **Support both Cloud and Server**: Detect automatically, reconstruct with `/browse/`

## Examples

### Example 1: First Jira Spec (Cloud)

```
User: "Create a spec for https://acme.atlassian.net/browse/PROJECT-1"

Kiro: "Detected Jira Cloud issue PROJECT-1"
Kiro: "Jira keys are used directly as identifiers"
Kiro: "Suggested identifier: PROJECT-1. Confirm?"
User: "yes"

Kiro: "Spec name suggestion: project-1. Provide better name:"
User: "user-login"

Kiro: "Saving Jira config..."
Kiro: "✅ Created: .kiro/specs/2026-01/PROJECT-1+user-login/"
Kiro: "Config saved: https://acme.atlassian.net, project: PROJECT"
```

### Example 2: Auto-increment (Same Project)

```
User: "Create spec for password reset"

Kiro: "Identifier? (Press Enter to auto-increment)"
User: [Enter]

Kiro: "Last PROJECT spec: PROJECT-1. Suggested: PROJECT-2. Confirm?"
User: "yes"

Kiro: "Spec name: password-reset. Confirm?"
User: "yes"

Kiro: "External URL? (Press Enter to auto-detect)"
User: [Enter]

Kiro: "Reconstructed: https://acme.atlassian.net/browse/PROJECT-2. Correct?"
User: "yes"

Kiro: "✅ Created: .kiro/specs/2026-01/PROJECT-2+password-reset/"
```

### Example 3: Different Project

```
User: "Create spec for https://acme.atlassian.net/browse/FEAT-1"

Kiro: "Detected Jira issue FEAT-1"
Kiro: "Config has project: PROJECT"
Kiro: "New project detected: FEAT"
Kiro: "Update config to FEAT? (enables auto-increment for FEAT)"
User: "yes"

Kiro: "Suggested identifier: FEAT-1. Confirm?"
User: "yes"

Kiro: "Spec name:"
User: "new-feature"

Kiro: "✅ Created: .kiro/specs/2026-01/FEAT-1+new-feature/"
Kiro: "Config updated: project is now FEAT"
```

### Example 4: Jira Server

```
User: "Create spec for https://jira.company.com/browse/BUG-10"

Kiro: "Detected Jira Server issue BUG-10"
Kiro: "Jira keys are used directly as identifiers"
Kiro: "Suggested identifier: BUG-10. Confirm?"
User: "yes"

Kiro: "Spec name:"
User: "fix-login-bug"

Kiro: "Saving Jira config..."
Kiro: "✅ Created: .kiro/specs/2026-01/BUG-10+fix-login-bug/"
Kiro: "Config saved: https://jira.company.com, project: BUG"
```

### Example 5: Custom Identifier

```
User: "Create spec for https://acme.atlassian.net/browse/PROJECT-10"

Kiro: "Detected Jira issue PROJECT-10"
Kiro: "Suggested identifier: PROJECT-10. Confirm?"
User: "no, use FEATURE-10"

Kiro: "Using custom identifier: FEATURE-10"
Kiro: "Note: This won't follow Jira auto-increment pattern"
Kiro: "Spec name:"
User: "new-feature"

Kiro: "✅ Created: .kiro/specs/2026-01/FEATURE-10+new-feature/"
```

## Summary

- **Detect**: Jira URLs with `/browse/` or `/projects/.../issues/` pattern
- **Use directly**: Jira keys as identifiers (no synthetic prefix)
- **Configure**: Save base URL and project to `.kiro/spec-manager.json`
- **Reconstruct**: Auto-generate URLs for subsequent specs
- **Per-project**: Track auto-increment separately for each project
- **Support both**: Cloud and Server with automatic detection
- **Explain**: Tell users that Jira keys are used directly
- **Allow**: Users can override any suggestion
