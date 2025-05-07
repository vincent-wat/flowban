const fs = require("fs");
const path = require("path");

const assets = ["altText_add.svg", "altText_done.svg"];

const fromDir = path.resolve(__dirname, "../public");
const toDir = path.resolve(__dirname, "../node_modules/pdfjs-dist/legacy/web/images");


if (!fs.existsSync(toDir)) {
  fs.mkdirSync(toDir, { recursive: true });
}

assets.forEach((filename) => {
  const src = path.join(fromDir, filename);
  const dest = path.join(toDir, filename);

  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(` Copied ${filename} to pdfjs-dist`);
  } else {
    console.warn(` Missing source asset: ${filename}`);
  }
});
