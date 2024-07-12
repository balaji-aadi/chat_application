import http from  'http'
import SocketService from './services/socket.js'

async function init(){
    const socketService = new SocketService()
    const httpServer = http.createServer()
    const port = 8000

    socketService.io.attach(httpServer)

    httpServer.listen(port, () => {
        console.log(`http server is running on port ${port}`)
    })

    socketService.initListeners()
}


init()