import {configureStore, createSlice} from '@reduxjs/toolkit';
const shoppingListSlice = createSlice({
  name: 'shoppingList',
  initialState: {
    items: [],
    newItem: '',
    editItemId: null,
  },
  reducers: {
    addItem: (state, action) => {
      if (action.payload.trim() !== '') {
        state.items.push({
          id: state.items.length + 1,
          name: action.payload,
          status: 'pending',
        });
        state.newItem = '';
      }
    },
    deleteItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    editItem: (state, action) => {
      const {id, newName, index} = action.payload;
      state.items[index].name = newName;
    },
    toggleStatus: (state, action) => {
      const id = action.payload;
      state.items = state.items.map(item =>
        item.id === id
          ? {...item, status: item.status === 'pending' ? 'bought' : 'pending'}
          : item,
      );
    },
    startEditing: (state, action) => {
      state.editItemId = action.payload;
    },
    endEditing: state => {
      state.editItemId = null;
    },
    setNewItem: (state, action) => {
      state.newItem = action.payload;
    },
  },
});

const store = configureStore({
  reducer: {
    shoppingList: shoppingListSlice.reducer,
  },
});

export const {
  addItem,
  deleteItem,
  editItem,
  toggleStatus,
  startEditing,
  endEditing,
  setNewItem,
} = shoppingListSlice.actions;

export default store;
