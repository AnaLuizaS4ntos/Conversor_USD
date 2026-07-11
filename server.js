//import { createServer } from 'node:http'

//const server = createServer((request, response) => {
    // response.write('oiii')

     //return response.end()
//})
 
//server.listen(3333)

import { fastify } from 'fastify'

const server = fastify({})

//porta hibrida
const porta = process.env.PORT || 3333;

//rotas 
server.get('/home', () =>{
     return 'History - Default'
})

server.get('/compare', () =>{
     return 'Compare'
})

server.get('/favorites', () =>{
     return 'Favorites'
})

server.get('/log', () =>{
     return 'log'
})


//rota hibrida pra nuvem e pra localhost
const start = async () => {
     try{
          await server.listen({
               port: porta,
               host: '0.0.0.0'
          })
     }catch(err){
          server.log.error(err)
          process.exit(1)
     }
}

start()


