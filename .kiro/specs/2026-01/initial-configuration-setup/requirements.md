# Requirements Document: Initial Configuration Setup

## Introduction

This feature ensures that the Spec Manager Power has a valid configuration before performing any operations. When a user first uses the power or when no configuration file exists, the system SHALL guide them through an interactive setup process to establish their tracking system preferences, project prefix, and other essential settings.

## Glossary

- **Spec_Manager**: The Kiro Power that manages specification documents and integrates with external tracking systems
- **Configuration_File**: The JSON file located at `.kiro/spec-manager.json` that stores tracking system preferences
- **Tracking_System**: An external issue tracking system (GitHub, Jira, or none)
- **Project_Prefix**: A string prefix prepended to numeric identifiers (e.g., "GITHUB-", "PROJECT-")
- **Interactive_Setup**: A guided process that prompts the user for configuration values
- **Validation**: The process of checking that configuration values meet schema requirements

## Requirements

### Requirement 1: Configuration Detection

**User Story:** As a user, I want the system to automatically detect if configuration exists, so that I don't have to manually check before using the power.

#### Acceptance Criteria

1. WHEN the Spec_Manager power is invoked, THE System SHALL check for the existence of `.kiro/spec-manager.json`
2. WHEN the Configuration_File exists and is valid, THE System SHALL load the configuration and proceed with the requested operation
3. WHEN the Configuration_File does not exist, THE System SHALL initiate the Interactive_Setup process
4. WHEN the Configuration_File exists but is invalid, THE System SHALL log a warning and initiate the Interactive_Setup process

### Requirement 2: Interactive Configuration Setup

**User Story:** As a user, I want to be guided through configuration setup, so that I can quickly establish my tracking system preferences without reading documentation.

#### Acceptance Criteria

1. WHEN Interactive_Setup begins, THE System SHALL prompt the user to select a Tracking_System from the options: GitHub, Jira, or None
2. WHEN the user selects GitHub, THE System SHALL prompt for the GitHub repository URL
3. WHEN the user selects Jira, THE System SHALL prompt for the Jira base URL and project key
4. WHEN the user selects None, THE System SHALL skip tracking system-specific prompts
5. WHEN tracking system information is collected, THE System SHALL prompt the user whether to enable prefix-aware input mode
6. WHEN prefix-aware input is enabled, THE System SHALL prompt for the Project_Prefix value
7. WHEN the user selects GitHub, THE System SHALL suggest "GITHUB-" as the default Project_Prefix
8. WHEN the user selects Jira with project key "PROJECT", THE System SHALL suggest "PROJECT-" as the default Project_Prefix
9. WHEN the user selects None, THE System SHALL suggest a custom prefix or allow skipping prefix configuration

### Requirement 3: Input Validation

**User Story:** As a user, I want my configuration inputs to be validated immediately, so that I don't create an invalid configuration file.

#### Acceptance Criteria

1. WHEN the user provides a GitHub repository URL, THE System SHALL validate it matches the pattern `https://{domain}/{owner}/{repo}`
2. WHEN the user provides a Jira base URL, THE System SHALL validate it matches the pattern `https://{domain}`
3. WHEN the user provides a Jira project key, THE System SHALL validate it contains only uppercase letters and numbers
4. WHEN the user provides a Project_Prefix, THE System SHALL validate it ends with a separator character (`-` or `_`)
5. WHEN the user provides a Project_Prefix, THE System SHALL validate it contains only alphanumeric characters and separators
6. WHEN validation fails, THE System SHALL display a clear error message and re-prompt for the invalid field
7. WHEN validation succeeds, THE System SHALL proceed to the next configuration step

### Requirement 4: Configuration File Creation

**User Story:** As a user, I want my configuration to be saved automatically, so that I don't have to repeat the setup process.

#### Acceptance Criteria

1. WHEN all configuration inputs are collected and validated, THE System SHALL create the `.kiro/spec-manager.json` file
2. WHEN creating the Configuration_File, THE System SHALL include the `trackingSystem` field
3. WHEN creating the Configuration_File, THE System SHALL include the `lastUpdated` field with the current ISO 8601 timestamp
4. WHEN the Tracking_System is GitHub, THE System SHALL include the `githubRepository` field
5. WHEN the Tracking_System is Jira, THE System SHALL include the `jiraBaseUrl` and `jiraProject` fields
6. WHEN prefix-aware input is enabled, THE System SHALL include the `usePrefix` field set to `true` and the `projectPrefix` field
7. WHEN prefix-aware input is disabled, THE System SHALL either omit the `usePrefix` field or set it to `false`
8. WHEN the Configuration_File is created, THE System SHALL display a confirmation message to the user

