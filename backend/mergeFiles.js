import fs from "fs";
import path from "path";

// Resolve the absolute path to avoid errors
const sourceDir = path.resolve("controllers"); // Update if the path is different
const outputFile = path.resolve("bundle.txt"); // Absolute path for safety

// Function to recursively get all JS files
function getJsFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.error(`❌ Directory not found: ${dir}`);
    return []; // Return an empty array if directory doesn't exist
  }

  let files = fs.readdirSync(dir);
  let jsFiles = [];

  files.forEach((file) => {
    let fullPath = path.join(dir, file);
    let stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      jsFiles = jsFiles.concat(getJsFiles(fullPath));
    } else if (stat.isFile() && file.endsWith(".js")) {
      jsFiles.push(fullPath);
    }
  });

  return jsFiles;
}

// Get all JS files
const jsFiles = getJsFiles(sourceDir);

if (jsFiles.length === 0) {
  console.warn("⚠️ No JavaScript files found.");
} else {
  // Read and merge files
  let mergedContent = jsFiles
    .map((file) => {
      const fileContent = fs.readFileSync(file, "utf8");
      return `// File: ${file}\n${fileContent}`;
    })
    .join("\n\n");

  // Write to output file
  fs.writeFileSync(outputFile, mergedContent, "utf8");
  console.log(`✅ Merged ${jsFiles.length} JavaScript files into ${outputFile}`);
}
