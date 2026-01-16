# Design Document: Spec Manager Power

## Overview

The Spec Manager Power is a Knowledge Base Power that provides comprehensive documentation and workflows for standardizing spec creation in Kiro. It guides users through a consistent process for creating specs with proper naming conventions, directory organization, and metadata tracking. The power integrates seamlessly with Kiro's spec-driven development workflow while adding organizational structure and traceability features.

This power does not require an MCP server as it provides pure documentation and guidance. It will be implemented as a POWER.md file with optional steering files for detailed workflows.

## Architecture

### Power Type: Knowledge Base Power

**Structure:**
```
spec-manager/
├── POWER.md              # Main documentation with frontmatter
└── steering/             # Optional workflow guides
    ├── creating-specs.md
    ├── naming-conventions.md
    └── troubleshooting.md
```

**No mcp.json required** - This is a documentation-only power.

### Integration Points

1. **Kiro Spec System**: Works with existing `.kiro/specs/` directory structure
2. **Task Management**: Compatible with `taskStatus` and `updatePBTStatus` tools
3. **File System**: Creates organized directory structures
4. **User Interaction**: Guides users through interactive prompts

## Components and Interfaces

### 1. POWER.md Structure

**Frontmatter:**
```yaml
---
name: "spec-manager"
displayName: "Spec Manager"
description: "Standardize spec creation with identifier-based naming, date organization, and Jira traceability for consistent project management"
keywords: ["specs", "jira", "organization", "workflow", "project-management", "traceability", "naming-conventions"]
author: "Your Organization"
---
```

**Main Sections:**
1. **Overview**: What the power does and why it's useful
2. **Quick Start**: Fast path to creating a spec
3. **Naming Conventions**: Detailed explanation of identifier + name format
4. **Directory Structure**: Visual representation of spec organization
5. **Metadata Tracking**: How to use metadata.json for traceability
6. **Querying Metadata**: How to search and retrieve spec information
7. **Work Directory**: Guidelines for .work/ usage
8. **Integration with Kiro**: How it works with Kiro's spec workflow
9. **Examples**: Complete examples of spec creation and queries
10. **Best Practices**: Tips for effective spec management
11. **Troubleshooting**: Common issues and solutions

### 2. Steering Files (Optional)

**creating-specs.md**: Step-by-step workflow for creating a new spec
- Interactive prompts
- Validation rules
- Directory creation steps
- Metadata generation

**naming-conventions.md**: Deep dive into naming standards
- Identifier format rules
- Name normalization algorithm
- Examples of good and bad names
- Special character handling

**troubleshooting.md**: Common problems and solutions
- Path resolution issues
- Naming conflicts
- Metadata errors
- Integration problems

### 3. Workflow Components

**Spec Creation Workflow:**
```
1. Prompt for Spec Identifier (optional)
   ↓
   1a. If user provides identifier:
       - Use provided identifier
       - Convert to uppercase
   ↓
   1b. If user doesn't provide identifier:
       - Search most recent specs (current month first)
       - Extract identifier from most recent spec
       - Detect numeric suffix
       - Increment number by 1
       - Present suggested identifier for confirmation
   ↓
2. Convert to Uppercase
   ↓
3. Generate Suggested Name
   ↓
4. Confirm with User
   ↓
5. Normalize if Custom Name Provided
   ↓
6. Prompt for External System URL (optional)
   ↓
   6a. If user provides only identifier:
       - Search most recent specs (current month first)
       - Find spec with URL in metadata
       - Extract URL pattern
       - Reconstruct URL with new identifier
       - Present to user for confirmation
   ↓
7. Auto-detect Assignee from Git Config
   ↓
8. Confirm Assignee with User (allow override)
   ↓
9. Create Date Directory (YYYY-MM)
   ↓
10. Create Spec Directory (IDENTIFIER+name)
   ↓
11. Generate File Structure
   ↓
12. Create Metadata File (with URL and assignee)
   ↓
13. Provide Path Information
```

**Metadata Query Workflow:**
```
User Query → Parse Intent → Locate Specs → Read Metadata → Filter/Search → Return Results
```

