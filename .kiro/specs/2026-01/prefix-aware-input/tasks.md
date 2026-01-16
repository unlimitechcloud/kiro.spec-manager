# Implementation Plan: Prefix-Aware Input

## Overview

Este plan implementa la funcionalidad de entrada consciente de prefijos para el Spec Manager Power. La implementación se enfoca en actualizar la documentación y las guías de steering para reflejar la nueva funcionalidad, ya que este es un Knowledge Base Power que proporciona workflows y documentación.

## Tasks

- [x] 1. Update spec-manager.json schema documentation
  - Update spec-manager-schema.md to include `usePrefix` and `projectPrefix` fields
  - Add validation rules for prefix format
  - Add examples showing prefix mode enabled and disabled
  - Document conditional requirement (projectPrefix required when usePrefix is true)
  - _Requirements: 1.1, 1.2, 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 2. Create prefix-aware input steering guide
  - [x] 2.1 Create steering/prefix-aware-input.md
    - Document what prefix mode is and why it's useful
    - Explain numeric input vs full identifier input
    - Provide examples of both input styles
    - Document how prefix mode integrates with GitHub and Jira
    - _Requirements: 5.1, 5.2, 5.3, 14.1, 14.2, 14.3_

  - [x] 2.2 Add workflow examples
    - Example: Creating spec with numeric input
    - Example: Creating spec with full identifier
    - Example: Correcting suggested identifier with just a number
    - Example: Handling prefix mismatch warnings
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.3, 3.5_

  - [x] 2.3 Document configuration management
    - How to enable prefix mode manually
    - How to disable prefix mode
    - How to change the configured prefix
    - How prefix mode is auto-enabled for GitHub/Jira
    - _Requirements: 1.7, 8.1, 8.2, 8.3, 8.4, 11.1, 11.2_

  - [x] 2.4 Add troubleshooting section
    - Handling prefix mismatch warnings
    - Dealing with invalid numeric input
    - Understanding backwards number warnings
    - Fixing invalid prefix format errors
    - _Requirements: 4.1, 4.2, 4.3, 12.1, 12.2, 12.3, 12.4_

- [x] 3. Update GitHub integration guide
  - [x] 3.1 Update steering/github-integration.md
    - Add section explaining prefix mode with GitHub
    - Document that "GITHUB-" prefix is auto-configured
    - Show examples of numeric input (typing "7" instead of "GITHUB-7")
    - Explain how URL reconstruction works with numeric input
    - _Requirements: 1.4, 11.1, 13.1, 13.2_

  - [x] 3.2 Add workflow examples with prefix mode
    - Example: Creating first GitHub spec (prefix mode auto-enabled)
    - Example: Creating subsequent specs with numeric input
    - Example: Auto-increment with numeric correction
    - _Requirements: 2.4, 3.3, 6.3, 13.5_

- [x] 4. Update Jira integration guide
  - [x] 4.1 Update steering/jira-integration.md
    - Add section explaining prefix mode with Jira
    - Document that project key is auto-configured as prefix
    - Show examples of numeric input with Jira
    - Explain how URL reconstruction works with numeric input
    - _Requirements: 1.5, 11.2, 13.1, 13.3_

  - [x] 4.2 Add workflow examples with prefix mode
    - Example: Creating first Jira spec (prefix mode auto-enabled)
    - Example: Creating subsequent specs with numeric input
    - Example: Working with multiple Jira projects
    - _Requirements: 2.4, 3.3, 6.3, 13.5_

- [x] 5. Update main documentation
  - [x] 5.1 Update POWER.md
    - Add "Prefix-Aware Input" to features list
    - Add brief description of the feature
    - Add example showing numeric input in Quick Start section
    - _Requirements: 14.1_

  - [x] 5.2 Update README.md
    - Add section explaining prefix-aware input
    - Document the two input modes (numeric vs full)
    - Provide examples of both modes
    - Link to detailed steering guide
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [x] 6. Update config management guide
  - [x] 6.1 Update steering/config-management.md
    - Add section on prefix configuration
    - Document `usePrefix` and `projectPrefix` fields
    - Explain when prefix mode is auto-enabled
    - Show how to manually enable/disable prefix mode
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

  - [x] 6.2 Add configuration examples
    - Example: GitHub with prefix mode
    - Example: Jira with prefix mode
    - Example: Custom prefix (non-tracking system)
    - Example: Disabling prefix mode
    - _Requirements: 8.3, 8.4_

