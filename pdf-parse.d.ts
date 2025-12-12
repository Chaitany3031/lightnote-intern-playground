declare module 'pdf-parse' {
  function PDFParse(buffer: Buffer): Promise<{
    text: string;
    numpages: number;
    info: any;
    version: string;
  }>;
  export = PDFParse;
}