import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ServerService } from './server.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterOutlet],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, AfterViewInit{


  constructor(private route: ActivatedRoute) { }
  
  message = '';
  public nombre:string="";
  serverService = inject(ServerService);
  mensajesRecibidos: string[] = [];
  maxMensajes = 8
  @ViewChild('mensajesDiv') mensajesDiv?: ElementRef;

// Función que se llama al hacer clic en el botón
mandarSaludo(message: string) {
  if (message && message.trim() !== '') { // Verifica si el mensaje no está vacío
    this.serverService.saludar(this.nombre+": "+message); // Enviamos el mensaje al backend
   

    this.message = ''; // Limpiamos el valor de la variable message
    setTimeout(() => {
      this.scrollToBottom(); // Esperar un poco para asegurarse que el DOM se ha actualizado
    }, 100);
  }
  // Si el mensaje está vacío, la función simplemente no hace nada
}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.nombre = params['nombre'];
      this.serverService.entraCliente(this.nombre + " se conectó al chat"); 
    });
    
    // Inicializa la escucha para el evento 'mensajeBack' al cargar el componente
    this.serverService.server.on('mensajeBack', (message: string) => {
 
 
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