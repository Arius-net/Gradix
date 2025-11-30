import { Injectable, signal } from '@angular/core';

export interface ConfirmDialogConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export interface ConfirmDialogData extends ConfirmDialogConfig {
  id: string;
  resolve: (value: boolean) => void;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  dialogs = signal<ConfirmDialogData[]>([]);

  confirm(config: ConfirmDialogConfig): Promise<boolean> {
    return new Promise((resolve) => {
      const id = `confirm-${Date.now()}-${Math.random()}`;
      const dialogData: ConfirmDialogData = {
        ...config,
        id,
        confirmText: config.confirmText || 'Confirmar',
        cancelText: config.cancelText || 'Cancelar',
        type: config.type || 'danger',
        resolve
      };
      
      this.dialogs.update(dialogs => [...dialogs, dialogData]);
    });
  }

  close(id: string, confirmed: boolean): void {
    const dialog = this.dialogs().find(d => d.id === id);
    if (dialog) {
      dialog.resolve(confirmed);
      this.dialogs.update(dialogs => dialogs.filter(d => d.id !== id));
    }
  }
}
