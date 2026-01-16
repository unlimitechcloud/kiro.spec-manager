# Creating Specs: Step-by-Step Workflow

This guide provides a detailed workflow for creating specs with Spec Manager.

## Prerequisites

Before creating your first spec, ensure configuration exists. If `.kiro/spec-manager.json` is missing, Kiro will automatically run the interactive setup wizard. See `initial-configuration-setup.md` for details.

## Complete Workflow

### Step 1: Prompt for Spec Identifier (Optional)

**Kiro asks**: "What is the spec identifier? (Press Enter to auto-increment)"

**Options**:
- **Provide identifier**: Type the identifier (e.g., `PROYECTO-101`)
- **Press Enter**: Auto-increment from last spec

**If you press Enter**:
1. Kiro searches for the most recent spec (current month first)
2. Extracts the identifier from the most recent spec
3. Detects numeric suffix and padding pattern
4. Increments the number by 1
5. Presents suggestion: "Last: PROYECTO-100. Suggested: PROYECTO-101. Confirm?"

**Padding Detection**:
- If last spec uses `001`, suggests `002` (preserves 3-digit padding)
- If last spec uses `1`, suggests `2` (no padding)
- If last spec uses `01`, suggests `02` (preserves 2-digit padding)

### Step 1a: Auto-detect and Increment

**How it works**:
```
Search order:
1. Current month (2026-02)
2. Previous month (2026-01)
3. Continue backwards (2025-12, 2025-11, ...)

For each month:
- List all spec directories
- Extract identifiers
- Find most recent by directory name
- Extract numeric suffix
- Detect padding width
- Increment number
```

**Examples**:
- `PROYECTO-100` → `PROYECTO-101` (no padding)
- `PROYECTO-001` → `PROYECTO-002` (3-digit padding)
- `SPEC-01` → `SPEC-02` (2-digit padding)
- `FEATURE-099` → `FEATURE-100` (natural overflow)

### Step 1b: Detect and Preserve Padding Pattern

**Algorithm**:
```python
# Pseudocode
last_identifier = "PROYECTO-001"
numeric_suffix = extract_number(last_identifier)  # "001"
padding_width = len(numeric_suffix)  # 3
number = int(numeric_suffix)  # 1
next_number = number + 1  # 2
next_suffix = str(next_number).zfill(padding_width)  # "002"
next_identifier = replace_suffix(last_identifier, next_suffix)  # "PROYECTO-002"
```

### Step 1c: Present Suggested Identifier

**Kiro presents**: "Last spec: PROYECTO-100. Suggested: PROYECTO-101. Confirm?"

**Your options**:
- Type `yes` or `y` → Use suggested identifier
- Type different identifier → Use your custom identifier
- Type `no` → Prompt for manual identifier

### Step 2: Convert to Uppercase

**Automatic**: Kiro converts any identifier to UPPERCASE

**Examples**:
- `proyecto-100` → `PROYECTO-100`
- `Jira-Key-5` → `JIRA-KEY-5`
- `FEATURE-1` → `FEATURE-1` (already uppercase)

### Step 3: Generate Suggested Name

**Kiro analyzes** your description and generates a short name:

**Process**:
1. Extract key words from description
2. Convert to lowercase
3. Join with hyphens
4. Truncate if > 50 characters
5. Preserve meaning

**Examples**:
- "User authentication feature" → `user-authentication-feature`
- "Payment gateway integration" → `payment-gateway-integration`
- "API for managing user profiles" → `api-managing-user-profiles`

### Step 4: Confirm with User

**Kiro asks**: "Spec name: user-authentication. Confirm?"

**Your options**:
- `yes` → Use suggested name
- Type different name → Kiro normalizes it
- `no` → Prompt for manual name

### Step 5: Normalize if Custom Name Provided

**If you provide a custom name**, Kiro normalizes it:

**Normalization steps**:
1. Trim whitespace
2. Convert to lowercase
3. Replace spaces with hyphens
4. Remove special characters (keep a-z, 0-9, -)
5. Remove consecutive hyphens
6. Trim hyphens from start/end
7. Truncate if > 50 characters