### Requirement 5: Configuration Summary

**User Story:** As a user, I want to review my configuration before it's saved, so that I can verify all settings are correct.

#### Acceptance Criteria

1. WHEN all configuration inputs are collected, THE System SHALL display a summary of the configuration
2. WHEN displaying the summary, THE System SHALL show the selected Tracking_System
3. WHEN displaying the summary, THE System SHALL show all system-specific fields (repository URL, Jira base URL, project key)
4. WHEN displaying the summary, THE System SHALL show the prefix configuration status and value
5. WHEN displaying the summary, THE System SHALL prompt the user to confirm or edit the configuration
6. WHEN the user confirms, THE System SHALL create the Configuration_File
7. WHEN the user requests edits, THE System SHALL allow them to modify specific fields without restarting the entire setup

### Requirement 6: Default Value Suggestions

**User Story:** As a user, I want sensible default values suggested during setup, so that I can quickly complete configuration with minimal typing.

#### Acceptance Criteria

1. WHEN prompting for Project_Prefix with GitHub selected, THE System SHALL suggest "GITHUB-" as the default
2. WHEN prompting for Project_Prefix with Jira selected, THE System SHALL suggest "{PROJECT_KEY}-" as the default
3. WHEN prompting for prefix-aware input mode, THE System SHALL suggest enabling it by default for GitHub and Jira
4. WHEN prompting for prefix-aware input mode with no tracking system, THE System SHALL suggest disabling it by default
5. WHEN the user presses Enter without typing, THE System SHALL accept the suggested default value

### Requirement 7: Error Recovery

**User Story:** As a developer, I want the system to handle errors gracefully during setup, so that users don't encounter crashes or confusing states.

#### Acceptance Criteria

1. WHEN the `.kiro/` directory does not exist, THE System SHALL create it before creating the Configuration_File
2. WHEN file system permissions prevent writing the Configuration_File, THE System SHALL display a clear error message
3. WHEN the user cancels the Interactive_Setup process, THE System SHALL exit gracefully without creating a partial configuration
4. WHEN an unexpected error occurs during setup, THE System SHALL log the error and display a user-friendly message

### Requirement 8: Configuration Persistence

**User Story:** As a user, I want my configuration to persist across sessions, so that I only need to configure the system once.

#### Acceptance Criteria

1. WHEN the Configuration_File is created, THE System SHALL write it to disk immediately
2. WHEN subsequent operations are performed, THE System SHALL read the existing Configuration_File
3. WHEN the Configuration_File is valid, THE System SHALL NOT prompt for configuration again
4. WHEN the user wants to reconfigure, THE System SHALL provide a way to trigger Interactive_Setup manually

### Requirement 9: Example File Cleanup

**User Story:** As a developer, I want to remove unnecessary example files from the project, so that the Power only includes essential files.

#### Acceptance Criteria

1. WHEN evaluating project files, THE System SHALL identify example configuration files that are not copied to the distribution
2. WHEN example files are not referenced in the build process, THE System SHALL remove them from the project root
3. WHEN example files are needed for documentation, THE System SHALL keep only those that provide unique value
4. WHEN the build process runs, THE System SHALL only include POWER.md, steering files, and schema documentation in the distribution

### Requirement 10: Documentation Optimization

**User Story:** As a developer, I want documentation to be concise and context-optimized, so that Kiro can efficiently process it without information overload.

#### Acceptance Criteria

1. WHEN creating documentation, THE System SHALL provide essential information without redundancy
2. WHEN documenting workflows, THE System SHALL use clear, actionable language optimized for AI interpretation
3. WHEN providing examples, THE System SHALL include only necessary examples that demonstrate key concepts
4. WHEN writing steering files, THE System SHALL focus on decision-making guidance rather than exhaustive explanations
5. WHEN documenting validation rules, THE System SHALL use concise patterns and examples rather than verbose descriptions
