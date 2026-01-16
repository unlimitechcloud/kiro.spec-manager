# GitHub Issues Integration Guide

This steering file provides detailed guidance for working with GitHub Issues in the Spec Manager Power.

## Overview

When a user wants to create a spec linked to a GitHub issue, the Spec Manager uses configuration from `.kiro/spec-manager.json` to automatically reconstruct URLs and suggest identifiers.

**First-time setup**: If no configuration exists, Kiro will run the interactive setup wizard. See `initial-configuration-setup.md` for details.

## GitHub URL Patterns

Detect these patterns as GitHub Issues:

**Standard GitHub**:
```
https://github.com/{owner}/{repo}/issues/{number}
```

**GitHub Enterprise**:
```
https://{custom-domain}/{owner}/{repo}/issues/{number}
```

**Pattern matching rules**:
- Must be HTTPS
- Must contain `/issues/` in the path
- Must end with a numeric issue number
- Domain can be `github.com` or any custom domain (for Enterprise)

## Identifier Generation Rules

### Synthetic Identifier Format

GitHub issues use a synthetic identifier with the format:

```
GITHUB-{number}
```

**Rules**:
1. Prefix is always `GITHUB-` (capital G, capital H, hyphen)
2. Number is extracted from the URL
3. No zero-padding (use the number as-is)
4. Examples:
   - Issue #1 → `GITHUB-1`
   - Issue #42 → `GITHUB-42`
   - Issue #123 → `GITHUB-123`

### Why Synthetic Identifiers?

GitHub's numeric-only system needs a prefix because:
1. **Consistency**: Matches the pattern of other tracking systems (Jira has PROJECT-, Linear has LIN-)
2. **Clarity**: Makes it obvious this spec links to GitHub
3. **Searchability**: Easy to find all GITHUB-linked specs
4. **Uniqueness**: Prevents conflicts with other numeric identifiers

## Prefix-Aware Input Mode

### Overview

When working with GitHub, **prefix-aware input mode** is automatically enabled. This allows you to type just the issue number instead of the full identifier.

**Without prefix mode**:
```
Kiro: "Identifier?"
You: "GITHUB-7"
```

**With prefix mode** (automatic for GitHub):
```
Kiro: "Identifier (GITHUB-):"
You: "7"
Result: GITHUB-7
```

### How It Works

When GitHub is detected for the first time:

1. **Auto-enable prefix mode**:
   ```json
   {
     "trackingSystem": "github",
     "githubRepository": "https://github.com/owner/repo",
     "usePrefix": true,
     "projectPrefix": "GITHUB-",
     "lastUpdated": "2026-01-16T10:30:00Z"
   }
   ```

2. **Inform the user**:
   ```
   "✓ GitHub detected"
   "✓ Prefix mode enabled with 'GITHUB-'"
   "✓ You can now type just numbers for identifiers"
   "  Example: Type '7' instead of 'GITHUB-7'"
   ```

3. **Accept both input styles**:
   - Numeric: `7` → `GITHUB-7`
   - Full: `GITHUB-7` → `GITHUB-7`

### Benefits

- **Faster**: Type 1-3 digits instead of 8-10 characters
- **Fewer errors**: No typos in the prefix
- **Flexible**: Can still use full identifiers when needed

### Prompts with Prefix Mode

**Auto-increment suggestion**:
```
Kiro: "Identifier (GITHUB-): [Press Enter for GITHUB-6, or type '7' for GITHUB-7]"
```

**User types number**:
```
You: "7"
Kiro: "Use identifier 'GITHUB-7'? (y/n)"
```

**User types full identifier**:
```
You: "GITHUB-7"
Kiro: "Use identifier 'GITHUB-7'? (y/n)"
```

### URL Reconstruction with Numeric Input

When you provide numeric input, URL reconstruction uses that number:

```
You: "7"
Result identifier: GITHUB-7
Reconstructed URL: https://github.com/owner/repo/issues/7
```

**Workflow**:
```
Kiro: "Identifier (GITHUB-): [Press Enter for GITHUB-6]"
You: "7"

Kiro: "Use identifier 'GITHUB-7'? (y/n)"
You: "y"

Kiro: "External URL? (Press Enter to auto-detect)"
You: [Enter]

Kiro: "Detected: https://github.com/owner/repo/issues/7. Correct?"
You: "yes"
```

