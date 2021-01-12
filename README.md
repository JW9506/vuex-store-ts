### Store

```ts
// src/store/index.ts
import { createStore } from 'vuex'
import * as modules from './modules'

declare module 'vuex-store-ts' {
  interface Modules {
    (): typeof modules
  }
}

export default createStore({
  modules,
})
```

```ts
// src/store/modules/index.ts
export { default as user } from './user';
```

```ts
// src/store/modules/book.ts
import { RootState, A, C } from 'vuex-store-ts'

declare module 'vuex-store-ts' {
  interface RootState {
    book: {
      list: Read[]
    }
  }
}
type S = RootState['book']

export default {
  namespaced: true,
  state: {
    list: [],
  } as S,
  mutations: {
    setList(state: S, { payload: list }: A<Read[]>) {
      state.list.push(...list)
    },
  },
  actions: {
    async fetchBooksAsync({ commit }: C, { payload: num }: A<number>) {
      const { data } = await fetchBooks(num)
      // assert data is Read[]
      /* 0 is to strip the namespace without triggering ts error */
      commit<0>({ type: 'setList', payload: data })
      return data
    },
  },
  getters: {
    listLength(state: S) {
      return state.list.length
    },
  },
}
```

```vue
<script lang="ts">
import { useAppStore } from 'vuex-store-ts'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'Home',
  components: {},
  setup() {
    const store = useAppStore()
    // all correctly typed
    const state = computed(() => store.state)
    store.getters['book/listLength']
    store.dispatch({
        type: 'book/fetchBooksAsync',
        payload: 1,
    })
    store.getters['book/listLength']
    })
    return { }
  },
})
</script>
```
