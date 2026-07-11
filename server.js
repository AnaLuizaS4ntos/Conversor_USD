//import { createServer } from 'node:http'

//const server = createServer((request, response) => {
    // response.write('oiii')

     //return response.end()
//})
 
//server.listen(3333)

import { fastify } from 'fastify'

const server = fastify({})

//porta hibrida / hybrid port
const porta = process.env.PORT || 3333;

//rotas / route
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
     return 'Log'
})


//rota hibrida pra nuvem e pra localhost / hybrid port for a cloud and a localhost
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


