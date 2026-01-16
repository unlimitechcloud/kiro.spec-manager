# Querying Metadata Guide

This guide explains how to query and search spec metadata using natural language with Kiro.

## Overview

Every spec created with the Spec Manager power includes a `metadata.json` file that contains structured information about the spec. You can query this metadata using natural language, and Kiro will search through all specs to find matches.

## Query Patterns

### 1. Query by URL

Find specs linked to external systems (Jira, GitHub, etc.).

**Natural Language Examples**:
- "What's the URL for PROJECT-1?"
- "Show me the Jira link for the authentication spec"
- "Find the spec with URL https://jira.example.com/PROJECT-123"
- "Which spec is linked to JIRA-456?"

**How It Works**:
1. Kiro searches all `metadata.json` files in `.kiro/specs/`
2. Matches the `url` field against your query
3. Returns the spec(s) with matching URLs

**Example Response**:
```
Found spec: PROJECT-1+user-authentication
Location: .kiro/specs/2026-01/PROJECT-1+user-authentication/
URL: https://jira.example.com/PROJECT-1
Status: in-progress
```

---

### 2. Query by Tag

Find specs with specific tags or categories.

**Natural Language Examples**:
- "Find all specs tagged with 'auth'"
- "Show me specs with the 'security' tag"
- "List specs tagged 'frontend' and 'react'"
- "Which specs are tagged as 'urgent'?"

**How It Works**:
1. Kiro searches the `tags` array in each `metadata.json`
2. Matches tags case-insensitively
3. Can match single or multiple tags
4. Returns all specs with matching tags

**Example Response**:
```
Found 3 specs with tag 'auth':

1. PROJECT-1+user-authentication
   Location: .kiro/specs/2026-01/PROJECT-1+user-authentication/
   Tags: auth, security, frontend
   Status: in-progress

2. PROJECT-5+oauth-integration
   Location: .kiro/specs/2026-01/PROJECT-5+oauth-integration/
   Tags: auth, oauth, backend
   Status: completed

3. PROJECT-12+password-reset
   Location: .kiro/specs/2026-01/PROJECT-12+password-reset/
   Tags: auth, email, security
   Status: planned
```

---

### 3. Query by Status

Find specs in a specific state of completion.

**Natural Language Examples**:
- "Show me all in-progress specs"
- "List completed specs"
- "Which specs are planned but not started?"
- "Find specs with status 'blocked'"

**Common Status Values**:
- `planned` - Spec created but work not started
- `in-progress` - Actively being worked on
- `completed` - Work finished
- `blocked` - Waiting on dependencies or decisions
- `cancelled` - No longer needed

**How It Works**:
1. Kiro searches the `status` field in each `metadata.json`
2. Matches status values exactly (case-insensitive)
3. Returns all specs with matching status

**Example Response**:
```
Found 5 specs with status 'in-progress':

1. PROJECT-1+user-authentication (.kiro/specs/2026-01/)
2. PROJECT-3+dashboard-redesign (.kiro/specs/2026-01/)
3. PROJECT-7+api-optimization (.kiro/specs/2026-01/)
4. PROJECT-9+mobile-app (.kiro/specs/2026-01/)
5. PROJECT-11+database-migration (.kiro/specs/2025-12/)
```

---

### 4. Query by Assignee

Find specs assigned to specific team members.

**Natural Language Examples**:
- "Show me all specs assigned to John Doe"
- "What specs is Jane working on?"
- "Find my specs" (uses your git user.name)
- "List specs assigned to the frontend team"

**How It Works**:
1. Kiro searches the `assignee` field in each `metadata.json`
2. Matches assignee names (partial matches supported)
3. Can use "my specs" to match your git user.name
4. Returns all specs with matching assignees

