import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
const files = {'/':'index.html','/index.html':'index.html','/style.css':'style.css','/app.js':'app.js','/booking.js':'booking.js'};
const types = {html:'text/html; charset=utf-8',css:'text/css',js:'text/javascript'};
createServer(async(req,res)=>{try{const file=files[new URL(req.url,'http://localhost').pathname];if(!file){res.writeHead(404);return res.end('Not found');}res.setHeader('Content-Type',types[file.split('.').pop()]);res.end(await readFile(file));}catch{res.writeHead(500);res.end('Server error');}}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
