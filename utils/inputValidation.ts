import { emailRegex, passwordRegex } from "@/constants/Regex";
import { Validation } from "@/types/types";

export const validateEmail = (email: string): Validation => {
    if (email.length === 0) {
        return {
            isValid: false,
            message: 'Please enter an e-mail'
        }
    } else if (!emailRegex.test(email)) {
        return {
            isValid: false,
            message: 'Invalid E-mail address'
        }
    } else {
        return {
            isValid: true,
            message: ''
        }
    }
}

export const validatePassword = (password: string): Validation => {
    if (password.length === 0) {
        return {
            isValid: false,
            message: 'Please enter your password'
        }
    } else if (!passwordRegex.test(password)) {
        return {
            isValid: false,
            message: 'Password must be: \n * Minimum length of 8 characters \n * At least one lowercase and one uppercase letter.\n * At least one digit.\n * At least one special character (!@#$%^&*).'
        }
    } else {
        return {
            isValid: true,
            message: ''
        }
    }
}

export const validateConfirmationPassword = (passowrd: string, confirmPassword: string): Validation => {
    if (confirmPassword.length === 0) {
        return {
            isValid: false,
            message: 'Please confirm your password'
        }
    } else if (passowrd != confirmPassword) {
        return {
            isValid: false,
            message: 'Password does not match'
        }
    } else {
        return {
            isValid: true,
            message: ''
        }
    }
}