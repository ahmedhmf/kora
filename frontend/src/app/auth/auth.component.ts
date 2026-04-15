import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen pt-24 pb-12 flex items-center justify-center bg-[#0A0A0A] relative overflow-hidden">
      <!-- Background Text Overlay -->
      <div class="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
        <h1 class="text-[40vw] font-black font-headline text-white leading-none">KORA</h1>
      </div>

      <div class="relative z-10 w-full max-w-lg px-6">
        @if (mode() === 'login') {
          <!-- Login View -->
          <div class="text-center mb-12">
            <span class="inline-block px-4 py-1 bg-white/5 border border-white/10 text-[10px] font-bold tracking-[0.2em] font-headline uppercase text-on-surface-variant mb-6">
              Performance Access
            </span>
            <h1 class="text-5xl md:text-7xl font-black font-headline text-white leading-none uppercase tracking-tighter mb-4">
              Log In To<br>Kora
            </h1>
            <p class="text-on-surface-variant text-sm font-medium tracking-tight">
              Enter your credentials to synchronize your performance data.
            </p>
          </div>

          <form (submit)="onLogin($event)" class="space-y-6">
            <div class="space-y-2">
              <label class="block text-[10px] font-black font-headline uppercase tracking-widest text-[#A0A0A0]">Email Address</label>
              <div class="relative group">
                <input type="email" name="email" [(ngModel)]="loginData.email" required
                       class="w-full bg-[#141414] border border-[#2A2A2A] rounded-sm px-4 py-4 text-white focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                       placeholder="NAME@KORA-GEAR.COM">
                <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary-container opacity-50 group-focus-within:opacity-100 italic">alternate_email</span>
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-[10px] font-black font-headline uppercase tracking-widest text-[#A0A0A0]">Password</label>
              <div class="relative group">
                <input type="password" name="password" [(ngModel)]="loginData.password" required
                       class="w-full bg-[#141414] border border-[#2A2A2A] rounded-sm px-4 py-4 text-white focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                       placeholder="••••••••••••">
                <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary-container opacity-50 group-focus-within:opacity-100">lock</span>
              </div>
            </div>

            <button type="submit" [disabled]="loading()"
                    class="w-full bg-primary-container text-white font-headline font-black text-sm uppercase tracking-widest py-5 rounded-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary-container/20 disabled:opacity-50">
              {{ loading() ? 'AUTHENTICATING...' : 'Access Account' }}
            </button>

            @if (error()) {
              <p class="text-primary-container text-center text-xs font-bold">{{ error() }}</p>
            }

            <div class="flex justify-between items-center pt-8 border-t border-[#1A1A1A]">
              <a href="#" class="text-[10px] font-black font-headline uppercase tracking-widest text-[#A0A0A0] hover:text-white transition-colors">Forgot Password</a>
              <div class="w-1.5 h-1.5 bg-[#1A1A1A] rounded-full"></div>
              <button type="button" (click)="mode.set('register')" class="text-[10px] font-black font-headline uppercase tracking-widest text-[#A0A0A0] hover:text-white transition-colors">Create Account</button>
            </div>
          </form>
        } @else {
          <!-- Register View -->
          <div class="text-center mb-12">
            <h1 class="text-5xl md:text-7xl font-black font-headline text-white leading-none uppercase tracking-tighter mb-4">
              Join the<br><span class="text-primary-container">Elite</span>
            </h1>
            <p class="text-on-surface-variant text-sm font-medium tracking-tight">
              Unlock professional-grade apparel and performance metrics engineered for the 1%.
            </p>
          </div>

          <form (submit)="onRegister($event)" class="space-y-6 bg-[#141414] p-8 rounded-sm border border-[#2A2A2A] relative">
            <div class="space-y-2">
              <label class="block text-[10px] font-black font-headline uppercase tracking-widest text-[#A0A0A0]">Full Name</label>
              <input type="text" name="name" [(ngModel)]="registerData.name" required
                     class="w-full bg-[#222] border border-transparent rounded-sm px-4 py-4 text-white focus:outline-none focus:border-primary-container transition-all"
                     placeholder="ERIK VANCE">
            </div>

            <div class="space-y-2">
              <label class="block text-[10px] font-black font-headline uppercase tracking-widest text-[#A0A0A0]">Email Address</label>
              <input type="email" name="email" [(ngModel)]="registerData.email" required
                     class="w-full bg-[#222] border border-transparent rounded-sm px-4 py-4 text-white focus:outline-none focus:border-primary-container transition-all"
                     placeholder="ERIK@KORA.COM">
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="block text-[10px] font-black font-headline uppercase tracking-widest text-[#A0A0A0]">Password</label>
                <input type="password" name="password" [(ngModel)]="registerData.password" required
                       class="w-full bg-[#222] border border-transparent rounded-sm px-4 py-4 text-white focus:outline-none focus:border-primary-container transition-all"
                       placeholder="••••••••">
              </div>
              <div class="space-y-2">
                <label class="block text-[10px] font-black font-headline uppercase tracking-widest text-[#A0A0A0]">Confirm Password</label>
                <input type="password" name="confirm" [(ngModel)]="registerData.confirm" required
                       class="w-full bg-[#222] border border-transparent rounded-sm px-4 py-4 text-white focus:outline-none focus:border-primary-container transition-all"
                       placeholder="••••••••">
              </div>
            </div>

            <label class="flex items-center gap-3 cursor-pointer group py-2">
              <input type="checkbox" name="newsletter" [(ngModel)]="registerData.newsletter" class="hidden">
              <div class="w-5 h-5 border border-[#444] rounded-sm flex items-center justify-center transition-all group-active:scale-95"
                   [class.bg-primary-container]="registerData.newsletter"
                   [class.border-primary-container]="registerData.newsletter">
                 @if (registerData.newsletter) {
                   <span class="material-symbols-outlined text-white text-base font-bold">check</span>
                 }
              </div>
              <span class="text-[10px] font-black font-headline uppercase tracking-widest text-[#A0A0A0] select-none">Join Kora Performance Labs (Newsletter)</span>
            </label>

            <button type="submit" [disabled]="loading()"
                    class="w-full bg-primary-container text-white font-headline font-black text-sm uppercase tracking-widest py-5 rounded-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary-container/20 disabled:opacity-50 mt-4">
              {{ loading() ? 'CREATING...' : 'Create Account' }}
            </button>

            @if (error()) {
              <p class="text-primary-container text-center text-xs font-bold mt-4">{{ error() }}</p>
            }

            <div class="pt-6 border-t border-[#1F1F1F] text-center">
               <button type="button" (click)="mode.set('login')" class="text-[10px] font-black font-headline uppercase tracking-widest text-[#A0A0A0] hover:text-white transition-colors">
                  Log In
               </button>
            </div>
          </form>
        }
      </div>
      
      <!-- Footer Text -->
      <div class="absolute bottom-6 w-full text-center pointer-events-none opacity-40">
        <p class="text-[10px] font-black font-headline uppercase tracking-[0.3em] text-on-surface-variant">
          Est. 2024 © Kora Performance Technology
        </p>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    input::placeholder { color: #444; }
  `]
})
export class AuthComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  mode = signal<'login' | 'register'>('login');
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  loginData = { email: '', password: '' };
  registerData = { name: '', email: '', password: '', confirm: '', newsletter: false };

  onLogin(e: Event) {
    e.preventDefault();
    this.loading.set(true);
    this.error.set(null);

    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error.set('Invalid credentials. Please try again.');
        this.loading.set(false);
      }
    });
  }

  onRegister(e: Event) {
    e.preventDefault();
    if (this.registerData.password !== this.registerData.confirm) {
        this.error.set('Passwords do not match');
        return;
    }

    this.loading.set(true);
    const [first_name, ...last_name] = this.registerData.name.split(' ');
    
    this.authService.register({
      email: this.registerData.email,
      password: this.registerData.password,
      first_name,
      last_name: last_name.join(' '),
    }).subscribe({
      next: () => {
        this.mode.set('login');
        this.loading.set(false);
        this.error.set('Account created. Please log in.');
      },
      error: (err) => {
        this.error.set('Failed to create account. Please check your data.');
        this.loading.set(false);
      }
    });
  }
}
