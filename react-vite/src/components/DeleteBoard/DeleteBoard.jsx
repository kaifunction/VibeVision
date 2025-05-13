import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useNavigate, useParams } from "react-router-dom";
import { thunkDeleteBoard } from "../../redux/board";
import { thunkDeleteBoardPins } from "../../redux/pin";
import "./DeleteBoard.css";


const DeleteBoard = () => {
     const { closeModal } = useModal();
     const dispatch = useDispatch();
     const navigate = useNavigate();
     const { boardId } = useParams();

     const deleteBoard = async (e) => {
          e.preventDefault();
          await dispatch(thunkDeleteBoard(boardId));
          await dispatch(thunkDeleteBoardPins());
          await navigate("/boards");
          closeModal();
        };

        const keepBoard = (e) => {
          e.preventDefault();
          closeModal();
        };

     return (
          <form className="DeleteForm">
               <div className="delete-container">
                    <div className="delete-text">
                         <h1>Confirm Delete</h1>
                         <h3>Are you sure you want to delete this Board?(The newly created pin is also accessible on the Home page.)</h3>
                    </div>
                    <div className="delete-button">
                         <button onClick={deleteBoard}>Yes (Delete Board)</button>
                         <button onClick={keepBoard} style={{color:'#000000',backgroundColor:'#ff2f0080', borderColor:'#ff2f0040'}}>No (Keep Board)</button>
                    </div>
               </div>
          </form>
     );

}

export default DeleteBoard;
