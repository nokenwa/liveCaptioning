const path = require('path');
const fastify = require('fastify')();
const PORT = process.env.PORT || 5000;

fastify.register(require('fastify-static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/public/',
});
fastify.register(require('fastify-websocket'));

fastify.get('/', (request, reply) => {
   reply.send('Hiya, Your Live Captioner is ready.') 
})

fastify.get('/livecaptions', (request, reply) => {
    reply.sendFile('captions.html')
});

fastify.get('/microphone', (requrest, reply) => {
    reply.sendFile('microphone.html')
})

fastify.get('/websocket', { websocket: true }, (connection, req) => {
    
    connection.socket.on('message', message => {
        fastify.websocketServer.clients.forEach(client => {
            client.send(message);
        })
    });
  })

fastify.listen(PORT, (err) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    fastify.log.info('server listening on Port 3000')
});