## Step-by-Step Workflow

### First Spec with GitHub URL

When a user provides a GitHub URL for the first time:

1. **Detect the URL pattern**:
   ```
   User input: "https://github.com/owner/repo/issues/5"
   ```

2. **Extract components**:
   - Owner: `owner`
   - Repo: `repo`
   - Issue number: `5`
   - Repository URL: `https://github.com/owner/repo`

3. **Generate synthetic identifier**:
   ```
   Identifier: GITHUB-5
   ```

4. **Inform the user**:
   ```
   "Detected GitHub issue #5"
   "GitHub uses synthetic identifiers with format: GITHUB-{number}"
   "Suggested identifier: GITHUB-5. Confirm?"
   ```

5. **Save configuration**:
   Create or update `.kiro/spec-manager.json`:
   ```json
   {
     "trackingSystem": "github",
     "githubRepository": "https://github.com/owner/repo",
     "usePrefix": true,
     "projectPrefix": "GITHUB-",
     "lastUpdated": "2026-01-16T10:30:00Z"
   }
   ```

6. **Inform about prefix mode**:
   ```
   "✓ Prefix mode enabled with 'GITHUB-'"
   "✓ You can now type just numbers for identifiers"
   "  Example: Type '7' instead of 'GITHUB-7'"
   ```

6. **Create metadata**:
   ```json
   {
     "specIdentifier": "GITHUB-5",
     "specName": "user-provided-name",
     "url": "https://github.com/owner/repo/issues/5",
     ...
   }
   ```

### Subsequent Specs with Prefix Mode

When a user wants to create another GitHub spec with prefix mode enabled:

1. **Prompt with prefix indicator**:
   ```
   "Identifier (GITHUB-): [Press Enter for GITHUB-6, or type '7' for GITHUB-7]"
   ```

2. **Accept numeric input**:
   ```
   User input: "7"
   Parse as: numeric
   Combine with prefix: "GITHUB-7"
   ```

3. **Confirm with user**:
   ```
   "Use identifier 'GITHUB-7'? (y/n)"
   ```

4. **Reconstruct URL using numeric portion**:
   ```
   Config: "https://github.com/owner/repo"
   Number: 7
   Result: "https://github.com/owner/repo/issues/7"
   ```

### Subsequent Specs (Auto-increment)

When a user wants to create another GitHub spec:

1. **Check for existing GitHub specs**:
   - Search for specs with identifiers matching `GITHUB-*`
   - Find the most recent one (highest number)

2. **Extract and increment**:
   ```
   Last spec: GITHUB-5
   Extract number: 5
   Increment: 6
   New identifier: GITHUB-6
   ```

3. **Suggest to user**:
   ```
   "Last GitHub spec: GITHUB-5. Suggested: GITHUB-6. Confirm?"
   ```

4. **Reconstruct URL**:
   - Read `githubRepository` from config
   - Append `/issues/{number}`
   ```
   Config: "https://github.com/owner/repo"
   Number: 6
   Result: "https://github.com/owner/repo/issues/6"
   ```

5. **Present reconstructed URL**:
   ```
   "Reconstructed URL: https://github.com/owner/repo/issues/6. Correct?"
   ```

### Starting from Scratch

If no GitHub specs exist:

1. **Suggest starting identifier**:
   ```
   "No previous GitHub specs found. Suggested: GITHUB-1. Confirm?"
   ```

2. **Require URL**:
   Since there's no config yet, the user must provide the full URL:
   ```
   "Please provide the GitHub issue URL:"
   ```

3. **Follow first-time workflow** (above)

## URL Reconstruction

### When to Reconstruct

Reconstruct URLs when:
1. User presses Enter at the "External URL?" prompt
2. Config file has `trackingSystem: "github"`
3. Config file has `githubRepository` field

### Reconstruction Logic

```
Repository URL: {githubRepository from config}
Issue number: {extracted from identifier}
Reconstructed URL: {githubRepository}/issues/{number}
```

