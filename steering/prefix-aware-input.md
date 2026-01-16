# Prefix-Aware Input Guide

## Overview

Prefix-aware input is a feature that makes working with prefixed identifiers (like `GITHUB-7`, `PROJECT-123`, `FEAT-5`) faster and more convenient. Instead of typing the full identifier every time, you can just type the number, and Kiro automatically combines it with your configured prefix.

**The Problem**: When working with GitHub Issues, Jira, or any system that uses prefixed identifiers, you end up typing the same prefix over and over:
- "GITHUB-1", "GITHUB-2", "GITHUB-3"...
- "PROJECT-100", "PROJECT-101", "PROJECT-102"...

**The Solution**: Enable prefix mode, and just type the numbers:
- Type `7` → Kiro creates `GITHUB-7`
- Type `123` → Kiro creates `PROJECT-123`

## Why Use Prefix-Aware Input?

**Benefits**:
- **Faster**: Type 1-3 digits instead of 8-15 characters
- **Fewer errors**: No typos in the prefix
- **Consistent**: All identifiers use the same prefix format
- **Flexible**: Can still use full identifiers when needed

**Perfect for**:
- Projects with many specs (dozens or hundreds)
- Teams using GitHub Issues or Jira
- Projects with custom identifier conventions

## How It Works

### Two Input Modes

When prefix mode is enabled, Kiro accepts two types of input:

**1. Numeric Input** (recommended for speed):
```
Kiro: "Identifier (GITHUB-): "
You: "7"
Result: GITHUB-7
```

**2. Full Identifier** (for flexibility):
```
Kiro: "Identifier (GITHUB-): "
You: "GITHUB-7"
Result: GITHUB-7
```

Both produce the same result. Use whichever is more convenient.

### Automatic Prefix Detection

Kiro automatically enables prefix mode when it detects:
- **GitHub URLs**: Sets prefix to `GITHUB-`
- **Jira URLs**: Sets prefix to the project key (e.g., `PROJECT-`)

You can also enable it manually for custom prefixes.

## Getting Started

### Automatic Setup (GitHub/Jira)

When you create your first spec with a GitHub or Jira URL:

```
You: "Create a spec for user authentication"

Kiro: "External URL?"
You: "https://github.com/owner/repo/issues/5"

Kiro: "✓ GitHub detected. Prefix mode enabled with 'GITHUB-'"
Kiro: "You can now use just numbers for identifiers (e.g., type '6' for 'GITHUB-6')"

Kiro: "Identifier (GITHUB-): [Press Enter for GITHUB-6]"
You: [Enter]

Kiro: "Use identifier 'GITHUB-6'? (y/n)"
You: "y"
```

Prefix mode is now active. Future specs can use numeric input.

### Manual Setup (Custom Prefix)

To enable prefix mode with a custom prefix:

1. Edit `.kiro/spec-manager.json`:
```json
{
  "trackingSystem": "none",
  "usePrefix": true,
  "projectPrefix": "FEAT-",
  "lastUpdated": "2026-01-16T10:30:00Z"
}
```

2. Create your next spec:
```
Kiro: "Identifier (FEAT-): "
You: "1"
Result: FEAT-1
```

## Usage Examples

### Example 1: Creating Specs with Numeric Input

**Scenario**: You're working on GitHub issue #7

```
You: "Create a spec for payment gateway"

Kiro: "Identifier (GITHUB-): [Press Enter for GITHUB-6, or type '7' for GITHUB-7]"
You: "7"

Kiro: "Use identifier 'GITHUB-7'? (y/n)"
You: "y"

Kiro: "External URL? (Press Enter to auto-detect)"
You: [Enter]

Kiro: "Detected: https://github.com/owner/repo/issues/7. Correct?"
You: "yes"

Kiro: "✅ Created: .kiro/specs/2026-01/GITHUB-7+payment-gateway/"
```

**What happened**:
1. You typed just `7` (3 characters)
2. Kiro combined it with `GITHUB-` to create `GITHUB-7`
3. Kiro reconstructed the URL using issue number `7`

### Example 2: Accepting Auto-increment Suggestion

**Scenario**: You want the next sequential identifier

```
You: "Create a spec for user dashboard"

Kiro: "Identifier (GITHUB-): [Press Enter for GITHUB-8]"
You: [Enter]

Kiro: "Use identifier 'GITHUB-8'? (y/n)"
You: "y"

Kiro: "✅ Created: .kiro/specs/2026-01/GITHUB-8+user-dashboard/"
```