**Examples**:
- "User Authentication!!!" → `user-authentication`
- "API   Integration" → `api-integration`
- "Payment_Gateway" → `payment-gateway`

### Step 6: Prompt for External System URL (Optional)

**Kiro asks**: "External system URL? (Press Enter to auto-detect, or provide full URL)"

**Options**:
- **Press Enter**: Auto-detect pattern from recent specs
- **Type identifier only** (e.g., `101`): Reconstruct URL with pattern
- **Type full URL**: Use as-is
- **Leave empty**: No URL (optional field)

### Step 6a: Auto-detect URL Pattern

**If you press Enter or provide identifier only**:

1. Search recent specs (current month first, backwards)
2. Find spec with URL in metadata.json
3. Extract URL pattern
4. Identify where identifier appears in URL
5. Reconstruct URL with new identifier
6. Present for confirmation

**Example**:
```
Last spec URL: https://jira.company.com/browse/PROYECTO-100
New identifier: PROYECTO-101
Reconstructed: https://jira.company.com/browse/PROYECTO-101
```

### Step 6b: Reconstruct URL and Confirm

**Kiro presents**: "Detected URL: https://jira.company.com/browse/PROYECTO-101. Correct?"

**Your options**:
- `yes` → Use detected URL
- Type correct URL → Use your URL
- `no` → Prompt for manual URL or leave empty

### Step 7: Auto-detect Assignee from Git Config

**Kiro runs**: `git config user.name`

**If successful**:
- Extracts name (e.g., "Manuel Lara")
- Presents for confirmation

**If fails**:
- Informs: "Could not detect assignee from git"
- Prompts for manual entry or leave empty

### Step 8: Confirm Assignee with User

**Kiro presents**: "Assignee detected: Manuel Lara. Confirm?"

**Your options**:
- `yes` → Use detected assignee
- Type different name → Use your name
- `no` or empty → Leave assignee empty (optional)

### Step 9: Create Date Directory

**Kiro creates**: `.kiro/specs/YYYY-MM/`

**Uses current date**:
- Year: 4 digits (e.g., 2026)
- Month: 2 digits with leading zero (e.g., 01, 02, 12)
- Format: `YYYY-MM`

**Examples**:
- January 2026 → `2026-01/`
- December 2025 → `2025-12/`

**If directory exists**: Reuses it (multiple specs per month)

### Step 10: Create Spec Directory

**Kiro creates**: `.kiro/specs/YYYY-MM/IDENTIFIER+spec-name/`

**Format**: `{IDENTIFIER}+{spec-name}`

**Examples**:
- `2026-01/PROYECTO-101+user-authentication/`
- `2026-02/FEATURE-5+payment-gateway/`

### Step 11: Generate File Structure

**Kiro creates**:

```
IDENTIFIER+spec-name/
├── requirements.md          # Empty template
├── design.md               # Empty template
├── tasks.md                # Empty template
├── metadata.json           # Populated with data
└── .work/                  # Working directory
    ├── helpers/
    ├── tests/
    └── reports/
```

### Step 12: Create Metadata File

**Kiro generates** `metadata.json`:

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
  "tags": [],
  "notes": ""
}
```

**Fields**:
- `specIdentifier`: Uppercase identifier
- `specName`: Normalized kebab-case name
- `displayName`: Title case version of name
- `created`: ISO date (YYYY-MM-DD)
- `updated`: Same as created initially
- `status`: Always "draft" for new specs
- `url`: Detected or provided URL (or null)
- `assignee`: Detected or provided name (or null)
- `tags`: Empty array (add later)
- `notes`: Empty string (add later)

### Step 13: Provide Path Information

**Kiro confirms**:
```
✅ Spec created successfully!

Location: .kiro/specs/2026-01/PROYECTO-101+user-authentication/

Files created:
- requirements.md
- design.md
- tasks.md
- metadata.json
- .work/ (directory)

