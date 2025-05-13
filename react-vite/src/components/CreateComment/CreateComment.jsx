// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { thunkPostComment } from "../../redux/pin";

// const CreateComment = ({ pinId, pin, updateComments }) => {
//   const dispatch = useDispatch();
//   const [comment, setComment] = useState("");
//   // const [errors, setErrors] = useState({});

//   const pinComments = pin.comments

//   console.log('PINID=====>', pinId)

//   console.log("COMMENT===>", comment)
//   console.log("pinComments===>", pinComments)

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setErrors({});

//     const errors = {};
//     if (comment?.length > 255)
//       errors.comment = "Comment should less than 255 characters.";

//     if (Object.values(errors).length) {
//       setErrors(errors);
//     } else {
//       const updatingComments = await dispatch(thunkPostComment(pinId, comment))
//       const newComments = [...pinComments, updatingComments];
//       setComment('')
//       updateComments(newComments);
//     }
//   }
//   return (
//     <>
//       <form onSubmit={handleSubmit}>
//         <textarea
//           placeholder="Write a comment for the song"
//           type="text"
//           maxLength="255"
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//           style={{width:"500px", height:"100px"}}
//         />
//         <input
//           type="submit"
//           style={{
//             cursor: "pointer",
//             marginLeft: "20px",
//             color: "#000433",
//             border: "1.5px solid rgba(0, 4, 51, .3)",
//           }}
//         />
//       </form>
//     </>
//   );
// };

// export default CreateComment;
