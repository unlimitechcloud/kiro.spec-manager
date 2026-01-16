# Troubleshooting Guide

This guide helps you diagnose and resolve common issues when working with the Spec Manager power.

## Common Problems

### 1. Invalid Identifier Errors

**Problem**: The identifier contains invalid characters or doesn't match the expected pattern.

**Symptoms**:
- Error message: "Invalid identifier format"
- Spec directory creation fails
- Identifier contains spaces, special characters, or emojis

**Diagnostic Steps**:
1. Check if the identifier contains only alphanumeric characters, hyphens, and underscores
2. Verify the identifier doesn't start or end with a hyphen
3. Confirm the identifier isn't empty or whitespace-only

**Solutions**:
- Remove or replace invalid characters (spaces → hyphens, special chars → remove)
- Use only: `A-Z`, `a-z`, `0-9`, `-`, `_`
- Valid examples: `PROJECT-1`, `FEAT_123`, `BUG-456`
- Invalid examples: `PROJECT 1`, `FEAT@123`, `BUG#456`

**Prevention**:
- Let Kiro auto-increment the identifier from previous specs
- Follow the naming conventions guide
- Use simple, consistent identifier patterns

---

### 2. Empty or Whitespace-Only Names

**Problem**: The spec name is empty, contains only whitespace, or becomes empty after normalization.

**Symptoms**:
- Error message: "Spec name cannot be empty"
- Directory name ends with just the identifier (e.g., `PROJECT-1+`)
- Normalization removes all characters

**Diagnostic Steps**:
1. Check if the original name contains any alphanumeric characters
2. Verify the name isn't just special characters or punctuation
3. Confirm normalization didn't remove all meaningful content

**Solutions**:
- Provide a descriptive name with at least one alphanumeric character
- Use meaningful words that describe the spec's purpose
- Avoid names with only special characters or emojis
- Example fix: `"!!!"` → `"urgent-fix"`, `"..."` → `"update-docs"`

**Prevention**:
- Always include descriptive words in the spec name
- Review the suggested name before confirming
- Use clear, concise descriptions of the spec's purpose

---

### 3. Directory Already Exists

**Problem**: A spec directory with the same name already exists.

**Symptoms**:
- Error message: "Directory already exists"
- Cannot create new spec with the same identifier
- Duplicate spec names in the same month

**Diagnostic Steps**:
1. Check if a directory with the same name exists in `.kiro/specs/YYYY-MM/`
2. Verify the identifier hasn't been used before
3. Confirm you're not trying to recreate an existing spec

**Solutions**:
- Use a different identifier (increment the number)
- Use a different spec name to differentiate
- If updating an existing spec, work in the existing directory
- If the directory is a mistake, remove it manually first

**Prevention**:
- Let Kiro auto-increment identifiers to avoid duplicates
- Check existing specs before creating new ones
- Use consistent identifier patterns that naturally increment

---

### 4. File System Permission Errors

**Problem**: Cannot create directories or files due to insufficient permissions.

**Symptoms**:
- Error message: "Permission denied"
- Cannot write to `.kiro/specs/` directory
- Files created but not writable

**Diagnostic Steps**:
1. Check if you have write permissions in the workspace
2. Verify the `.kiro/` directory exists and is writable
3. Confirm no files are locked or in use by other processes

**Solutions**:
- Ensure you have write permissions in the workspace directory
- Check if the workspace is on a read-only filesystem
- Verify no antivirus or security software is blocking file creation
- On Unix systems: `chmod -R u+w .kiro/specs/`

**Prevention**:
- Work in directories where you have full permissions
- Avoid working on network drives or restricted filesystems
- Keep workspace directories in user-owned locations

---

### 5. Path Resolution Errors

**Problem**: Kiro cannot find or resolve the spec directory path.

**Symptoms**:
- Error message: "Path not found"
- Cannot locate `.kiro/specs/` directory
- Relative paths don't resolve correctly

**Diagnostic Steps**:
1. Verify the workspace root contains a `.kiro/` directory
2. Check if you're in a multi-root workspace
3. Confirm the current working directory is correct

**Solutions**:
- Ensure `.kiro/specs/` directory exists in the workspace root
- Create the directory structure if missing: `.kiro/specs/`
- In multi-root workspaces, specify which workspace to use
- Use absolute paths if relative paths fail

**Prevention**:
- Always work from the workspace root
- Ensure `.kiro/` directory structure is initialized
- Use Kiro's built-in path resolution

---

### 6. Metadata Validation Errors

**Problem**: The `metadata.json` file is invalid or missing required fields.

**Symptoms**:
- Error message: "Invalid metadata format"
- Cannot query spec metadata
- JSON parsing errors

