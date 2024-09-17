// const router = require("express").Router();
// const { Op, Sequelize } = require("sequelize");
// const { User, Affiliation, Verification, Group } = require("../db/models");
// const { isAdmin, isLoggedIn, upload, LOGIC } = require("module-middleware");
// const fs = require("fs");
// const imageDataURI = require("image-data-uri");
// module.exports = router;

// const USERS_PER_PAGE = 20;
// const paginate = (page) => {
//   const offset = (page - 1) * USERS_PER_PAGE;
//   const limit = USERS_PER_PAGE;

//   return {
//     offset,
//     limit,
//   };
// };

// const sortMap = {
//   ["0"]: [["id", "DESC"]],
//   ["1"]: [["id", "ASC"]],
//   ["2"]: [["firstName", "ASC"]],
//   ["3"]: [["firstName", "DESC"]],
//   ["4"]: [["username", "ASC"]],
//   ["5"]: [["username", "DESC"]],
//   ["6"]: [
//     [Sequelize.col("updatedAt"), "ASC"],
//     ["id", "DESC"],
//   ],
// };

// const houseMembershipMap = {
//   ["0"]: "any",
//   ["1"]: "none",
//   ["2"]: "dabney",
//   ["3"]: "blacker",
//   ["4"]: "venerable",
//   ["5"]: "avery",
//   ["6"]: "fleming",
//   ["7"]: "ricketts",
//   ["8"]: "page",
//   ["9"]: "lloyd",
// };
// const verificationStatusMap = {
//   ["1"]: null,
//   ["2"]: true,
//   ["3"]: false,
// };

// const UserGroup = require("../db/models/userGroup");

// /**
//  *  GET all users (api/users)
//  */
// router.get("/", isAdmin, async (req, res, next) => {
//   try {
//     const search = req.query.search ? JSON.parse(req.query.search) : {};

//     let extra = {};
//     let where = {};
//     let attributes_include = [
//       "username",
//       "firstName",
//       "lastName",
//       "caltechEmail",
//       "personalEmail",
//       "id",
//     ];

//     let include = [];
//     if (search.name) {
//       let fl = search.name.split(" ");

//       let or = [];
//       for (let i = 0; i < fl.length; i++) {
//         or.push(
//           ...[
//             {
//               firstName: {
//                 [Op.iLike]: "%" + fl[i] + "%",
//               },
//             },
//             {
//               lastName: {
//                 [Op.iLike]: "%" + fl[i] + "%",
//               },
//             },
//           ]
//         );
//       }

//       where = {
//         ...where,
//         [Op.or]: or,
//       };
//     }
//     if (search.email) {
//       where = {
//         ...where,
//         [Op.or]: [
//           {
//             personalEmail: {
//               [Op.iLike]: "%" + search.email + "%",
//             },
//           },
//           {
//             caltechEmail: {
//               [Op.iLike]: "%" + search.email + "%",
//             },
//           },
//         ],
//       };
//     }
//     if (search.username) {
//       where = {
//         ...where,
//         username: {
//           [Op.iLike]: "%" + search.username + "%",
//         },
//       };
//     }

//     // just any map to the verification status, not sure why not 0 indexed
//     if (search.verification_status && search.verification_status != "1") {
//       include = [
//         ...include,
//         {
//           model: Affiliation,
//           required: true,
//           where: {
//             verified: verificationStatusMap[search.verification_status],
//           },
//         },
//       ];
//     }

//     // add in house membership option, 0 means any so dont add anything
//     // 1 for none, we gotta do a query to do the count and then compare
//     if (search.house_membership == "1") {
//       // query all users with affiliations, so then we can make the next query to ignore all these
//       let memUsers = await User.findAll({
//         include: {
//           model: Affiliation,
//           attributes: ["id"],
//           required: true,
//         },
//         attributes: {
//           include: ["id"],
//         },
//         ...extra,
//       });

//       ids = [...memUsers].map((u) => u.id);

