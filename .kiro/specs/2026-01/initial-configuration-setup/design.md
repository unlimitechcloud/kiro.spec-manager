# Design Document: Initial Configuration Setup

## Overview

The Initial Configuration Setup feature provides an interactive, user-friendly process for establishing the Spec Manager's configuration on first use. The system detects whether a valid configuration exists and, if not, guides users through a step-by-step setup that collects tracking system preferences, validates inputs, and creates a properly formatted configuration file.

This design emphasizes user experience through clear prompts, sensible defaults, immediate validation, and a confirmation step before persisting configuration.

## Architecture

The configuration setup system follows a linear workflow with validation checkpoints:

```
┌─────────────────────────────────────────────────────────────┐
│                    Power Invocation                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Configuration Detection                         │
│  • Check for .kiro/spec-manager.json                        │
│  • Validate existing configuration                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ├─── Valid Config ──────► Continue Operation
                       │
                       └─── No/Invalid Config
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Interactive Setup Wizard                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 1. Select Tracking System (GitHub/Jira/None)         │  │
│  └───────────────────┬───────────────────────────────────┘  │
│                      │                                       │
│                      ├─── GitHub ──► Collect Repository URL │
│                      ├─── Jira ────► Collect Base URL + Key │
│                      └─── None ────► Skip                   │
│                      │                                       │
│  ┌───────────────────▼───────────────────────────────────┐  │
│  │ 2. Configure Prefix Mode                              │  │
│  │    • Enable/Disable prefix-aware input                │  │
│  │    • Collect prefix value (if enabled)                │  │
│  └───────────────────┬───────────────────────────────────┘  │
│                      │                                       │
│  ┌───────────────────▼───────────────────────────────────┐  │
│  │ 3. Validation Layer                                   │  │
│  │    • Validate all inputs against schema               │  │
│  │    • Re-prompt on validation errors                   │  │
│  └───────────────────┬───────────────────────────────────┘  │
│                      │                                       │
│  ┌───────────────────▼───────────────────────────────────┐  │
│  │ 4. Configuration Summary                              │  │
│  │    • Display all collected values                     │  │
│  │    • Confirm or edit                                  │  │
│  └───────────────────┬───────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Configuration Persistence                       │
│  • Create .kiro/ directory if needed                        │
│  • Write spec-manager.json                                  │
│  • Set lastUpdated timestamp                                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
                  Continue Operation
```

## Components and Interfaces

### 1. ConfigurationDetector

**Responsibility:** Detect and validate existing configuration files.

**Interface:**
```typescript
interface ConfigurationDetector {
  /**
   * Check if configuration file exists and is valid
   * @returns ConfigurationStatus indicating existence and validity
   */
  detectConfiguration(): ConfigurationStatus;
  
  /**
   * Load and parse existing configuration
   * @returns Parsed configuration object or null if invalid
   */
  loadConfiguration(): SpecManagerConfig | null;
  
  /**
   * Validate configuration against schema
   * @param config Configuration object to validate
   * @returns Validation result with errors if any
   */
  validateConfiguration(config: SpecManagerConfig): ValidationResult;
}

interface ConfigurationStatus {
  exists: boolean;
  valid: boolean;
  errors?: string[];
}
```

**Behavior:**
- Checks for `.kiro/spec-manager.json` in the workspace
- Attempts to parse JSON if file exists
- Validates required fields and field formats
- Returns detailed status for decision-making

### 2. InteractiveSetupWizard

**Responsibility:** Guide users through configuration setup with prompts and validation.

