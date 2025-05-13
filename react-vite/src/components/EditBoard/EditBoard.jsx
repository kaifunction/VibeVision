import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { thunkGetBoard } from "../../redux/board";
import { thunkUpdateBoard } from "../../redux/board";
import { FaChevronLeft } from "react-icons/fa";
import "./EditBoard.css";

function EditBoard() {
  const dispatch = useDispatch();
  const { boardId } = useParams();
  const navigate = useNavigate();
  const board = useSelector((state) => state.boards[boardId]);
//   console.log("BOARD===>", board.board_pic);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [boardPic, setBoardPic] = useState("No Image");
  const [file, setFile] = useState("");
  const [errors, setErrors] = useState("");
  const [validation, setValidation] = useState({});
  const [disabled, setDisabled] = useState(false);

  function onImageChange(e) {
    if (e.target.files && e.target.files[0]) {
      setFile(URL.createObjectURL(e.target.files[0]));
      setBoardPic(e.target.files[0]);
    }
  }

  function validate() {
    const tempValidation = {};
    if ("" == title) tempValidation.title = "Enter a title.";
    if ("" == description) tempValidation.description = "Enter a description.";
    if ("" == file) tempValidation.file = "Enter a board link.";
    setValidation(tempValidation);

    if (Object.values(tempValidation)?.length != 0) return false;
    return true;
  }

  useEffect(() => {
     dispatch(thunkGetBoard(boardId));
   }, [dispatch, boardId]);

   useEffect(() => {
     if (board) {
       setTitle(board.title);
       setDescription(board.description);
       setFile(board.board_pic);
     }
   }, [board]);

   if (!board) return null;

   async function onSubmit(e) {
     e.preventDefault();
     setDisabled(false);

     if (!validate()) {
       setDisabled(false);
       return;
     }

     const response = await dispatch(
          thunkUpdateBoard({
           boardId,
           title,
           description,
           board_pic: boardPic,
           })
      );
      // console.log("response FROM EDIT PAGE===>", response);
    if (response.errors) {
      setErrors({ errors: Object.values(response.errors) });
      setDisabled(false);
      return;
    }

    await navigate(`/boards`);
   }

   function backToBoard(e) {
     e.preventDefault();
     navigate(`/boards/${boardId}`);
   }

   function clearForm(e) {
     e.preventDefault();
     setTitle(board.title);
     setDescription(board.description);
     setBoardPic("No Image");
     setFile(board.board_pic);
   }

  return (
    <form onSubmit={onSubmit}>
          <div className="edit-board-container">
          <div className="edit-board-left">
               <button onClick={backToBoard} className="editBoard-button">
               <FaChevronLeft />
          </button>
          <div>
            <h1>UPDATE A NEW BOARD</h1>
          </div>
          <div className="edit-board-upload-boardPic">
              <img
                src={file}
                alt="Board Image Here"
                style={{ width: "400px", height: "500px" }}
              />
              {boardPic == "No Image" && (
                <input
                  type="file"
                  accept="image/*"
                  name="board_pic"
                  onChange={onImageChange}
                  className="editBoard-choose-file"
                />
              )}
              {validation.file && <p>{validation.file}</p>}
            </div>
            <div className="edit-board-data">
              {errors.errors &&
                errors.errors.map((error, i) => (
                  <div
                    key={i}
                    style={{ margin: "0", fontSize: "12px", color: "#ff00bb" }}
                  >
                    {error}
                  </div>
                ))}
            </div>
          </div>
          <div className="edit-board-right">
            <div className="edit-board-input">

            <label className="edit-board-label">
              <h4 className="edit-text-h4">Title:</h4>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{width:'400px', color:'#000000', backgroundColor:'#d3f71220', borderColor: '#ff00bb20', padding:'10px', borderRadius:'15px'}}
              />
              {validation.title && (
                <p
                  style={{
                    marginTop: "10px",
                    fontSize: "12px",
                    color: "#ff00bb",
                  }}
                >
                  {validation.title}
                </p>
              )}
            </label>

            <label className="edit-board-label">
              <h4 className="edit-text-h4">Description:</h4>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{width:'400px', height: '100px', color:'#000000', backgroundColor:'#d3f71220', borderColor: '#ff00bb20', padding:'10px', borderRadius:'15px'}}
              />
              {validation.description && (
                <p
                  style={{
                    marginTop: "10px",
                    fontSize: "12px",
                    color: "#ff00bb",
                  }}
                >
                  {validation.description}
                </p>
              )}
            </label>
            </div>

            <div className="edit-board-button-container">
              <button
                type="cancel"
                onClick={clearForm}
                className="editBoard-button"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={disabled}
                className="editBoard-button"
              >
                Submit
              </button>
            </div>
            </div>

          </div>
     </form>
  );
}

export default EditBoard;
