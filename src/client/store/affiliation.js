/**
 * Author:	Nick Jasinski
 * Date:		2022-09-03
 *
 * Redux state handler for affiliation shit
 * this isnt neccessary, but i didnt want to put
 * all of the state including the options into the
 * react frontend.
 *
 * //TODO dynamically load the options from the server
 */

// import axios from "axios";
// import { toast } from "react-toastify";

// /**
//  * Affiliation options users are provided
//  *
//  * unaffilated just is absence of houses
//  *
//  * TODO put this in a config file somewhere
//  */
// export const AFFILATION_OPTIONS = {
//   "Dabney Social": { house: "dabney", status: "social" },
//   "Dabney Full": { house: "dabney", status: "full" },

//   "Blacker Social": { house: "blacker", status: "social" },
//   "Blacker Full": { house: "blacker", status: "full" },

//   "Fleming Social": { house: "fleming", status: "social" },
//   "Fleming Full": { house: "fleming", status: "full" },

//   "Venerable Social": { house: "venerable", status: "social" },
//   "Venerable Full": { house: "venerable", status: "full" },

//   "Page Social": { house: "page", status: "social" },
//   "Page Full": { house: "page", status: "full" },

//   "Lloyd Social": { house: "lloyd", status: "social" },
//   "Lloyd Full": { house: "lloyd", status: "full" },

//   "Avery Social": { house: "avery", status: "social" },
//   "Avery Full": { house: "avery", status: "full" },

//   "Ricketts Full": { house: "ricketts", status: "full" },
// };

// /**
//  * ACTION TYPES
//  */
// const GOT_AFFILATIONS = "GOT_AFFILATIONS";

// /**
//  * INITIAL STATE
//  */
// const init = {
//   options: AFFILATION_OPTIONS,
//   list: [],
// };

// /**
//  * ACTION CREATORS
//  */
// const gotAffiliations = (affiliations) => ({
//   type: GOT_AFFILATIONS,
//   affiliations,
// });

// /**
//  * THUNK CREATORS
//  */
// export const updateAffiliations = (affiliations) => async (dispatch) => {
//   try {
//     const res = await axios.put("/api/affiliations", {
//       affiliations,
//     });
//     if (res.status == 201) {
//       dispatch(gotAffiliations(affiliations));
//       toast.success(
//         "Your affiliations were updated. Please await verification."
//       );
//     }
//   } catch (err) {
//     toast.error(`There was an error updating your house affiliations.`, {});
//   }
// };

// export const getAffiliations = () => async (dispatch) => {
//   try {
//     const res = await axios.get("/api/affiliations");
//     dispatch(gotAffiliations(res.data));
//   } catch (error) {
//     toast.error(`There was an error retrieving your house affiliations.`, {});
//   }
// };

// /**
//  * REDUCER
//  */
// export default function (state = init, action) {
//   switch (action.type) {
//     case GOT_AFFILATIONS:
//       return { ...state, list: action.affiliations };
//     default:
//       return state;
//   }
// }