**What happened**:
1. Kiro found the last identifier was `GITHUB-7`
2. Suggested `GITHUB-8` as the next one
3. You accepted by pressing Enter

### Example 3: Using Full Identifier

**Scenario**: You want to use a specific identifier

```
You: "Create a spec for API integration"

Kiro: "Identifier (GITHUB-): [Press Enter for GITHUB-9]"
You: "GITHUB-15"

Kiro: "Use identifier 'GITHUB-15'? (y/n)"
You: "y"

Kiro: "✅ Created: .kiro/specs/2026-01/GITHUB-15+api-integration/"
```

**What happened**:
1. You typed the full identifier `GITHUB-15`
2. Kiro validated it matches the configured prefix
3. Created the spec with that identifier

### Example 4: Jira with Numeric Input

**Scenario**: Working with Jira project "PROJECT"

```
You: "Create a spec for data migration"

Kiro: "Identifier (PROJECT-): [Press Enter for PROJECT-101]"
You: "102"

Kiro: "Use identifier 'PROJECT-102'? (y/n)"
You: "y"

Kiro: "External URL? (Press Enter to auto-detect)"
You: [Enter]

Kiro: "Detected: https://company.atlassian.net/browse/PROJECT-102. Correct?"
You: "yes"

Kiro: "✅ Created: .kiro/specs/2026-01/PROJECT-102+data-migration/"
```

**What happened**:
1. You typed just `102`
2. Kiro combined it with `PROJECT-` to create `PROJECT-102`
3. Kiro reconstructed the Jira URL

## Configuration

### Viewing Current Configuration

Check your `.kiro/spec-manager.json`:

```json
{
  "trackingSystem": "github",
  "githubRepository": "https://github.com/owner/repo",
  "usePrefix": true,
  "projectPrefix": "GITHUB-",
  "lastUpdated": "2026-01-16T10:30:00Z"
}
```

**Key fields**:
- `usePrefix`: Whether prefix mode is enabled
- `projectPrefix`: The prefix to use

### Enabling Prefix Mode

**For GitHub**:
```json
{
  "trackingSystem": "github",
  "githubRepository": "https://github.com/owner/repo",
  "usePrefix": true,
  "projectPrefix": "GITHUB-",
  "lastUpdated": "2026-01-16T10:30:00Z"
}
```

**For Jira**:
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

**For Custom Prefix**:
```json
{
  "trackingSystem": "none",
  "usePrefix": true,
  "projectPrefix": "FEAT-",
  "lastUpdated": "2026-01-16T10:30:00Z"
}
```

### Disabling Prefix Mode

Set `usePrefix` to `false`:

```json
{
  "trackingSystem": "github",
  "githubRepository": "https://github.com/owner/repo",
  "usePrefix": false,
  "projectPrefix": "GITHUB-",
  "lastUpdated": "2026-01-16T10:30:00Z"
}
```

**Note**: The `projectPrefix` is preserved so you can re-enable easily.

### Changing the Prefix

Edit `projectPrefix`:

```json
{
  "trackingSystem": "none",
  "usePrefix": true,
  "projectPrefix": "FEATURE-",
  "lastUpdated": "2026-01-16T10:30:00Z"
}
```

**Important**: Changing the prefix doesn't affect existing specs.

## Validation Rules

### Numeric Input Validation

When you provide numeric input, Kiro validates:

**Valid**:
- ✅ `1`, `7`, `42`, `123`, `999`
- Positive integers only

**Invalid**:
- ❌ `0` (must be positive)
- ❌ `-5` (no negatives)
- ❌ `3.14` (no decimals)
- ❌ `007` (no leading zeros)

**Error example**:
```
You: "007"
Kiro: "❌ Invalid numeric input: cannot have leading zeros"
Kiro: "Please enter a positive integer (e.g., 7)"
```

### Prefix Format Validation

When configuring a prefix, it must:

**Requirements**:
1. End with `-` or `_`
2. Contain only alphanumeric characters and separators
3. Be uppercase (recommended)

**Valid**:
- ✅ `GITHUB-`
- ✅ `PROJECT-`
- ✅ `FEAT_`
- ✅ `BUG-`

**Invalid**:
- ❌ `GITHUB` (missing separator)
- ❌ `PROJECT_-` (multiple separators)
- ❌ `PRO@ECT-` (invalid character)
- ❌ `project-` (lowercase, should be uppercase)

