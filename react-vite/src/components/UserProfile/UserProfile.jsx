import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { thunkGetPins } from "../../redux/pin";
import { thunkLogin } from "../../redux/session";
import { useModal } from "../../context/Modal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import  SignupFormModal  from "../SignupFormModal";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "./UserProfile.css";

const UserProfile = () => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [showMenu, setShowMenu] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { closeModal } = useModal();
  const user = useSelector((store) => store.session.user);
  const allPins = useSelector((state) => state.pins.pins);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const userId = user?.id;
  const pinArray = Object.values(allPins);
  // console.log('PIN ARRAY FROM USER PROFILE=====>', pinArray)

  // console.log("USERID FROM PROFILE BUTTON=====>", userId)

  const currentUserPins = pinArray.filter((pin) => {
    if (pin?.user_id === userId) {
      return pin;
    }
  });

  useEffect(() => {
    dispatch(thunkGetPins());
  }, [dispatch]);

  useEffect(() => {
    const asyncLoad = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    };
    asyncLoad();
  }, []);

  const handleScroll = () => {
    if (window.scrollY > 200) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


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

  return (
    <>
      {userId ? (
        <>
          {isLoading ? (
            <h1 className="loading-spinner">Loading...</h1>
            ) : (
              <div className="allPins-container">
              {showScrollButton && (
                <button
                className="scrollToTopButton"
                onClick={handleScrollToTop}
                >
                  Back to Top
                </button>
              )}
              <div className="allPins-title">
                <h1>Welcome, {user.username}!</h1>
                <h2>Your Pins</h2>
              </div>
              {currentUserPins.map((pin) => (
                <div key={pin.id} className="allPins-eachpin">
                  <NavLink key={pin.id} to={`/pin/${pin.id}/`}>
                    <img src={pin.pin_link} />
                    <div className="pinTitle">{pin.title}</div>
                  </NavLink>
                </div>
              ))}
            </div>
          )}
        </>
      ) :
      <div>
        <h3
          style={{padding: '140px 40px 20px 40px',margin:'0px', color:'#ff00bb', fontWeight:'normal', fontSize:'24px', display:'flex', flexDirection:'column', alignItems:'center', backgroundColor:'#ff2f0020'}}
        >
          Please Log in or Sign up first...
        </h3>
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
    </>
  );
};

export default UserProfile;