**Interface:**
```typescript
interface InteractiveSetupWizard {
  /**
   * Run the complete setup wizard
   * @returns Completed configuration object
   */
  runSetup(): Promise<SpecManagerConfig>;
  
  /**
   * Prompt for tracking system selection
   * @returns Selected tracking system
   */
  promptTrackingSystem(): Promise<TrackingSystem>;
  
  /**
   * Prompt for GitHub-specific configuration
   * @returns GitHub repository URL
   */
  promptGitHubConfig(): Promise<string>;
  
  /**
   * Prompt for Jira-specific configuration
   * @returns Jira base URL and project key
   */
  promptJiraConfig(): Promise<{ baseUrl: string; projectKey: string }>;
  
  /**
   * Prompt for prefix configuration
   * @param trackingSystem The selected tracking system
   * @returns Prefix configuration
   */
  promptPrefixConfig(trackingSystem: TrackingSystem): Promise<PrefixConfig>;
  
  /**
   * Display configuration summary and get confirmation
   * @param config The collected configuration
   * @returns true if confirmed, false if user wants to edit
   */
  confirmConfiguration(config: SpecManagerConfig): Promise<boolean>;
}

type TrackingSystem = "github" | "jira" | "none";

interface PrefixConfig {
  usePrefix: boolean;
  projectPrefix?: string;
}
```

**Behavior:**
- Presents clear, sequential prompts
- Provides default values based on context
- Validates each input immediately
- Allows navigation back to edit previous values
- Shows summary before final confirmation

### 3. InputValidator

**Responsibility:** Validate user inputs against schema rules.

**Interface:**
```typescript
interface InputValidator {
  /**
   * Validate GitHub repository URL
   * @param url The URL to validate
   * @returns Validation result
   */
  validateGitHubUrl(url: string): ValidationResult;
  
  /**
   * Validate Jira base URL
   * @param url The URL to validate
   * @returns Validation result
   */
  validateJiraBaseUrl(url: string): ValidationResult;
  
  /**
   * Validate Jira project key
   * @param key The project key to validate
   * @returns Validation result
   */
  validateJiraProjectKey(key: string): ValidationResult;
  
  /**
   * Validate project prefix format
   * @param prefix The prefix to validate
   * @returns Validation result
   */
  validateProjectPrefix(prefix: string): ValidationResult;
}

interface ValidationResult {
  valid: boolean;
  errors?: string[];
}
```

**Validation Rules:**

**GitHub URL:**
- Must start with `https://`
- Must match pattern: `https://{domain}/{owner}/{repo}`
- Must NOT include `/issues/` or issue numbers
- Examples:
  - ✅ `https://github.com/owner/repo`
  - ❌ `https://github.com/owner/repo/issues/1`

**Jira Base URL:**
- Must start with `https://`
- Must match pattern: `https://{domain}`
- Must NOT include `/browse/` or issue keys
- Examples:
  - ✅ `https://company.atlassian.net`
  - ❌ `https://company.atlassian.net/browse/PROJECT-1`

**Jira Project Key:**
- Must contain only uppercase letters and numbers
- Must start with a letter
- Pattern: `^[A-Z][A-Z0-9]*$`
- Examples:
  - ✅ `PROJECT`, `FEAT`, `BUG123`
  - ❌ `project`, `PROJECT-`, `123`

**Project Prefix:**
- Must end with `-` or `_`
- Must contain only alphanumeric characters and separators
- Should be uppercase (warning if lowercase)
- Pattern: `^[A-Za-z0-9]+[-_]$`
- Examples:
  - ✅ `GITHUB-`, `PROJECT-`, `FEAT_`
  - ❌ `GITHUB`, `PROJECT_-`, `PRO@ECT-`

### 4. ConfigurationPersister

**Responsibility:** Write configuration to disk with proper formatting.

**Interface:**
```typescript
interface ConfigurationPersister {
  /**
   * Persist configuration to disk
   * @param config The configuration to save
   * @returns Success status
   */
  persistConfiguration(config: SpecManagerConfig): Promise<PersistResult>;
  
  /**
   * Ensure .kiro directory exists
   * @returns Success status
   */
  ensureKiroDirectory(): Promise<boolean>;
  
  /**
   * Generate ISO 8601 timestamp for lastUpdated
   * @returns Current timestamp string
   */
  generateTimestamp(): string;
}

interface PersistResult {
  success: boolean;
  error?: string;
  filePath?: string;
}
```

**Behavior:**
- Creates `.kiro/` directory if it doesn't exist
- Writes JSON with proper indentation (2 spaces)
- Sets `lastUpdated` field automatically
- Handles file system errors gracefully
- Returns detailed result for user feedback

