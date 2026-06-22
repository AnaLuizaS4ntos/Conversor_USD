//import { createServer } from 'node:http'

//const server = createServer((request, response) => {
    // response.write('oiii')

     //return response.end()
//})
 
//server.listen(3333)

import { fastify } from 'fastify'

const server = fastify({

})

const porta = process.env.PORT || 3333;

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