**Query Types:**
1. **URL Lookup**: "What's the URL for PROYECTO-100?"
2. **Metadata Display**: "Show me the metadata for feature-auth"
3. **Tag Search**: "Find all specs tagged with 'api'"
4. **Status Search**: "Show me all in-progress specs"
5. **Identifier Search**: "Where is the spec for PROYECTO-100?"
6. **Assignee Search**: "Show me all specs assigned to John"
7. **List All**: "List all specs in January 2026"

**Git Config Detection:**
```
1. Check if workspace is a git repository
   ↓
2. Run: git config user.name
   ↓
3. If successful: Present value to user for confirmation
   ↓
4. If failed: Prompt user for optional assignee
   ↓
5. Store confirmed/provided value in metadata
```

**URL Pattern Detection:**
```
1. User provides identifier only (e.g., "PROYECTO-101")
   ↓
2. Search for specs with URLs (most recent month first)
   ↓
3. Read metadata.json files to find URL patterns
   ↓
4. Extract pattern from most recent URL
   ↓
5. Identify identifier placeholder in URL
   ↓
6. Reconstruct URL with new identifier
   ↓
7. Present to user: "Is this the correct URL: {reconstructed_url}?"
   ↓
8. If confirmed: Use reconstructed URL
   ↓
9. If rejected: Prompt for correct URL
```

**URL Pattern Examples:**
- Pattern: `https://jira.company.com/browse/PROYECTO-100`
- New ID: `PROYECTO-101`
- Result: `https://jira.company.com/browse/PROYECTO-101`

**Month Priority Search:**
```
Current: 2026-02 (check first)
   ↓ (if no specs with URLs)
Previous: 2026-01 (check second)
   ↓ (if no specs with URLs)
Continue: 2025-12, 2025-11, ... (backwards in time)
```

**Identifier Auto-increment:**
```
1. User doesn't provide identifier (or presses Enter)
   ↓
2. Search for most recent spec (current month first)
   ↓
3. Extract identifier from most recent spec
   ↓
4. Detect numeric suffix pattern
   ↓
5. Increment number by 1
   ↓
6. Present to user: "Suggested identifier: {incremented_id}"
   ↓
7. If confirmed: Use suggested identifier
   ↓
8. If rejected: Prompt for custom identifier
```

**Identifier Increment Examples:**
- Last: `PROYECTO-100` → Suggest: `PROYECTO-101` (no padding)
- Last: `PROYECTO-001` → Suggest: `PROYECTO-002` (preserves 3-digit padding)
- Last: `JIRA-KEY-5` → Suggest: `JIRA-KEY-6` (no padding)
- Last: `FEATURE-1` → Suggest: `FEATURE-2` (no padding)
- Last: `SPEC-MANAGER-01` → Suggest: `SPEC-MANAGER-02` (preserves 2-digit padding)

**Padding Detection Logic:**
```
1. Extract numeric suffix from identifier
2. Count leading zeros in the number
3. Determine padding width (total digits)
4. Increment number
5. Apply same padding width to result
```

**Examples:**
- `001` → width=3, increment → `002` (3 digits)
- `1` → width=1, increment → `2` (1 digit)
- `099` → width=3, increment → `100` (3 digits, natural overflow)
- `9` → width=1, increment → `10` (natural overflow, no padding needed)

**Edge Cases:**
- No numeric suffix: Prompt for manual identifier
- Multiple numbers: Increment the last number only
- Padding overflow: Allow natural expansion (099 → 100)

## Data Models

### 1. Spec Directory Structure

```
.kiro/specs/
└── YYYY-MM/                          # Date-based organization
    └── IDENTIFIER+spec-name/         # Spec directory
        ├── requirements.md           # Requirements document
        ├── design.md                 # Design document
        ├── tasks.md                  # Task list
        ├── metadata.json             # Tracking metadata
        └── .work/                    # Working directory
            ├── helpers/              # Helper scripts
            ├── tests/                # Test files
            └── reports/              # Execution reports
```

### 2. Metadata Schema

