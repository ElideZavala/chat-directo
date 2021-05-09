const { Socket } = require('socket.io')  // <== Solo realizar en desarrollo, quitar en produccion. 
const { comprobarJWT } = require('../helpers');
const { ChatMensajes } = require('../models');

// Sole se ejecutara una vez cuando el servidor se levanta
const chatMensajes = new ChatMensajes();

const socketController = async( socket = new Socket(), io ) => {

     const usuario = await comprobarJWT( socket.handshake.headers['x-token'] );     // <== headers personalizados 
     if( !usuario ) {
          return socket.disconnect();
     }
     
     // Agregar el usuario conectado
     chatMensajes.conectarUsuario( usuario );
     // io <== Es para todo el mundo
     io.emit('usuarios-activos',    chatMensajes.usuariosArr);   //  <== Mandamos los usuarios activos 
     socket.emit('recibir-mensaje', chatMensajes.ultimos10 );

     // Conectarlo a una sala especial
     socket.join( usuario.id );  // global, socket.id, usuario.id

     //Limpiar cuando alguien se desconecta
     socket.on('disconnect', () => {
          chatMensajes.desconectarUsuario( usuario.id )
     })

     // Escuchar enviar mensaje 
     socket.on('enviar-mensaje', ({ mensaje, uid }) => {

          if ( uid ) {
               // Mensaje privado
               socket.to( uid ).emit('mensaje-privado', { de: usuario.nombre, mensaje } ) // <== Mandar un socket privado usando el id
          } else {
               // Mensaje para todo el muundo
               chatMensajes.enviarMensaje( usuario.id, usuario.nombre, mensaje );
               io.emit('recibir-mensaje', chatMensajes.ultimos10 );
          }

     })


}



module.exports = {
     socketController
}