### 5. DefaultValueProvider

**Responsibility:** Provide sensible default values based on context.

**Interface:**
```typescript
interface DefaultValueProvider {
  /**
   * Get default prefix for tracking system
   * @param trackingSystem The selected tracking system
   * @param jiraProjectKey Optional Jira project key
   * @returns Suggested prefix
   */
  getDefaultPrefix(
    trackingSystem: TrackingSystem,
    jiraProjectKey?: string
  ): string;
  
  /**
   * Get default usePrefix value
   * @param trackingSystem The selected tracking system
   * @returns Whether to enable prefix mode by default
   */
  getDefaultUsePrefixValue(trackingSystem: TrackingSystem): boolean;
}
```

**Default Values:**

| Tracking System | Default Prefix | Default usePrefix |
|----------------|----------------|-------------------|
| GitHub         | `GITHUB-`      | `true`            |
| Jira           | `{PROJECT}-`   | `true`            |
| None           | `FEAT-`        | `false`           |

## Data Models

### SpecManagerConfig

The complete configuration object that gets persisted to disk.

```typescript
interface SpecManagerConfig {
  // Required fields
  trackingSystem: "github" | "jira" | "none";
  lastUpdated: string; // ISO 8601 timestamp
  
  // GitHub-specific fields
  githubRepository?: string;
  
  // Jira-specific fields
  jiraBaseUrl?: string;
  jiraProject?: string;
  
  // Prefix configuration
  usePrefix?: boolean;
  projectPrefix?: string;
}
```

**Field Constraints:**

- `trackingSystem`: Required, must be one of the three values
- `lastUpdated`: Required, ISO 8601 format
- `githubRepository`: Required when `trackingSystem` is "github"
- `jiraBaseUrl`: Required when `trackingSystem` is "jira"
- `jiraProject`: Required when `trackingSystem` is "jira"
- `usePrefix`: Optional, defaults to `false` if omitted
- `projectPrefix`: Required when `usePrefix` is `true`

### SetupState

Internal state tracking during the setup wizard.

