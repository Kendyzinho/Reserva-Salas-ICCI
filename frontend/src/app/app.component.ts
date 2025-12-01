import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GestionarSalaComponent } from './features/admin/gestionar-sala/gestionar-sala.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'reservas';
}