**Example Response**:
```
Found 4 specs assigned to 'John Doe':

1. PROJECT-1+user-authentication
   Status: in-progress
   Created: 2026-01-10
   Tags: auth, security

2. PROJECT-8+payment-gateway
   Status: planned
   Created: 2026-01-14
   Tags: payments, backend

3. PROJECT-15+notification-system
   Status: in-progress
   Created: 2026-01-15
   Tags: notifications, email

4. PROJECT-20+admin-panel
   Status: completed
   Created: 2025-12-28
   Tags: admin, frontend
```

---

### 5. Query by Identifier

Find a specific spec by its identifier.

**Natural Language Examples**:
- "Show me PROJECT-1"
- "Find spec FEAT-123"
- "Where is BUG-456?"
- "Open PROJECT-10"

**How It Works**:
1. Kiro searches the `identifier` field in each `metadata.json`
2. Matches identifiers exactly (case-insensitive)
3. Returns the spec with matching identifier

**Example Response**:
```
Found spec: PROJECT-1

Full Name: PROJECT-1+user-authentication
Location: .kiro/specs/2026-01/PROJECT-1+user-authentication/
Status: in-progress
Assignee: John Doe
Tags: auth, security, frontend
URL: https://jira.example.com/PROJECT-1
Created: 2026-01-10T10:30:00.000Z
Updated: 2026-01-15T14:22:00.000Z
```

---

### 6. List All Specs

Get an overview of all specs in the workspace.

**Natural Language Examples**:
- "List all specs"
- "Show me all specs"
- "What specs exist?"
- "Give me a summary of all specs"

**How It Works**:
1. Kiro scans all directories in `.kiro/specs/`
2. Reads all `metadata.json` files
3. Returns a summary of all specs, organized by date

**Example Response**:
```
Found 15 specs across 2 months:

January 2026 (12 specs):
- PROJECT-1+user-authentication (in-progress)
- PROJECT-2+dashboard-layout (completed)
- PROJECT-3+dashboard-redesign (in-progress)
- PROJECT-4+api-documentation (planned)
- PROJECT-5+oauth-integration (completed)
- PROJECT-6+error-handling (in-progress)
- PROJECT-7+api-optimization (in-progress)
- PROJECT-8+payment-gateway (planned)
- PROJECT-9+mobile-app (in-progress)
- PROJECT-10+search-feature (completed)
- PROJECT-11+database-migration (blocked)
- PROJECT-12+password-reset (planned)

December 2025 (3 specs):
- PROJECT-20+admin-panel (completed)
- PROJECT-21+user-roles (completed)
- PROJECT-22+audit-logging (completed)
```

---

### 7. List Specs by Date Range

Find specs created in a specific time period.

**Natural Language Examples**:
- "List specs from January 2026"
- "Show me specs created in December"
- "What specs were created this month?"
- "Find specs from last month"

**How It Works**:
1. Kiro uses the directory structure (`.kiro/specs/YYYY-MM/`)
2. Filters specs by the date directory
3. Can also use the `created` field for more precise filtering

**Example Response**:
```
Specs from January 2026:

Found 12 specs:
1. PROJECT-1+user-authentication (in-progress)
2. PROJECT-2+dashboard-layout (completed)
3. PROJECT-3+dashboard-redesign (in-progress)
4. PROJECT-4+api-documentation (planned)
5. PROJECT-5+oauth-integration (completed)
6. PROJECT-6+error-handling (in-progress)
7. PROJECT-7+api-optimization (in-progress)
8. PROJECT-8+payment-gateway (planned)
9. PROJECT-9+mobile-app (in-progress)
10. PROJECT-10+search-feature (completed)
11. PROJECT-11+database-migration (blocked)
12. PROJECT-12+password-reset (planned)
```

---

## Search Mechanics

### How Kiro Locates Specs

1. **Directory Scanning**: Kiro scans `.kiro/specs/` and all subdirectories
2. **Metadata Reading**: Reads each `metadata.json` file found
3. **Filtering**: Applies your query filters to the metadata
4. **Sorting**: Sorts results by date (most recent first)
5. **Presentation**: Formats and displays matching specs

