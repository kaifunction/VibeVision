import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { thunkEditPin, thunkGetPin } from "../../redux/pin";
import { FaChevronLeft } from "react-icons/fa";
import "./EditPin.css";

function EditPin() {
  const dispatch = useDispatch();
  const { pinId } = useParams();
  const navigate = useNavigate();
  const pin = useSelector((state) => state.pins?.pins[pinId]);
  //   const currentUser = useSelector((state) => state.session.user);
  //pin 可以获得 title description，pin_link只要 pin.title
  // console.log("PINID FROM EDIT PAGE", pinId)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pinLink, setPinLink] = useState("No Image");
  const [file, setFile] = useState("");
  const [errors, setErrors] = useState("");
  const [validation, setValidation] = useState({});
  const [disabled, setDisabled] = useState(false);

  function onImageChange(e) {
    if (e.target.files && e.target.files[0]) {
      setFile(URL.createObjectURL(e.target.files[0]));
      setPinLink(e.target.files[0]);
    }
  }
  //   console.log("file FROM EP", file)
  //   console.log("pinLink FROM EP", pinLink)

  function validate() {
    const tempValidation = {};
    if ("" == title) tempValidation.title = "Enter a title.";
    if ("" == description) tempValidation.description = "Enter a description.";
    if ("" == file) tempValidation.file = "Enter a pin link.";
    setValidation(tempValidation);

    if (Object.values(tempValidation)?.length != 0) return false;
    return true;
  }
  // console.log("FILE====>", file)

  useEffect(() => {
    dispatch(thunkGetPin(pinId));
  }, [dispatch, pinId]);

  useEffect(() => {
    if (pin) {
      setTitle(pin.title);
      setDescription(pin.description);
      setFile(pin.pin_link);
    }
  }, [pin]);

  //   useEffect(() => {  :)
  //     dispatch(thunkEditPin(pinId, pin));  :-) ^.^, OwO, ;u; ;-; UoU
  //   }, [dispatch, pinId, pin]);

  if (!pin) return null;

  //   const userId = pin.user.id;
  // console.log("USERId FROM EDIT PAGE", userId)
  //   const currentUserId = currentUser.id;
  // console.log("currentUserId FROM EDIT PAGE", currentUserId)
  //   if (userId === currentUserId) setDisabled(false)
  //   setDisabled(true)

  async function onSubmit(e) {
    e.preventDefault();
    setDisabled(false);

    if (!validate()) {
      setDisabled(false);
      return;
    }

    const response = await dispatch(
      thunkEditPin({
        pinId,
        title,
        description,
        pin_link: pinLink,
      })
    );
    // console.log("response FROM EDIT PAGE===>", response);
    if (response.errors) {
      setErrors({ errors: Object.values(response.errors) });
      setDisabled(false);
      return;
    }

    await navigate(`/pin/${pinId}`);
  }

  function backToPin(e) {
    e.preventDefault();
    navigate(`/pin/${pinId}`);
  }

  function clearForm(e) {
    e.preventDefault();
    setTitle(pin.title);
    setDescription(pin.description);
    setPinLink("No Image");
    setFile(pin.pin_link);
  }

  return (
    <form onSubmit={onSubmit}>
        <div className="edit-pin-container">
        <div className="edit-pin-left">
          <button onClick={backToPin} className="editPin-button">
            <FaChevronLeft />
          </button>
          <div>
            <h1>UPDATE A NEW PIN</h1>
          </div>
          {/* <div> */}
            <div className="edit-pin-upload-pinLink">
              <img
                src={file}
                alt="Pin Image Here"
                style={{ width: "400px", height: "500px" }}
              />
              {pinLink == "No Image" && (
                <input
                  type="file"
                  accept="image/*"
                  name="pin_link"
                  onChange={onImageChange}
                  className="editPin-choose-file"
                />
              )}
              {validation.file && <p>{validation.file}</p>}
            </div>
            <div className="edit-pin-data">
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
          <div className="edit-pin-right">
            <div className="edit-pin-input">

            <label className="edit-pin-label">
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

            <label className="edit-pin-label">
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

            <div className="edit-pin-button-container">
              <button
                type="cancel"
                onClick={clearForm}
                className="editPin-button"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={disabled}
                className="editPin-button"
              >
                Submit
              </button>
            </div>
          </div>
          {/* </div> */}
    </div>
      </form>
  );
}

export default EditPin;
