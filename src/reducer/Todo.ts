import { Todo } from '../models/Todo';
import { Action } from '../actions/Todo';
import { ActionTodoConstants } from '../constants/Todo';

// 定义State的接口
export interface State {
  todos: Todo[];
}

export const initialState: State = {
  todos: [],
};

// 把定义的Action给action参数声明
export function reducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case ActionTodoConstants.ADD_TODO: {
      const todo = action.payload;
      return {
        ...state,
        todo: [...state.todos, todo],
      };
    }
    case ActionTodoConstants.TOGGLE_TODO: {
      const { id } = action.payload;
      return {
        ...state,
        todos: state.todos.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)),
      };
    }
    default:
      return state;
  }
}
