import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-perfil.html',
  styleUrl: './user-perfil.scss'
})
export class UserPerfil {
  usuario = {
    nombre: 'Juan Pérez',
    email: 'juan.perez@example.com',
    fechaRegistro: '15 de enero de 2024',
    avatar: '👤'
  };
}

