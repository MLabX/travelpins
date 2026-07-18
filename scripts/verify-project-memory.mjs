import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root=process.cwd();
const failures=[];

function walk(directory){
  return fs.readdirSync(directory,{withFileTypes:true}).flatMap((entry)=>{
    const full=path.join(directory,entry.name);
    return entry.isDirectory()?walk(full):[full];
  });
}

const markdown=[
  path.join(root,"AGENTS.md"),
  path.join(root,"PROJECT_MEMORY.md"),
  ...walk(path.join(root,"docs","project-memory")).filter((file)=>file.endsWith(".md")),
];

for(const file of markdown){
  const source=fs.readFileSync(file,"utf8");
  for(const match of source.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)){
    const target=match[1].trim().replace(/^<|>$/g,"").split("#")[0];
    if(!target||/^(?:https?:|mailto:)/.test(target)) continue;
    const resolved=path.resolve(path.dirname(file),decodeURIComponent(target));
    if(!fs.existsSync(resolved)) failures.push(`${path.relative(root,file)} -> ${target}`);
  }
}

const manifestPath=path.join(root,"docs","project-memory","manifest.json");
let manifest;
try{
  manifest=JSON.parse(fs.readFileSync(manifestPath,"utf8"));
}catch(error){
  failures.push(`manifest.json is invalid: ${error.message}`);
}

for(const file of manifest?.keyDocuments||[]){
  if(!fs.existsSync(path.join(root,file))) failures.push(`manifest keyDocument missing: ${file}`);
}

if(failures.length){
  console.error("Project memory verification failed:\n"+failures.map((item)=>`- ${item}`).join("\n"));
  process.exit(1);
}

console.log(`Project memory verified: ${markdown.length} Markdown files and ${manifest.keyDocuments.length} key documents.`);