### Search Priority

When searching for patterns (like URL patterns or identifier increments):

1. **Current Month First**: Always checks the current month directory first
2. **Backwards in Time**: If not found, searches previous months in reverse chronological order
3. **Most Recent Match**: Uses the most recent matching spec as the reference

### Performance Considerations

- **Fast for Small Workspaces**: Instant results for workspaces with < 100 specs
- **Efficient Scanning**: Only reads `metadata.json` files, not full spec content
- **Cached Results**: Kiro may cache metadata for faster subsequent queries
- **Large Workspaces**: For workspaces with 1000+ specs, queries may take a few seconds

### Filtering Logic

- **Exact Matches**: Identifiers and URLs must match exactly (case-insensitive)
- **Partial Matches**: Assignee names support partial matching
- **Array Matching**: Tags support matching any tag in the array
- **Case Insensitive**: All text matching is case-insensitive
- **Multiple Filters**: You can combine filters (e.g., "in-progress specs tagged auth")

---

## Complete Examples

### Example 1: Find Spec URL

**User Query**: "What's the Jira link for PROJECT-5?"

**Kiro's Process**:
1. Searches for spec with identifier "PROJECT-5"
2. Finds `.kiro/specs/2026-01/PROJECT-5+oauth-integration/metadata.json`
3. Reads the `url` field
4. Returns the URL

**Response**:
```
The Jira link for PROJECT-5 (oauth-integration) is:
https://jira.example.com/PROJECT-5

Full spec location: .kiro/specs/2026-01/PROJECT-5+oauth-integration/
```

---

### Example 2: Search by Tag

**User Query**: "Find all specs tagged with 'security'"

**Kiro's Process**:
1. Scans all `metadata.json` files
2. Checks the `tags` array in each file
3. Matches specs where "security" is in the tags array
4. Returns all matches

**Response**:
```
Found 3 specs tagged with 'security':

1. PROJECT-1+user-authentication
   Location: .kiro/specs/2026-01/PROJECT-1+user-authentication/
   Status: in-progress
   Assignee: John Doe
   Tags: auth, security, frontend

2. PROJECT-6+error-handling
   Location: .kiro/specs/2026-01/PROJECT-6+error-handling/
   Status: in-progress
   Assignee: Jane Smith
   Tags: security, backend, logging

3. PROJECT-12+password-reset
   Location: .kiro/specs/2026-01/PROJECT-12+password-reset/
   Status: planned
   Assignee: John Doe
   Tags: auth, email, security
```

---

### Example 3: Filter by Status

**User Query**: "Show me all completed specs"

**Kiro's Process**:
1. Scans all `metadata.json` files
2. Filters specs where `status === "completed"`
3. Sorts by date (most recent first)
4. Returns all matches

**Response**:
```
Found 5 completed specs:

January 2026:
1. PROJECT-10+search-feature
   Assignee: Jane Smith
   Completed: 2026-01-14

2. PROJECT-5+oauth-integration
   Assignee: John Doe
   Completed: 2026-01-12

3. PROJECT-2+dashboard-layout
   Assignee: Jane Smith
   Completed: 2026-01-08

December 2025:
4. PROJECT-22+audit-logging
   Assignee: John Doe
   Completed: 2025-12-30

5. PROJECT-21+user-roles
   Assignee: Jane Smith
   Completed: 2025-12-28
```

---

### Example 4: Find Specs by Assignee

**User Query**: "What specs is Jane Smith working on?"

**Kiro's Process**:
1. Scans all `metadata.json` files
2. Matches specs where `assignee` contains "Jane Smith"
3. Filters to only in-progress specs (implied by "working on")
4. Returns matches

**Response**:
```
Jane Smith is currently working on 2 specs:

1. PROJECT-3+dashboard-redesign
   Location: .kiro/specs/2026-01/PROJECT-3+dashboard-redesign/
   Status: in-progress
   Tags: frontend, ui, design
   Started: 2026-01-11

2. PROJECT-6+error-handling
   Location: .kiro/specs/2026-01/PROJECT-6+error-handling/
   Status: in-progress
   Tags: security, backend, logging
   Started: 2026-01-13
```