```typescript
interface SetupState {
  trackingSystem?: TrackingSystem;
  githubRepository?: string;
  jiraBaseUrl?: string;
  jiraProjectKey?: string;
  usePrefix?: boolean;
  projectPrefix?: string;
  currentStep: SetupStep;
}

enum SetupStep {
  TRACKING_SYSTEM = "tracking_system",
  SYSTEM_SPECIFIC = "system_specific",
  PREFIX_CONFIG = "prefix_config",
  SUMMARY = "summary",
  COMPLETE = "complete"
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Configuration file creation completeness

*For any* completed setup wizard execution, the created configuration file SHALL contain all required fields for the selected tracking system.

**Validates: Requirements 4.2, 4.3, 4.4, 4.5, 4.6, 4.7**

### Property 2: URL validation correctness

*For any* GitHub repository URL input, if it contains `/issues/` or an issue number, the validation SHALL reject it.

**Validates: Requirements 3.1**

### Property 3: Jira base URL validation correctness

*For any* Jira base URL input, if it contains `/browse/` or an issue key, the validation SHALL reject it.

**Validates: Requirements 3.2**

### Property 4: Project key format validation

*For any* Jira project key input, if it contains lowercase letters or non-alphanumeric characters, the validation SHALL reject it.

**Validates: Requirements 3.3**

### Property 5: Prefix format validation

*For any* project prefix input, if it does not end with `-` or `_`, the validation SHALL reject it.

**Validates: Requirements 3.4, 3.5**

### Property 6: Default prefix generation consistency

*For any* tracking system selection, the suggested default prefix SHALL match the expected format for that system (GITHUB- for GitHub, {PROJECT}- for Jira).

**Validates: Requirements 6.1, 6.2**

### Property 7: Configuration persistence atomicity

*For any* confirmed configuration, either the complete configuration file is written successfully, or no file is created (no partial writes).

**Validates: Requirements 4.1, 4.8**

### Property 8: Validation error re-prompting

*For any* invalid input, the system SHALL display an error message and re-prompt for that specific field without losing other collected values.

**Validates: Requirements 3.6**

### Property 9: Configuration detection accuracy

*For any* existing valid configuration file, the detection process SHALL correctly identify it as valid and skip the setup wizard.

**Validates: Requirements 1.2**

### Property 10: Invalid configuration handling

*For any* existing invalid configuration file, the detection process SHALL identify it as invalid and initiate the setup wizard.

**Validates: Requirements 1.4**

### Property 11: Example file necessity

*For any* file in the project root, if it is not included in the build distribution and not referenced in documentation, it SHALL be identified for removal.

**Validates: Requirements 9.1, 9.2, 9.3**

### Property 12: Documentation conciseness

*For any* documentation section, if it contains redundant information that can be inferred from other sections, it SHALL be condensed without losing precision.

**Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5**

## Error Handling

### File System Errors

**Scenario:** `.kiro/` directory cannot be created due to permissions

**Handling:**
1. Catch the file system error
2. Display clear message: "Cannot create .kiro/ directory. Please check file permissions."
3. Provide path to the directory that failed
4. Exit setup gracefully without creating partial configuration

**Scenario:** Configuration file cannot be written

**Handling:**
1. Catch the write error
2. Display clear message: "Cannot write configuration file. Please check file permissions."
3. Provide full path to the file
4. Suggest manual creation with provided JSON
5. Exit setup gracefully

### Validation Errors

**Scenario:** User provides invalid URL format

**Handling:**
1. Display specific error: "Invalid URL format. Expected: https://domain/owner/repo"
2. Show the invalid input for reference
3. Re-prompt for the same field
4. Preserve all other collected values

**Scenario:** User provides invalid project key

**Handling:**
1. Display specific error: "Project key must be uppercase letters and numbers only"
2. Show example: "Valid examples: PROJECT, FEAT, BUG123"
3. Re-prompt for the project key
4. Preserve all other collected values

### User Cancellation

**Scenario:** User cancels during setup (Ctrl+C or explicit cancel)

**Handling:**
1. Catch cancellation signal
2. Display message: "Setup cancelled. No configuration was saved."
3. Clean up any temporary state
4. Exit gracefully without creating files

### JSON Parsing Errors

**Scenario:** Existing configuration file contains invalid JSON

**Handling:**
1. Log warning: "Existing configuration file is invalid JSON"
2. Display message to user: "Found invalid configuration. Starting fresh setup."
3. Optionally backup the invalid file as `.kiro/spec-manager.json.backup`
4. Proceed with setup wizard

### Network/External Validation

**Note:** This design does NOT include network validation of URLs (checking if GitHub repo exists, etc.). Validation is format-only. Future enhancements could add optional network validation.

## Testing Strategy

### Unit Tests

Unit tests will verify specific examples and edge cases:

**ConfigurationDetector:**
- Test detection when file exists and is valid
- Test detection when file doesn't exist
- Test detection when file exists but is invalid JSON
- Test detection when file has missing required fields

**InputValidator:**
- Test valid GitHub URLs (various domains)
- Test invalid GitHub URLs (with /issues/, without https, etc.)
- Test valid Jira base URLs
- Test invalid Jira base URLs (with /browse/, etc.)
- Test valid project keys (uppercase, alphanumeric)
- Test invalid project keys (lowercase, special chars, starting with number)
- Test valid prefixes (ending with - or _)
- Test invalid prefixes (no separator, multiple separators, special chars)

**DefaultValueProvider:**
- Test default prefix for GitHub returns "GITHUB-"
- Test default prefix for Jira with project "PROJECT" returns "PROJECT-"
- Test default prefix for None returns "FEAT-"
- Test default usePrefix for GitHub returns true
- Test default usePrefix for Jira returns true
- Test default usePrefix for None returns false

**ConfigurationPersister:**
- Test successful file write
- Test directory creation when .kiro/ doesn't exist
- Test timestamp generation format
- Test JSON formatting (indentation, field order)

### Property-Based Tests

Property-based tests will verify universal properties across many generated inputs. Each test should run a minimum of 100 iterations.

**Property Test 1: Configuration file creation completeness**
- Generate random tracking system selections
- Generate random valid inputs for each system
- Run setup wizard with generated inputs
- Verify created config contains all required fields
- **Feature: initial-configuration-setup, Property 1: Configuration file creation completeness**

**Property Test 2: URL validation correctness**
- Generate random GitHub URLs (some valid, some with /issues/)
- Validate each URL
- Verify that URLs with /issues/ are rejected
- Verify that valid URLs are accepted
- **Feature: initial-configuration-setup, Property 2: URL validation correctness**

**Property Test 3: Jira base URL validation correctness**
- Generate random Jira URLs (some valid, some with /browse/)
- Validate each URL
- Verify that URLs with /browse/ are rejected
- Verify that valid URLs are accepted
- **Feature: initial-configuration-setup, Property 3: Jira base URL validation correctness**

**Property Test 4: Project key format validation**
- Generate random strings (some valid keys, some with lowercase/special chars)
- Validate each string as a project key
- Verify that invalid formats are rejected
- Verify that valid formats are accepted
- **Feature: initial-configuration-setup, Property 4: Project key format validation**

**Property Test 5: Prefix format validation**
- Generate random prefix strings (some ending with separators, some not)
- Validate each prefix
- Verify that prefixes without separators are rejected
- Verify that valid prefixes are accepted
- **Feature: initial-configuration-setup, Property 5: Prefix format validation**

**Property Test 6: Default prefix generation consistency**
- Generate random tracking system selections
- Generate random Jira project keys
- Get default prefix for each
- Verify GitHub always returns "GITHUB-"
- Verify Jira returns "{PROJECT_KEY}-"
- Verify None returns "FEAT-"
- **Feature: initial-configuration-setup, Property 6: Default prefix generation consistency**

**Property Test 7: Configuration persistence atomicity**
- Generate random valid configurations
- Attempt to persist each configuration
- Verify either complete file exists or no file exists
- Verify no partial configurations are written
- **Feature: initial-configuration-setup, Property 7: Configuration persistence atomicity**

**Property Test 8: Validation error re-prompting**
- Generate random invalid inputs
- Simulate setup wizard with invalid input followed by valid input
- Verify that other collected values are preserved
- Verify that only the invalid field is re-prompted
- **Feature: initial-configuration-setup, Property 8: Validation error re-prompting**

**Property Test 9: Configuration detection accuracy**
- Generate random valid configuration files
- Run detection on each
- Verify all are correctly identified as valid
- Verify setup wizard is not triggered
- **Feature: initial-configuration-setup, Property 9: Configuration detection accuracy**

**Property Test 10: Invalid configuration handling**
- Generate random invalid configuration files (missing fields, wrong types, etc.)
- Run detection on each
- Verify all are correctly identified as invalid
- Verify setup wizard is triggered
- **Feature: initial-configuration-setup, Property 10: Invalid configuration handling**

### Integration Tests

Integration tests will verify end-to-end workflows:

**Complete Setup Flow:**
- Start with no configuration file
- Run setup wizard with GitHub selection
- Provide valid repository URL
- Enable prefix mode with default prefix
- Confirm configuration
- Verify file is created with correct content
- Verify subsequent operations use the configuration

**Edit and Retry Flow:**
- Start setup wizard
- Provide invalid URL
- Verify error message and re-prompt
- Provide valid URL
- Complete setup
- Verify configuration is correct

**Cancellation Flow:**
- Start setup wizard
- Cancel during prompts
- Verify no configuration file is created
- Verify no partial state remains

### Testing Framework

This design will use **fast-check** (for TypeScript/JavaScript) as the property-based testing library. Each property test will be configured to run 100 iterations minimum to ensure comprehensive coverage.

Example test structure:
```typescript
import fc from 'fast-check';

test('Property 2: URL validation correctness', () => {
  fc.assert(
    fc.property(
      fc.webUrl(), // Generate random URLs
      (url) => {
        const withIssues = url + '/issues/123';
        const result = validator.validateGitHubUrl(withIssues);
        expect(result.valid).toBe(false);
      }
    ),
    { numRuns: 100 }
  );
});
```
