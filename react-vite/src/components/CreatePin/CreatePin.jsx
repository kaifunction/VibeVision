import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { thunkPostPin } from "../../redux/pin";
import { thunkLogin } from "../../redux/session";
import { useModal } from "../../context/Modal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import  SignupFormModal  from "../SignupFormModal";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// import {IoIosArrowForward} from 'react-icons/io'
import "./CreatePin.css";

function CreatePin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const newPin = useSelector((state) => state.pins.pins)
  const [errors, setErrors] = useState({});
  const [validation, setValidation] = useState({});
  const [disabled, setDisabled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { closeModal } = useModal();
  // const [hasSubmitted, setHasSubmitted] = useState(false);

  const [pinLink, setPinLink] = useState();
  const [file, setFile] = useState("No Image");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const currentUser = useSelector((state) => state.session?.user)
  // console.log("CURRENTUSER====>",currentUser)



  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  const defaultLogin = async (e) => {
    e.preventDefault();

    await dispatch(
      thunkLogin({
        email: "demo@aa.io",
        password: "password",
      })
    );

    closeModal();
  };



  function onImageChange(e) {
    if (e.target.files && e.target.files[0]) {
      setPinLink(URL.createObjectURL(e.target.files[0]));
      setFile(e.target.files[0]);
    }
  }

  function validate() {
    const tempValidation = {};
    if ("" == title) tempValidation.title = "Enter a title.";
    if ("" == description) tempValidation.description = "Enter a description.";
    if ("" == file) tempValidation.file = "Enter a pin link.";
    setValidation(tempValidation);

    if (Object.values(tempValidation)?.length != 0) return false;
    return true;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setDisabled(false);

    if (!validate()) {
      setDisabled(false);
      return;
    }

    const payload = {
      title,
      pin_link: file,
      description,
    };
    // console.log("file====>", file)

    const response = await dispatch(thunkPostPin(payload));

    if (response.errors) {
      setErrors({ errors: Object.values(response.errors) });
      setDisabled(false);
      return;
    }
    // console.log("pinID====>", response.id)
    const newPinId = response.id;
    // if (newPinId !== null) {
    await navigate(`/pin/${newPinId}`);
    // }
  }

  function clearForm(e) {
    e.preventDefault();
    setTitle("");
    setDescription("");
    setPinLink("");
    setFile("No Image");
  }

  return (
    <div>
    {currentUser ? (<form onSubmit={onSubmit}  className="createPin-container">
      <div className="createPin-left">
        <div>
          <h1>Create a new Pin</h1>
        </div>
          <div className="create-pin-upload-pinLink">
            {pinLink ? <img
              src={pinLink}
              alt="&nbsp;&nbsp; Please drop you file here..."
              style={{ width: "300px", height: "400px", color:'#ff00bb' }}
              className="createPin-image"
            /> :
            <div style={{display:'flex', flexDirection:'row', alignItems:'center', marginBottom:'10px'}}>
              <img src={'https://vibevision-project.s3.us-west-1.amazonaws.com/image-icon.png'} style={{width:'30px'}}/>
              <span style={{color:'#ff00bb'}}>&nbsp;&nbsp; Please drop you file here...</span>

            </div>
            }
            {file == "No Image" && (
              <div>
                {/* <label for="file-upload" className="upload-form_container-upload-custom-button">Upload image(s)</label> */}
                <input
                  // id="file-upload"
                  type="file"
                  accept="image/*"
                  name="pin_link"
                  onChange={onImageChange}
                  className="createPin-choose-file"
                  style={{width:'400px', height:'305px'}}
                  />
              </div>
            )}
            {validation.file && <p>{validation.file}</p>}
          </div>

          <div className="createPin-data">
            {errors.errors &&
              errors.errors.map((error, i) => <div key={i} style={{ margin: "0", fontSize: "12px", color: "#ff00bb" }}>{error}</div>)}
          </div>
      </div>
      <div className="createPin-right">
            <label>
              <h4 className="createPin-text-h4">Title:</h4>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{width:'400px', color:'#000000', backgroundColor:'#d3f71220', borderColor: '#ff00bb20', padding:'10px', borderRadius:'15px'}}
              />
              {validation.title && <p style={{
                    marginTop: "10px",
                    fontSize: "12px",
                    color: "#ff00bb",
                  }}>{validation.title}</p>}
            </label>

            <label>
            <h4 className="createPin-text-h4">Description:</h4>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{width:'400px', height: '100px', color:'#000000', backgroundColor:'#d3f71220', borderColor: '#ff00bb30', padding:'10px', borderRadius:'15px'}}
              />
              {validation.description && <p style={{
                    marginTop: "10px",
                    fontSize: "12px",
                    color: "#ff00bb",
                  }}>{validation.description}</p>}
            </label>

            <div className="createPin-button-container">
              <button type="cancel" onClick={clearForm} className="createPin-button">
                Cancel
              </button>

              <button type="submit" disabled={disabled} className="createPin-button">
                Submit
              </button>
            </div>
          </div>
    </form>) :
    <div>
    <h3 style={{padding: '140px 40px 20px 40px',margin:'0px', color:'#ff00bb', fontWeight:'normal', fontSize:'24px', display:'flex', flexDirection:'column', alignItems:'center', backgroundColor:'#ff2f0020'}}>Please Log in or Sign up first...</h3>
    <div className="login-container">
      <div className="login-top">
        <h1>Log In</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="login-bottom">
          <label>
            Email:
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input"
            />
          </label>
          {errors.email && (
            <p style={{ margin: "0", fontSize: "12px", color: "#ff00bb" }}>
              {errors.email}
            </p>
          )}
          <label>
            Password:
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="login-input"
              />
              {showPassword ? (
                <FaEyeSlash onClick={() => setShowPassword(false)} style={{ position: 'relative', left: '-10%' }}/>
              ) : (
                <FaEye onClick={() => setShowPassword(true)} style={{ position: 'relative', left: '-10%' }}/>
              )}
            </div>
          </label>
          {errors.password && (
            <p style={{ margin: "0", fontSize: "12px", color: "#ff00bb" }}>
              {errors.password}
            </p>
          )}
          <div className="login-button-container">
            <button type="submit" className="login-button1">Log In</button>

            {/* <button onClick={() => SignupFormModal()}
            className="login-button1">Sign Up</button> */}
            <div onClick={toggleMenu}>
              <OpenModalMenuItem
                  itemText="Sign Up"
                  onItemClick={closeMenu}
                  modalComponent={<SignupFormModal />}
                />
            </div>

            <button onClick={defaultLogin} className="login-button2">Demo User</button>
          </div>
        </div>
      </form>
      {/* <div style={{backgroundColor:'#ff2f0020', background: 'linear-gradient(to bottom, #ff2f0020, #ffffff)', paddingBottom:'13%'}}> */}
      <div className="bottom-div">

      </div>
    </div>
    </div>

    }
    {/* <div>
          <IoIosArrowForward className='nav-bar-arrow8'/>
          <IoIosArrowForward className='nav-bar-arrow7'/>
          <IoIosArrowForward className='nav-bar-arrow'/>
          <IoIosArrowForward className='nav-bar-arrow2'/>
          <IoIosArrowForward className='nav-bar-arrow3'/>
          <IoIosArrowForward className='nav-bar-arrow4'/>
          <IoIosArrowForward className='nav-bar-arrow5'/>
          <IoIosArrowForward className='nav-bar-arrow6'/>
        </div> */}
    </div>
  );
}

export default CreatePin;
