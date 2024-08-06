const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

function generateRandomData() {
  function generateRandomNumber(min, max, decimalPlaces) {
    const randomNumber = Math.random() * (max - min) + min;
    return Number(randomNumber.toFixed(decimalPlaces));
  }

  function generateOrders(count) {
    return Array.from({ length: count }, () => {
      const price = generateRandomNumber(50000, 60000, 1);
      const amount = generateRandomNumber(0.1, 10, 4);
      const total = generateRandomNumber(0.1, 10, 4);

      return {
        price: price.toFixed(1),
        amount: amount.toFixed(4),
        total: total.toFixed(4),
      };
    });
  }

  return {
    buyData: generateOrders(25),
    sellData: generateOrders(25)
  };
}

wss.on('connection', (ws) => {
  console.log('Client connected');

  const interval = setInterval(() => {
    const data = generateRandomData();
    ws.send(JSON.stringify(data));
  }, 1000);

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});