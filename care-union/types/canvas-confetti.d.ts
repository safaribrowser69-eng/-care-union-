declare module 'canvas-confetti' {
  interface Options {
    particleCount?:number; angle?:number; spread?:number; origin?:{x?:number;y?:number}
    colors?:string[]; ticks?:number; gravity?:number; scalar?:number; zIndex?:number
  }
  function confetti(options?:Options):Promise<null>|null
  export = confetti
}
