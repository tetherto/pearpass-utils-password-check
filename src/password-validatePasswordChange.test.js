import { validatePasswordChange } from './password'

describe('validatePasswordChange', () => {
  const errors = {
    minLength: 'Password must be at least 8 characters long',
    hasLowerCase: 'Password must contain at least one lowercase letter',
    hasUpperCase: 'Password must contain at least one uppercase letter',
    hasNumbers: 'Password must contain at least one number',
    hasSymbols: 'Password must contain at least one special character'
  }

  it('should fail when new password is same as current password', () => {
    const result = validatePasswordChange({
      currentPassword: 'MyPassword123!',
      newPassword: 'MyPassword123!',
      messages: {
        newPasswordMustDiffer:
          'New password must be different from the current password.'
      },
      config: { errors }
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe(
      'New password must be different from the current password.'
    )
    expect(result.field).toBe('newPassword')
    expect(result.strengthResult).toBeNull()
  })

  it('should use translate function for same password error', () => {
    const result = validatePasswordChange({
      currentPassword: 'MyPassword123!',
      newPassword: 'MyPassword123!',
      messages: {
        newPasswordMustDiffer:
          'Le nouveau mot de passe doit être différent du mot de passe actuel.'
      },
      config: { errors }
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe(
      'Le nouveau mot de passe doit être différent du mot de passe actuel.'
    )
    expect(result.field).toBe('newPassword')
  })

  it('should fail when new password is weak', () => {
    const result = validatePasswordChange({
      currentPassword: 'MyPassword123!',
      newPassword: 'weak',
      config: { errors }
    })

    expect(result.success).toBe(false)
    expect(result.error).toContain(
      'Password must be at least 8 characters long'
    )
    expect(result.field).toBe('newPassword')
    expect(result.strengthResult).not.toBeNull()
  })

  it('should succeed when new password is different and strong', () => {
    const result = validatePasswordChange({
      currentPassword: 'OldPassword123!',
      newPassword: 'NewPassword456!',
      config: { errors }
    })

    expect(result.success).toBe(true)
    expect(result.error).toBeNull()
    expect(result.field).toBeNull()
    expect(result.strengthResult).not.toBeNull()
    expect(result.strengthResult.success).toBe(true)
  })

  it('should handle empty config', () => {
    const result = validatePasswordChange({
      currentPassword: 'OldPassword123!',
      newPassword: 'OldPassword123!',
      messages: {
        newPasswordMustDiffer:
          'New password must be different from the current password.'
      }
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe(
      'New password must be different from the current password.'
    )
  })

  it('should pass through strength config to checkPasswordStrength', () => {
    const result = validatePasswordChange({
      currentPassword: 'OldPassword',
      newPassword: 'NewPassword',
      config: {
        rules: {
          length: 8,
          includeSpecialChars: false,
          lowerCase: false,
          upperCase: false,
          numbers: false
        }
      }
    })

    expect(result.success).toBe(true)
    expect(result.error).toBeNull()
    expect(result.field).toBeNull()
  })

  it('should fail when passwords do not match', () => {
    const result = validatePasswordChange({
      currentPassword: 'OldPassword123!',
      newPassword: 'NewPassword456!',
      repeatPassword: 'DifferentPassword789!',
      messages: {
        passwordsDontMatch: 'Passwords do not match'
      },
      config: { errors }
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe('Passwords do not match')
    expect(result.field).toBe('repeatPassword')
    expect(result.strengthResult).toBeNull()
  })

  it('should succeed when passwords match', () => {
    const result = validatePasswordChange({
      currentPassword: 'OldPassword123!',
      newPassword: 'NewPassword456!',
      repeatPassword: 'NewPassword456!',
      config: { errors }
    })

    expect(result.success).toBe(true)
    expect(result.error).toBeNull()
    expect(result.field).toBeNull()
    expect(result.strengthResult).not.toBeNull()
  })

  it('should skip repeat password check if not provided', () => {
    const result = validatePasswordChange({
      currentPassword: 'OldPassword123!',
      newPassword: 'NewPassword456!',
      config: { errors }
    })

    expect(result.success).toBe(true)
    expect(result.error).toBeNull()
    expect(result.field).toBeNull()
  })
})
