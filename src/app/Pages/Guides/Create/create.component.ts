import { Component, signal, inject, ChangeDetectionStrategy } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import {
    GuideSpecialty,
    GuideLanguage,
    GUIDE_SPECIALTIES,
    GUIDE_LANGUAGES,
    CreateGuideRequest
} from "../../../Types/guide.types";
import { GuidesService } from "../../../Services/Guides/guides.service";
import { CardComponent } from "../../../Components/Card/card.component";

@Component({
    selector: "pg-guides-create",
    templateUrl: "./create.component.html",
    styleUrl: "./create.component.css",
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        ReactiveFormsModule,
        CardComponent
    ],
})
export class GuidesCreateComponent {
    // Services
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private guidesService = inject(GuidesService);

    // Señales para el estado del componente
    isSubmitting = signal<boolean>(false);
    submitError = signal<string>('');

    // Opciones para los selects
    readonly specialtyOptions = Object.entries(GUIDE_SPECIALTIES).map(([key, value]) => ({
        value: key as GuideSpecialty,
        label: value.name,
        icon: value.icon
    }));

    readonly languageOptions = Object.entries(GUIDE_LANGUAGES).map(([key, value]) => ({
        value: key as GuideLanguage,
        label: value.name,
        flag: value.flag
    }));

    // Formulario reactivo
    guideForm: FormGroup = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^[+]?[\d\s-()]+$/)]],
        photo: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
        location: ['', Validators.required],
        yearsExperience: [0, [Validators.required, Validators.min(0), Validators.max(50)]],
        hourlyRate: [0, [Validators.required, Validators.min(1)]],
        description: ['', [Validators.required, Validators.minLength(20)]],
        specialties: [[], [Validators.required, Validators.minLength(1)]],
        languages: [[], [Validators.required, Validators.minLength(1)]],
        certifications: [[]]
    });

    // Métodos para manejar especialidades
    onSpecialtyChange(specialty: GuideSpecialty, event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        const currentSpecialties = this.guideForm.get('specialties')?.value || [];

        if (checkbox.checked) {
            if (!currentSpecialties.includes(specialty)) {
                this.guideForm.patchValue({
                    specialties: [...currentSpecialties, specialty]
                });
            }
        } else {
            this.guideForm.patchValue({
                specialties: currentSpecialties.filter((s: GuideSpecialty) => s !== specialty)
            });
        }
    }

    // Métodos para manejar idiomas
    onLanguageChange(language: GuideLanguage, event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        const currentLanguages = this.guideForm.get('languages')?.value || [];

        if (checkbox.checked) {
            if (!currentLanguages.includes(language)) {
                this.guideForm.patchValue({
                    languages: [...currentLanguages, language]
                });
            }
        } else {
            this.guideForm.patchValue({
                languages: currentLanguages.filter((l: GuideLanguage) => l !== language)
            });
        }
    }

    // Métodos para manejar certificaciones
    onAddCertification(): void {
        const currentCertifications = this.guideForm.get('certifications')?.value || [];
        this.guideForm.patchValue({
            certifications: [...currentCertifications, '']
        });
    }

    onRemoveCertification(index: number): void {
        const currentCertifications = this.guideForm.get('certifications')?.value || [];
        currentCertifications.splice(index, 1);
        this.guideForm.patchValue({
            certifications: [...currentCertifications]
        });
    }

    onCertificationChange(index: number, value: string): void {
        const currentCertifications = this.guideForm.get('certifications')?.value || [];
        currentCertifications[index] = value;
        this.guideForm.patchValue({
            certifications: [...currentCertifications]
        });
    }

    // Verificar si una especialidad está seleccionada
    isSpecialtySelected(specialty: GuideSpecialty): boolean {
        const selectedSpecialties = this.guideForm.get('specialties')?.value || [];
        return selectedSpecialties.includes(specialty);
    }

    // Verificar si un idioma está seleccionado
    isLanguageSelected(language: GuideLanguage): boolean {
        const selectedLanguages = this.guideForm.get('languages')?.value || [];
        return selectedLanguages.includes(language);
    }

    // Obtener las certificaciones actuales
    getCertifications(): string[] {
        return this.guideForm.get('certifications')?.value || [];
    }

    // Método para enviar el formulario
    onSubmit(): void {
        if (this.guideForm.valid && !this.isSubmitting()) {
            this.isSubmitting.set(true);
            this.submitError.set('');

            const formData = this.guideForm.value;
            const createRequest: CreateGuideRequest = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                photo: formData.photo,
                location: formData.location,
                yearsExperience: formData.yearsExperience,
                hourlyRate: formData.hourlyRate,
                description: formData.description,
                specialties: formData.specialties,
                languages: formData.languages,
                certifications: formData.certifications.filter((cert: string) => cert.trim() !== '')
            };

            this.guidesService.createGuide(createRequest).subscribe({
                next: (success) => {
                    if (success) {
                        console.log('Guía creado exitosamente');
                        this.router.navigate(['/dashboard/guides']);
                    } else {
                        this.submitError.set('No se pudo crear el guía. Inténtalo de nuevo.');
                    }
                },
                error: (error) => {
                    console.error('Error al crear el guía:', error);
                    this.submitError.set('Error al crear el guía. Inténtalo de nuevo.');
                },
                complete: () => {
                    this.isSubmitting.set(false);
                }
            });
        } else {
            this.markFormGroupTouched();
        }
    }

    // Marcar todos los campos como touched para mostrar errores
    private markFormGroupTouched(): void {
        Object.keys(this.guideForm.controls).forEach(key => {
            const control = this.guideForm.get(key);
            control?.markAsTouched();
        });
    }

    // Método para cancelar y volver
    onCancel(): void {
        this.router.navigate(['/dashboard/guides']);
    }

    // Verificar si un campo tiene errores
    hasFieldError(fieldName: string): boolean {
        const field = this.guideForm.get(fieldName);
        return !!(field && field.invalid && field.touched);
    }

    // Obtener el mensaje de error de un campo
    getFieldError(fieldName: string): string {
        const field = this.guideForm.get(fieldName);
        if (field && field.errors && field.touched) {
            if (field.errors['required']) return 'Este campo es obligatorio';
            if (field.errors['email']) return 'Ingresa un email válido';
            if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
            if (field.errors['pattern']) return 'Formato inválido';
            if (field.errors['min']) return `Valor mínimo: ${field.errors['min'].min}`;
            if (field.errors['max']) return `Valor máximo: ${field.errors['max'].max}`;
        }
        return '';
    }
}
