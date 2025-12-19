import { PASSWORD_STRENGTH } from './constants'
import { getPassStrength } from './utils/getPassStrength'
import { getStrengthDisplay } from './utils/getStrengthDisplay'

/**
 * @param {string} password
 * @param {Object} [config={}]
 * @param {Object} [config.rules={}]
 * @param {number} [config.rules.length=8]
 * @param {boolean} [config.rules.includeSpecialChars=true]
 * @param {boolean} [config.rules.lowerCase=true]
 * @param {boolean} [config.rules.upperCase=true]
 * @param {boolean} [config.rules.numbers=true]
 * @param {Object} [config.errors={}]
 * @returns {{
 *  success: boolean,
 *  type: 'vulnerable' | 'weak' | 'safe',
 *  strengthType: 'error' | 'warning' | 'success',
 *  strengthText: string,
 *  rules: Record<string, boolean>,
 *  errors: string[]
 * }}
 */
export const checkPasswordStrength = (password, config = {}) => {
  const { rules = {}, errors = {} } = config

  const {
    length = 8,
    includeSpecialChars = true,
    lowerCase = true,
    upperCase = true,
    numbers = true
  } = rules

  const rulesCheck = {
    minLength: password.length >= length,
    hasLowerCase: lowerCase ? /[a-z]/.test(password) : true,
    hasUpperCase: upperCase ? /[A-Z]/.test(password) : true,
    hasNumbers: numbers ? /\d/.test(password) : true,
    hasSymbols: includeSpecialChars
      ? /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)
      : true
  }

  const failedRules = Object.keys(rulesCheck).filter(
    (rule) => !rulesCheck[rule]
  )
  const errorMessages = failedRules.map((rule) => errors[rule])
  const type = getPassStrength(rulesCheck)
  const strengthDisplay = getStrengthDisplay(type)

  return {
    success: type === PASSWORD_STRENGTH.SAFE && errorMessages.length === 0,
    type,
    strengthType: strengthDisplay.type,
    strengthText: strengthDisplay.text,
    rules: rulesCheck,
    errors: errorMessages
  }
}

/**
 * Validates a password change operation
 * @param {Object} params
 * @param {string} params.currentPassword - The current password
 * @param {string} params.newPassword - The new password to validate
 * @param {string} [params.repeatPassword] - The repeated new password to verify
 * @param {Object} [params.messages] - Pre-translated error messages
 * @param {string} [params.messages.newPasswordMustDiffer] - Error when new password equals current
 * @param {string} [params.messages.passwordsDontMatch] - Error when passwords don't match
 * @param {Object} [params.config={}] - Configuration for password strength check
 * @param {Object} [params.config.rules={}] - Password rules configuration
 * @param {Object} [params.config.errors={}] - Error messages for password rules
 * @returns {{
 *  success: boolean,
 *  error: string | null,
 *  field: 'newPassword' | 'repeatPassword' | null,
 *  strengthResult: Object | null
 * }}
 */
export const validatePasswordChange = (params) => {
  const {
    currentPassword,
    newPassword,
    repeatPassword,
    messages = {},
    config = {}
  } = params

  const strengthResult = checkPasswordStrength(newPassword, config)

  if (!strengthResult.success) {
    return {
      success: false,
      error:
        strengthResult.errors.length > 0
          ? strengthResult.errors.join(', ')
          : null,
      field: 'newPassword',
      strengthResult
    }
  }

  if (newPassword === currentPassword) {
    return {
      success: false,
      error: messages.newPasswordMustDiffer,
      field: 'newPassword',
      strengthResult: null
    }
  }

  // Check if passwords match (only if repeatPassword is provided)
  if (repeatPassword !== undefined && newPassword !== repeatPassword) {
    return {
      success: false,
      error: messages.passwordsDontMatch,
      field: 'repeatPassword',
      strengthResult: null
    }
  }

  return {
    success: true,
    error: null,
    field: null,
    strengthResult
  }
}
