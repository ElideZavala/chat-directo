// Asi luciran todos los mensajes guardados 
class Mensaje {

     constructor(uid, nombre, mensaje ) {
          this.uid     = uid;
          this.nombre  = nombre;
          this.mensaje = mensaje
     }
}



class ChatMensajes {

     constructor() {
          this.mensajes = [];
          this.usuarios = {}
     }

     get ultimos10() {
          //Retornar los ultimos 10 mensajes
          this.mensajes = this.mensajes.splice(0,10);   // <== cortar los mensajes del 0 al 10
          return this.mensajes;
     }

     get usuariosArr() {
          return Object.values( this.usuarios ); // [ {}, {} {} ]  <== Los convierte en un arreglo
     }

     enviarMensaje( uid, nombre, mensaje ) {
          this.mensajes.unshift(                       // <== Inserta un nuevo elemento al inicio del arreglo 
               new Mensaje(uid, nombre, mensaje)
          );
     }

     conectarUsuario( usuario ) {
          this.usuarios[usuario.id] = usuario;         // <== Agregamos la llave id a usuarios
     }

     desconectarUsuario( id ) {
          delete this.usuarios[id]
     }

 }


module.exports = ChatMensajes;