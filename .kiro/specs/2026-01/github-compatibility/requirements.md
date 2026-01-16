# Requirements Document

## Introduction

Este documento define los requisitos para la compatibilidad con sistemas de tracking externos en el Spec Manager Power, con soporte específico para GitHub Issues y Jira. Cada sistema tiene sus propias convenciones de identificadores y URLs. El sistema debe detectar automáticamente el sistema de tracking en uso, generar identificadores sintéticos apropiados, y persistir las preferencias del usuario en un archivo de configuración para evitar retrabajo.

## Glossary

- **Spec_Manager**: El sistema de gestión de especificaciones de Kiro
- **Tracking_System**: El sistema externo de gestión de issues (GitHub Issues, Jira, etc.)
- **GitHub_Issue**: Un issue en el sistema de GitHub Issues
- **Jira_Issue**: Un issue en el sistema Jira
- **Spec_Identifier**: El identificador único sintético generado para un spec vinculado a un sistema externo
- **Issue_Number**: El número o clave asignado por el sistema de tracking a un issue
- **Issue_URL**: La URL completa de un issue en el sistema de tracking
- **Repository_URL**: La URL base del repositorio o proyecto (sin el identificador del issue)
- **Config_File**: El archivo spec-manager.json que almacena preferencias y configuración
- **Kiro_Root**: El directorio .kiro/ donde se almacenan specs y configuración

## Requirements

### Requirement 1: Configuration File Management

**User Story:** Como usuario, quiero que el sistema almacene mis preferencias de tracking en un archivo de configuración, para que no tenga que repetir la misma información cada vez que creo un spec.

#### Acceptance Criteria

1. THE Spec_Manager SHALL create a Config_File at `.kiro/spec-manager.json` if it does not exist
2. WHEN the Config_File is created, THE Spec_Manager SHALL initialize it with default values
3. WHEN the user specifies a Tracking_System preference, THE Spec_Manager SHALL store it in the Config_File
4. WHEN the user provides a Repository_URL, THE Spec_Manager SHALL store it in the Config_File for future use
5. WHEN creating a new spec, THE Spec_Manager SHALL read the Config_File to determine default values
6. THE Spec_Manager SHALL validate the Config_File structure and handle invalid or missing files gracefully
7. IF multiple .kiro/ directories exist in parent paths, THE Spec_Manager SHALL use the Config_File in the closest .kiro/ directory

### Requirement 2: Tracking System Detection

**User Story:** Como usuario, quiero que el sistema detecte automáticamente qué sistema de tracking estoy usando (GitHub o Jira), para que pueda generar identificadores y URLs apropiados sin configuración manual.

#### Acceptance Criteria

1. WHEN a user provides a URL, THE Spec_Manager SHALL analyze the URL pattern to determine the Tracking_System
2. WHEN a URL matches the pattern `https://github.com/{owner}/{repo}/issues/{number}`, THE Spec_Manager SHALL identify it as GitHub Issues
3. WHEN a URL matches the pattern `https://{domain}/browse/{key}` or `https://{domain}/projects/{project}/issues/{key}`, THE Spec_Manager SHALL identify it as Jira
4. WHEN a Tracking_System is detected, THE Spec_Manager SHALL store it in the Config_File for future reference
5. WHEN no URL is provided and a Tracking_System is configured, THE Spec_Manager SHALL use the configured system
6. IF a URL does not match known patterns, THEN THE Spec_Manager SHALL handle it as a generic external system URL

### Requirement 3: GitHub URL Detection and Parsing

**User Story:** Como usuario, quiero que el sistema detecte automáticamente cuando estoy usando GitHub Issues, para que pueda vincular specs con issues de GitHub de forma transparente.

#### Acceptance Criteria

1. WHEN a user provides a URL matching the pattern `https://github.com/{owner}/{repo}/issues/{number}`, THE Spec_Manager SHALL recognize it as a GitHub Issue URL
2. WHEN a GitHub Issue URL is detected, THE Spec_Manager SHALL extract the Issue_Number from the URL
3. WHEN a GitHub Issue URL is detected, THE Spec_Manager SHALL extract the Repository_URL (owner and repo name) from the URL
4. WHEN a GitHub Issue URL is detected, THE Spec_Manager SHALL store the Repository_URL in the Config_File
5. THE Spec_Manager SHALL support both `github.com` and GitHub Enterprise URLs with custom domains

### Requirement 4: Jira URL Detection and Parsing

**User Story:** Como usuario, quiero que el sistema detecte automáticamente cuando estoy usando Jira, para que pueda vincular specs con issues de Jira usando sus convenciones de identificadores.

#### Acceptance Criteria

