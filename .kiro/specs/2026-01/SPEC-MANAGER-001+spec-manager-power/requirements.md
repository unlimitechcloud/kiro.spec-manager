# Requirements Document

## Introduction

The Spec Manager Power is a Knowledge Base Power that standardizes the creation and organization of specification documents within Kiro. It enforces naming conventions, directory structures, and metadata tracking to ensure consistency across all specs and maintain traceability with external project management systems like Jira.

## Glossary

- **Spec**: A specification document following Kiro's spec-driven development methodology (requirements.md, design.md, tasks.md)
- **Spec_Identifier**: A unique uppercase identifier for the spec (e.g., PROYECTO-100, JIRA-KEY-123)
- **Spec_Name**: A short, normalized kebab-case name describing the spec's purpose (e.g., feature-auth, user-management)
- **Spec_Manager**: The system responsible for creating and organizing specs
- **Work_Directory**: A subdirectory (.work/) within each spec for temporary files, helpers, tests, and reports
- **Metadata_File**: A JSON file (metadata.json) containing spec tracking information

## Requirements

### Requirement 1: Spec Identifier Collection

**User Story:** As a developer, I want to provide a unique identifier for my spec, so that I can maintain traceability with external systems like Jira.

#### Acceptance Criteria

1. WHEN creating a new spec, THE Spec_Manager SHALL prompt the user for a spec identifier
2. WHEN the user provides an identifier, THE Spec_Manager SHALL convert it to uppercase format
3. THE Spec_Manager SHALL use the uppercase identifier as the first part of the spec directory name
4. WHEN the identifier contains lowercase letters, THE Spec_Manager SHALL preserve the structure but convert to uppercase (e.g., "proyecto-100" becomes "PROYECTO-100")
5. WHEN the user does not provide an identifier, THE Spec_Manager SHALL search for the most recent spec
6. WHEN a recent spec is found, THE Spec_Manager SHALL extract the identifier pattern
7. WHEN the identifier ends with a number, THE Spec_Manager SHALL increment it by 1
8. WHEN the identifier has zero-padding (e.g., 001), THE Spec_Manager SHALL preserve the padding width in the incremented value
9. WHEN the identifier has no zero-padding (e.g., 1), THE Spec_Manager SHALL increment without adding padding
10. THE Spec_Manager SHALL present the suggested next identifier to the user for confirmation
11. WHEN the user confirms the suggested identifier, THE Spec_Manager SHALL use it
12. WHEN the user provides a different identifier, THE Spec_Manager SHALL use the user-provided value

### Requirement 2: Spec Name Generation and Confirmation

**User Story:** As a developer, I want to confirm or customize the natural name of my spec, so that the spec directory has a clear, concise, and meaningful name.

#### Acceptance Criteria

1. WHEN the user provides a spec description, THE Spec_Manager SHALL generate a suggested short name
2. THE Spec_Manager SHALL present the suggested name to the user for confirmation
3. WHEN the user confirms the suggested name, THE Spec_Manager SHALL use it as-is
4. WHEN the user provides a different name, THE Spec_Manager SHALL normalize it by converting to lowercase and kebab-case
5. WHEN the user-provided name is excessively long (>50 characters), THE Spec_Manager SHALL shorten it while preserving meaning
6. THE Spec_Manager SHALL ensure the final name is concise and clearly communicates the spec's purpose

### Requirement 3: Directory Naming Convention

**User Story:** As a developer, I want specs to follow a consistent naming convention, so that I can easily identify and locate specs.

#### Acceptance Criteria

1. THE Spec_Manager SHALL create spec directories using the format: `{IDENTIFIER}+{spec-name}`
2. THE Spec_Manager SHALL use the plus sign (+) as the separator between identifier and name
3. WHEN creating the directory name, THE Spec_Manager SHALL combine the uppercase identifier with the normalized spec name
4. THE Spec_Manager SHALL ensure the directory name is filesystem-safe (no special characters except hyphen and plus)

### Requirement 4: Date-Based Organization

**User Story:** As a developer, I want specs organized by creation date, so that I can manage large numbers of specs without cluttering a single directory.

#### Acceptance Criteria

1. THE Spec_Manager SHALL organize specs into year-month subdirectories
2. THE Spec_Manager SHALL use the format YYYY-MM for date directories (e.g., 2026-01)
3. WHEN creating a new spec, THE Spec_Manager SHALL use the current year and month
4. THE Spec_Manager SHALL create the date directory if it does not exist
5. THE Spec_Manager SHALL place the spec directory inside the appropriate date directory

### Requirement 5: Standard Spec File Structure

**User Story:** As a developer, I want each spec to have a consistent file structure, so that I know where to find requirements, design, and tasks.

#### Acceptance Criteria

1. THE Spec_Manager SHALL create three core files: requirements.md, design.md, and tasks.md
2. THE Spec_Manager SHALL place all three files in the spec directory root
3. THE Spec_Manager SHALL create a .work/ subdirectory for temporary files
4. THE Spec_Manager SHALL create subdirectories within .work/: helpers/, tests/, and reports/
5. THE Spec_Manager SHALL create a metadata.json file in the spec directory root

