import { detectIntent } from './brain/intentEngine.js';
import { extractEntities } from './brain/entityExtractor.js';
import { aiBrain } from './brain/aiBrain.js';

console.log("Intent Test 'open vscode':", detectIntent("open vscode"));
console.log("Intent Test 'show mern projects':", detectIntent("show mern projects"));
console.log("Entity Test 'show mern projects':", extractEntities("show mern projects"));
console.log("Intent Test 'resme':", detectIntent("resme"));
console.log("Intent Test 'compare campushub and interview prep':", detectIntent("compare campushub and interview prep"));
console.log("Entity Test 'compare campushub and interview prep':", extractEntities("compare campushub and interview prep"));

// We cannot fully test aiBrain easily in Node if it uses zustand windowStore inside actionExecutor
