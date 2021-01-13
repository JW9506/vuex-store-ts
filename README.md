# vuex-store-ts

#### This util provides user with type hints when using vuex, from defining to calling, with minimum boilerplate.

### Exported JavaScript contains no logics

```js
import { useStore } from 'vuex'
export function defineSlice(namespace, _) {
  return _
}
export function useAppStore() {
  return useStore()
}
```

### Install

```bash
yarn add vuex-store-ts -D
npm i vuex-store-ts -D
```

### Example

```ts
// src/store/index.ts
import { StoreType } from 'vuex-store-ts'
import { createStore } from 'vuex'
import * as modules from './modules'

declare module 'vuex-store-ts' {
  interface Modules {
    (): typeof modules
  }
}

export default createStore({
  modules,
}) as StoreType
```

```ts
// src/store/modules/index.ts
export { default as user } from './user'
export { default as loading } from './loading'
```

```ts
// src/store/modules/user.ts
import { defineSlice, A } from 'vuex-store-ts'

declare module 'vuex-store-ts' {
  interface RootState {
    user: {
      isLogin: boolean
    }
  }
}

export default defineSlice('user', {
  state: {
    isLogin: false,
  },
  mutations: {
    setLogin(state, { payload }: A<boolean>) {
      state.isLogin = payload
    },
  },
  actions: {
    async login({ commit }, { payload }: A<boolean>) {
      commit({ type: 'loading/setLoading', payload: true })
      const flag = await loginBusiness(payload)
      commit({ type: 'setLogin', payload: flag })
      commit({ type: 'loading/setLoading', payload: false })
    },
  },
})

function loginBusiness(flag: boolean) {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(flag)
    }, 800)
  })
}
```

```ts
// src/store/modules/loading.ts
import { defineSlice, A } from 'vuex-store-ts'

declare module 'vuex-store-ts' {
  interface RootState {
    loading: {
      isLoading: boolean
    }
  }
}

export default defineSlice('loading', {
  namespaced: true,
  state: {
    isLoading: false,
  },
  mutations: {
    setLoading(state, { payload: flag }: A<boolean>) {
      state.isLoading = flag
    },
  },
})
```

```vue
<template>
  <div>Home</div>
  <pre>{{ state }}</pre>
  <button @click="login">login</button>
  <button @click="logout">logout</button>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useAppStore } from 'vuex-store-ts'
export default defineComponent({
  name: 'Home',
  setup() {
    const store = useAppStore()
    const state = computed(() => store.state)
    const login = () => {
      store.dispatch({ type: 'login', payload: true })
    }
    const logout = () => {
      store.dispatch({ type: 'login', payload: false })
    }
    return {
      login,
      logout,
      state,
    }
  },
})
</script>
```
