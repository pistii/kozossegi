import { createStore } from 'vuex';

export default createStore({
  state: {
    currentPage: 1
  },
  actions: {
  },
  getters: {
    currentPage: state => state.currentPage,
  }
});

