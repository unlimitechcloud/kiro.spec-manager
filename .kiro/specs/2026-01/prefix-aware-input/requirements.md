# Requirements Document

## Introduction

Este documento define los requisitos para mejorar la experiencia de usuario al trabajar con identificadores que tienen prefijos de proyecto (como "GITHUB-", "JIRA-", o claves de proyecto personalizadas). El sistema debe permitir al usuario ingresar solo la parte numérica del identificador cuando el prefijo está configurado, reduciendo la fricción y errores al corregir o especificar identificadores.

## Glossary

- **Spec_Manager**: El sistema de gestión de especificaciones de Kiro
- **Project_Prefix**: El prefijo que se antepone a los identificadores (ej: "GITHUB-", "PROJECT-", "FEAT-")
- **Numeric_Portion**: La parte numérica del identificador después del prefijo
- **Full_Identifier**: El identificador completo incluyendo prefijo y número (ej: "GITHUB-123")
- **User_Input**: El valor que el usuario proporciona al sistema
- **Config_File**: El archivo spec-manager.json que almacena preferencias
- **Prefix_Mode**: Configuración que indica si el sistema debe usar prefijos automáticamente

## Requirements

### Requirement 1: Prefix Configuration Storage

**User Story:** Como usuario, quiero configurar si mi proyecto usa prefijos en los identificadores, para que el sistema pueda manejarlos automáticamente sin que tenga que escribirlos cada vez.

#### Acceptance Criteria

1. THE Config_File SHALL include a `usePrefix` boolean field indicating whether prefix mode is enabled
2. THE Config_File SHALL include a `projectPrefix` string field storing the prefix to use (ej: "GITHUB-", "PROJECT-")
3. WHEN a tracking system is detected (GitHub or Jira), THE Spec_Manager SHALL automatically set `usePrefix` to true
4. WHEN GitHub is detected, THE Spec_Manager SHALL set `projectPrefix` to "GITHUB-"
5. WHEN Jira is detected, THE Spec_Manager SHALL extract the project key and set `projectPrefix` to "{PROJECT}-"
6. WHEN no tracking system is configured, THE Spec_Manager SHALL set `usePrefix` to false by default
7. THE Spec_Manager SHALL allow users to manually enable or disable prefix mode in the config

### Requirement 2: Numeric Input Detection

**User Story:** Como usuario, quiero poder escribir solo el número del identificador cuando corrijo o especifico uno, para ahorrar tiempo y evitar errores de tipeo.

#### Acceptance Criteria

1. WHEN prefix mode is enabled and the user provides input, THE Spec_Manager SHALL detect if the input is purely numeric
2. WHEN the user input is purely numeric, THE Spec_Manager SHALL treat it as the Numeric_Portion
3. WHEN the user input contains the full prefix, THE Spec_Manager SHALL accept it as the Full_Identifier
4. WHEN the user input is numeric, THE Spec_Manager SHALL prepend the configured Project_Prefix to create the Full_Identifier
5. WHEN prefix mode is disabled, THE Spec_Manager SHALL use the user input as-is without modification

### Requirement 3: Smart Identifier Suggestion

**User Story:** Como usuario, quiero que el sistema me sugiera el siguiente identificador completo, pero me permita corregirlo con solo el número, para tener flexibilidad sin perder la conveniencia.

#### Acceptance Criteria

1. WHEN suggesting the next identifier, THE Spec_Manager SHALL present the Full_Identifier (ej: "GITHUB-6")
2. WHEN the user accepts the suggestion, THE Spec_Manager SHALL use the Full_Identifier
3. WHEN the user provides a numeric correction, THE Spec_Manager SHALL combine the Project_Prefix with the Numeric_Portion
4. WHEN the user provides a full identifier with prefix, THE Spec_Manager SHALL validate it matches the configured prefix
5. IF the user provides a full identifier with a different prefix, THE Spec_Manager SHALL warn the user and ask for confirmation

### Requirement 4: Prefix Validation

**User Story:** Como usuario, quiero que el sistema valide que los identificadores que ingreso son consistentes con el prefijo configurado, para evitar inconsistencias en mi proyecto.

#### Acceptance Criteria

