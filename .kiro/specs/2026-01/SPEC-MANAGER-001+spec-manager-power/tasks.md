# Implementation Plan: Spec Manager Power

## Overview

This implementation plan focuses on creating a Knowledge Base Power that provides comprehensive documentation and workflows for standardized spec creation in Kiro. The power will be implemented as documentation files (POWER.md and optional steering files) without requiring an MCP server.

## Tasks

- [x] 1. Set up power directory structure
  - Create directory: `web-forge-ai/power/spec-manager/`
  - Create subdirectory: `web-forge-ai/power/spec-manager/steering/`
  - Verify directory structure is correct
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 2. Create POWER.md with frontmatter and core documentation
  - [x] 2.1 Write frontmatter metadata
    - Include name: "spec-manager"
    - Include displayName: "Spec Manager"
    - Include description (max 3 sentences)
    - Include 7 relevant keywords
    - Include author information
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [x] 2.2 Write Overview section
    - Explain what the power does
    - Explain why it's useful
    - Describe the problem it solves
    - _Requirements: 9.1_

  - [x] 2.3 Write Quick Start section
    - Provide fast path to creating a spec
    - Include step-by-step instructions
    - Show example with actual values
    - _Requirements: 9.1, 9.2_

  - [x] 2.4 Write Naming Conventions section
    - Explain identifier format and conversion to uppercase
    - Explain identifier auto-increment from recent specs
    - Document numeric suffix detection and increment logic
    - Document padding detection and preservation (001→002, 1→2)
    - Explain spec name normalization
    - Explain combined format with + separator
    - Provide examples of good names
    - Provide examples of names to avoid
    - Show identifier increment examples with and without padding
    - _Requirements: 1.2, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3, 9.3_

  - [x] 2.5 Write Directory Structure section
    - Show visual representation of spec organization
    - Explain date-based organization (YYYY-MM)
    - Explain spec directory structure
    - Explain .work/ subdirectories
    - _Requirements: 4.1, 4.2, 4.3, 5.1, 5.2, 5.3, 5.4, 7.1, 7.2, 7.3, 7.4, 9.4_

  - [x] 2.6 Write Metadata Tracking section
    - Explain metadata.json purpose
    - Show metadata schema
    - Provide example metadata file
    - Explain how to use for traceability
    - Document URL field for external systems
    - Document URL pattern detection from previous specs
    - Explain month priority search (most recent first)
    - Document auto-detection of assignee from git config
    - Explain confirmation workflow for assignee and URL
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10, 6.11, 6.12, 6.13, 6.14, 6.15, 6.16, 6.17_

  - [x] 2.7 Write Querying Metadata section
    - Explain how to query spec metadata through Kiro
    - Document natural language query patterns
    - Show examples: URL lookup, tag search, status search, assignee search
    - Explain how Kiro reads and filters metadata.json files
    - Provide query examples for each metadata field
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_

  - [x] 2.8 Write Work Directory Guidelines section
    - Explain when to use .work/ directory
    - Describe helpers/ subdirectory usage
    - Describe tests/ subdirectory usage
    - Describe reports/ subdirectory usage
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 9.5_

  - [x] 2.8 Write Integration with Kiro section
    - Explain compatibility with taskStatus tool
    - Explain compatibility with updatePBTStatus tool
    - Show how to reference spec files in Kiro tools
    - Provide path examples
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 10.1, 10.2_

  - [x] 2.9 Write Complete Examples section
    - Example 1: Simple spec creation
    - Example 2: Spec with Jira integration
    - Example 3: Spec with long name (truncation)
    - Show full workflow for each example
    - _Requirements: 9.2_

  - [x] 2.10 Write Best Practices section
    - Best practices for identifier naming
    - Best practices for spec name selection
    - Best practices for .work/ directory usage
    - Best practices for metadata maintenance
    - _Requirements: 9.1, 9.2, 9.3_

  - [x] 2.11 Write Troubleshooting section
    - Invalid identifier characters
    - Empty or whitespace-only names
    - Directory already exists
    - File system permissions
    - Path resolution issues
    - _Requirements: 9.4_