**Diagnostic Steps**:
1. Open `metadata.json` and verify it's valid JSON
2. Check if all required fields are present: `specIdentifier`, `specName`, `displayName`, `created`, `updated`, `status`
3. Verify field types match the schema (strings, dates, arrays)

**Solutions**:
- Validate JSON syntax using a JSON validator
- Ensure all required fields are present
- Check date formats are ISO 8601 (YYYY-MM-DD)
- Verify arrays contain strings, not other types
- Example valid metadata:
```json
{
  "specIdentifier": "PROJECT-1",
  "specName": "user-authentication",
  "displayName": "User Authentication",
  "created": "2026-01-16",
  "updated": "2026-01-16",
  "status": "in-progress",
  "tags": ["auth", "security"],
  "assignee": "John Doe",
  "url": "https://jira.example.com/PROJECT-1",
  "notes": "Implements OAuth 2.0 authentication"
}
```

**Prevention**:
- Let Kiro generate metadata.json automatically
- Don't manually edit metadata unless necessary
- Use a JSON schema validator when editing manually

---

### 7. Git Config Detection Errors

**Problem**: Cannot auto-detect assignee from git configuration.

**Symptoms**:
- Warning message: "Could not detect git user"
- Assignee field is empty or uses a default value
- Git config not found

**Diagnostic Steps**:
1. Check if git is installed: `git --version`
2. Verify git user.name is configured: `git config user.name`
3. Confirm you're in a git repository or workspace

**Solutions**:
- Configure git user name: `git config --global user.name "Your Name"`
- Or configure locally: `git config user.name "Your Name"`
- Manually provide assignee when prompted
- Check git installation if command not found

**Prevention**:
- Configure git user.name globally for all projects
- Verify git configuration before creating specs
- Keep git configuration up-to-date

---

### 8. Identifier Auto-Increment Errors

**Problem**: Cannot auto-detect or increment identifier from previous specs.

**Symptoms**:
- Warning message: "Could not detect previous identifier"
- Suggested identifier is generic (e.g., "SPEC-1")
- Padding pattern not preserved

**Diagnostic Steps**:
1. Check if any specs exist in the current month directory
2. Verify previous spec directories follow the naming convention
3. Confirm identifier pattern is consistent (e.g., all use `PROJECT-`)

**Solutions**:
- If no previous specs exist, provide the first identifier manually
- Ensure previous specs follow the `IDENTIFIER+name` format
- Check that identifiers have numeric suffixes for auto-increment
- Manually specify the identifier if auto-detection fails

**Prevention**:
- Use consistent identifier patterns across all specs
- Always include numeric suffixes for auto-increment (e.g., `PROJECT-1`, not just `PROJECT`)
- Follow the naming conventions guide

---

### 9. URL Pattern Detection Errors

**Problem**: Cannot detect or reconstruct URL pattern from previous specs.

**Symptoms**:
- Warning message: "Could not detect URL pattern"
- URL field is empty or incorrect
- Reconstructed URL doesn't match expected format

**Diagnostic Steps**:
1. Check if previous specs have URL fields in metadata.json
2. Verify URLs follow a consistent pattern
3. Confirm the identifier is present in the URL

**Solutions**:
- Manually provide the full URL when prompted
- Ensure previous specs have valid URLs in metadata
- Use consistent URL patterns across all specs
- Example pattern: `https://jira.example.com/PROJECT-{number}`

**Prevention**:
- Always include URLs in metadata for external system integration
- Use consistent URL patterns for all specs
- Document your URL pattern for team reference

---

### 10. Padding Pattern Detection Errors

**Problem**: Auto-increment doesn't preserve the padding pattern from previous specs.

**Symptoms**:
- Previous spec uses `001`, new spec uses `1` (or vice versa)
- Inconsistent identifier numbering
- Padding not detected correctly

**Diagnostic Steps**:
1. Check the numeric suffix of the most recent spec
2. Count leading zeros in the identifier
3. Verify the pattern is consistent across recent specs

**Solutions**:
- Manually specify the identifier with correct padding
- Ensure previous specs use consistent padding
- If pattern is inconsistent, choose one and stick with it
- Examples:
  - `PROJECT-001` → `PROJECT-002` (3-digit padding)
  - `PROJECT-1` → `PROJECT-2` (no padding)

**Prevention**:
- Choose a padding pattern at the start of the project
- Use consistent padding across all specs
- Document the padding pattern for team reference

---

### 11. GitHub URL Detection Errors

**Problem**: GitHub issue URL is not recognized or parsed incorrectly.

**Symptoms**:
- Error message: "Invalid GitHub URL"
- URL not detected as GitHub Issues
- Identifier not generated correctly