//       // now compare and take the ids of the ones that are not in memUsers (ie have not association)
//       // I woud rather write a raw query here because the issue is sequelize being
//       // annoying and creating malformed queries so it had to be broken up.
//       where = { ...where, id: { [Op.notIn]: ids } };
//     } else if (search.house_membership && search.house_membership !== "0") {
//       include = [
//         ...include,
//         {
//           model: Affiliation,
//           required: true,
//           where: { house: houseMembershipMap[search.house_membership] },
//         },
//       ];
//     }

//     // smh there u go melissa
//     if (search.sort == undefined) {
//       search.sort = "0";
//     }

//     let query = {
//       ...paginate(Number(req.query.pageNum || 1)),
//       order: sortMap[search.sort],
//       where,
//       include,
//       attributes: {
//         include: attributes_include,
//       },
//       ...extra,
//     };

//     let allUsers;
//     try {
//       allUsers = await User.findAndCountAll(query);
//     } catch (error) {
//       // detailed debug prints
//       // const util = require("util");
//       // console.log(
//       //   "REQUEST:\n",
//       //   util.inspect(req.query, {
//       //     showHidden: false,
//       //     depth: null,
//       //     colors: true,
//       //   })
//       // );
//       // console.log(
//       //   "QUERY OBJECT:\n",
//       //   util.inspect(query, { showHidden: false, depth: null, colors: true })
//       // );
//       // console.log("BAD QUERY:\n", error.sql);
//       // console.error("\n\n\n\n\n", error);
//       next(error);
//       return;
//     }

//     allUsers.count = Math.ceil(allUsers.count / USERS_PER_PAGE);

//     res.json(allUsers).status(200);
//   } catch (error) {
//     next(error);
//   }
// });

// /**
//  *  GET single user (api/users/:id)
//  */
// router.get("/admin/:userId", isAdmin, async (req, res, next) => {
//   try {
//     let user = await User.findByPk(req.params.userId, {
//       include: [
//         { model: Affiliation },
//         { model: Verification },
//         { model: Group },
//       ],
//     });
//     res.json(user);
//   } catch (err) {
//     console.error(err);
//     next(err);
//   }
// });

// /**
//  * just a filtered version of the above
//  */

// router.get(
//   "/:userId",
//   LOGIC.combineOr(LOGIC.isLoggedIn, LOGIC.isLocalRequest),
//   async (req, res, next) => {
//     try {
//       let user = await User.findByPk(req.params.userId, {
//         attributes: ["username", "firstName", "lastName", "profile"],
//         include: [
//           { model: Affiliation, attributes: ["house", "status", "verified"] },
//         ],
//       });
//       res.json(user);
//     } catch (err) {
//       next(err);
//     }
//   }
// );

// /**
//  *  PUT single user (api/users/:id)
//  */

// router.put(
//   "/:userId",
//   isAdmin,
//   upload.single("profile"),
//   async (req, res, next) => {
//     try {
//       const changeGroups = [];
//       const changeMember = [];
//       const cleaned = Object.keys(req.body).filter((key) => {
//         if (key.indexOf("group-check-") == 0) {
//           changeGroups.push([key.replace("group-check-", ""), req.body[key]]);
//           return false;
//         } else if (key.indexOf("verification-key-") == 0) {
//           if (key.indexOf("verified") !== -1) {
//             house_status_split = key
//               .replace("verification-key-", "")
//               .replace(".verified", "")
//               .split("-");
//             changeMember.push([
//               key,
//               ...house_status_split,
//               req.body[key] == "true",
//             ]);
//           }
//           return false;
//         }
//         // TODO filter the real params
//         return true;
//       });

//       const cleanBody = {};
//       cleaned.forEach((key) => {
//         cleanBody[key] = req.body[key];
//       });

//       /**
//        * edit dokuwiki groups
//        */
//       for (let i = 0; i < changeGroups.length; i++) {
//         if (changeGroups[i][1] == "true") {
//           await UserGroup.findOrCreate({
//             where: {
//               userId: req.params.userId,
//               groupId: changeGroups[i][0],
//             },
//           });
//         } else {
//           const toRemove = await UserGroup.findOne({
//             where: {
//               userId: req.params.userId,
//               groupId: changeGroups[i][0],
//             },
//           });
//           if (toRemove) {
//             await toRemove.destroy();
//           }
//         }
//       }

