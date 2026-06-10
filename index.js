import http from 'http'
import {app}  from './src/app.js'


const server = http.createServer(app);



try {
    
    server.listen(3000, ()=> {
        console.log("App is listen on port 3000 : http://localhost:3000");
    })
    
} catch (err) {

    console.log("Error ins server listen :", err);
    
}