1. WHEN prefix mode is enabled and the user provides a Full_Identifier, THE Spec_Manager SHALL verify it starts with the configured Project_Prefix
2. IF the identifier does not match the prefix, THE Spec_Manager SHALL display a warning message
3. THE Spec_Manager SHALL show the expected prefix and the provided identifier
4. THE Spec_Manager SHALL ask the user if they want to proceed anyway or correct the input
5. WHEN the user chooses to proceed, THE Spec_Manager SHALL use the identifier as provided
6. WHEN the user chooses to correct, THE Spec_Manager SHALL prompt for input again

### Requirement 5: User Guidance for Prefix Mode

**User Story:** Como usuario, quiero recibir orientación clara sobre cómo funciona el modo de prefijos, para entender que puedo usar solo números o el identificador completo.

#### Acceptance Criteria

1. WHEN prefix mode is enabled and prompting for an identifier, THE Spec_Manager SHALL indicate the user can provide just the number
2. THE Spec_Manager SHALL display the configured prefix in the prompt (ej: "Identifier (GITHUB-): ")
3. WHEN suggesting an identifier, THE Spec_Manager SHALL show an example of numeric input (ej: "Press Enter for GITHUB-6, or type just '7' for GITHUB-7")
4. WHEN the user provides numeric input, THE Spec_Manager SHALL confirm the resulting Full_Identifier before proceeding
5. THE Spec_Manager SHALL provide clear feedback about what identifier will be used

### Requirement 6: Auto-increment with Prefix Awareness

**User Story:** Como usuario, quiero que el auto-incremento funcione correctamente con prefijos, sugiriendo el siguiente número pero permitiéndome saltar números con solo escribir el nuevo valor numérico.

#### Acceptance Criteria

1. WHEN auto-incrementing with prefix mode enabled, THE Spec_Manager SHALL find the highest Numeric_Portion for the configured prefix
2. THE Spec_Manager SHALL suggest the next sequential number with the prefix (ej: "GITHUB-6")
3. WHEN the user provides a different number, THE Spec_Manager SHALL use that number with the prefix
4. WHEN the user provides a number lower than the current maximum, THE Spec_Manager SHALL warn about potential conflicts
5. THE Spec_Manager SHALL allow the user to proceed with any numeric value they choose

### Requirement 7: Prefix Extraction from Existing Identifiers

**User Story:** Como usuario, quiero que el sistema detecte automáticamente el prefijo usado en mis specs existentes, para configurar el modo de prefijos sin intervención manual.

#### Acceptance Criteria

1. WHEN no prefix is configured and specs exist, THE Spec_Manager SHALL analyze existing spec identifiers
2. THE Spec_Manager SHALL detect common prefix patterns (format: "{PREFIX}-{NUMBER}")
3. WHEN a consistent prefix is found in multiple specs, THE Spec_Manager SHALL suggest enabling prefix mode with that prefix
4. THE Spec_Manager SHALL ask the user to confirm the detected prefix
5. WHEN the user confirms, THE Spec_Manager SHALL update the config with the detected prefix
6. WHEN no consistent prefix is found, THE Spec_Manager SHALL not enable prefix mode automatically

### Requirement 8: Prefix Mode Toggle

**User Story:** Como usuario, quiero poder activar o desactivar el modo de prefijos fácilmente, para adaptarme a diferentes convenciones de proyecto.

#### Acceptance Criteria

1. THE Spec_Manager SHALL provide a command or option to enable prefix mode
2. THE Spec_Manager SHALL provide a command or option to disable prefix mode
3. WHEN enabling prefix mode, THE Spec_Manager SHALL prompt for the Project_Prefix if not already configured
4. WHEN disabling prefix mode, THE Spec_Manager SHALL preserve the prefix configuration but set `usePrefix` to false
5. THE Spec_Manager SHALL confirm the mode change to the user

### Requirement 9: Backward Compatibility

**User Story:** Como usuario con specs existentes, quiero que el nuevo modo de prefijos no afecte mis specs actuales, para mantener la compatibilidad con mi trabajo previo.

#### Acceptance Criteria

