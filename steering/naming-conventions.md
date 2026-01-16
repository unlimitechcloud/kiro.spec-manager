# Naming Conventions: Deep Dive

Complete guide to identifier and spec name formats.

## Identifier Format Rules

### Pattern
`^[A-Z0-9-]+$` - Uppercase letters, numbers, hyphens only

### Structure
`{PREFIX}-{NUMBER}` or `{PREFIX}-{CATEGORY}-{NUMBER}`

### Examples
**Good**:
- `PROYECTO-100` - Simple prefix + number
- `JIRA-KEY-5` - Multi-part prefix + number
- `FEATURE-1` - Short and clear
- `SPEC-MANAGER-001` - Descriptive with padding

**Bad**:
- `proyecto-100` - Lowercase (auto-converted)
- `PROJECT_100` - Underscore not allowed
- `PROJECT--100` - Consecutive hyphens
- `-PROJECT-100` - Starts with hyphen

### Auto-increment Logic

**Padding Detection Algorithm**:
```
1. Extract numeric suffix: "PROYECTO-001" → "001"
2. Count digits: len("001") = 3
3. Detect leading zeros: "001" has 2 leading zeros
4. Increment: int("001") + 1 = 2
5. Apply padding: str(2).zfill(3) = "002"
6. Result: "PROYECTO-002"
```

**Padding Examples**:
| Last | Padding | Next |
|------|---------|------|
| `PROYECTO-1` | None | `PROYECTO-2` |
| `PROYECTO-01` | 2-digit | `PROYECTO-02` |
| `PROYECTO-001` | 3-digit | `PROYECTO-002` |
| `PROYECTO-099` | 3-digit | `PROYECTO-100` (overflow) |
| `PROYECTO-999` | 3-digit | `PROYECTO-1000` (overflow) |

**Overflow Handling**: When incrementing causes more digits than padding width, allow natural expansion.

## Spec Name Format Rules

### Pattern
`^[a-z0-9-]+$` - Lowercase letters, numbers, hyphens only

### Length
Maximum 50 characters

### Normalization Algorithm

```
Input: "User Authentication System!!!"

Steps:
1. Trim: "User Authentication System!!!"
2. Lowercase: "user authentication system!!!"
3. Replace spaces: "user-authentication-system!!!"
4. Remove special chars: "user-authentication-system"
5. Remove consecutive hyphens: "user-authentication-system"
6. Trim hyphens: "user-authentication-system"
7. Check length: 26 chars (OK)
8. Result: "user-authentication-system"
```

### Truncation Strategy

**If > 50 characters**:
1. Split by hyphens into words
2. Keep first 3-4 most meaningful words
3. Ensure result < 50 chars
4. Preserve core meaning

**Example**:
```
Input: "create-a-comprehensive-user-management-system-with-role-based-access-control"
Length: 82 chars

Truncation:
1. Split: ["create", "a", "comprehensive", "user", "management", "system", "with", "role", "based", "access", "control"]
2. Remove filler words: ["create", "comprehensive", "user", "management", "system", "role", "access", "control"]
3. Keep first 4 meaningful: ["create", "user", "management", "system"]
4. Join: "create-user-management-system"
5. Length: 28 chars (OK)
```

## Combined Format

### Structure
`{IDENTIFIER}+{spec-name}`

The `+` separator clearly distinguishes identifier from name.

### Examples
- `PROYECTO-100+user-authentication`
- `JIRA-KEY-5+payment-gateway`
- `FEATURE-1+api-integration`
- `SPEC-MANAGER-001+spec-manager-power`

### Why Plus Sign?

**Advantages**:
- ✅ Visually distinct from hyphen
- ✅ Clearly separates two parts
- ✅ Filesystem-safe
- ✅ Easy to parse programmatically

**Alternatives considered**:
- `_` (underscore) - Less visually distinct
- `--` (double hyphen) - Confusing with single hyphens
- `.` (dot) - Can be confused with file extensions

## Extensive Examples

### Good Identifier Names

| Identifier | Why Good |
|------------|----------|
| `PROYECTO-100` | Clear prefix, simple number |
| `JIRA-KEY-5` | Multi-part prefix, identifies system |
| `FEATURE-1` | Short, clear purpose |
| `EPIC-2024-Q1-10` | Includes time context |
| `SPEC-MANAGER-001` | Descriptive, padded |

### Bad Identifier Names

| Identifier | Why Bad | Fix |
|------------|---------|-----|
| `proyecto-100` | Lowercase | `PROYECTO-100` |
| `PROJECT_100` | Underscore | `PROJECT-100` |
| `PROJECT--100` | Double hyphen | `PROJECT-100` |
| `-PROJECT-100` | Starts with hyphen | `PROJECT-100` |
| `PROJECT 100` | Space | `PROJECT-100` |

### Good Spec Names

| Name | Why Good |
|------|----------|
| `user-auth` | Concise, clear |
| `payment-gateway` | Descriptive, 2 words |
| `api-integration` | Clear purpose |
| `dashboard-redesign` | Action + target |
| `data-migration` | Clear task |

### Bad Spec Names

| Name | Why Bad | Fix |
|------|---------|-----|
| `feature` | Too vague | `user-authentication` |
| `update` | No context | `dashboard-update` |
| `fix-bug` | Not descriptive | `fix-login-timeout` |
| `create-a-form-that-handles-user-input-and-validates-it-properly` | Too long (63 chars) | `user-input-form` |
| `User_Authentication` | Wrong format | `user-authentication` |

### Before/After Normalization

| Input | Output | Notes |
|-------|--------|-------|
| "User Authentication" | `user-authentication` | Lowercase, space→hyphen |
| "API   Integration" | `api-integration` | Multiple spaces→single hyphen |
| "Payment_Gateway" | `payment-gateway` | Underscore→hyphen |
| "Feature!!!" | `feature` | Special chars removed |
| "  Dashboard  " | `dashboard` | Trimmed |
| "User--Auth" | `user-auth` | Consecutive hyphens→single |

### Edge Cases

| Input | Output | Reason |
|-------|--------|--------|
| "123" | `123` | Numbers OK |
| "a" | `a` | Single char OK |
| "user-auth-system-with-oauth2-and-jwt-tokens-for-api" | `user-auth-system-oauth2-jwt` | Truncated to 50 chars |
| "---user---" | `user` | Hyphens trimmed |
| "UPPERCASE" | `uppercase` | Converted to lowercase |

## Team Conventions

### Establish Standards

**Document your team's choices**:
1. **Identifier prefix**: What prefix to use? (`PROYECTO-`, `JIRA-`, `FEATURE-`)
2. **Padding style**: With or without zeros? (`001` vs `1`)
3. **External system**: Which system for URLs? (Jira, GitHub, Linear)
4. **Naming style**: Preferred word count? (2-4 words)

### Example Team Convention

```markdown
# Our Spec Naming Convention

## Identifiers
- Prefix: `MYPROJECT-`
- Padding: 3 digits (001, 002, ...)
- Example: `MYPROJECT-001`

## Names
- Length: 2-3 words preferred
- Style: action-object or object-action
- Examples: `user-auth`, `create-dashboard`, `api-integration`

## URLs
- System: Jira
- Pattern: `https://jira.company.com/browse/{ID}`

## Tags
- Categories: `feature`, `bugfix`, `refactor`, `docs`
- Areas: `frontend`, `backend`, `api`, `database`
```

### Consistency Checklist

- [ ] All identifiers use same prefix
- [ ] All identifiers use same padding style
- [ ] All names follow same length guideline
- [ ] All URLs point to same system
- [ ] Team members know the conventions
- [ ] Conventions are documented

