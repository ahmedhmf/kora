import { Injectable } from '@angular/core';
import Medusa from '@medusajs/js-sdk';

@Injectable({
  providedIn: 'root'
})
export class MedusaService {
  private medusa: Medusa;

  constructor() {
    this.medusa = new Medusa({
      baseUrl: 'http://localhost:9001',
      publishableKey: 'pk_949bf3ed8fe302298a4c82f1ddeb35445d298706c91132cc54952abd13597c14',
      globalHeaders: {
        'x-publishable-api-key': 'pk_949bf3ed8fe302298a4c82f1ddeb35445d298706c91132cc54952abd13597c14'
      },
      debug: true
    });
  }

  get client() {
    return this.medusa;
  }
}