---

### Example 5: List Specs in Date Range

**User Query**: "List all specs from December 2025"

**Kiro's Process**:
1. Looks in `.kiro/specs/2025-12/` directory
2. Reads all `metadata.json` files in that directory
3. Returns summary of all specs

**Response**:
```
Specs from December 2025:

Found 3 specs:

1. PROJECT-20+admin-panel
   Status: completed
   Assignee: John Doe
   Tags: admin, frontend
   Created: 2025-12-15

2. PROJECT-21+user-roles
   Status: completed
   Assignee: Jane Smith
   Tags: auth, permissions, backend
   Created: 2025-12-20

3. PROJECT-22+audit-logging
   Status: completed
   Assignee: John Doe
   Tags: logging, security, compliance
   Created: 2025-12-28
```

---

## Error Handling

### Metadata File Not Found

**Error**: "No metadata.json found for spec"

**Cause**: The spec directory exists but doesn't contain a `metadata.json` file

**Solution**: Create a `metadata.json` file following the schema, or recreate the spec using the Spec Manager power

---

### Invalid JSON in Metadata

**Error**: "Invalid JSON in metadata.json"

**Cause**: The `metadata.json` file contains syntax errors

**Solution**: Validate the JSON using a JSON validator and fix syntax errors

---

### Missing Required Fields

**Error**: "Missing required field: [field name]"

**Cause**: The `metadata.json` file is missing a required field

**Solution**: Add the missing field. Required fields are:
- `specIdentifier`
- `specName`
- `displayName`
- `created`
- `updated`
- `status`

---

### No Specs Match Query

**Response**: "No specs found matching your query"

**Cause**: No specs match the search criteria

**Solutions**:
- Verify the search term is correct (check spelling)
- Try a broader search (e.g., partial tag name)
- Check if specs exist in the expected date range
- List all specs to see what's available

---

## Advanced Queries

### Combining Multiple Filters

**Examples**:
- "Find in-progress specs tagged with 'auth' assigned to John"
- "Show completed specs from January with the 'frontend' tag"
- "List blocked specs assigned to me"

**How It Works**: Kiro applies all filters sequentially, narrowing results at each step.

---

### Using Wildcards

**Examples**:
- "Find specs with PROJECT-* identifier"
- "Show specs tagged with 'auth*'"

**Note**: Wildcard support depends on Kiro's implementation. Try natural language first.

---

### Sorting Results

**Examples**:
- "List specs by creation date"
- "Show specs sorted by status"
- "Order specs by assignee"

**Default**: Results are sorted by creation date (most recent first) unless specified otherwise.

---

## Best Practices

1. **Use Specific Queries**: More specific queries return faster, more relevant results
2. **Check Metadata Quality**: Ensure all specs have complete, accurate metadata
3. **Use Tags Consistently**: Establish a tag taxonomy for your team
4. **Update Status Regularly**: Keep status fields current for accurate filtering
5. **Include URLs**: Always link specs to external systems for traceability
6. **Use Natural Language**: Kiro understands natural queries better than rigid syntax

---

## Tips for Team Collaboration

- **Standardize Tags**: Agree on common tags (e.g., "frontend", "backend", "urgent")
- **Update Assignees**: Keep assignee fields current when work is transferred
- **Use Status Consistently**: Define what each status means for your team
- **Document URL Patterns**: Share your URL pattern so everyone uses the same format
- **Regular Cleanup**: Archive or remove cancelled specs to keep queries fast

---

## Next Steps

- Review the [Creating Specs Guide](creating-specs.md) for the full workflow
- Check the [Naming Conventions Guide](naming-conventions.md) for identifier rules
- See the [Troubleshooting Guide](troubleshooting.md) for common issues
- Read the main [POWER.md](../POWER.md) for complete documentation


