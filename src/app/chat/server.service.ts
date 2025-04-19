import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  public message: string = '';
 


  server = io('https://chat-wandering-leaf-6384.fly.dev', {
    transports: ['websocket'],
  });

  constructor() {
    this.server.on("connect", () => {
      console.log("Conectado al backend");
      
   
    });

    this.server.on("mensajeBack", (message: string) => {
      console.log("Mensaje recibido del servidor:", message);
      this.message=message;
    });

    this.server.connect();  // Luego activas la conexión aquí
  
  }

  saludar(message:string) {
    this.server.emit('recibirFront', message);  // Enviamos el mensaje con el evento 'howdy'
  }

  entraCliente(message:string) {
    this.server.emit('entraCliente', message);  // Enviamos el mensaje con el evento 'howdy'
  }



}