**Diagnostic Steps**:
1. Verify URL contains `/issues/` in the path
2. Check URL ends with a numeric issue number
3. Confirm URL is HTTPS (not HTTP)
4. Verify format matches: `https://github.com/{owner}/{repo}/issues/{number}`

**Solutions**:
- Ensure URL follows the correct pattern
- For GitHub Enterprise, verify custom domain is accessible
- Check that issue number is present at the end
- Valid examples:
  - `https://github.com/owner/repo/issues/5`
  - `https://github.enterprise.com/owner/repo/issues/10`
- Invalid examples:
  - `https://github.com/owner/repo` (missing /issues/)
  - `https://github.com/owner/repo/pull/5` (pull request, not issue)
  - `http://github.com/owner/repo/issues/5` (HTTP, not HTTPS)

**Prevention**:
- Copy URLs directly from GitHub issue pages
- Use the full URL, not shortened versions
- Verify URL in browser before providing to Kiro

---

### 12. Jira URL Detection Errors

**Problem**: Jira issue URL is not recognized or parsed incorrectly.

**Symptoms**:
- Error message: "Invalid Jira URL"
- URL not detected as Jira
- Issue key not extracted correctly

**Diagnostic Steps**:
1. Verify URL contains `/browse/` or `/projects/.../issues/` in the path
2. Check issue key format: `{PROJECT}-{number}`
3. Confirm URL is HTTPS (not HTTP)
4. Verify domain is accessible

**Solutions**:
- Ensure URL follows Jira patterns
- For Jira Cloud: `https://{company}.atlassian.net/browse/{KEY}`
- For Jira Server: `https://{domain}/browse/{KEY}`
- Check that issue key is in correct format (PROJECT-123)
- Valid examples:
  - `https://company.atlassian.net/browse/PROJECT-5`
  - `https://jira.company.com/browse/FEAT-10`
  - `https://jira.company.com/projects/PROJECT/issues/PROJECT-5`
- Invalid examples:
  - `https://company.atlassian.net/PROJECT-5` (missing /browse/)
  - `https://jira.company.com/browse/project-5` (lowercase key)
  - `http://jira.company.com/browse/PROJECT-5` (HTTP, not HTTPS)

**Prevention**:
- Copy URLs directly from Jira issue pages
- Use the full URL from the browser address bar
- Verify URL in browser before providing to Kiro

---

### 13. Config File Errors

**Problem**: spec-manager.json is missing, corrupted, or has invalid values.

**Symptoms**:
- Warning message: "Config file invalid"
- URL reconstruction doesn't work
- Tracking system not detected

**Diagnostic Steps**:
1. Check if `.kiro/spec-manager.json` exists
2. Verify JSON syntax is valid
3. Confirm required fields are present: `trackingSystem`, `lastUpdated`
4. Check system-specific fields (githubRepository, jiraBaseUrl, jiraProject)

**Solutions**:
- If missing: Kiro will create it automatically on first use
- If corrupted: Delete the file and let Kiro recreate it
- If invalid values: Edit manually or delete and recreate
- Validate JSON syntax using a JSON validator
- Example valid configs:
```json
// GitHub
{
  "trackingSystem": "github",
  "githubRepository": "https://github.com/owner/repo",
  "lastUpdated": "2026-01-16T10:30:00Z"
}

// Jira
{
  "trackingSystem": "jira",
  "jiraBaseUrl": "https://company.atlassian.net",
  "jiraProject": "PROJECT",
  "lastUpdated": "2026-01-16T10:30:00Z"
}
```

**Prevention**:
- Let Kiro manage the config file automatically
- Don't manually edit unless necessary
- Commit config file to version control for team consistency
- See `spec-manager-schema.md` for complete schema documentation

---

### 14. URL Reconstruction Errors

**Problem**: Cannot reconstruct URL for new specs automatically.

**Symptoms**:
- Warning message: "Cannot reconstruct URL"
- Must provide full URL manually each time
- Config exists but reconstruction fails

**Diagnostic Steps**:
1. Check if config file has required fields
2. For GitHub: verify `githubRepository` is present
3. For Jira: verify `jiraBaseUrl` is present
4. Confirm identifier matches the configured system

**Solutions**:
- Ensure config file has repository/base URL
- For GitHub: config needs `githubRepository` field
- For Jira: config needs `jiraBaseUrl` field
- If config is incomplete, provide full URL once to update it
- Verify identifier format matches tracking system:
  - GitHub: `GITHUB-{number}`
  - Jira: `{PROJECT}-{number}`

**Prevention**:
- Create first spec with full URL to populate config
- Don't manually edit config unless you know the correct format
- Verify config file after manual edits

---

