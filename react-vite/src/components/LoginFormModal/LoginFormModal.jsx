import { useState, useEffect, useRef } from "react";
import { thunkLogin, thunkLogout } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import  SignupFormModal  from "../SignupFormModal";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [showPassword, setShowPassword] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

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

  // const logout = (e) => {
  //   e.preventDefault();
  //   dispatch(thunkLogout());
  //   closeMenu();
  // };

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


  // const handleSignup = async (e) => {
  //   e.preventDefault();

  //   if (password !== confirmPassword) {
  //     return setErrors({
  //       confirmPassword:
  //         "Confirm Password field must be the same as the Password field",
  //     });
  //   }

  //   const serverResponseSignUp = await dispatch(
  //     thunkSignup({
  //       email,
  //       username,
  //       password,
  //     })
  //   );

  //   if (serverResponseSignUp) {
  //     setErrors(serverResponseSignUp);
  //   } else {
  //     closeModal();
  //   }
  // };

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

  return (
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
              style={{borderRadius:'10px'}}
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
                style={{borderRadius:'10px'}}
              />
              {showPassword ? (
                <FaEyeSlash onClick={() => setShowPassword(false)} style={{ position: 'absolute', left: '405px' }}/>
              ) : (
                <FaEye onClick={() => setShowPassword(true)} style={{ position: 'absolute', left: '405px' }}/>
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
    </div>
  );
}

export default LoginFormModal;
