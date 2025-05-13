const GET_PIN = 'pins/GET_PIN';
const GET_PINS = 'pins/GET_PINS';
// Post wait AWS
const POST_PIN = 'pins/POST_PIN';
const EDIT_PIN = 'pins/EDIT_PIN';
const DELETE_PIN = 'pins/DELETE_PIN';

const POST_COMMENT = 'pins/POST_COMMENT';
const EDIT_COMMENT = 'pins/EDIT_COMMENT';
const DELETE_COMMENT = 'pins/DELETE_COMMENT';

const POST_BOARD_PINS = 'pins/POST_BOARD_PINS';
const DELETE_BOARD_PINS = 'pins/DELETE_BOARD_PINS';

const ADD_LIKE = 'pins/ADD_LIKE';
const DELETE_LIKE = 'pins/DELETE_LIKE';


// Action Creators
const getPin = (pin) => ({
     type: GET_PIN,
     payload: pin
});

const getPins = (pins) => ({
     type: GET_PINS,
     payload: pins
})

const postPin = (pin) => ({
     type: POST_PIN,
     payload: pin
})

const editPin = (pin) => ({
     type: EDIT_PIN,
     payload: pin
})

const deletePin = (pin) => ({
     type: DELETE_PIN,
     payload: pin
})


const postComment = (comment) => ({
     type: POST_COMMENT,
     payload: comment
})

export const editComment = (comment) => ({
     type: EDIT_COMMENT,
     payload: comment
})

const deleteComment = (commentId) => ({
     type: DELETE_COMMENT,
     payload: commentId
})


const postBoardPins = (pin) => ({
     type: POST_BOARD_PINS,
     payload: pin
})

const deleteBoardPins = () => ({
     type: DELETE_BOARD_PINS,
})

const addLike = (pinId, current_user, pin) => ({
     type: ADD_LIKE,
     payload: {pinId, current_user, pin}
})

const deleteLike = (pinId, current_user) => ({
     type: DELETE_LIKE,
     payload: {pinId, current_user}
})


// Thunks
// Get One Pin
export const thunkGetPin = (pinId) => async (dispatch) => {
     const response = await fetch(`/api/pin/${pinId}`);

     if(response.ok){
          const pin = await response.json();
          dispatch(getPin(pin));
          return pin
     }
     const data = await response.json();
     if (data.errors) return data;
}

// Get All Pins
export const thunkGetPins = () => async (dispatch) => {
     const response = await fetch('/api/pin/');

     if(response.ok){
          const pins = await response.json();
          dispatch(getPins(pins));
          return pins
     }
     const data = await response.json();
     if (data.errors) return data;
}

// Post A Pin
export const thunkPostPin = (pin) => async (dispatch) => {
     const data = new FormData();
     data.append('pin_link', pin['pin_link'])
     data.append('title', pin['title'])
     data.append('description', pin['description'])

     const response = await fetch('/api/pin/pin-creation-tool/', {
          method: 'POST',
          body: data
     })
     // console.log("RESPONSE FROM THUNK===>", response)

     if (response.ok) {
          const new_pin = await response.json();
          dispatch(postPin(new_pin));
          return new_pin;
     } else {
          const data = await response.json();
          if (data.errors){
               return data
          }
     }
}

// Edit a pin
export const thunkEditPin = (pin) => async (dispatch) => {
     const { pinId } = pin
     // console.log("PINID FROM THUNK", pinId)
     const formData = new FormData();
     formData.append('pin_link', pin['pin_link'])
     formData.append('title', pin['title'])
     formData.append('description', pin['description'])

     const response = await fetch (`/api/pin/${pinId}/edit/`, {
          method: 'POST',
          body: formData
     })
     // console.log("response FROM EDIT THUNK", response)

     if (response.ok){
          const edit_pin = await response.json()
          dispatch(editPin(edit_pin))
          return edit_pin
     } else {
          const data = await response.json();
          if(data.errors){
               return data
          }
     }

}

// Delete a pin
export const thunkDeletePin = (pinId) => async (dispatch) => {
     const response = await fetch(`/api/pin/${pinId}`, {
          method: 'DELETE',
     })

     if (response.ok) {
          const delete_pin = await response.json()
          dispatch(deletePin(delete_pin))
          return delete_pin;
     } else {
          const data = await response.json();
          if(data.errors){
               return data
          }
     }
}

// Post a Comment
export const thunkPostComment = (pinId, comment) => async (dispatch) => {
     // console.log('COMMENT FROM THUNK====>', comment)
     const response = await fetch(`/api/pin/${pinId}/comments/`, {
          method: 'POST',
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(comment)
     })
     // console.log("RESPONSE FROM THUNK ====>", response)

     if (response.ok) {
          const post_comment = await response.json()
          // console.log('POST COMMENT FROM THUNK===>', post_comment)
          dispatch(postComment(post_comment))
          return post_comment
     } else {
          const data = await response.json();
          if(data.errors){
               return data
          }
     }
}


