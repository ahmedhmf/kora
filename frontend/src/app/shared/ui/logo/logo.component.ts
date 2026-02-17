import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  template: `
    <div class="flex items-center gap-3 group pointer-events-none">
      <svg [attr.width]="width" [attr.height]="height" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="transition-transform group-hover:scale-110">
        <!-- Outer Shape (Red background) -->
        <path d="M20 10C15 10 10 15 10 20V70C10 75 15 80 20 80H25L20 95L45 80H80C85 80 90 75 90 70V20C90 15 85 10 80 10H20Z" fill="#EF0000"/>
        <!-- Inner "K" Shape (White) -->
        <path d="M35 25L30 35V65L35 75H45L40 65V55L50 65V75H65L55 60L75 25H60L45 45L45 25H35Z" fill="white"/>
      </svg>
      @if (showText) {
        <span class="text-2xl font-black uppercase tracking-[0.2em] transition-colors" [style.color]="isWhite ? 'white' : 'var(--color-primary)'">
          KORA
        </span>
      }
    </div>
  `,
  styles: [`
    :host { display: inline-block; }
  `]
})
export class LogoComponent {
  @Input() width: string = '48';
  @Input() height: string = '48';
  @Input() showText: boolean = true;
  @Input() isWhite: boolean = false;
}