```json
{
  "specIdentifier": "string",      // Uppercase identifier (e.g., "PROYECTO-100")
  "specName": "string",            // Normalized kebab-case name (e.g., "feature-auth")
  "displayName": "string",         // Human-readable name (e.g., "Feature Auth")
  "created": "string",             // ISO date (e.g., "2026-01-16")
  "updated": "string",             // ISO date (last modification)
  "status": "string",              // "draft" | "in-progress" | "completed" | "archived"
  "url": "string?",                // Optional external system URL (Jira, GitHub, etc.)
  "assignee": "string?",           // Optional assignee name
  "tags": "string[]?",             // Optional tags for categorization
  "notes": "string?"               // Optional additional notes
}
```

### 3. Naming Rules

**Identifier Format:**
- Input: Any case (e.g., "proyecto-100", "JIRA-KEY-123")
- Output: Uppercase (e.g., "PROYECTO-100", "JIRA-KEY-123")
- Allowed characters: Letters, numbers, hyphens
- Pattern: `^[A-Z0-9-]+$`

**Spec Name Format:**
- Input: Natural language or custom name
- Output: Lowercase kebab-case
- Max length: 50 characters
- Allowed characters: Lowercase letters, numbers, hyphens
- Pattern: `^[a-z0-9-]+$`

**Combined Format:**
- Pattern: `{IDENTIFIER}+{spec-name}`
- Example: `PROYECTO-100+feature-auth`
- Separator: `+` (plus sign)

### 4. Name Normalization Algorithm

