// Type declaration for the deep import that bypasses pdf-parse's debug-mode
// index.js (which reads a test fixture at import time).
declare module "pdf-parse/lib/pdf-parse.js" {
  import pdfParse from "pdf-parse";
  export default pdfParse;
}
