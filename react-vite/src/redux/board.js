import { createSelector } from 'reselect';
import { normalizeObj } from './helper';
import { thunkGetPins } from './pin';


// Action Types
const GET_BOARD = 'boards/GET_BOARD';
const GET_BOARDS = 'boards/GET_BOARDS';
const ADD_BOARD = 'boards/ADD_BOARD';
const DELETE_BOARD = 'boards/DELETE_BOARD';
const EDIT_BOARD = 'boards/EDIT_BOARD';
// const ADD_PIN = 'boards/ADD_PIN';
const POST_BOARD_PINS = 'boards/POST_BOARD_PINS';


// Custom Selectors
export const selectSingleBoard = (id) => createSelector(
     (state) => state.boards,
     (boards) => boards[id]
);

export const selectBoards = () => createSelector(
     (state) => state.boards,
     (boards) => Object.values(boards)
);


// Action Creators
export const getBoard = (board) => ({
     type: GET_BOARD,
     payload: board
});

export const getBoards = (boards) => ({
     type: GET_BOARDS,
     payload: boards
});

export const addBoard = (board) => ({
     type: ADD_BOARD,
     payload: board
});

const editBoard = (board) => ({
     type: EDIT_BOARD,
     payload: board
});

export const deleteBoard = (boardId) => ({
     type: DELETE_BOARD,
     payload: boardId
});

const postBoardPins = (pin) => ({
     type: POST_BOARD_PINS,
     payload: pin
})

// export const addPin = (pin) => ({
//      type: ADD_PIN,
//      payload: pin
// });


// Thunks
// Get a Board Thunk
export const thunkGetBoard = (boardId) => async (dispatch) => {
     if (!boardId) return;
     const res = await fetch(`/api/board/${boardId}/`);

     if (res.ok) {
          const { board } = await res.json();
          dispatch(getBoard(board));
          return board;
     }

     const data = await res.json();
     if(data.errors) return data;
}


// Get all Boards Thunk
export const thunkGetBoards = () => async (dispatch) => {
     const res = await fetch('/api/board/');

     // console.log("resFROMTHUNK===>", res)

     if (res.ok) {
          const { boards } = await res.json();
          dispatch(getBoards(boards));
          return boards;
     }

     const data = await res.json();
     if(data.errors) return data;
}


// Post a Board Thunk
export const thunkAddBoard = (board) => async (dispatch) => {
     const formData = new FormData();
     for (let key of Object.keys(board))
          formData.append(key, board[key]);

     const res = await fetch('/api/board/board-creation-tool/', {
          method: 'POST',
          body: formData
     });

     if (res.ok) {
          const { board } = await res.json();
          // dispatch(thunkDeleteBoardPins())
          dispatch(addBoard(board));
          return board;
     }

     const data = await res.json();
     if(data.errors) return data;
}



// Edit a Board Thunk
export const thunkUpdateBoard = (board) => async (dispatch) => {
     const { boardId } = board;

     const formData = new FormData();
     formData.append('title', board['title']);
     formData.append('description', board['description']);
     formData.append('board_pic', board['board_pic']);


     const res = await fetch(`/api/board/${boardId}/edit/`, {
          method: 'POST',
          body: formData
     });

     // console.log("res FROM THUNK===>", res)

     if (res.ok) {
          const edit_board = await res.json();
          dispatch(editBoard(board));
          return edit_board;
     }else {
          const data = await res.json();
          if(data.errors){
               return data
          }
     }

}


// Delete a Board Thunk
export const thunkDeleteBoard = (boardId) => async (dispatch) => {
     const res = await fetch(`/api/board/${boardId}/`, {
          method: 'DELETE'
     });

     if (res.ok) {
          const { board } = await res.json();
          dispatch(deleteBoard(boardId));
          dispatch(thunkGetPins())
          return board;
     }

     const data = await res.json();
     if(data.errors) return data;
}


// Post a Pin to a Board Thunk
export const thunkPostBoardPins = (boardId, pin) => async (dispatch) => {
     // console.log('PIN FROM THUNKPOSTBOARDPINS=====>', pin['pin_link'])
     //正确✅

     const data = new FormData();
     data.append('pin_link', pin['pin_link'])
     data.append('title', pin['title'])
     data.append('description', pin['description'])

     // console.log('DATA FROM THUNKPOSTBOARDPINS=====>', data)
//      const entries = data.entries();
//     for (const entry of entries) {
//         console.log('DATAentry FROM THUNKPOSTBOARDPINS=====>', entry);
//     }

     const response = await fetch(`/api/board/${boardId}/add-pin/`, {
          method: 'POST',
          body: data
     });

     // console.log("response FROM POST BOARD PINS===>", response)

     if (response.ok) {
          const post_pin = await response.json();
          dispatch(postBoardPins(post_pin));
          return post_pin;
     } else {
          const data = await response.json();
          if(data.errors) return data;
     }

}

// Reducer
const initialState = { boards: {}, postedBoardPins: {} };

const boardsReducer = (state = initialState, action) => {
     let newState;
     switch (action.type) {
          case GET_BOARD:
               newState = { ...state };
               newState[action.payload.id] = action.payload;
               return newState;

          case GET_BOARDS:
               newState = {...normalizeObj(action.payload)}
               return newState;

          case ADD_BOARD:
               newState = { ...state };
               newState[action.payload.id] = action.payload;
               return newState;

          case EDIT_BOARD:
               return {
                    ...state,
                    board: action.payload
               }

          case DELETE_BOARD:
               newState = { ...state };
               delete newState[action.payload];
               return newState;

          case POST_BOARD_PINS:
               newState = { ...state };
               newState.postedBoardPins = newState.postedBoardPins || {}; // 检查并初始化
               const { id, ...pinData } = action.payload;
               newState.postedBoardPins[id] = pinData;
               return newState;



          default:
               return state;
     }
}

export default boardsReducer;
