const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  if (dir.includes('node_modules') || dir.includes('.git') || dir.includes('out')) return filelist;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    const dirent = fs.statSync(dirFile);
    if (dirent.isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.match(/\.(ts|json|md|html)$/)) {
        filelist.push(dirFile);
      }
    }
  }
  return filelist;
};

const files = walkSync(__dirname);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  content = content.replace(/AutoDev/g, 'ArchEngine');
  content = content.replace(/autodev/g, 'archengine');
  content = content.replace(/AUTODEV/g, 'ARCHENGINE');
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
console.log('Rename complete!');
