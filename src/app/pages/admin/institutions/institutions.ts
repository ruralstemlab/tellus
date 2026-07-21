import { Component, OnInit, OnDestroy, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { InstitutionService } from '../../../core/services/institution.service';
import { Institution } from '../../../core/models/institution.model';

@Component({
  selector: 'app-institutions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './institutions.html',
  styleUrls: ['./institutions.scss']
})
export class InstitutionsComponent implements OnInit, OnDestroy {
  // Signal para el estado reactivo
  institutions = signal<Institution[]>([]);
  filteredInstitutions = signal<Institution[]>([]);
  searchTerm = signal<string>('');
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);

  // Modal
  showModal = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  currentInstitution = signal<Institution>(this.getEmptyInstitution());
  modalError = signal<string>('');

  // Notificaciones
  notification = signal<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  private subscription = new Subscription();

  constructor(private institutionService: InstitutionService) {
    // Efecto para filtrar automáticamente cuando cambia la búsqueda o las instituciones
    effect(() => {
      const term = this.searchTerm().toLowerCase().trim();
      const all = this.institutions();
      if (!term) {
        this.filteredInstitutions.set(all);
        return;
      }
      this.filteredInstitutions.set(
        all.filter(inst =>
          inst.name.toLowerCase().includes(term) ||
          inst.municipality.toLowerCase().includes(term) ||
          inst.department.toLowerCase().includes(term)
        )
      );
    });
  }

  ngOnInit(): void {
    this.loadInstitutions();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadInstitutions(): void {
    this.isLoading.set(true);
    this.subscription.add(
      this.institutionService.getInstitutions().subscribe({
        next: (data) => {
          this.institutions.set(data);
          this.filteredInstitutions.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error cargando instituciones:', err);
          this.showNotification('Error al cargar las instituciones', 'error');
          this.isLoading.set(false);
        }
      })
    );
  }

  getEmptyInstitution(): Institution {
    return {
      id: '',
      name: '',
      municipality: '',
      department: '',
      country: '',
      active: true,
      logoUrl: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // Abrir modal para crear
  openCreateModal(): void {
    this.isEditing.set(false);
    this.currentInstitution.set(this.getEmptyInstitution());
    this.modalError.set('');
    this.showModal.set(true);
  }

  // Abrir modal para editar
  openEditModal(institution: Institution): void {
    this.isEditing.set(true);
    this.currentInstitution.set({ ...institution });
    this.modalError.set('');
    this.showModal.set(true);
  }

  // Cerrar modal
  closeModal(): void {
    this.showModal.set(false);
    this.modalError.set('');
  }

  // Guardar institución
  saveInstitution(): void {
    const inst = this.currentInstitution();

    // Validaciones
    if (!inst.name.trim()) {
      this.modalError.set('El nombre es obligatorio');
      return;
    }
    if (!inst.municipality.trim()) {
      this.modalError.set('El municipio es obligatorio');
      return;
    }
    if (!inst.department.trim()) {
      this.modalError.set('El departamento es obligatorio');
      return;
    }
    if (!inst.country.trim()) {
      this.modalError.set('El país es obligatorio');
      return;
    }

    this.isSaving.set(true);
    this.modalError.set('');

    const data = {
      name: inst.name.trim(),
      municipality: inst.municipality.trim(),
      department: inst.department.trim(),
      country: inst.country.trim(),
      active: inst.active ?? true,
      logoUrl: inst.logoUrl || ''
    };

    if (this.isEditing() && inst.id) {
      this.institutionService.updateInstitution(inst.id, data).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.showModal.set(false);
          this.showNotification('Institución actualizada correctamente', 'success');
          this.loadInstitutions();
        },
        error: (err) => {
          this.isSaving.set(false);
          this.modalError.set('Error al actualizar: ' + err.message);
          this.showNotification('Error al actualizar la institución', 'error');
        }
      });
    } else {
      this.institutionService.createInstitution(data).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.showModal.set(false);
          this.showNotification('Institución creada correctamente', 'success');
          this.loadInstitutions();
        },
        error: (err) => {
          this.isSaving.set(false);
          this.modalError.set('Error al crear: ' + err.message);
          this.showNotification('Error al crear la institución', 'error');
        }
      });
    }
  }

  // Toggle activo/inactivo
  toggleInstitution(institution: Institution): void {
    const newStatus = !institution.active;
    this.institutionService.toggleInstitution(institution.id, newStatus).subscribe({
      next: () => {
        this.showNotification(
          `Institución ${newStatus ? 'activada' : 'desactivada'} correctamente`,
          'success'
        );
        this.loadInstitutions();
      },
      error: (err) => {
        console.error('Error al cambiar estado:', err);
        this.showNotification('Error al cambiar el estado de la institución', 'error');
      }
    });
  }

  // Sistema de notificaciones (reutiliza el estilo de Tellus)
  private showNotification(message: string, type: 'success' | 'error' | 'info'): void {
    this.notification.set({ message, type });
    setTimeout(() => {
      this.notification.set(null);
    }, 4000);
  }

  // Limpiar notificación
  clearNotification(): void {
    this.notification.set(null);
  }
}