1. WHEN prefix mode is enabled, THE Spec_Manager SHALL continue to recognize existing identifiers with or without prefixes
2. THE Spec_Manager SHALL not modify existing metadata.json files when enabling prefix mode
3. WHEN querying specs, THE Spec_Manager SHALL find specs regardless of whether they use the configured prefix
4. THE Spec_Manager SHALL support mixed identifier formats in the same project
5. WHEN displaying specs, THE Spec_Manager SHALL show identifiers exactly as stored in metadata

### Requirement 10: Config Schema Extension

**User Story:** Como usuario, quiero que la configuración de prefijos esté bien documentada y validada, para entender cómo configurarla correctamente.

#### Acceptance Criteria

1. THE Config_File schema SHALL include `usePrefix` as an optional boolean field (default: false)
2. THE Config_File schema SHALL include `projectPrefix` as an optional string field
3. WHEN `usePrefix` is true, THE `projectPrefix` field SHALL be required
4. THE Spec_Manager SHALL validate that `projectPrefix` ends with a separator character (hyphen or underscore)
5. THE Spec_Manager SHALL validate that `projectPrefix` contains only alphanumeric characters and separators
6. IF validation fails, THE Spec_Manager SHALL display an error and use default behavior

### Requirement 11: Integration with GitHub and Jira Workflows

**User Story:** Como usuario de GitHub o Jira, quiero que el modo de prefijos se active automáticamente cuando uso estos sistemas, para tener una experiencia fluida sin configuración adicional.

#### Acceptance Criteria

1. WHEN a GitHub URL is detected for the first time, THE Spec_Manager SHALL automatically enable prefix mode with "GITHUB-"
2. WHEN a Jira URL is detected for the first time, THE Spec_Manager SHALL automatically enable prefix mode with the Jira project key
3. THE Spec_Manager SHALL inform the user that prefix mode has been enabled
4. THE Spec_Manager SHALL explain that they can now use just numbers for identifiers
5. WHEN the tracking system changes, THE Spec_Manager SHALL update the prefix accordingly

### Requirement 12: Numeric Input Validation

**User Story:** Como usuario, quiero que el sistema valide que los números que ingreso son válidos, para evitar crear identificadores inválidos.

#### Acceptance Criteria

1. WHEN the user provides numeric input, THE Spec_Manager SHALL verify it is a positive integer
2. THE Spec_Manager SHALL reject negative numbers, zero, and non-integer values
3. THE Spec_Manager SHALL reject numeric input that contains leading zeros (ej: "007")
4. WHEN invalid numeric input is provided, THE Spec_Manager SHALL display an error message
5. THE Spec_Manager SHALL prompt the user to provide valid input

### Requirement 13: URL Reconstruction with Numeric Input

**User Story:** Como usuario, quiero que cuando proporciono solo un número, el sistema reconstruya la URL correctamente usando ese número, para mantener la consistencia entre identificador y URL.

#### Acceptance Criteria

1. WHEN the user provides numeric input and URL reconstruction is enabled, THE Spec_Manager SHALL use the Numeric_Portion for URL reconstruction
2. WHEN reconstructing a GitHub URL, THE Spec_Manager SHALL use the numeric value as the issue number
3. WHEN reconstructing a Jira URL, THE Spec_Manager SHALL combine the project prefix with the numeric value for the issue key
4. THE Spec_Manager SHALL present the reconstructed URL to the user for confirmation
5. WHEN the user confirms, THE Spec_Manager SHALL store both the Full_Identifier and the reconstructed URL

### Requirement 14: Documentation Updates

**User Story:** Como usuario, quiero que la documentación explique claramente cómo funciona el modo de prefijos, para aprovechar esta funcionalidad al máximo.

#### Acceptance Criteria

1. THE README.md SHALL include a section explaining prefix mode
2. THE documentation SHALL provide examples of using numeric input with GitHub
3. THE documentation SHALL provide examples of using numeric input with Jira
4. THE documentation SHALL explain how to enable and disable prefix mode
5. THE documentation SHALL document the config fields `usePrefix` and `projectPrefix`
6. THE spec-manager-schema.md SHALL be updated with the new config fields
7. THE documentation SHALL include troubleshooting tips for prefix-related issues
