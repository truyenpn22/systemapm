const express = require('express');
const { WebSocketServer, WebSocket } = require('ws');
const http = require('http');
const app = express();
const port = 5500;
const rxjs = require('rxjs');
const { map, mergeMap, delay } = require('rxjs/operators');

app.use(express.static(__dirname));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

function generateServiceData() {
    return rxjs.interval(5000).pipe(
        map(() => {
            const numServices = Math.floor(Math.random() * 20) + 1;
            const serviceDataArray = [];
            for (let i = 1; i <= numServices; i++) {
                const serviceName = `Service${i}`;
                const existingServiceIndex = serviceDataArray.findIndex(serviceData => serviceData.name === serviceName);
                if (existingServiceIndex !== -1) {
                    const existingService = serviceDataArray[existingServiceIndex];
                    console.log(existingService);
                    const numRequestsListService = Math.floor(Math.random() * 5);
                    for (let j = 0; j < numRequestsListService; j++) {
                        const timeIn = (Math.floor(Math.random() * 15000) + 1000);
                        const timeOut = timeIn + Math.floor(Math.random() * 3000);
                        const newService = {
                            id: Math.floor(Math.random() * 10000000),
                            name: serviceName,
                            timeIn: timeIn,
                            timeOut: timeOut,
                            actions: ['register', 'WEB', 'unregister']
                        };
                        existingService.listService.push(newService);
                    }
                } else {
                    const serviceData = {
                        id: Math.floor(Math.random() * 10000000),
                        name: serviceName,
                        listService: []
                    };
                    const numRequestsListService = Math.floor(Math.random() * 5);
                    for (let j = 0; j < numRequestsListService; j++) {
                        const timeIn = (Math.floor(Math.random() * 15000) + 1000);
                        const timeOut = timeIn + Math.floor(Math.random() * 3000);
                        const newService = {
                            id: Math.floor(Math.random() * 10000000),
                            name: serviceName,
                            timeIn: timeIn,
                            timeOut: timeOut,
                            actions: ['register', 'WEB', 'unregister']
                        };
                        serviceData.listService.push(newService);
                    }
                    serviceDataArray.push(serviceData);
                }
            }
            return serviceDataArray;
        }),
    );
}

const serviceDataObservable = generateServiceData();

wss.on('connection', function connection(ws) {
    console.log('A new client connected.');

    const subscription = serviceDataObservable.subscribe(serviceDataArray => {
        ws.send(JSON.stringify(serviceDataArray));
    });

    ws.on('close', () => {
        console.log('Client has disconnected.');
        subscription.unsubscribe();
    });

});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

