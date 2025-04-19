import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ServerService } from './chat/server.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit{
  message = '';
  public nombre:string="Felipe";
  serverService = inject(ServerService);
  mensajesRecibidos: string[] = [];
  maxMensajes = 8
  @ViewChild('mensajesDiv') mensajesDiv?: ElementRef;

  // Función que se llama al hacer clic en el botón
  mandarSaludo(message: string) {
    this.serverService.saludar(message);  // Enviamos el mensaje al backend
    setTimeout(() => {
      this.scrollToBottom();  // Esperar un poco para asegurarse que el DOM se ha actualizado
    }, 100);
  }

  ngOnInit() {
    // Inicializa la escucha para el evento 'mensajeBack' al cargar el componente
    this.serverService.server.on('mensajeBack', (message: string) => {
    console.log("mensaje recibido",message)
    this.mensajesRecibidos.push(message);
    if (this.mensajesRecibidos.length > this.maxMensajes) {
      this.mensajesRecibidos.unshift();
    }
    setTimeout(() => {
      this.scrollToBottom();  // Llamar después de que se haya renderizado el nuevo mensaje
    }, 100);  // Un pequeño retraso para garantizar que Angular procese los cambios
    });
    
  }

  ngAfterViewInit(): void {
   
      this.scrollToBottom();
    }
  
  
    scrollToBottom() {
      if (this.mensajesDiv && this.mensajesDiv.nativeElement) {
        this.mensajesDiv.nativeElement.scrollTop = this.mensajesDiv.nativeElement.scrollHeight;
      }
    }   
}