- [x] 7. Update creating specs guide
  - [x] 7.1 Update steering/creating-specs.md
    - Add step explaining prefix mode detection
    - Document numeric input option in identifier prompt
    - Add validation rules for numeric input
    - Update examples to show prefix-aware prompts
    - _Requirements: 2.1, 2.2, 2.4, 5.1, 5.2, 5.3_

  - [x] 7.2 Add prefix-aware workflow variations
    - Workflow: Creating spec with numeric input
    - Workflow: Creating spec with full identifier
    - Workflow: Correcting auto-increment suggestion
    - Workflow: Handling prefix mismatch
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 8. Update troubleshooting guide
  - [x] 8.1 Update steering/troubleshooting.md
    - Add "Invalid numeric input" troubleshooting entry
    - Add "Prefix mismatch warning" troubleshooting entry
    - Add "Cannot enable prefix mode" troubleshooting entry
    - Add "Backwards number warning" troubleshooting entry
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 4.1, 4.2, 6.4_

  - [x] 8.2 Add solutions and examples
    - Solution for each error type
    - Examples of valid vs invalid input
    - Steps to resolve common issues
    - _Requirements: 10.6, 12.5_

- [x] 9. Update naming conventions guide
  - [x] 9.1 Update steering/naming-conventions.md
    - Add section on prefix-aware identifier input
    - Document that identifiers can be entered as numbers
    - Explain how the system combines prefix with number
    - Update examples to show both input styles
    - _Requirements: 2.1, 2.2, 2.4, 5.1_

  - [x] 9.2 Add validation rules
    - Document numeric input validation rules
    - Document prefix format validation rules
    - Provide examples of valid and invalid inputs
    - _Requirements: 10.4, 10.5, 12.1, 12.2, 12.3_

- [x] 10. Create example configuration files
  - [x] 10.1 Create example-config-github-prefix.json
    - Show GitHub config with prefix mode enabled
    - Include comments explaining each field
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 10.2 Create example-config-jira-prefix.json
    - Show Jira config with prefix mode enabled
    - Include comments explaining each field
    - _Requirements: 1.1, 1.2, 1.3, 1.5_

  - [x] 10.3 Create example-config-custom-prefix.json
    - Show custom prefix config (no tracking system)
    - Include comments explaining each field
    - _Requirements: 1.1, 1.2, 1.6_

- [x] 11. Update querying metadata guide
  - [x] 11.1 Update steering/querying-metadata.md
    - Document that queries work with both prefixed and non-prefixed identifiers
    - Add examples of querying with numeric portion only
    - Explain backwards compatibility with mixed formats
    - _Requirements: 9.1, 9.3, 9.4_

  - [x] 11.2 Add query examples
    - Example: Query by full identifier
    - Example: Query by numeric portion
    - Example: Query in mixed-format project
    - _Requirements: 9.1, 9.3_

- [x] 12. Add prefix detection documentation
  - [x] 12.1 Add section to creating-specs.md
    - Document automatic prefix detection from existing specs
    - Explain when detection is triggered
    - Show example of detection and suggestion
    - Document user confirmation flow
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [x] 12.2 Add detection examples
    - Example: Consistent prefix detected
    - Example: Multiple prefixes detected
    - Example: No consistent prefix found
    - _Requirements: 7.2, 7.3, 7.6_

- [x] 13. Document backwards compatibility
  - [x] 13.1 Add section to POWER.md
    - Explain that prefix mode doesn't affect existing specs
    - Document support for mixed identifier formats
    - Clarify that existing metadata is never modified
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [x] 13.2 Add migration guidance
    - Explain how to adopt prefix mode in existing projects
    - Document that it's opt-in and gradual
    - Provide best practices for teams
    - _Requirements: 9.1, 9.2_

- [x] 14. Final documentation review
  - Review all updated documentation for consistency
  - Ensure all examples are accurate and complete
  - Verify all cross-references between documents
  - Check that terminology is consistent throughout
  - Ensure all requirements are covered in documentation

## Notes

- This is a documentation-focused implementation since Spec Manager is a Knowledge Base Power
- All tasks involve updating or creating markdown documentation files
- No code implementation is required
- Focus on clear examples and user-friendly explanations
- Maintain consistency with existing documentation style
- Each task references specific requirements for traceability