---

### 8. Query GitHub Specs

Find specs linked to GitHub Issues.

**Natural Language Examples**:
- "What's the GitHub link for issue 5?"
- "Show me GITHUB-5"
- "Find all GitHub specs"
- "List specs from GitHub"
- "Show me issue 10"

**How It Works**:
1. Kiro searches for specs with identifiers matching `GITHUB-*`
2. Can search by full identifier (`GITHUB-5`) or just number (`5`)
3. Returns specs with GitHub URLs

**Example Response**:
```
Found spec: GITHUB-5

Full Name: GITHUB-5+user-authentication
Location: .kiro/specs/2026-01/GITHUB-5+user-authentication/
Status: in-progress
Assignee: John Doe
Tags: auth, security, github
URL: https://github.com/owner/repo/issues/5
Created: 2026-01-10T10:30:00.000Z
```

**Fuzzy Number Search**:
```
User: "Show me issue 5"

Kiro checks for:
1. Exact match: identifier = "5"
2. GitHub match: identifier = "GITHUB-5"
3. Returns GITHUB-5 if found
```

---

### 9. Query Jira Specs

Find specs linked to Jira issues.

**Natural Language Examples**:
- "What's the Jira link for PROJECT-5?"
- "Show me PROJECT-10"
- "Find all PROJECT specs"
- "List specs from Jira"
- "Show me all FEAT specs"

**How It Works**:
1. Kiro searches for specs with identifiers matching Jira key format
2. Can search by full key (`PROJECT-5`) or project prefix (`PROJECT-*`)
3. Returns specs with Jira URLs

**Example Response**:
```
Found spec: PROJECT-5

Full Name: PROJECT-5+user-authentication
Location: .kiro/specs/2026-01/PROJECT-5+user-authentication/
Status: in-progress
Assignee: John Doe
Tags: auth, security, jira
URL: https://company.atlassian.net/browse/PROJECT-5
Created: 2026-01-10T10:30:00.000Z
```

**Project-wide Search**:
```
User: "List all PROJECT specs"

Kiro finds all specs with identifiers matching "PROJECT-*":
- PROJECT-1+user-authentication
- PROJECT-2+payment-gateway
- PROJECT-5+api-integration
- PROJECT-10+dashboard-redesign
```

---

### 10. Query by Tracking System

Find all specs from a specific tracking system.

**Natural Language Examples**:
- "Show me all GitHub specs"
- "List all Jira specs"
- "Find specs linked to GitHub"
- "Which specs use Jira?"

**How It Works**:
1. For GitHub: Searches for identifiers matching `GITHUB-*`
2. For Jira: Searches for URLs containing Jira domains or identifiers with project prefixes
3. Returns all specs from that tracking system

**Example Response (GitHub)**:
```
Found 5 GitHub specs:

1. GITHUB-1+user-login
   Status: completed
   URL: https://github.com/owner/repo/issues/1

2. GITHUB-2+password-reset
   Status: in-progress
   URL: https://github.com/owner/repo/issues/2

3. GITHUB-5+oauth-integration
   Status: in-progress
   URL: https://github.com/owner/repo/issues/5

4. GITHUB-10+api-refactor
   Status: planned
   URL: https://github.com/owner/repo/issues/10

5. GITHUB-15+mobile-app
   Status: in-progress
   URL: https://github.com/owner/repo/issues/15
```

**Example Response (Jira)**:
```
Found 8 Jira specs across 2 projects:

PROJECT specs (5):
- PROJECT-1+user-authentication (in-progress)
- PROJECT-2+payment-gateway (completed)
- PROJECT-5+api-integration (in-progress)
- PROJECT-8+dashboard-redesign (planned)
- PROJECT-10+mobile-app (in-progress)

FEAT specs (3):
- FEAT-1+new-feature (planned)
- FEAT-5+enhancement (in-progress)
- FEAT-10+optimization (completed)
```