**Example**:
```
Config: "https://github.com/owner/repo"
Identifier: GITHUB-10
Result: "https://github.com/owner/repo/issues/10"
```

### Validation

After reconstruction, always:
1. Present the URL to the user
2. Ask for confirmation
3. Allow the user to provide a different URL if incorrect

## User Guidance

### Explaining GitHub Identifiers

When suggesting a GitHub identifier, explain:

```
"GitHub uses numeric issue IDs without prefixes."
"Spec Manager creates synthetic identifiers with format: GITHUB-{number}"
"This maintains consistency with other tracking systems."
```

### Allowing Overrides

Always allow users to override the suggested identifier:

```
"Suggested identifier: GITHUB-5. Confirm? (or provide custom identifier)"
```

If user provides custom identifier:
- Accept it
- Don't enforce the GITHUB- prefix
- Store it as-is in metadata

## Querying and Search

### Search Patterns

Support these search patterns:

1. **Full identifier**:
   ```
   User: "What's the URL for GITHUB-5?"
   Response: "GITHUB-5 → https://github.com/owner/repo/issues/5"
   ```

2. **Number only** (fuzzy search):
   ```
   User: "Show me issue 5"
   Check for: GITHUB-5
   Response: "Found GITHUB-5 → https://github.com/owner/repo/issues/5"
   ```

3. **List all GitHub specs**:
   ```
   User: "List all GitHub specs"
   Search for: identifiers matching "GITHUB-*"
   ```

### Search Implementation

When searching:
1. Check exact match first: `GITHUB-5`
2. If no match and input is numeric, try: `GITHUB-{number}`
3. Return spec with identifier and URL

## Troubleshooting

### "Invalid GitHub URL"

**Cause**: URL doesn't match expected pattern

**Check**:
- Does it contain `/issues/`?
- Does it end with a number?
- Is it HTTPS?

**Solution**:
```
"URL doesn't match GitHub Issues pattern."
"Expected: https://github.com/{owner}/{repo}/issues/{number}"
"Please provide a valid GitHub issue URL."
```

### "Cannot reconstruct URL"

**Cause**: No `githubRepository` in config

**Solution**:
```
"No GitHub repository configured."
"Please provide the full GitHub issue URL."
```

After receiving URL, save repository to config.

### "Identifier conflict"

**Cause**: Suggested identifier already exists

**Solution**:
```
"Identifier GITHUB-5 already exists."
"Suggested alternative: GITHUB-6. Confirm?"
```

Or allow user to provide custom identifier.

### "Wrong issue number"

**Cause**: Auto-increment suggested wrong number

**Solution**:
```
"Suggested: GITHUB-6. Is this correct?"
"If not, provide the correct issue number."
```

User can override with correct number.

## Configuration Management

### Creating Config

On first GitHub spec:
```json
{
  "trackingSystem": "github",
  "githubRepository": "https://github.com/owner/repo",
  "lastUpdated": "2026-01-16T10:30:00Z"
}
```

### Updating Config

If repository changes:
1. Detect new repository URL from user-provided URL
2. Ask: "Repository changed. Update config? (old → new)"
3. If confirmed, update `githubRepository` field

### Multiple Repositories

If user has specs from multiple GitHub repositories:
- Config stores only one repository (the most recent)
- URL reconstruction works only for that repository
- For other repositories, user must provide full URL

**Recommendation**: Use one repository per workspace/project.

## Best Practices

1. **Always confirm**: Present suggested identifiers and URLs for user confirmation
2. **Explain once**: On first GitHub spec, explain the synthetic identifier format
3. **Allow overrides**: Never force the GITHUB- prefix if user wants something else
4. **Validate URLs**: Check pattern before accepting
5. **Save config**: Always save repository URL for future use
6. **Fuzzy search**: Support searching by number only (5 → GITHUB-5)

## Examples

### Example 1: First GitHub Spec (with Prefix Mode)

