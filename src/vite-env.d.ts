/// <reference types="vite/client" />

import type { DefineComponent } from 'vue'

declare module '*.vue' {
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Vue 3 compiler macros type declarations
import type { EmitsOptions } from 'vue'

declare global {
  function defineEmits<EE extends string = string>(
    emits: EE[]
  ): (name: EE, ...args: any[]) => void
  function defineEmits<E extends EmitsOptions = EmitsOptions>(
    emits?: E
  ): (name: string, ...args: any[]) => void
  function defineEmits<EE extends string = string, E extends EmitsOptions = EmitsOptions>(
    emits: EE[] | E
  ): (name: EE | string, ...args: any[]) => void
}