```
Input: User-provided name
Steps:
1. Trim whitespace
2. Convert to lowercase
3. Replace spaces with hyphens
4. Remove special characters (keep only a-z, 0-9, -)
5. Remove consecutive hyphens
6. Trim hyphens from start/end
7. If length > 50: Truncate intelligently
   - Keep first 3-4 words
   - Preserve meaning
   - Ensure ends with complete word
8. Validate pattern: ^[a-z0-9-]+$
Output: Normalized kebab-case name
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Identifier Uppercase Conversion

*For any* user-provided spec identifier, converting it to uppercase should preserve the structure while ensuring all alphabetic characters are uppercase.

**Validates: Requirements 1.2, 1.4**

### Property 2: Name Normalization Idempotence

*For any* already-normalized spec name, applying the normalization algorithm should return the same name unchanged.

**Validates: Requirements 2.4**

### Property 3: Directory Name Format Compliance

*For any* spec identifier and spec name, the combined directory name should match the pattern `^[A-Z0-9-]+\+[a-z0-9-]+$`.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

### Property 4: Date Directory Format

*For any* spec creation date, the date directory should match the pattern `^20[0-9]{2}-(0[1-9]|1[0-2])$` (YYYY-MM format for years 2000-2099).

**Validates: Requirements 4.2, 4.3**

### Property 5: File Structure Completeness

*For any* created spec directory, it should contain exactly the required files: requirements.md, design.md, tasks.md, metadata.json, and the .work/ directory with its subdirectories.

**Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**

### Property 6: Metadata Schema Compliance

*For any* generated metadata.json file, it should validate against the metadata schema with all required fields present and correctly typed.

**Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**

### Property 7: Path Resolution Correctness

*For any* spec directory, the generated path should be relative to workspace root and follow the format `.kiro/specs/{YYYY-MM}/{IDENTIFIER}+{name}/`.

**Validates: Requirements 8.1, 8.2, 8.4**

### Property 8: Name Length Constraint

*For any* user-provided name longer than 50 characters, the normalized name should be truncated to 50 characters or less while preserving meaning.

**Validates: Requirements 2.5**

### Property 9: Git Config Detection

*For any* workspace that is a git repository, running `git config user.name` should either return a valid username or fail gracefully without breaking the workflow.

**Validates: Requirements 6.8, 6.12**

### Property 10: Assignee Confirmation

*For any* detected or user-provided assignee value, the final metadata should contain exactly the value confirmed by the user.

**Validates: Requirements 6.9, 6.10, 6.11**

### Property 11: Metadata Query by Assignee

*For any* assignee name, searching specs by assignee should return all and only specs where the metadata assignee field matches the search term.

**Validates: Requirements 11.1, 11.2, 11.3, 11.4**

### Property 12: URL Pattern Reconstruction

*For any* valid URL pattern and new identifier, reconstructing the URL should replace only the identifier portion while preserving the rest of the URL structure.

**Validates: Requirements 6.13, 6.14, 6.15**

### Property 13: Month Priority Search

*For any* search for recent specs, the search should check the current month first, then proceed backwards chronologically through previous months.

**Validates: Requirements 6.16, 6.17**

### Property 14: Identifier Auto-increment with Padding Preservation

*For any* identifier ending with a numeric suffix, incrementing it should increase only the numeric portion by 1 while preserving the prefix structure and any zero-padding width from the original pattern.

**Validates: Requirements 1.5, 1.6, 1.7, 1.8, 1.9**

## Error Handling

### 1. Invalid Identifier

**Error:** User provides identifier with invalid characters
**Handling:**
- Detect invalid characters (anything not alphanumeric or hyphen)
- Provide clear error message: "Identifier can only contain letters, numbers, and hyphens"
- Prompt user to provide valid identifier
- Show example: "PROYECTO-100"

### 2. Empty or Whitespace-Only Name

**Error:** User provides empty name or only whitespace
**Handling:**
- Detect empty/whitespace input
- Provide error message: "Spec name cannot be empty"
- Prompt user to provide meaningful name
- Suggest based on identifier if possible

### 3. Directory Already Exists

**Error:** Spec directory already exists
**Handling:**
- Check for existing directory before creation
- Provide error message: "Spec directory already exists: {path}"
- Offer options:
  - Use different name
  - Use different identifier
  - Overwrite (with confirmation)
  - Open existing spec

### 4. Invalid Date Format

**Error:** System date is invalid or cannot be determined
**Handling:**
- Fallback to manual date entry
- Validate format: YYYY-MM
- Provide error message if invalid
- Default to current date if available

### 5. File System Permissions

**Error:** Cannot create directories or files
**Handling:**
- Catch file system errors
- Provide clear error message with path
- Check workspace permissions
- Suggest running with appropriate permissions

### 6. Metadata Validation Errors

**Error:** Generated metadata doesn't match schema
**Handling:**
- Validate metadata before writing
- Log validation errors
- Provide default values for optional fields
- Ensure required fields are present

### 7. Git Config Not Available

**Error:** Cannot detect git config (not a git repo or git not installed)
**Handling:**
- Catch git command errors gracefully
- Inform user: "Could not auto-detect assignee from git config"
- Prompt user for optional assignee manually
- Continue workflow without blocking
- Document that assignee is optional

### 8. Git Config Returns Empty

**Error:** Git config exists but user.name is not set
**Handling:**
- Detect empty response from git config
- Inform user: "Git user.name is not configured"
- Prompt user for optional assignee manually
- Suggest setting git config for future use
- Continue workflow without blocking

### 9. No URL Pattern Found

**Error:** User provides identifier only but no previous specs have URLs
**Handling:**
- Search through all date directories for specs with URLs
- If none found, inform user: "No URL pattern found in previous specs"
- Prompt user to provide full URL manually
- Document the URL for future pattern detection
- Continue workflow normally

### 10. Ambiguous URL Pattern

**Error:** Multiple different URL patterns found in previous specs
**Handling:**
- Use the most recent URL pattern (latest month)
- Inform user which pattern was selected
- Show reconstructed URL for confirmation
- Allow user to provide different URL if incorrect
- Document pattern selection logic

### 11. No Numeric Suffix in Identifier

**Error:** Most recent spec identifier has no numeric suffix to increment
**Handling:**
- Inform user: "Cannot auto-increment identifier (no numeric suffix found)"
- Show last identifier: "Last spec was: {identifier}"
- Prompt user to provide identifier manually
- Suggest adding a number if appropriate
- Continue workflow normally

### 12. No Previous Specs Found

**Error:** No previous specs exist to detect identifier pattern
**Handling:**
- Inform user: "No previous specs found"
- Prompt user to provide identifier manually
- This is expected for first spec in workspace
- Continue workflow normally

## Testing Strategy

### Unit Testing Approach

Since this is a Knowledge Base Power (documentation only), traditional unit tests are not applicable. However, we can validate the documentation through:

1. **Example Validation**: Ensure all examples in documentation are correct
2. **Link Checking**: Verify all internal references are valid
3. **Schema Validation**: Validate metadata.json examples against schema
4. **Pattern Testing**: Test regex patterns with various inputs

### Documentation Testing

**Test Cases:**

1. **Identifier Conversion Examples**
   - Input: "proyecto-100" → Output: "PROYECTO-100"
   - Input: "JIRA-KEY-123" → Output: "JIRA-KEY-123"
   - Input: "feature-1" → Output: "FEATURE-1"

2. **Name Normalization Examples**
   - Input: "Feature Authentication" → Output: "feature-authentication"
   - Input: "User Management System" → Output: "user-management-system"
   - Input: "API Integration" → Output: "api-integration"
   - Input: "Create form that does XYZ and then ABC and more stuff" → Output: "create-form-xyz-abc" (truncated)

3. **Directory Name Examples**
   - Identifier: "PROYECTO-100", Name: "feature-auth" → "PROYECTO-100+feature-auth"
   - Identifier: "JIRA-KEY-123", Name: "user-mgmt" → "JIRA-KEY-123+user-mgmt"

4. **Full Path Examples**
   - Date: 2026-01, Spec: "PROYECTO-100+feature-auth" → ".kiro/specs/2026-01/PROYECTO-100+feature-auth/"

### Integration Testing

**Test Scenarios:**

1. **Create Spec Workflow**
   - Follow documentation to create a spec
   - Verify directory structure is created correctly
   - Verify metadata.json is valid
   - Verify paths work with Kiro tools

2. **Name Edge Cases**
   - Very long names (>50 chars)
   - Names with special characters
   - Names with multiple spaces
   - Single-word names

3. **Identifier Edge Cases**
   - Mixed case identifiers
   - Identifiers with numbers
   - Identifiers with multiple hyphens
   - Short identifiers (1-2 chars)

4. **Date Organization**
   - Create specs in different months
   - Verify date directories are created
   - Verify specs are organized correctly

### Validation Checklist

- [ ] All examples in POWER.md are correct and tested
- [ ] Metadata schema examples validate successfully
- [ ] Regex patterns match expected inputs
- [ ] Directory structure examples are accurate
- [ ] Path examples work with Kiro tools
- [ ] Naming convention examples cover edge cases
- [ ] Error handling scenarios are documented
- [ ] Troubleshooting guide covers common issues

## Implementation Notes

### 1. Power Development Location

**Development Path:** `/home/user/vscode/ucloud-web-forge-ai/power/spec-manager/`

This allows local development and testing before potential publication to a separate repository.

### 2. Publication Strategy

**Options:**
- **Option A**: Publish from subdirectory in current repo
- **Option B**: Move to independent repository for cleaner distribution

**Recommendation**: Develop in current repo, publish to independent repo when stable.

### 3. Documentation Style

- Use clear, concise language
- Provide complete, runnable examples
- Include visual representations (directory trees)
- Show before/after comparisons
- Use consistent formatting
- Include troubleshooting for common issues

### 4. User Experience

**Interactive Workflow:**
1. Agent reads POWER.md when user wants to create spec
2. Agent follows documented workflow
3. Agent prompts user for identifier
4. Agent suggests name based on description
5. Agent confirms with user
6. Agent creates directory structure
7. Agent generates metadata
8. Agent provides paths for next steps

### 5. Maintenance Considerations

- Keep examples up-to-date with Kiro changes
- Update metadata schema if new fields are needed
- Add new troubleshooting entries as issues arise
- Maintain compatibility with Kiro spec workflow
- Version documentation for breaking changes

### 6. Future Enhancements

Potential additions (not in current scope):
- Spec templates for common patterns
- Automated Jira integration
- Spec status tracking dashboard
- Bulk spec operations
- Spec migration tools
- Analytics and reporting