**Error example**:
```
Kiro: "❌ Invalid prefix format: 'GITHUB'"
Kiro: "Prefix must end with '-' or '_'"
Kiro: "Example: 'GITHUB-'"
```

### Prefix Mismatch Warning

If you provide a full identifier that doesn't match the configured prefix:

```
Kiro: "Identifier (GITHUB-): "
You: "PROJECT-5"

Kiro: "⚠️  Warning: Identifier doesn't match expected prefix"
Kiro: "  Expected: GITHUB-5"
Kiro: "  Provided: PROJECT-5"
Kiro: ""
Kiro: "What would you like to do?"
Kiro: "  1. Use 'PROJECT-5' as-is"
Kiro: "  2. Correct to 'GITHUB-5'"
Kiro: "  3. Re-enter identifier"
```

**Options**:
1. **Use as-is**: Proceeds with `PROJECT-5` (useful if intentional)
2. **Correct**: Changes to `GITHUB-5` (fixes typo)
3. **Re-enter**: Prompts again (start over)

## Advanced Usage

### Skipping Numbers

You can skip numbers in the sequence:

```
Last spec: GITHUB-5

Kiro: "Identifier (GITHUB-): [Press Enter for GITHUB-6]"
You: "10"

Kiro: "⚠️  Warning: Number 10 is higher than current maximum (5)"
Kiro: "This will skip numbers 6-9. Continue? (y/n)"
You: "y"

Kiro: "Use identifier 'GITHUB-10'? (y/n)"
You: "y"
```

**Use case**: Aligning with external issue numbers that have gaps.

### Going Backwards

You can use numbers lower than the current maximum:

```
Last spec: GITHUB-10

Kiro: "Identifier (GITHUB-): [Press Enter for GITHUB-11]"
You: "3"

Kiro: "⚠️  Warning: Number 3 is less than current maximum (10)"
Kiro: "This may cause confusion with spec ordering. Continue? (y/n)"
You: "y"

Kiro: "Use identifier 'GITHUB-3'? (y/n)"
You: "y"
```

**Use case**: Creating a spec for an older issue that was missed.

### Mixed Identifier Formats

Prefix mode works alongside non-prefixed identifiers:

```
Existing specs:
- GITHUB-1+feature-a
- GITHUB-2+feature-b
- old-spec-1+legacy
- old-spec-2+legacy

New spec with prefix mode:
Kiro: "Identifier (GITHUB-): "
You: "3"
Result: GITHUB-3+feature-c
```

**Backwards compatibility**: Existing specs are never modified.

## Integration with GitHub

When working with GitHub Issues:

### First Spec (Auto-enable)

```
You: "Create a spec for issue #5"

Kiro: "External URL?"
You: "https://github.com/owner/repo/issues/5"

Kiro: "✓ GitHub detected"
Kiro: "✓ Prefix mode enabled with 'GITHUB-'"
Kiro: "✓ Repository saved: https://github.com/owner/repo"

Kiro: "Identifier (GITHUB-): [Press Enter for GITHUB-5]"
You: [Enter]
```

### Subsequent Specs (Numeric Input)

```
You: "Create a spec for issue #6"

Kiro: "Identifier (GITHUB-): [Press Enter for GITHUB-6]"
You: [Enter]

Kiro: "External URL? (Press Enter to auto-detect)"
You: [Enter]

Kiro: "Detected: https://github.com/owner/repo/issues/6. Correct?"
You: "yes"
```

### Correcting Issue Number

```
You: "Create a spec for issue #8"

Kiro: "Identifier (GITHUB-): [Press Enter for GITHUB-7]"
You: "8"

Kiro: "Use identifier 'GITHUB-8'? (y/n)"
You: "y"

Kiro: "External URL? (Press Enter to auto-detect)"
You: [Enter]

Kiro: "Detected: https://github.com/owner/repo/issues/8. Correct?"
You: "yes"
```

## Integration with Jira

When working with Jira:

### First Spec (Auto-enable)

```
You: "Create a spec for PROJECT-100"

Kiro: "External URL?"
You: "https://company.atlassian.net/browse/PROJECT-100"

Kiro: "✓ Jira detected"
Kiro: "✓ Prefix mode enabled with 'PROJECT-'"
Kiro: "✓ Jira base URL saved: https://company.atlassian.net"

Kiro: "Identifier (PROJECT-): [Press Enter for PROJECT-100]"
You: [Enter]
```

### Subsequent Specs (Numeric Input)

