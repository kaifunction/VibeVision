import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkDeletePin } from "../../redux/pin";
import { useNavigate, useParams } from "react-router-dom";
import "./DeletePin.css";

const DeletePin = () => {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pinId } = useParams();

  // console.log("pinId FROM DELETE PAGE===>", pinId);

  const deletePin = async (e) => {
    e.preventDefault();
    await dispatch(thunkDeletePin(pinId));
    await navigate("/pin");
    closeModal();
  };

  const keepPin = (e) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <form className="DeleteForm">
      <div className="delete-container">
        <div className="delete-text">
          <h1>Confirm Delete</h1>
          <h3>Are you sure you want to delete this Pin?</h3>
        </div>
        <div className="delete-button">
          <button onClick={deletePin}>Yes (Delete Pin)</button>
          <button onClick={keepPin} style={{color:'#000000',backgroundColor:'#ff2f0080', borderColor:'#ff2f0040'}}>No (Keep Pin)</button>
        </div>
      </div>
    </form>
  );
};

export default DeletePin;
