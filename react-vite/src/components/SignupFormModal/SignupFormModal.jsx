import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [showPassword, setShowPassword] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const ulRef = useRef();

  // const toggleMenu = (e) => {
  //   e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
  //   setShowMenu(!showMenu);
  // };

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

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        username,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
    <div className="signUp-container">
      <div className="signUp-top">
        <h1>Sign Up</h1>
      </div>
      {errors.server && (
        <p style={{ margin: "0", fontSize: "12px", color: "#ff00bb" }}>
          {errors.server}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="signUp-bottom">
          <label>
            Email:
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="signUp-input"
              style={{borderRadius:'10px'}}
            />
          </label>
          {errors.email && (
            <p style={{ margin: "0", fontSize: "12px", color: "#ff00bb" }}>
              {errors.email}
            </p>
          )}
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="signUp-input"
              style={{borderRadius:'10px'}}
            />
          </label>
          {errors.username && (
            <p style={{ margin: "0", fontSize: "12px", color: "#ff00bb" }}>
              {errors.username}
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
                className="signUp-input"
                style={{borderRadius:'10px'}}
              />
              {showPassword ? (
                <FaEyeSlash
                  onClick={() => setShowPassword(false)}
                  style={{ position: "absolute", left: "430px" }}
                />
              ) : (
                <FaEye
                  onClick={() => setShowPassword(true)}
                  style={{ position: "absolute", left: "430px" }}
                />
              )}
            </div>
          </label>
          {errors.password && (
            <p style={{ margin: "0", fontSize: "12px", color: "#ff00bb" }}>
              {errors.password}
            </p>
          )}
          <label>
            Confirm Password:
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="signUp-input"
                style={{borderRadius:'10px'}}
              />
              {showPassword ? (
                <FaEyeSlash
                  onClick={() => setShowPassword(false)}
                  style={{ position: "absolute", left: "430px" }}
                />
              ) : (
                <FaEye
                  onClick={() => setShowPassword(true)}
                  style={{ position: "absolute", left: "430px" }}
                />
              )}
            </div>
          </label>
          {errors.confirmPassword && (
            <p style={{ margin: "0", fontSize: "12px", color: "#ff00bb" }}>
              {errors.confirmPassword}
            </p>
          )}
      <div className="logIn-signUp" style={{display:"flex", flexDirection:"row"}}>
          <button type="submit">Sign Up</button>
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
       </div>
        </div>
      </form>
    </div>
  );
}

export default SignupFormModal;