// Edit a Comment
export const thunkEditComment = (pinId, comment) => async (dispatch) => {
     // console.log('PINID, COMMENT FROM THUNK===>', pinId, comment)
     const response = await fetch(`/api/pin/${pinId}/comments/${comment.id}/`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(comment)
     })
     // console.log('RESPONSE FROM THUNK====>', response)

     if(response.ok) {
          const edit_comment = await response.json()
          dispatch(editComment(edit_comment))
          // console.log("EDIT_COMMENT FROM THUNK====>", edit_comment)
          return edit_comment
     } else {
          const data = await response.json();
          if(data.errors){
               return data
          }
     }
}

// Delete a comment
export const thunkDeleteComment = (pinId, commentId) => async (dispatch) => {
     // console.log('PINID, COMMENTId FROM THUNK===>', pinId, commentId)
     const response = await fetch(`/api/pin/${pinId}/comments/${commentId}/`, {
          method: 'DELETE'
     })
     // console.log('RESPONSE FROM DELETE THUNK====>', response)

     if (response.ok){
          const delete_comment = await response.json()
          dispatch(deleteComment(delete_comment))
          // console.log("DELETE_COMMENT FROM THUNK====>", delete_comment)
          // return delete_comment;
     } else {
          const data = await response.json();
          if(data.errors){
               return data
          }
     }
}


// post a BoardPins
export const thunkPostBoardPins = (pin) => async (dispatch) => {
     pin = await dispatch(thunkPostPin(pin));
     // console.log("PIN FROM THUNK===>", pin)

     dispatch(postBoardPins(pin));
     // console.log("PIN FROM THUNK after postBoardPins===>", pin)
     return pin;
}


// delete a BoardPins
export const thunkDeleteBoardPins = () => async (dispatch) => {
     dispatch(deleteBoardPins());
}


// add a like
export const thunkAddLike = (pinId, current_user) => async (dispatch) => {
     const response = await fetch(`/api/pin/${pinId}/like/`, {
          method: 'POST',
     })

     const pin = await response.json();
     if(pin.message === 'added like'){
          dispatch(addLike(pinId, current_user, pin))
          return 1
     } else if (pin.message === 'deleted like'){
          dispatch(deleteLike(pinId, current_user))
          return -1
     }
     return 0
}



const initialState = { pins: {}, postedBoardPins: {} }

const pinReducer = (state=initialState, action) => {
     let newState;
     switch(action.type) {

          case GET_PIN:
               newState = { ...state }
               newState.pins[action.payload.id] = action.payload;
               return newState;

          case GET_PINS:
               newState = { ...state }
               newState.pins = action.payload;
               return newState;

          case POST_PIN:
               newState = { ...state }
               newState.pins = { ...state.pins, [action.payload.id]: action.payload };
               return newState;

          case EDIT_PIN:
               return {
                    ...state,
                    pin: action.payload
               };

          case DELETE_PIN:
               newState = { ...state }
               newState.pins = { ...state.pins };
               delete newState.pins[action.pinId];
               return newState;

          case POST_COMMENT:
               newState = { ...state }
               newState.pins = { ...state.pins, [action.payload.id]: action.payload };
               return newState;

          case EDIT_COMMENT:
               newState = { ...state, pins: { ...state.pins } }; // 创建新对象以确保不直接修改原始 state
               const editedComment = action.payload;

               // 找到被编辑的评论并更新
               newState.pins[editedComment.pin_id].comments = newState.pins[editedComment.pin_id].comments.map(comment =>
               comment.id === editedComment.id ? { ...comment, comment: editedComment.comment } : comment);
               return newState;

          case DELETE_COMMENT:
               newState = { ...state };
               delete newState.pins[action.payload];
               return newState

          case POST_BOARD_PINS:
               return {
                    ...state,
                    postedBoardPins: { ...state.postedBoardPins, [action.payload.id]: action.payload }
                  };

          case DELETE_BOARD_PINS:
               newState = { ...state };
               const postedBoardPinsIds = Object.keys(newState.postedBoardPins);
               postedBoardPinsIds.forEach((pinId) => {
                    delete newState.pins[pinId];
               });

               newState.postedBoardPins = {};
               return newState;

          case ADD_LIKE:
               newState = { ...state };
               newState.pins = {...state.pins, [action.payload.id]: action.payload}
               return newState;

          default:
               return state;
     }
}


export default pinReducer;
