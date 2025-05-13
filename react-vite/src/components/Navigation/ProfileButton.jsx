import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUser } from "react-icons/fa";
import { thunkLogout } from "../../redux/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { NavLink } from "react-router-dom";

function ProfileButton() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.user);
  // const userId = user?.id;
  // console.log("USERID FROM PROFILE BUTTON=====>", userId)
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

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    closeMenu();
  };

  const userFirstLetter = user?.username[0]?.toUpperCase();

  return (
    <div onClick={toggleMenu}>
      <button className="login-signup-button">
        {userFirstLetter ? (
          userFirstLetter
        ) : (
          <FaUser style={{ color: "#000000" }} />
        )}
      </button>
      {showMenu && (
        <ul
          className={"profile-dropdown"}
          style={{ paddingTop: "20px", background: 'linear-gradient(to bottom, #000000, #00000000)', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:'10px' }}
          ref={ulRef}
        >
          {user ? (
            <>
              <h3 style={{ color: "#d3f712", fontWeight:'500' }}>Hi, {user.username}!</h3>
              <h3 style={{ color: "#d3f712", fontWeight:'500' }}>
                {user.email}
              </h3>

              <NavLink
                to={`/current-user`}
                style={{ textDecoration: "none", color: "#d3f712" }}
              >
                <button style={{margin:'10px 5px'}}>User Profile</button>
              </NavLink>

              <button onClick={logout} style={{ pointerEvents: "all", margin:'10px 5px' }}>
                Log Out
              </button>
            </>
          ) : (
            <div className="logIn-signUp">
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />

              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </div>
          )}
        </ul>
      )}
    </div>
  );
}

export default ProfileButton;
