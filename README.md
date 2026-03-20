# pearpass-utils-password-check

A utility library to check the strength of passwords and passphrases based on configurable rules.

## Table of Contents

- [Features](#features)
- [Security Notice](#security-notice)
- [Installation](#installation)
- [Usage Examples](#usage-examples)
- [Dependencies](#dependencies)
- [Related Projects](#related-projects)

## Features

This utility provides functions to check the strength of passwords and passphrases based on configurable rules:

**Password Validation:**
- Minimum length requirements
- Uppercase and lowercase character inclusion
- Number inclusion
- Special character inclusion

**Passphrase Validation:**
- Minimum word count
- Unique words verification
- Capital letter inclusion
- Symbol inclusion
- Number inclusion

## Security Notice

1. To ensure the security and integrity of your projects, please note that official PearPass packages are distributed exclusively through our GitHub organization.
2. Any packages with similar names found on the npm registry or other third-party package managers are not affiliated with PearPass and should be strictly avoided. We recommend installing directly from this repository to ensure you are using the verified, open-source version.

## Installation

```bash
npm install git+https://github.com/tetherto/pearpass-utils-password-check.git
```

## Usage Examples

### Checking Password Strength
```javascript
import { checkPasswordStrength } from '@tetherto/pearpass-utils-password-check';

// With default rules
const result = checkPasswordStrength('Test123!');
console.log(result.strengthType); // safe

// With custom rules
const customResult = checkPasswordStrength('Test1234', {
    length: 8,
    includeSpecialChars: false,
    lowerCase: true,
    upperCase: true,
    numbers: true
});
console.log(customResult.strengthType); // safe
console.log(customResult.rules); // Detailed rules assessment
```

### Checking Passphrase Strength
```javascript
import { checkPassphraseStrength } from '@tetherto/pearpass-utils-password-check';

// With default rules
const words = ['Test1!', 'Word2@', 'Example3#', 'Unique', 'Safe', 'Pass', 'Phrase', 'Another4$'];
const result = checkPassphraseStrength(words);
console.log(result.strength); // safe

// With custom rules
const customResult = checkPassphraseStrength(words, {
    capitalLetters: true,
    symbols: true,
    numbers: true,
    words: 6
});
console.log(customResult.strengthType); // safe
console.log(customResult.rules); // Detailed rules assessment
```

## Dependencies

This package has no runtime dependencies.

## Related Projects

- [@tetherto/pearpass-app-mobile](https://github.com/tetherto/pearpass-app-mobile) - A mobile app for PearPass, a password manager
- [@tetherto/pearpass-app-desktop](https://github.com/tetherto/pearpass-app-desktop) - A desktop app for PearPass, a password
- [@tetherto/pearpass-lib-ui-react-native-components](https://github.com/tetherto/pearpass-lib-ui-react-native-components) - A library of React Native UI components for PearPass
- [@tetherto/pearpass-lib-ui-react-components](https://github.com/tetherto/pearpass-lib-ui-react-components) - A library of React UI components for PearPass
- [@tetherto/tether-dev-docs](https://github.com/tetherto/tether-dev-docs) - Documentations and guides for developers

## License

This project is licensed under the Apache License, Version 2.0. See the [LICENSE](./LICENSE) file for details.