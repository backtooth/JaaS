import { mkdir, copyFile, rm } from 'node:fs/promises';
await rm('dist', {recursive:true, force:true});
await mkdir('dist', {recursive:true});
for (const file of ['index.html','style.css','app.js','booking.js']) await copyFile(file, `dist/${file}`);
await copyFile('.nojekyll', 'dist/.nojekyll');
console.log('Built dist/');
