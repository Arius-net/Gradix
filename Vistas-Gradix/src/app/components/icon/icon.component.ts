import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `<span [innerHTML]="getIcon()"></span>`,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class IconComponent {
  @Input() name!: string;
  @Input() size: number = 20;

  getIcon(): string {
    const icons: { [key: string]: string } = {
      'graduation-cap': '🎓',
      'home': '🏠',
      'users': '👥',
      'book-open': '📚',
      'list-checks': '📋',
      'clipboard-check': '✅',
      'trending-up': '📈',
      'file-text': '📄',
      'log-out': '🚪',
      'menu': '☰',
      'x': '✕',
      'user-plus': '➕',
      'edit': '✏️',
      'trash': '🗑️'
    };
    
    return `<span style="font-size: ${this.size}px;">${icons[this.name] || '⚫'}</span>`;
  }
}