### Requirement 6: Metadata Tracking

**User Story:** As a developer, I want spec metadata automatically tracked, so that I can maintain traceability and status information.

#### Acceptance Criteria

1. THE Spec_Manager SHALL create a metadata.json file for each spec
2. THE Spec_Manager SHALL include the spec identifier in the metadata
3. THE Spec_Manager SHALL include the spec name in the metadata
4. THE Spec_Manager SHALL include the creation date in ISO format
5. THE Spec_Manager SHALL include a status field (default: "draft")
6. THE Spec_Manager SHALL prompt the user for an optional external system URL
7. WHEN the user provides a URL, THE Spec_Manager SHALL include it in the metadata
8. THE Spec_Manager SHALL auto-detect the assignee from git config user.name
9. WHEN git config is available, THE Spec_Manager SHALL present the detected assignee to the user for confirmation
10. WHEN the user confirms the assignee, THE Spec_Manager SHALL include it in the metadata
11. WHEN the user provides a different assignee, THE Spec_Manager SHALL use the user-provided value
12. WHEN git config is not available, THE Spec_Manager SHALL prompt the user for an optional assignee
13. WHEN the user provides only an identifier for the URL, THE Spec_Manager SHALL search for the most recent spec with a URL
14. WHEN a URL pattern is found, THE Spec_Manager SHALL reconstruct the URL using the new identifier
15. THE Spec_Manager SHALL present the reconstructed URL to the user for confirmation
16. WHEN searching for URL patterns, THE Spec_Manager SHALL prioritize the most recent month first
17. WHEN no specs exist in the current month, THE Spec_Manager SHALL search backwards through previous months

### Requirement 7: Work Directory Management

**User Story:** As a developer, I want a dedicated location for temporary files and reports, so that my spec directory remains organized.

#### Acceptance Criteria

1. THE Spec_Manager SHALL create a .work/ directory within each spec
2. THE Spec_Manager SHALL create a helpers/ subdirectory for utility scripts
3. THE Spec_Manager SHALL create a tests/ subdirectory for test files
4. THE Spec_Manager SHALL create a reports/ subdirectory for execution reports
5. THE Spec_Manager SHALL document that all temporary files should be placed in .work/

### Requirement 8: Path Resolution

**User Story:** As a developer, I want the spec manager to provide correct file paths, so that I can reference spec files in Kiro tools.

#### Acceptance Criteria

1. THE Spec_Manager SHALL generate the full relative path to the spec directory
2. THE Spec_Manager SHALL provide paths in the format: `.kiro/specs/{YYYY-MM}/{IDENTIFIER}+{name}/`
3. WHEN providing task file paths, THE Spec_Manager SHALL include the full path to tasks.md
4. THE Spec_Manager SHALL ensure all paths are relative to the workspace root

### Requirement 9: Documentation and Guidance

**User Story:** As a developer, I want clear documentation on spec naming conventions, so that I can create specs consistently.

#### Acceptance Criteria

1. THE Spec_Manager SHALL provide documentation on the identifier format
2. THE Spec_Manager SHALL provide examples of good spec names
3. THE Spec_Manager SHALL provide examples of names to avoid (too long, too vague)
4. THE Spec_Manager SHALL document the directory structure and file organization
5. THE Spec_Manager SHALL provide guidance on when to use the .work/ directory

### Requirement 10: Integration with Kiro Spec Workflow

**User Story:** As a developer, I want the spec manager to work seamlessly with Kiro's spec-driven development workflow, so that I can use all Kiro spec features.

#### Acceptance Criteria

1. THE Spec_Manager SHALL create specs that are compatible with Kiro's taskStatus tool
2. THE Spec_Manager SHALL create specs that are compatible with Kiro's updatePBTStatus tool
3. THE Spec_Manager SHALL ensure requirements.md follows EARS patterns
4. THE Spec_Manager SHALL ensure design.md includes correctness properties
5. THE Spec_Manager SHALL ensure tasks.md follows Kiro's task format with checkboxes

### Requirement 11: Metadata Query Capabilities

**User Story:** As a developer, I want to query spec metadata through Kiro, so that I can find and access spec information easily.

#### Acceptance Criteria

1. WHEN a user asks for a spec's URL, THE Spec_Manager SHALL read the metadata.json file and provide the URL field
2. WHEN a user asks for metadata information, THE Spec_Manager SHALL read and present the metadata.json contents
3. WHEN a user searches by tag, THE Spec_Manager SHALL find all specs with matching tags in their metadata
4. WHEN a user searches by status, THE Spec_Manager SHALL find all specs with matching status in their metadata
5. WHEN a user searches by identifier, THE Spec_Manager SHALL locate the spec directory and provide its path
6. THE Spec_Manager SHALL provide guidance on how to query metadata through natural language
7. THE Spec_Manager SHALL document metadata query patterns and examples
8. WHEN metadata.json is missing or invalid, THE Spec_Manager SHALL provide a clear error message