Next steps:
1. Open requirements.md to define requirements
2. Use Kiro's spec workflow to create design and tasks
3. Start implementing!
```

## Summary

The complete workflow automates:
- ✅ Identifier auto-increment with padding detection
- ✅ Name normalization
- ✅ URL pattern reconstruction
- ✅ Assignee detection from git
- ✅ Date-based organization
- ✅ Complete file structure generation
- ✅ Metadata tracking

**Result**: Consistent, organized specs with minimal manual work!


## Validation Rules

### Identifier Validation

**Pattern**: `^[A-Z0-9-]+$`

**Rules**:
- Must contain only uppercase letters, numbers, and hyphens
- Cannot start or end with hyphen
- Cannot have consecutive hyphens
- Minimum length: 1 character
- No maximum length (but keep reasonable, < 50 chars)

**Valid Examples**:
- ✅ `PROYECTO-100`
- ✅ `JIRA-KEY-5`
- ✅ `FEATURE-1`
- ✅ `A`
- ✅ `PROJECT-2024-Q1-100`

**Invalid Examples**:
- ❌ `proyecto-100` (lowercase - will be converted)
- ❌ `PROJECT_100` (underscore not allowed)
- ❌ `PROJECT--100` (consecutive hyphens)
- ❌ `-PROJECT-100` (starts with hyphen)
- ❌ `PROJECT-100-` (ends with hyphen)
- ❌ `PROJECT 100` (space not allowed)

### Name Validation

**Pattern**: `^[a-z0-9-]+$`

**Rules**:
- Must contain only lowercase letters, numbers, and hyphens
- Cannot start or end with hyphen
- Cannot have consecutive hyphens
- Maximum length: 50 characters
- Minimum length: 1 character

**Valid Examples**:
- ✅ `user-authentication`
- ✅ `api-integration`
- ✅ `feature-1`
- ✅ `a`

**Invalid Examples**:
- ❌ `User-Authentication` (uppercase - will be normalized)
- ❌ `user_authentication` (underscore - will be normalized)
- ❌ `user--authentication` (consecutive hyphens - will be normalized)
- ❌ `-user-authentication` (starts with hyphen - will be normalized)
- ❌ `user authentication` (space - will be normalized)

### Date Validation

**Pattern**: `^20[0-9]{2}-(0[1-9]|1[0-2])$`

**Rules**:
- Year: 2000-2099 (4 digits starting with 20)
- Month: 01-12 (2 digits with leading zero)
- Format: `YYYY-MM`

**Valid Examples**:
- ✅ `2026-01`
- ✅ `2025-12`
- ✅ `2099-06`

**Invalid Examples**:
- ❌ `26-01` (year must be 4 digits)
- ❌ `2026-1` (month must be 2 digits)
- ❌ `2026-13` (month > 12)
- ❌ `2026-00` (month < 01)

### Path Validation

**Rules**:
- Must be filesystem-safe
- No special characters except hyphen and plus sign
- No spaces
- No path traversal (../)
- Relative to workspace root

**Valid Examples**:
- ✅ `.kiro/specs/2026-01/PROYECTO-100+user-auth/`
- ✅ `.kiro/specs/2025-12/FEATURE-1+api/`

**Invalid Examples**:
- ❌ `.kiro/specs/../../../etc/passwd` (path traversal)
- ❌ `.kiro/specs/2026-01/PROJECT 100/` (space)
- ❌ `/absolute/path/specs/` (absolute path)


## Interactive Prompts Examples

### Example 1: Full Auto-detection

```
You: "Create a new spec for payment processing"

Kiro: "Spec identifier? (Press Enter to auto-increment)"
You: [Enter]

Kiro: "Searching for recent specs..."
Kiro: "Last spec: PROYECTO-100 (2026-01)"
Kiro: "Suggested identifier: PROYECTO-101"
Kiro: "Confirm? (yes/no or provide different identifier)"
You: "yes"

Kiro: "Spec name suggestion: payment-processing"
Kiro: "Confirm? (yes/no or provide different name)"
You: "yes"

