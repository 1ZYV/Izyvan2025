/**
 * Utilidades compartidas para validación de formularios
 */

import { AbstractControl, ValidationErrors } from '@angular/forms';

// Mensajes de error estándar
export const VALIDATION_MESSAGES = {
    required: 'Este campo es obligatorio',
    email: 'Email inválido',
    pattern: {
        licensePlate: 'Formato inválido (ej: ABC-123)',
        licenseNumber: 'Formato inválido (ej: LIC-12345)',
        phone: 'Formato de teléfono inválido',
        default: 'Formato inválido'
    },
    minlength: (requiredLength: number) => `Mínimo ${requiredLength} caracteres`,
    maxlength: (requiredLength: number) => `Máximo ${requiredLength} caracteres`,
    min: (min: number) => `Valor mínimo: ${min}`,
    max: (max: number) => `Valor máximo: ${max}`
} as const;

// Función para obtener mensaje de error de un campo
export function getFieldError(control: AbstractControl | null, fieldName?: string): string | null {
    if (!control || !control.errors || !control.touched) {
        return null;
    }

    const errors = control.errors;

    if (errors['required']) {
        return VALIDATION_MESSAGES.required;
    }

    if (errors['email']) {
        return VALIDATION_MESSAGES.email;
    }

    if (errors['pattern']) {
        if (fieldName === 'licensePlate') {
            return VALIDATION_MESSAGES.pattern.licensePlate;
        } else if (fieldName === 'licenseNumber') {
            return VALIDATION_MESSAGES.pattern.licenseNumber;
        } else if (fieldName?.includes('Phone') || fieldName?.includes('phone')) {
            return VALIDATION_MESSAGES.pattern.phone;
        }
        return VALIDATION_MESSAGES.pattern.default;
    }

    if (errors['minlength']) {
        return VALIDATION_MESSAGES.minlength(errors['minlength'].requiredLength);
    }

    if (errors['maxlength']) {
        return VALIDATION_MESSAGES.maxlength(errors['maxlength'].requiredLength);
    }

    if (errors['min']) {
        return VALIDATION_MESSAGES.min(errors['min'].min);
    }

    if (errors['max']) {
        return VALIDATION_MESSAGES.max(errors['max'].max);
    }

    return null;
}

// Función para verificar si un campo es inválido
export function isFieldInvalid(control: AbstractControl | null): boolean {
    return !!(control && control.invalid && control.touched);
}

// Validadores personalizados
export class CustomValidators {
    static licensePlate(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (!value) return null;

        const pattern = /^[A-Z0-9]{3}-[A-Z0-9]{3}$/;
        return pattern.test(value) ? null : { pattern: true };
    }

    static licenseNumber(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (!value) return null;

        const pattern = /^LIC-[A-Z0-9]{5}$/;
        return pattern.test(value) ? null : { pattern: true };
    }

    static phone(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (!value) return null;

        const pattern = /^\+?[0-9\s\-]{9,15}$/;
        return pattern.test(value) ? null : { pattern: true };
    }

    static futureDate(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (!value) return null;

        const inputDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return inputDate > today ? null : { futureDate: true };
    }

    static currentOrFutureYear(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (!value) return null;

        const currentYear = new Date().getFullYear();
        const inputYear = parseInt(value, 10);

        if (inputYear < 1990) {
            return { min: { min: 1990, actual: inputYear } };
        }

        if (inputYear > currentYear + 1) {
            return { max: { max: currentYear + 1, actual: inputYear } };
        }

        return null;
    }
}

// Función para generar ID único
export function generateUniqueId(prefix: string): string {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substr(2, 9);
    return `${prefix}-${timestamp}-${randomStr}`;
}

// Función para limpiar datos del formulario
export function sanitizeFormData<T extends Record<string, any>>(data: T): T {
    const cleaned = { ...data } as any;

    // Limpiar strings
    Object.keys(cleaned).forEach(key => {
        if (typeof cleaned[key] === 'string') {
            cleaned[key] = cleaned[key].trim();
            // Convertir strings vacíos a undefined
            if (cleaned[key] === '') {
                cleaned[key] = undefined;
            }
        }
    });

    return cleaned;
}