//       /**
//        * update any membership verifications
//        */

//       for (let i = 0; i < changeMember.length; i++) {
//         let aff = await Affiliation.findOne({
//           where: {
//             userId: req.params.userId,
//             house: changeMember[i][1],
//             status: changeMember[i][2],
//           },
//         });
//         // doesnt exist so not update,
//         // if true then we should create
//         if (aff == undefined) {
//           if (changeMember[i][3]) {
//             aff = await Affiliation.create({
//               userId: req.params.userId,
//               house: changeMember[i][1],
//               status: changeMember[i][2],
//               verified: true,
//               userRequested: false,
//             });
//           }
//         } else if (changeMember[i][3] !== aff.verified) {
//           if (aff.userRequested) {
//             // if user requested dont delete it, so they user can see they requested
//             await aff.update({ verified: changeMember[i][3] });
//           } else if (!changeMember[i][3]) {
//             // otherwise just delete it if false
//             await aff.destroy();
//           }
//         }
//       }

//       /**
//        * update all params actually stored in the user model
//        */
//       let oldUser = await User.findByPk(req.params.userId);
//       await oldUser.update({
//         ...cleanBody,
//         ...(req.body.profile
//           ? {
//               profile: { ...oldUser.profile.toJSON(), ...req.body.profile },
//             }
//           : {}),
//       });
//       res.sendStatus(201);
//     } catch (error) {
//       console.error(error);
//       next(error);
//     }
//   }
// );

// /**
//  * PUT single user based on req
//  */

// router.put(
//   "/",
//   isLoggedIn,
//   upload.single("profile"),
//   async (req, res, next) => {
//     try {
//       let oldUser = await User.findByPk(req.user.id);
//       const ALLOWED_USER_EDITS = [
//         "firstName",
//         "lastName",
//         "uuid",
//         "phone",
//         "room",
//         "bio",
//         "profile.photo",
//         "profile.room",
//         "profile.bio",
//       ];

//       sizeLimits = {
//         firstName: 69,
//         lastName: 69,
//         uuid: 69,
//         phone: 69,
//         room: 69,
//         bio: 421,
//         "profile.photo": -1,
//         "profile.room": 69,
//         "profile.bio": 421,
//       };

//       let filtered = Object.fromEntries(
//         Object.entries(req.body).filter(([key]) => {
//           if (sizeLimits[key] !== -1) {
//             if (sizeLimits[key] < req.body[key].length) {
//               return false;
//             }
//           }
//           return ALLOWED_USER_EDITS.indexOf(key) !== -1;
//         })
//       );

//       if (
//         filtered["profile.photo"] &&
//         !filtered["profile.photo"].indexOf("/resources/images/") == 0
//       ) {
//         const file = `/resources/images/pfp/${req.user.id}.png`;
//         // write to the currently used public folder, and the resources folder for the next build
//         const image = imageDataURI.decode(filtered["profile.photo"]);

//         fs.writeFileSync("." + file, image.dataBuffer);
//         fs.writeFileSync("./public" + file, image.dataBuffer);
//         filtered["profile.photo"] = file;
//       }

//       if (filtered.profile) {
//         filtered.profile = {
//           ...oldUser.profile.toJSON(),
//           ...filtered.profile,
//         };
//       }

//       await oldUser.update(filtered);
//       res.status(201).send(req.body);
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// /**
//  *  DELETE single user (api/users/:id)
//  */

// router.delete("/:userId", isAdmin, async (req, res, next) => {
//   try {
//     await User.destroy({
//       where: { id: req.params.userId },
//     });
//     res.sendStatus(200);
//   } catch (error) {
//     next(error);
//   }
// });

// /**
//  *  PATCH promote single user (api/users/:id)
//  */
// router.patch("/:userId", isAdmin, async (req, res, next) => {
//   try {
//     await User.update(
//       {
//         isAdmin: true,
//       },
//       { where: { id: req.params.userId } }
//     );
//     res.sendStatus(200);
//   } catch (error) {
//     next(error);
//   }
// });
