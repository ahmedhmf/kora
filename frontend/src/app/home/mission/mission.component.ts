import { Component } from '@angular/core';

@Component({
  selector: 'app-mission',
  standalone: true,
  imports: [],
  templateUrl: './mission.component.html',
  styleUrl: './mission.component.scss'
})
export class MissionComponent {
  stats = [
    { value: '99.9%', label: 'Kinetic Precision' },
    { value: '0.02s', label: 'Response Delta' },
    { value: 'PRO',   label: 'Verified Standard' },
  ];
}