- [x] 3. Create steering file: creating-specs.md
  - [x] 3.1 Write step-by-step workflow
    - Step 1: Prompt for spec identifier (optional)
    - Step 1a: If not provided, auto-detect and increment from recent specs
    - Step 1b: Detect and preserve padding pattern (001→002 or 1→2)
    - Step 1c: Present suggested identifier for confirmation
    - Step 2: Convert to uppercase
    - Step 3: Generate suggested name
    - Step 4: Confirm with user
    - Step 5: Normalize if custom name provided
    - Step 6: Prompt for external system URL (optional)
    - Step 6a: If identifier only, detect URL pattern from recent specs
    - Step 6b: Reconstruct URL and confirm with user
    - Step 7: Auto-detect assignee from git config
    - Step 8: Confirm assignee with user (allow override)
    - Step 9: Create date directory
    - Step 10: Create spec directory
    - Step 11: Generate file structure
    - Step 12: Create metadata file (with URL and assignee)
    - Step 13: Provide path information
    - _Requirements: 1.1, 1.2, 1.5, 1.6, 1.7, 1.8, 1.9, 2.1, 2.2, 2.3, 2.4, 3.1, 4.1, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10, 6.11, 6.12, 6.13, 6.14, 6.15, 6.16, 6.17, 8.1, 8.2_

  - [x] 3.2 Add validation rules
    - Identifier validation (pattern, characters)
    - Name validation (length, characters)
    - Date validation (format)
    - Path validation (filesystem-safe)
    - _Requirements: 1.4, 2.5, 3.4, 4.2_

  - [x] 3.3 Add interactive prompts examples
    - Show example prompts for identifier
    - Show example prompts for name confirmation
    - Show example prompts for optional fields
    - _Requirements: 1.1, 2.2, 2.3_

- [x] 4. Create steering file: naming-conventions.md
  - [x] 4.1 Write identifier format rules
    - Allowed characters
    - Case conversion rules
    - Pattern validation
    - Examples of valid identifiers
    - Examples of invalid identifiers
    - _Requirements: 1.2, 1.4, 3.4_

  - [x] 4.2 Write name normalization algorithm
    - Step-by-step normalization process
    - Truncation rules for long names
    - Special character handling
    - Examples of normalization
    - _Requirements: 2.4, 2.5_

  - [x] 4.3 Write combined format rules
    - Separator usage (+ sign)
    - Full pattern explanation
    - Filesystem safety considerations
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 4.4 Provide extensive examples
    - 10+ examples of good spec names
    - 10+ examples of names to avoid
    - Before/after normalization examples
    - Edge case examples
    - _Requirements: 2.6, 9.3_

- [x] 5. Create steering file: troubleshooting.md
  - [x] 5.1 Document common problems
    - Invalid identifier errors
    - Empty name errors
    - Directory exists errors
    - Permission errors
    - Path resolution errors
    - Metadata validation errors
    - Git config detection errors
    - _Requirements: 9.4_

  - [x] 5.2 Provide diagnostic steps
    - How to identify each problem
    - What to check first
    - How to verify the issue
    - How to check git config manually
    - _Requirements: 9.4_

  - [x] 5.3 Provide solutions
    - Step-by-step fixes for each problem
    - Alternative approaches
    - Prevention strategies
    - How to configure git user.name
    - _Requirements: 9.4_

  - [x] 5.4 Add FAQ section
    - Common questions about naming
    - Common questions about organization
    - Common questions about metadata
    - Common questions about Kiro integration
    - Common questions about git config detection
    - Common questions about querying metadata
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 11.6, 11.7_