1. WHEN a user provides a URL matching Jira patterns, THE Spec_Manager SHALL recognize it as a Jira Issue URL
2. WHEN a Jira Issue URL is detected, THE Spec_Manager SHALL extract the issue key (e.g., `PROJECT-123`)
3. WHEN a Jira Issue URL is detected, THE Spec_Manager SHALL extract the Jira domain and project information
4. WHEN a Jira Issue URL is detected, THE Spec_Manager SHALL store the Jira base URL in the Config_File
5. THE Spec_Manager SHALL support both Jira Cloud and Jira Server URL patterns

### Requirement 5: GitHub Synthetic Identifier Generation

**User Story:** Como usuario, quiero que el sistema genere identificadores sintéticos con el prefijo "GITHUB-" para issues de GitHub, para mantener consistencia con otros sistemas externos y facilitar la identificación.

#### Acceptance Criteria

1. WHEN creating a spec linked to a GitHub Issue, THE Spec_Manager SHALL generate a Spec_Identifier with the format `GITHUB-{Issue_Number}`
2. WHEN the Issue_Number is extracted from a GitHub URL, THE Spec_Manager SHALL preserve the numeric value without padding
3. THE Spec_Manager SHALL present the suggested identifier `GITHUB-{Issue_Number}` to the user for confirmation
4. WHEN the user confirms the suggested identifier, THE Spec_Manager SHALL use it as the specIdentifier in metadata.json
5. WHEN the user rejects the suggested identifier, THE Spec_Manager SHALL allow the user to provide a custom identifier

### Requirement 6: Jira Identifier Handling

**User Story:** Como usuario, quiero que el sistema use directamente las claves de Jira como identificadores, para mantener consistencia con el sistema de tracking sin necesidad de identificadores sintéticos.

#### Acceptance Criteria

1. WHEN creating a spec linked to a Jira Issue, THE Spec_Manager SHALL use the Jira issue key directly as the Spec_Identifier
2. WHEN a Jira issue key is extracted from a URL, THE Spec_Manager SHALL preserve the exact format (e.g., `PROJECT-123`)
3. THE Spec_Manager SHALL present the suggested Jira key to the user for confirmation
4. WHEN the user confirms the suggested identifier, THE Spec_Manager SHALL use it as the specIdentifier in metadata.json
5. WHEN the user rejects the suggested identifier, THE Spec_Manager SHALL allow the user to provide a custom identifier

### Requirement 7: URL Pattern Reconstruction from Config

**User Story:** Como usuario, quiero que el sistema reconstruya automáticamente las URLs de issues basándose en la configuración almacenada, para ahorrar tiempo al crear múltiples specs vinculados al mismo proyecto.

#### Acceptance Criteria

1. WHEN creating a new spec and a Repository_URL exists in the Config_File, THE Spec_Manager SHALL reconstruct the Issue_URL using the new identifier
2. WHEN reconstructing a GitHub URL, THE Spec_Manager SHALL use the pattern `{Repository_URL}/issues/{Issue_Number}`
3. WHEN reconstructing a Jira URL, THE Spec_Manager SHALL use the pattern `{Jira_Base_URL}/browse/{Issue_Key}`
4. THE Spec_Manager SHALL present the reconstructed URL to the user for confirmation
5. WHEN the user confirms the reconstructed URL, THE Spec_Manager SHALL store it in the metadata.json
6. WHEN the user rejects the reconstructed URL, THE Spec_Manager SHALL allow the user to provide a different URL

### Requirement 8: System-specific User Guidance

**User Story:** Como usuario, quiero recibir orientación específica sobre cómo usar el sistema con GitHub o Jira, para entender las convenciones de identificadores y URLs de cada sistema.

#### Acceptance Criteria

1. WHEN a user creates a spec with a GitHub URL, THE Spec_Manager SHALL inform the user that GitHub uses the prefix "GITHUB-" for identifiers
2. WHEN suggesting an identifier for a GitHub Issue, THE Spec_Manager SHALL explain that the format is `GITHUB-{Issue_Number}`
3. WHEN a user creates a spec with a Jira URL, THE Spec_Manager SHALL inform the user that Jira keys are used directly as identifiers
4. THE Spec_Manager SHALL allow the user to override suggested identifiers if they prefer a different naming convention
5. WHEN querying specs, THE Spec_Manager SHALL recognize system-specific identifier patterns for search

### Requirement 9: Metadata Storage for Tracked Issues

**User Story:** Como usuario, quiero que el sistema almacene correctamente la información de issues externos en los metadatos, para mantener la trazabilidad completa con el sistema de tracking.

#### Acceptance Criteria

