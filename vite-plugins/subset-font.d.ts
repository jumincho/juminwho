// subset-font ships no type declarations; this covers the part hangulFont.ts uses.
declare module 'subset-font' {
  interface SubsetOptions {
    targetFormat?: 'sfnt' | 'woff' | 'woff2' | 'truetype'
  }

  export default function subsetFont(font: Buffer, text: string, options?: SubsetOptions): Promise<Buffer>
}
