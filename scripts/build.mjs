import { mkdir, copyFile, rm, cp } from 'node:fs/promises';
await rm('dist', {recursive:true, force:true});
await mkdir('dist', {recursive:true});
for (const file of ['index.html','style.css','mascot.css','app.js','booking.js']) await copyFile(file, `dist/${file}`);
await copyFile('.nojekyll', 'dist/.nojekyll');
await cp('assets', 'dist/assets', {recursive:true});
console.log('Built dist/');