Kiro: "External system URL?"
Kiro: "(Press Enter to auto-detect, type identifier only, or full URL)"
You: [Enter]

Kiro: "Searching for URL patterns..."
Kiro: "Found pattern: https://jira.company.com/browse/{ID}"
Kiro: "Reconstructed: https://jira.company.com/browse/PROYECTO-101"
Kiro: "Correct? (yes/no or provide correct URL)"
You: "yes"

Kiro: "Detecting assignee from git config..."
Kiro: "Found: Manuel Lara"
Kiro: "Confirm? (yes/no or provide different name)"
You: "yes"

Kiro: "✅ Creating spec..."
Kiro: "✅ Spec created: .kiro/specs/2026-01/PROYECTO-101+payment-processing/"
```

### Example 2: Manual Identifier

```
You: "Create spec for user authentication, ticket JIRA-KEY-50"

Kiro: "Spec identifier? (Press Enter to auto-increment)"
You: "JIRA-KEY-50"

Kiro: "Spec name suggestion: user-authentication"
Kiro: "Confirm? (yes/no or provide different name)"
You: "yes"

Kiro: "External system URL?"
You: "50"

Kiro: "Searching for URL patterns..."
Kiro: "Found pattern: https://jira.company.com/browse/{ID}"
Kiro: "Reconstructed: https://jira.company.com/browse/JIRA-KEY-50"
Kiro: "Correct?"
You: "yes"

Kiro: "Assignee: Manuel Lara. Confirm?"
You: "yes"

Kiro: "✅ Created: .kiro/specs/2026-01/JIRA-KEY-50+user-authentication/"
```

### Example 3: Custom Name

```
You: "Create spec for implementing OAuth2 authentication system"

Kiro: "Spec identifier?"
You: [Enter]

Kiro: "Suggested: PROYECTO-102. Confirm?"
You: "yes"

Kiro: "Spec name: implementing-oauth2-authentication-system"
Kiro: "This is quite long. Suggested shorter version: oauth2-authentication"
Kiro: "Confirm? (yes/no or provide different name)"
You: "oauth2-auth"

Kiro: "Normalizing: oauth2-auth"
Kiro: "Using: oauth2-auth"

Kiro: "External URL?"
You: [Enter]

Kiro: "Detected: https://jira.company.com/browse/PROYECTO-102. Correct?"
You: "yes"

Kiro: "Assignee: Manuel Lara. Confirm?"
You: "yes"

Kiro: "✅ Created: .kiro/specs/2026-01/PROYECTO-102+oauth2-auth/"
```

### Example 4: No Auto-detection Available

```
You: "Create first spec for this project"

Kiro: "Spec identifier?"
You: [Enter]

Kiro: "No previous specs found."
Kiro: "Please provide an identifier:"
You: "MYPROJECT-1"

Kiro: "Spec name suggestion: first-spec"
Kiro: "Confirm?"
You: "initial-setup"

Kiro: "Using: initial-setup"

Kiro: "External URL?"
You: "https://github.com/company/project/issues/1"

Kiro: "Using: https://github.com/company/project/issues/1"

Kiro: "Assignee from git: Manuel Lara. Confirm?"
You: "yes"

Kiro: "✅ Created: .kiro/specs/2026-01/MYPROJECT-1+initial-setup/"
```

### Example 5: Override All Auto-detection

```
You: "Create spec"

Kiro: "Spec identifier?"
You: "CUSTOM-999"

Kiro: "Spec name?"
You: "my-custom-feature"

Kiro: "External URL?"
You: "https://linear.app/company/issue/CUSTOM-999"

Kiro: "Assignee?"
You: "John Doe"

Kiro: "✅ Created: .kiro/specs/2026-01/CUSTOM-999+my-custom-feature/"
```

## Tips for Smooth Workflow

1. **Press Enter** to accept suggestions - fastest workflow
2. **Type identifier only** for URLs - let pattern detection work
3. **Keep names short** - 2-4 words is ideal
4. **Use consistent prefixes** - helps with organization
5. **Confirm git config** - saves time on assignee entry