```
You: "Create a spec for next issue"

Kiro: "Identifier (PROJECT-): [Press Enter for PROJECT-101]"
You: [Enter]

Kiro: "External URL? (Press Enter to auto-detect)"
You: [Enter]

Kiro: "Detected: https://company.atlassian.net/browse/PROJECT-101. Correct?"
You: "yes"
```

### Correcting Issue Number

```
You: "Create a spec for PROJECT-105"

Kiro: "Identifier (PROJECT-): [Press Enter for PROJECT-102]"
You: "105"

Kiro: "Use identifier 'PROJECT-105'? (y/n)"
You: "y"

Kiro: "External URL? (Press Enter to auto-detect)"
You: [Enter]

Kiro: "Detected: https://company.atlassian.net/browse/PROJECT-105. Correct?"
You: "yes"
```

## Troubleshooting

### "Invalid numeric input"

**Problem**: You entered an invalid number

**Examples**:
- `0` → Must be positive
- `-5` → No negatives
- `3.14` → No decimals
- `007` → No leading zeros

**Solution**: Enter a positive integer (1, 2, 3, ...)

### "Prefix mismatch warning"

**Problem**: You entered a full identifier with a different prefix

**Example**:
```
Config: GITHUB-
You entered: PROJECT-5
```

**Solution**:
1. If intentional: Choose "Use as-is"
2. If typo: Choose "Correct to GITHUB-5"
3. If unsure: Choose "Re-enter"

### "Prefix required when usePrefix is true"

**Problem**: Config has `usePrefix: true` but no `projectPrefix`

**Solution**: Add `projectPrefix` to config:
```json
{
  "usePrefix": true,
  "projectPrefix": "FEAT-",
  "lastUpdated": "2026-01-16T10:30:00Z"
}
```

### "Invalid prefix format"

**Problem**: Prefix doesn't end with `-` or `_`

**Examples**:
- ❌ `GITHUB` → Should be `GITHUB-`
- ❌ `PROJECT_-` → Should be `PROJECT-`

**Solution**: Fix the prefix format:
```json
{
  "projectPrefix": "GITHUB-"
}
```

### "Backwards number warning"

**Problem**: You entered a number less than the current maximum

**Example**:
```
Last spec: GITHUB-10
You entered: 3
```

**Solution**:
- If intentional (filling gap): Confirm and proceed
- If mistake: Cancel and enter correct number

## Best Practices

### Do

✅ **Enable prefix mode for GitHub/Jira projects**
- Saves time and reduces errors

✅ **Use numeric input for speed**
- Type `7` instead of `GITHUB-7`

✅ **Accept auto-increment suggestions when possible**
- Press Enter for sequential identifiers

✅ **Use consistent prefix format**
- Always uppercase with `-` or `_` separator

✅ **Keep prefix short**
- `GITHUB-` is better than `GITHUB-ISSUE-`

### Don't

❌ **Don't mix prefix formats**
- Stick to one format per project

❌ **Don't use lowercase prefixes**
- Use `GITHUB-` not `github-`

❌ **Don't change prefix mid-project**
- Causes confusion with existing specs

❌ **Don't use special characters in prefix**
- Only alphanumeric and `-` or `_`

❌ **Don't forget the separator**
- `GITHUB-` not `GITHUB`

## FAQ

### Can I use prefix mode without GitHub or Jira?

Yes! Set a custom prefix:
```json
{
  "trackingSystem": "none",
  "usePrefix": true,
  "projectPrefix": "FEAT-",
  "lastUpdated": "2026-01-16T10:30:00Z"
}
```

### Does prefix mode affect existing specs?

No. Existing specs are never modified. Prefix mode only affects new specs you create.

### Can I disable prefix mode temporarily?

Yes. Set `usePrefix: false` in config. The prefix is preserved so you can re-enable easily.

### Can I use different prefixes for different specs?

Yes, but not recommended. Prefix mode uses one prefix per project. You can override by providing full identifiers.

### What if I make a typo in the number?

Kiro asks for confirmation before creating the spec. You can correct it then.

### Can I use prefix mode with existing non-prefixed specs?

Yes. Prefix mode works alongside any existing identifier format.

### How do I query specs with prefix mode?

Queries work with both formats:
- `GITHUB-5` finds the spec
- `5` also finds it (if GitHub specs exist)

## See Also

- **spec-manager-schema.md**: Configuration file reference
- **steering/github-integration.md**: GitHub-specific workflows
- **steering/jira-integration.md**: Jira-specific workflows
- **steering/config-management.md**: Advanced configuration
- **steering/creating-specs.md**: General spec creation guide