- [x] 6. Create steering file: querying-metadata.md
  - [x] 6.1 Document query patterns
    - Natural language query examples
    - Query by URL
    - Query by tag
    - Query by status
    - Query by assignee
    - Query by identifier
    - List all specs
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_

  - [x] 6.2 Explain search mechanics
    - How Kiro locates spec directories
    - How Kiro reads metadata.json files
    - How filtering works
    - Performance considerations
    - _Requirements: 11.2, 11.8_

  - [x] 6.3 Provide complete examples
    - Example 1: Find spec URL
    - Example 2: Search by tag
    - Example 3: Filter by status
    - Example 4: Find specs by assignee
    - Example 5: List specs in date range
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.7_

  - [x] 6.4 Document error handling
    - Metadata file not found
    - Invalid JSON in metadata
    - Missing required fields
    - No specs match query
    - _Requirements: 11.8_

- [x] 7. Create example metadata.json file
  - Create example in power directory for reference
  - Include all required fields
  - Include optional fields with examples
  - Add comments explaining each field
  - Validate against schema from design
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [x] 8. Create README.md for power directory
  - Explain what the power does
  - Link to POWER.md as main documentation
  - Provide installation instructions
  - Include quick example
  - Add license information
  - _Requirements: 9.1_

- [ ] 9. Validate all documentation
  - [ ] 9.1 Check all examples are correct
    - Test identifier conversion examples
    - Test name normalization examples
    - Test directory name examples
    - Test full path examples
    - _Requirements: 9.2_

  - [ ] 9.2 Verify all internal references
    - Check links between sections
    - Check references to steering files
    - Check references to requirements
    - _Requirements: 9.1, 9.4_

  - [ ] 9.3 Validate metadata examples
    - Ensure metadata.json examples are valid JSON
    - Verify all required fields are present
    - Check field types match schema
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ] 9.4 Test regex patterns
    - Test identifier pattern with various inputs
    - Test name pattern with various inputs
    - Test date pattern with various inputs
    - Test combined pattern with various inputs
    - _Requirements: 1.4, 2.4, 3.4, 4.2_

- [ ] 10. Test power locally
  - [ ] 10.1 Install power from local directory
    - Open Powers UI in Kiro
    - Add custom power from local directory
    - Verify power appears in installed list
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ] 10.2 Test power activation
    - Make request to create a spec
    - Verify agent activates the power
    - Verify agent reads POWER.md
    - _Requirements: 10.1, 10.2_

  - [ ] 10.3 Test complete workflow
    - Follow documentation to create a spec
    - Verify directory structure is created
    - Verify metadata.json is created
    - Verify files are in correct locations
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 2.4, 3.1, 4.1, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4, 6.5, 8.1, 8.2_

  - [ ] 10.4 Test steering files
    - Request detailed workflow guidance
    - Verify agent reads creating-specs.md
    - Request naming convention details
    - Verify agent reads naming-conventions.md
    - Request troubleshooting help
    - Verify agent reads troubleshooting.md
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [ ] 10.5 Test edge cases
    - Test with very long names
    - Test with special characters
    - Test with existing directories
    - Test with invalid identifiers
    - Verify error handling works
    - _Requirements: 2.5, 2.6, 3.4_

- [ ] 11. Create documentation for publication
  - [ ] 11.1 Write comprehensive README.md
    - Overview of the power
    - Installation instructions
    - Quick start guide
    - Link to full documentation
    - Contributing guidelines
    - License information
    - _Requirements: 9.1_

  - [ ] 11.2 Add LICENSE file
    - Choose appropriate license (MIT, Apache, etc.)
    - Include license text
    - _Requirements: 9.1_

  - [ ] 11.3 Add CHANGELOG.md
    - Document initial version
    - Prepare for future updates
    - _Requirements: 9.1_

  - [ ] 11.4 Create examples directory
    - Add example spec structures
    - Add example metadata files
    - Add example workflows
    - _Requirements: 9.2_

- [ ] 12. Final review and polish
  - Review all documentation for clarity
  - Check for typos and grammar
  - Ensure consistent formatting
  - Verify all links work
  - Test all examples
  - Get user feedback
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

## Notes

- This is a documentation-only power (Knowledge Base Power)
- No code implementation required, only documentation files
- Focus on clear, comprehensive, and accurate documentation
- All examples must be tested and verified
- Power should work seamlessly with Kiro's existing spec workflow
- Consider user experience when writing documentation
- Keep documentation up-to-date with Kiro changes
