// This tells TypeScript that importing images is totally valid
declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg';
declare module '*.png';