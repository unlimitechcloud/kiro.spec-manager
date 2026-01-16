# Implementation Plan: GitHub and Jira Compatibility Documentation

## Overview

Este plan actualiza la documentación del Spec Manager Power para incluir guías específicas sobre cómo trabajar con GitHub Issues y Jira como sistemas de tracking externos. El plan se enfoca en actualizar README.md, POWER.md, y crear steering files que guíen a Kiro sobre cómo manejar estos sistemas.

## Tasks

- [x] 1. Document spec-manager.json configuration file
  - Create documentation section explaining the config file structure
  - Document the JSON schema with all fields
  - Provide examples for GitHub and Jira configurations
  - Explain where the file is located (.kiro/spec-manager.json)
  - Document how Kiro uses this file for defaults
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 14.3_

- [x] 2. Document GitHub Issues integration
  - [x] 2.1 Create GitHub integration section in README.md
    - Explain GitHub's numeric issue system
    - Document the synthetic identifier format (GITHUB-{number})
    - Provide examples of GitHub URLs
    - Explain how Kiro detects GitHub URLs
    - _Requirements: 14.1, 14.4_

  - [x] 2.2 Document GitHub identifier auto-increment
    - Explain how Kiro finds the last GitHub issue number
    - Document the increment behavior (GITHUB-5 → GITHUB-6)
    - Explain the starting identifier (GITHUB-1)
    - Provide workflow examples
    - _Requirements: 14.7_

  - [x] 2.3 Document GitHub URL reconstruction
    - Explain how repository URL is stored in config
    - Document how URLs are reconstructed for new issues
    - Provide examples of the reconstruction process
    - _Requirements: 14.5_

  - [x] 2.4 Create GitHub workflow examples
    - Example: Creating first spec with GitHub URL
    - Example: Creating subsequent specs with auto-increment
    - Example: Querying GitHub specs
    - _Requirements: 14.6_

- [x] 3. Document Jira integration
  - [x] 3.1 Create Jira integration section in README.md
    - Explain Jira's key-based system (PROJECT-123)
    - Document that Jira keys are used directly as identifiers
    - Provide examples of Jira URLs (Cloud and Server)
    - Explain how Kiro detects Jira URLs
    - _Requirements: 14.2, 14.4_

  - [x] 3.2 Document Jira identifier auto-increment
    - Explain how Kiro finds the last issue for a project
    - Document the increment behavior (PROJECT-5 → PROJECT-6)
    - Explain the starting identifier (PROJECT-1)
    - Provide workflow examples
    - _Requirements: 14.7_

  - [x] 3.3 Document Jira URL reconstruction
    - Explain how Jira base URL is stored in config
    - Document how URLs are reconstructed for new issues
    - Provide examples of the reconstruction process
    - _Requirements: 14.5_

  - [x] 3.4 Create Jira workflow examples
    - Example: Creating first spec with Jira URL
    - Example: Creating subsequent specs with auto-increment
    - Example: Querying Jira specs
    - _Requirements: 14.6_

- [x] 4. Create steering file for GitHub integration
  - Create steering/github-integration.md
  - Document step-by-step workflow for GitHub
  - Include URL pattern detection rules
  - Document identifier generation rules
  - Provide troubleshooting guidance
  - _Requirements: 3.1, 3.2, 3.3, 5.1, 5.2_

- [x] 5. Create steering file for Jira integration
  - Create steering/jira-integration.md
  - Document step-by-step workflow for Jira
  - Include URL pattern detection rules
  - Document identifier handling rules
  - Provide troubleshooting guidance
  - _Requirements: 4.1, 4.2, 4.3, 6.1, 6.2_

- [x] 6. Create steering file for config management
  - Create steering/config-management.md
  - Document spec-manager.json structure in detail
  - Explain when and how config is created
  - Document validation rules
  - Explain how to manually edit config
  - Provide troubleshooting for config issues
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

- [x] 7. Update POWER.md with new features
  - Add GitHub and Jira to the feature list
  - Update the overview section
  - Add keywords: "github", "jira", "tracking-systems"
  - Update examples to show GitHub/Jira usage
  - _Requirements: 14.1, 14.2_

- [x] 8. Update README.md Quick Example
  - Update the quick example to show tracking system detection
  - Show how Kiro suggests GITHUB- or Jira identifiers
  - Demonstrate URL reconstruction
  - _Requirements: 14.6_

- [x] 9. Add comparison table to README.md
  - Create table comparing GitHub vs Jira handling
  - Show identifier formats side by side
  - Show URL patterns side by side
  - Show auto-increment behavior side by side
  - _Requirements: 14.4_

- [x] 10. Update troubleshooting documentation
  - Add troubleshooting section for GitHub URLs
  - Add troubleshooting section for Jira URLs
  - Add troubleshooting for config file issues
  - Add troubleshooting for identifier conflicts
  - Update steering/troubleshooting.md
  - _Requirements: 2.6_

- [x] 11. Create example metadata files
  - Create example-metadata-github.json
  - Create example-metadata-jira.json
  - Show complete examples with URLs
  - _Requirements: 9.1, 9.2, 9.3_

- [x] 12. Create example config files
  - Create example-config-github.json
  - Create example-config-jira.json
  - Show complete examples with all fields
  - _Requirements: 13.1, 13.2, 13.3, 13.4_

- [x] 13. Update querying documentation
  - Update steering/querying-metadata.md
  - Add examples for querying GitHub specs
  - Add examples for querying Jira specs
  - Document fuzzy number search for GitHub
  - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [x] 14. Review and validate all documentation
  - Ensure consistency across all files
  - Verify all examples are correct
  - Check that all requirements are documented
  - Ensure steering files are complete
  - Test that examples work as described

## Notes

- This is a documentation-only update for a Kiro Power
- No code implementation is required
- Focus is on clear, comprehensive documentation
- All examples should be realistic and tested
- Steering files guide Kiro on how to handle these systems
- Each task references specific requirements for traceability