```
User: "Create a spec for https://github.com/acme/app/issues/1"

Kiro: "Detected GitHub issue #1"
Kiro: "GitHub uses synthetic identifiers: GITHUB-{number}"
Kiro: "✓ Prefix mode enabled with 'GITHUB-'"
Kiro: "✓ You can now type just numbers for identifiers"
Kiro: "Suggested identifier: GITHUB-1. Confirm?"
User: "yes"

Kiro: "Spec name suggestion: github-issue-1. Provide better name:"
User: "user-login"

Kiro: "Saving GitHub repository to config..."
Kiro: "✅ Created: .kiro/specs/2026-01/GITHUB-1+user-login/"
Kiro: "Config saved: https://github.com/acme/app"
```

### Example 2: Auto-increment with Numeric Input

```
User: "Create spec for password reset"

Kiro: "Identifier (GITHUB-): [Press Enter for GITHUB-2, or type '3' for GITHUB-3]"
User: [Enter]

Kiro: "Use identifier 'GITHUB-2'? (y/n)"
User: "y"

Kiro: "Spec name: password-reset. Confirm?"
User: "yes"

Kiro: "External URL? (Press Enter to auto-detect)"
User: [Enter]

Kiro: "Reconstructed: https://github.com/acme/app/issues/2. Correct?"
User: "yes"

Kiro: "✅ Created: .kiro/specs/2026-01/GITHUB-2+password-reset/"
```

### Example 3: Correcting Issue Number with Numeric Input

```
User: "Create spec for issue #5"

Kiro: "Identifier (GITHUB-): [Press Enter for GITHUB-3]"
User: "5"

Kiro: "Use identifier 'GITHUB-5'? (y/n)"
User: "y"

Kiro: "Spec name:"
User: "email-notifications"

Kiro: "External URL? (Press Enter to auto-detect)"
User: [Enter]

Kiro: "Reconstructed: https://github.com/acme/app/issues/5. Correct?"
User: "yes"

Kiro: "✅ Created: .kiro/specs/2026-01/GITHUB-5+email-notifications/"
```

### Example 4: Using Full Identifier

```
User: "Create spec for https://github.com/acme/app/issues/10"

Kiro: "Detected GitHub issue #10"
Kiro: "Identifier (GITHUB-): [Press Enter for GITHUB-10]"
User: "GITHUB-10"

Kiro: "Use identifier 'GITHUB-10'? (y/n)"
User: "y"

Kiro: "Spec name:"
User: "new-feature"

Kiro: "✅ Created: .kiro/specs/2026-01/GITHUB-10+new-feature/"
```

### Example 5: Custom Identifier (Overriding Prefix)

```
User: "Create spec for https://github.com/acme/app/issues/10"

Kiro: "Detected GitHub issue #10"
Kiro: "Identifier (GITHUB-): [Press Enter for GITHUB-10]"
User: "FEATURE-10"

Kiro: "⚠️  Warning: Identifier doesn't match expected prefix"
Kiro: "  Expected: GITHUB-10"
Kiro: "  Provided: FEATURE-10"
Kiro: ""
Kiro: "What would you like to do?"
Kiro: "  1. Use 'FEATURE-10' as-is"
Kiro: "  2. Correct to 'GITHUB-10'"
Kiro: "  3. Re-enter identifier"
User: "1"

Kiro: "Using custom identifier: FEATURE-10"
Kiro: "Note: This won't follow GitHub auto-increment pattern"
Kiro: "Spec name:"
User: "new-feature"

Kiro: "✅ Created: .kiro/specs/2026-01/FEATURE-10+new-feature/"
```

## Summary

- **Detect**: GitHub URLs with `/issues/{number}` pattern
- **Generate**: Synthetic identifiers `GITHUB-{number}`
- **Prefix Mode**: Automatically enabled for faster input
- **Numeric Input**: Type just `7` instead of `GITHUB-7`
- **Configure**: Save repository URL and prefix to `.kiro/spec-manager.json`
- **Reconstruct**: Auto-generate URLs for subsequent specs
- **Search**: Support both full identifier and number-only queries
- **Explain**: Tell users about synthetic identifiers and prefix mode on first use
- **Allow**: Users can override any suggestion

## See Also

- **steering/prefix-aware-input.md**: Detailed guide on prefix-aware input mode
- **spec-manager-schema.md**: Configuration file reference
- **steering/config-management.md**: Advanced configuration management
