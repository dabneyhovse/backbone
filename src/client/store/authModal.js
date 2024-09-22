/**
 * Author:	Nick Jasinski
 * Date:		2022-08-13
 *
 * Authmodal state functions, allows for making the modal appear
 * and showing loaded status
 */

// const UPDATE_MODAL_STATUS = "UPDATE_MODAL_STATUS";
const LOADED_AUTH = "LOADED_AUTH";

// export const updateModalStatus = (status, isLoggedIn) => {
//   if (!isLoggedIn && !status) {
//     return {
//       type: UPDATE_MODAL_STATUS,
//       status: true,
//     };
//   }
//   return {
//     type: UPDATE_MODAL_STATUS,
//     status,
//   };
// };

// export const updateModalVisibility = (invisible) => {
//   if (invisible) {
//     document.body.style.overflow = "hidden";
//   } else {
//     document.body.style.overflow = "";
//   }
//   return {
//     type: UPDATE_MODAL_STATUS,
//     status: invisible,
//   };
// };

export const loadedAuth = () => {
  return { type: LOADED_AUTH };
};

const init = {
  // visible: false,
  loaded: false,
};

export default function (state = init, action) {
  switch (action.type) {
    // case UPDATE_MODAL_STATUS:
    //   return { ...state, visible: action.status };
    case LOADED_AUTH:
      return { ...state, loaded: true };
    default: {
      return state;
    }
  }
}
