import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-[#0A0A0A] pt-32 pb-20 px-6 md:px-12">
      <div class="max-w-[1440px] mx-auto">
        
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 text-[#e5e2e1]">
          <div>
            <p class="text-[10px] font-black font-headline uppercase tracking-widest text-[#666] mb-4">
              Account Overview / ID_{{ authService.currentUser()?.id?.slice(-5) || '00000' }}
            </p>
            <h1 class="text-6xl md:text-9xl font-black font-headline text-white leading-[0.8] uppercase tracking-tighter">
              {{ authService.currentUser()?.first_name || 'Guest' }}<br>
              <span class="outline-text block relative">
                {{ authService.currentUser()?.last_name || 'User' }}
                <span class="absolute inset-0 blur-2xl opacity-20 bg-primary-container pointer-events-none"></span>
              </span>
            </h1>
          </div>

          <div class="flex flex-col items-end gap-6 self-stretch md:self-auto">
             <div class="text-right">
                <p class="text-[8px] font-black font-headline uppercase tracking-[0.2em] text-[#666] mb-1">Member Since</p>
                <p class="text-lg font-black font-headline uppercase text-white">
                  {{ authService.currentUser()?.created_at | date:'MMM yyyy' }}
                </p>
             </div>
             <button (click)="openEditModal()" class="px-8 py-3 bg-[#1A1A1A] border border-[#333] text-[10px] font-black font-headline uppercase tracking-widest text-white hover:bg-primary-container hover:border-primary-container transition-all">
                Edit Profile
             </button>
             <button (click)="onLogout()" class="text-[10px] font-black font-headline uppercase tracking-widest text-primary-container hover:underline">
                Sign Out
             </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 text-[#e5e2e1]">
          
          <!-- LEFT COLUMN: Account Details -->
          <div class="lg:col-span-4 space-y-12">
            
            <!-- Shipping Section -->
            <section>
              <div class="flex items-center gap-4 mb-6">
                <h2 class="text-xl font-black font-headline uppercase tracking-widest text-white">Shipping</h2>
                <div class="flex-grow h-px bg-[#1A1A1A]"></div>
                <span class="material-symbols-outlined text-primary-container text-sm">local_shipping</span>
              </div>
              
              <div class="bg-[#141414] border border-[#2A2A2A] p-6 space-y-4">
                @if (authService.currentUser()?.addresses?.[0]; as addr) {
                  <div>
                    <p class="text-[8px] font-black font-headline uppercase tracking-widest text-[#666] mb-1">Full Name</p>
                    <p class="text-sm font-bold text-white uppercase">{{ addr.first_name }} {{ addr.last_name }}</p>
                  </div>
                  <div>
                    <p class="text-[8px] font-black font-headline uppercase tracking-widest text-[#666] mb-1">Address</p>
                    <p class="text-sm font-bold text-white uppercase">{{ addr.address_1 }}</p>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-[8px] font-black font-headline uppercase tracking-widest text-[#666] mb-1">City</p>
                      <p class="text-sm font-bold text-white uppercase">{{ addr.city }}</p>
                    </div>
                    <div>
                      <p class="text-[8px] font-black font-headline uppercase tracking-widest text-[#666] mb-1">Zip Code</p>
                      <p class="text-sm font-bold text-white uppercase">{{ addr.postal_code }}</p>
                    </div>
                  </div>
                } @else {
                  <p class="text-xs text-[#666] italic font-body">No shipping address provided.</p>
                  <button class="text-[10px] font-black font-headline uppercase tracking-widest text-primary-container hover:underline mt-2">
                    Add Address
                  </button>
                }
              </div>
            </section>

            <!-- Payment Section -->
            <section>
              <div class="flex items-center gap-4 mb-6">
                <h2 class="text-xl font-black font-headline uppercase tracking-widest text-white">Payment</h2>
                <div class="flex-grow h-px bg-[#1A1A1A]"></div>
                <span class="material-symbols-outlined text-primary-container text-sm">payments</span>
              </div>
              
              <div class="space-y-4">
                <div class="bg-[#141414] border border-[#2A2A2A] p-4 flex justify-between items-center group cursor-pointer hover:border-[#444] transition-all">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-6 bg-[#222] rounded-sm flex items-center justify-center text-[8px] font-bold text-[#666]">VISA</div>
                    <div>
                    <p class="text-xs font-bold text-white uppercase tracking-widest">Ending in 4242</p>
                    <p class="text-[8px] font-black font-headline uppercase tracking-widest text-[#666]">Exp: 12/25</p>
                    </div>
                  </div>
                  <span class="material-symbols-outlined text-sm text-[#444] group-hover:text-primary-container transition-colors">edit</span>
                </div>

                <button class="w-full py-4 bg-transparent border border-dashed border-[#333] text-[10px] font-black font-headline uppercase tracking-widest text-[#666] hover:text-white hover:border-white transition-all">
                  Add New Method
                </button>
              </div>
            </section>

          </div>

          <!-- RIGHT COLUMN: Activity & Security -->
          <div class="lg:col-span-8 space-y-12">
            
            <!-- Recent Orders Section -->
            <section>
              <div class="flex items-center gap-4 mb-6">
                <h2 class="text-xl font-black font-headline uppercase tracking-widest text-white">Recent Orders</h2>
                <div class="flex-grow h-px bg-[#1A1A1A]"></div>
                <span class="material-symbols-outlined text-primary-container text-sm">inventory_2</span>
              </div>

              <div class="bg-[#141414] border border-[#2A2A2A] overflow-hidden">
                <div class="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#2A2A2A] text-[10px] font-black font-headline uppercase tracking-widest text-[#666]">
                  <div class="col-span-6 md:col-span-5">Item</div>
                  <div class="hidden md:block col-span-2 text-center">Status</div>
                  <div class="hidden md:block col-span-2 text-center">Date</div>
                  <div class="col-span-6 md:col-span-3 text-right">Investment</div>
                </div>

                <div class="divide-y divide-[#1A1A1A]">
                  @for (order of orders(); track order.id) {
                    <div class="grid grid-cols-12 gap-4 px-6 py-6 items-center group hover:bg-white/[0.02] transition-colors cursor-pointer">
                      <div class="col-span-6 md:col-span-5 flex items-center gap-4">
                        <div class="w-12 h-12 bg-[#1F1F1F] rounded-sm relative overflow-hidden flex-shrink-0">
                           <img [src]="order.items?.[0]?.thumbnail" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="order thumbnail">
                        </div>
                        <div>
                           <p class="text-xs font-bold text-white uppercase tracking-tight">{{ order.items?.[0]?.title || 'Unnamed Item' }}</p>
                           <p class="text-[8px] font-black font-headline uppercase tracking-widest text-[#444]">SKU: {{ order.items?.[0]?.variant?.sku || 'N/A' }}</p>
                        </div>
                      </div>
                      
                      <div class="hidden md:block col-span-2 text-center">
                        <span class="inline-block px-3 py-1 border border-primary-container text-[8px] font-black font-headline uppercase tracking-widest text-primary-container">
                          {{ order.status }}
                        </span>
                      </div>
                      
                      <div class="hidden md:block col-span-2 text-center">
                        <p class="text-[10px] font-bold text-[#888] font-body">{{ order.created_at | date:'dd.MM.yy' }}</p>
                      </div>

                      <div class="col-span-6 md:col-span-3 text-right">
                        <p class="text-xs font-black font-headline text-white tracking-widest">
                          {{ (order.total / 100) | currency:order.currency_code:'symbol':'1.2-2' }}
                        </p>
                      </div>
                    </div>
                  } @empty {
                    <div class="px-6 py-12 text-center">
                      <p class="text-xs text-[#444] uppercase font-bold tracking-widest italic font-body">No deployments found in your history.</p>
                      <a routerLink="/shop" class="inline-block mt-4 text-[10px] font-black font-headline uppercase tracking-widest text-primary-container hover:underline">Start Exploring</a>
                    </div>
                  }
                </div>
              </div>
            </section>

            <!-- Security & Identity Section -->
            <section>
              <div class="flex items-center gap-4 mb-6">
                <h2 class="text-xl font-black font-headline uppercase tracking-widest text-white">Security & Identity</h2>
                <div class="flex-grow h-px bg-[#1A1A1A]"></div>
                <span class="material-symbols-outlined text-primary-container text-sm">settings</span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-[#141414] border border-[#2A2A2A] p-6 space-y-4">
                  <p class="text-[8px] font-black font-headline uppercase tracking-widest text-[#666]">Email Address</p>
                  <div class="flex justify-between items-center group">
                    <p class="text-xs font-bold text-white font-body">{{ authService.currentUser()?.email }}</p>
                    <span class="material-symbols-outlined text-sm text-green-500">check_circle</span>
                  </div>
                </div>

                <div (click)="openPasswordModal()" class="bg-[#141414] border border-[#2A2A2A] p-6 space-y-4 group cursor-pointer hover:border-primary-container transition-all">
                  <div class="flex justify-between items-start">
                    <p class="text-[8px] font-black font-headline uppercase tracking-widest text-[#666]">Password Identification</p>
                    <span class="material-symbols-outlined text-sm text-primary-container">lock</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <p class="text-xs font-bold text-white tracking-tighter italic font-headline">RECONFIGURE CREDENTIALS</p>
                    <span class="material-symbols-outlined text-sm text-[#444] group-hover:text-white transition-colors">edit</span>
                  </div>
                </div>

                <div class="bg-[#141414] border border-[#A22] p-6 space-y-4 flex flex-col justify-between group cursor-pointer hover:bg-[#A11] transition-all md:col-span-2">
                  <p class="text-[8px] font-black font-headline uppercase tracking-widest text-white/50">Identity Management</p>
                  <button class="w-full text-left text-[10px] font-black font-headline uppercase tracking-widest text-white">
                    Terminate Identity
                  </button>
                </div>
              </div>
            </section>

          </div>
        </div>

      </div>
    </div>

    <!-- MODALS -->
    @if (isEditModalOpen()) {
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
        <div class="bg-[#141414] border border-[#2A2A2A] w-full max-w-lg p-10 relative overflow-hidden shadow-2xl">
          <div class="absolute top-0 right-0 p-4">
             <button (click)="isEditModalOpen.set(false)" class="text-[#666] hover:text-white transition-colors">
               <span class="material-symbols-outlined">close</span>
             </button>
          </div>
          
          <h3 class="font-headline font-black uppercase text-3xl text-white mb-8 tracking-tighter">Edit<br><span class="text-primary-container">Profile</span></h3>
          
          <form (submit)="onUpdateProfile($event)" class="space-y-6">
            <div class="grid grid-cols-2 gap-4 text-[#e5e2e1]">
              <div class="space-y-2">
                <label class="block text-[8px] font-black font-headline uppercase tracking-widest text-[#666]">First Name</label>
                <input type="text" name="first_name" [(ngModel)]="editData.first_name" required
                       class="w-full bg-[#222] border border-transparent rounded-sm px-4 py-3 text-white focus:outline-none focus:border-primary-container transition-all"
                       placeholder="MARCUS">
              </div>
              <div class="space-y-2">
                <label class="block text-[8px] font-black font-headline uppercase tracking-widest text-[#666]">Last Name</label>
                <input type="text" name="last_name" [(ngModel)]="editData.last_name" required
                       class="w-full bg-[#222] border border-transparent rounded-sm px-4 py-3 text-white focus:outline-none focus:border-primary-container transition-all"
                       placeholder="VANCE">
              </div>
            </div>

            <div class="space-y-2 text-[#e5e2e1]">
              <label class="block text-[8px] font-black font-headline uppercase tracking-widest text-[#666]">Phone Number</label>
              <input type="tel" name="phone" [(ngModel)]="editData.phone"
                     class="w-full bg-[#222] border border-transparent rounded-sm px-4 py-3 text-white focus:outline-none focus:border-primary-container transition-all font-body"
                     placeholder="+1 234 567 890">
            </div>

            <div class="pt-4 flex gap-4">
              <button type="submit" [disabled]="loading()"
                      class="flex-grow bg-primary-container text-white font-headline font-black text-xs uppercase tracking-widest py-4 rounded-sm hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-primary-container/20">
                {{ loading() ? 'Saving Changes...' : 'Save Profile' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }

    @if (isPasswordModalOpen()) {
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
        <div class="bg-[#141414] border border-[#2A2A2A] w-full max-w-lg p-10 relative overflow-hidden shadow-2xl">
          <div class="absolute top-0 right-0 p-4">
             <button (click)="isPasswordModalOpen.set(false)" class="text-[#666] hover:text-white transition-colors">
               <span class="material-symbols-outlined">close</span>
             </button>
          </div>
          
          <h3 class="font-headline font-black uppercase text-3xl text-white mb-8 tracking-tighter">Security<br><span class="text-primary-container">Protocol</span></h3>
          
          <form (submit)="onChangePassword($event)" class="space-y-6">
            <div class="space-y-2 text-[#e5e2e1]">
              <label class="block text-[8px] font-black font-headline uppercase tracking-widest text-[#666]">Current Password</label>
              <input type="password" name="old" [(ngModel)]="passwordData.old" required
                     class="w-full bg-[#222] border border-transparent rounded-sm px-4 py-3 text-white focus:outline-none focus:border-primary-container transition-all"
                     placeholder="••••••••">
            </div>

            <div class="space-y-2 text-[#e5e2e1]">
              <label class="block text-[8px] font-black font-headline uppercase tracking-widest text-[#666]">New Password</label>
              <input type="password" name="new" [(ngModel)]="passwordData.new" required
                     class="w-full bg-[#222] border border-transparent rounded-sm px-4 py-3 text-white focus:outline-none focus:border-primary-container transition-all"
                     placeholder="••••••••">
            </div>

            <div class="space-y-2 text-[#e5e2e1]">
              <label class="block text-[8px] font-black font-headline uppercase tracking-widest text-[#666]">Confirm New Password</label>
              <input type="password" name="confirm" [(ngModel)]="passwordData.confirm" required
                     class="w-full bg-[#222] border border-transparent rounded-sm px-4 py-3 text-white focus:outline-none focus:border-primary-container transition-all"
                     placeholder="••••••••">
            </div>

            @if (error()) {
              <p class="text-primary-container text-[10px] font-bold uppercase tracking-widest text-center">{{ error() }}</p>
            }

            <div class="pt-4 flex gap-4">
              <button type="submit" [disabled]="loading()"
                      class="flex-grow bg-primary-container text-white font-headline font-black text-xs uppercase tracking-widest py-4 rounded-sm hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-primary-container/20">
                {{ loading() ? 'Updating Credentials...' : 'Reconfigure' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }
    .outline-text {
      -webkit-text-stroke: 1px #444;
      color: transparent;
    }
    input::placeholder { color: #444; }
  `]
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  private router = inject(Router);

  orders = signal<any[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Modal State
  isEditModalOpen = signal<boolean>(false);
  isPasswordModalOpen = signal<boolean>(false);

  // Form Data
  editData = { first_name: '', last_name: '', phone: '' };
  passwordData = { old: '', new: '', confirm: '' };

  ngOnInit() {
    const user = this.authService.currentUser();
    if (!user) {
      this.router.navigate(['/auth']);
      return;
    }

    this.authService.getOrders().subscribe({
      next: (orders) => this.orders.set(orders),
      error: () => console.error('Failed to load orders')
    });
  }

  openEditModal() {
    const user = this.authService.currentUser();
    if (user) {
      this.editData = {
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || ''
      };
      this.isEditModalOpen.set(true);
    }
  }

  openPasswordModal() {
    this.passwordData = { old: '', new: '', confirm: '' };
    this.error.set(null);
    this.isPasswordModalOpen.set(true);
  }

  onUpdateProfile(e: Event) {
    e.preventDefault();
    this.loading.set(true);
    this.authService.updateCustomer(this.editData).subscribe({
      next: () => {
        this.loading.set(false);
        this.isEditModalOpen.set(false);
      },
      error: () => {
        this.loading.set(false);
        alert('Failed to update profile. Please check your data.');
      }
    });
  }

  onChangePassword(e: Event) {
    e.preventDefault();
    if (this.passwordData.new !== this.passwordData.confirm) {
        this.error.set('New passwords do not match');
        return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.authService.changePassword(this.passwordData.old, this.passwordData.new).subscribe({
      next: () => {
        this.loading.set(false);
        this.isPasswordModalOpen.set(false);
        alert('Security credentials successfully updated.');
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Authentication failure. Verify current password.');
      }
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
