import { createServer } from 'node:http'

const server = createServer((request, response) => {
     response.write('oiii')

     return response.end()
})
 
server.listen(3333)