### 15. Identifier Conflict Errors

**Problem**: Suggested identifier already exists.

**Symptoms**:
- Error message: "Identifier already exists"
- Cannot create spec with auto-incremented identifier
- Duplicate spec directories

**Diagnostic Steps**:
1. Check if a spec with that identifier exists in any month
2. Verify the identifier hasn't been used before
3. Confirm auto-increment detected the correct last identifier

**Solutions**:
- Use the next available identifier manually
- Check all month directories for existing specs
- If duplicate is a mistake, remove or rename it
- Override auto-increment with custom identifier

**Prevention**:
- Let Kiro auto-increment to avoid conflicts
- Don't manually create specs with future identifiers
- Keep identifier sequences consistent

---

### 16. Multiple Projects Confusion

**Problem**: Working with multiple GitHub repositories or Jira projects causes confusion.

**Symptoms**:
- Wrong repository URL used for reconstruction
- Jira project mismatch
- Config keeps changing between projects

**Diagnostic Steps**:
1. Check which tracking system is in config
2. Verify which repository/project is configured
3. Confirm you're working on the intended project

**Solutions**:
- For multiple GitHub repos: Update config when switching repos
- For multiple Jira projects: Update `jiraProject` when switching
- Or provide full URL manually for different projects
- Consider using separate workspaces for different projects

**Prevention**:
- Use one repository/project per workspace when possible
- Update config explicitly when switching projects
- Document which project each workspace uses

---

## Frequently Asked Questions

### Naming Conventions

**Q: Can I use spaces in the identifier?**
A: No, identifiers should only contain alphanumeric characters, hyphens, and underscores. Spaces will be rejected.

**Q: Should I use uppercase or lowercase for identifiers?**
A: Always use uppercase. Kiro will automatically convert identifiers to uppercase.

**Q: How long can the spec name be?**
A: Spec names should be concise (ideally under 50 characters). Kiro will suggest truncation for very long names.

**Q: Can I change the identifier after creating the spec?**
A: It's not recommended. The identifier is part of the directory name and metadata. If you must change it, rename the directory and update metadata.json manually.

### Organization

**Q: Why are specs organized by date (YYYY-MM)?**
A: Date-based organization prevents having thousands of specs at the same level and makes it easier to find recent specs.

**Q: Can I create specs in past months?**
A: Yes, but it's not recommended. Kiro defaults to the current month for consistency.

**Q: What if I have multiple projects in the same workspace?**
A: Use different identifier prefixes for each project (e.g., `PROJ-A-1`, `PROJ-B-1`).

### Metadata

**Q: Is the URL field required?**
A: No, it's optional. Use it if you want to link specs to external systems like Jira or GitHub.

**Q: Can I add custom fields to metadata.json?**
A: Yes, you can add custom fields, but ensure the required fields are always present.

**Q: How do I update metadata after creation?**
A: Edit the `metadata.json` file directly in the spec directory.

### Kiro Integration

**Q: How does Kiro know which spec I'm working on?**
A: Kiro uses the current file path or you can reference specs explicitly using the full path.

**Q: Can I use the power with existing specs?**
A: Yes, the power works with any spec that follows the naming conventions.

**Q: Does the power work in multi-root workspaces?**
A: Yes, but ensure each workspace has its own `.kiro/specs/` directory.

### Git Configuration

**Q: What if I don't use git?**
A: You can still use the power. Just provide the assignee manually when prompted.

**Q: Can I use a different name than my git user.name?**
A: Yes, Kiro will confirm the detected assignee and allow you to override it.

**Q: Does the power modify my git configuration?**
A: No, it only reads the configuration. It never modifies git settings.

### Querying Metadata

**Q: How do I find all specs assigned to me?**
A: Ask Kiro: "Show me all specs assigned to [Your Name]" or "Find my specs"

**Q: Can I search by multiple tags?**
A: Yes, ask Kiro: "Find specs with tags auth and security"

**Q: How do I list all specs in a specific month?**
A: Ask Kiro: "List all specs from January 2026" or check the `.kiro/specs/2026-01/` directory

**Q: What if metadata.json is missing from a spec?**
A: Kiro won't be able to query that spec. Create a metadata.json file following the schema.

---

## Getting Help

If you encounter issues not covered in this guide:

1. Check the main documentation in `POWER.md`
2. Review the naming conventions guide
3. Review the creating specs workflow guide
4. Ask Kiro for help with specific error messages
5. Check Kiro's documentation for general troubleshooting

## Reporting Issues

If you find a bug or have suggestions for improvement:

1. Document the issue with steps to reproduce
2. Include error messages and relevant file paths
3. Note your Kiro version and operating system
4. Share the issue with the power maintainer or community