1. WHEN storing metadata for a tracked spec, THE Spec_Manager SHALL store the complete Issue_URL in the `url` field
2. WHEN storing metadata for a GITHUB-linked spec, THE Spec_Manager SHALL store the synthetic identifier `GITHUB-{Issue_Number}` in the `specIdentifier` field
3. WHEN storing metadata for a Jira-linked spec, THE Spec_Manager SHALL store the Jira issue key in the `specIdentifier` field
4. THE Spec_Manager SHALL validate that the stored URL matches the expected pattern for the Tracking_System
5. WHEN updating a spec, THE Spec_Manager SHALL preserve the URL and identifier relationship

### Requirement 10: Auto-increment Support for GitHub Issues

**User Story:** Como usuario, quiero que el sistema detecte el último número de issue de GitHub usado y sugiera el siguiente, para facilitar la creación secuencial de specs vinculados a issues consecutivos.

#### Acceptance Criteria

1. WHEN auto-incrementing is requested for GitHub identifiers, THE Spec_Manager SHALL find the most recent spec with a `GITHUB-` prefix
2. WHEN the most recent GitHub identifier is found, THE Spec_Manager SHALL extract the Issue_Number
3. THE Spec_Manager SHALL increment the Issue_Number by 1 and suggest `GITHUB-{Issue_Number + 1}` as the next identifier
4. WHEN no previous GitHub identifiers exist, THE Spec_Manager SHALL suggest `GITHUB-1` as the starting identifier
5. THE Spec_Manager SHALL reconstruct the GitHub URL using the incremented Issue_Number if a Repository_URL exists in Config_File

### Requirement 11: Auto-increment Support for Jira Issues

**User Story:** Como usuario, quiero que el sistema detecte el último número de issue de Jira usado y sugiera el siguiente, para facilitar la creación secuencial de specs vinculados a issues consecutivos del mismo proyecto.

#### Acceptance Criteria

1. WHEN auto-incrementing is requested for Jira identifiers, THE Spec_Manager SHALL find the most recent spec with the same Jira project prefix
2. WHEN the most recent Jira identifier is found, THE Spec_Manager SHALL extract the numeric portion
3. THE Spec_Manager SHALL increment the number by 1 and suggest `{PROJECT}-{Number + 1}` as the next identifier
4. WHEN no previous Jira identifiers exist for the project, THE Spec_Manager SHALL suggest `{PROJECT}-1` as the starting identifier
5. THE Spec_Manager SHALL reconstruct the Jira URL using the incremented key if a Jira base URL exists in Config_File

### Requirement 12: Query Support for System-specific Identifiers

**User Story:** Como usuario, quiero poder buscar specs usando identificadores específicos de cada sistema, para facilitar la búsqueda de información sin importar el formato del identificador.

#### Acceptance Criteria

1. WHEN a user queries with a GitHub identifier like `GITHUB-5`, THE Spec_Manager SHALL find the corresponding spec
2. WHEN a user queries with just a number like `5` and GitHub specs exist, THE Spec_Manager SHALL consider matching `GITHUB-5`
3. WHEN a user queries with a Jira key like `PROJECT-123`, THE Spec_Manager SHALL find the corresponding spec
4. WHEN displaying query results, THE Spec_Manager SHALL show both the identifier and the Issue_URL
5. THE Spec_Manager SHALL support natural language queries like "What's the GitHub link for issue 5?" or "Show me PROJECT-123"

### Requirement 13: Config File Schema and Validation

**User Story:** Como usuario, quiero que el archivo de configuración tenga una estructura clara y validada, para evitar errores y entender qué información se está almacenando.

#### Acceptance Criteria

1. THE Config_File SHALL follow a JSON schema with defined fields for tracking system configuration
2. THE Config_File SHALL include a `trackingSystem` field with values "github", "jira", or "none"
3. WHEN the Tracking_System is GitHub, THE Config_File SHALL include a `githubRepository` field with the repository URL
4. WHEN the Tracking_System is Jira, THE Config_File SHALL include `jiraBaseUrl` and `jiraProject` fields
5. THE Spec_Manager SHALL validate the Config_File structure when reading it
6. IF the Config_File is invalid or corrupted, THE Spec_Manager SHALL create a new valid Config_File with default values
7. THE Spec_Manager SHALL preserve any additional custom fields in the Config_File when updating it

### Requirement 14: Documentation Updates

**User Story:** Como usuario, quiero que la documentación del power explique claramente cómo funciona con GitHub y Jira, para entender las convenciones y flujos de trabajo específicos de cada sistema.

#### Acceptance Criteria

1. THE README.md SHALL include a section explaining GitHub Issues integration
2. THE README.md SHALL include a section explaining Jira integration
3. THE README.md SHALL document the spec-manager.json configuration file structure
4. THE README.md SHALL provide examples of identifier formats for both GitHub and Jira
5. THE README.md SHALL explain the URL reconstruction feature for both systems
6. THE README.md SHALL include example workflows for creating specs with GitHub and Jira
7. THE README.md SHALL document the auto-increment behavior for both GitHub and Jira identifiers
