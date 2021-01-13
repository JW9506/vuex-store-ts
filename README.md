## vuex-store-ts
### Create store module by using the following pattern provide users with type hints
```bash
yarn add vuex-store-ts -D
npm i vuex-store-ts -D
```
```ts
// src/store/index.ts
import { createStore, StoreType } from 'vuex'
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
export { default as user } from './user';
```

```ts
// src/store/modules/book.ts
import { RootState, A, defineSlice } from 'vuex-store-ts'

declare module 'vuex-store-ts' {
  interface RootState {
    book: {
      list: Read[]
    }
  }
}
type S = RootState['book']

export default defineSlice({
  namespace: 'book',
  namespaced: true,
  state: {
    list: [],
  },
  mutations: {
    setList(state, { payload: list }: A<Read[]>) {
      state.list.push(...list)
    },
  },
  actions: {
    async fetchBooksAsync({ commit }, { payload: num }: A<number>) {
      const { data } = await fetchBooks(num)
      // assert data is Read[]
      /* 0 is to strip the namespace without triggering ts error */
      commit<0>({ type: 'setList', payload: data })
      return data
    },
  },
  getters: {
    listLength(state) {
      return state.list.length
    },
  },
})
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
