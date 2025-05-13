import { NavLink } from "react-router-dom";
import { useState } from "react";
// import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
// import { IoIosArrowForward } from "react-icons/io";
import { useSearchResults } from "../../context/SearchContext";
// import GetAllPins from "../GetAllPins/GetAllPins";
import "./Navigation.css";

function Navigation() {
  const [searchTerm, setSearchTerm] = useState("");
  const { searchResults, setSearchResults } = useSearchResults();
  // const [searchResults, setSearchResults] = useState([]);

  // const pinReducerState = useSelector((state) => state.pins);
  // console.log("pinREDUCERSTATE==========>", pinReducerState);
  // const userReducerState = useSelector((state) => state.session.user);
  // console.log("userReducerState==========>", userReducerState);

  //确保userReducerState存在

  const handleSearch = async () => {
    try {
      // console.log("searchTerm", searchTerm);
      if (searchTerm.trim() === "") {
        // 如果搜索栏被清空，显示所有 uniquePins
        setSearchResults({}); // 清空搜索结果
      } else {
        const response = await fetch(`/api/pin/search?query=${searchTerm}`);
        const data = await response.json();
        // console.log("data", data);
        setSearchResults(data);
      }

    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }


  return (
    <nav>
      <div className="nav-bar">
        <div className="nav-bar-left">
          <div className="nav-bar-logo-link">
            <div className="nav-bar-left-logo">
              <NavLink to="/">
                <img
                  src="/Vibevision.png"
                  alt="Logo"
                  className="nav-bar-left-logo"
                />
              </NavLink>
            </div>
            <div className="nav-bar-left-links">
              <NavLink
                to="/pin"
                className="nav-bar-button"
                style={{ textDecoration: "none" }}
              >
                Home
              </NavLink>

              <NavLink
                to="/boards"
                style={{ textDecoration: "none" }}
              >
                <div
                  className="nav-bar-button"
                  // onClick={() => window.alert("Feature coming soon")}
                  style={{ cursor: "pointer" }}
                >
                  Boards
                </div>
              </NavLink>

              <NavLink
                to="/pin-creation-tool"
                style={{ textDecoration: "none" }}
              >
                <div className="nav-bar-button">Create</div>
              </NavLink>
            </div>
          </div>
          <div className="nav-bar-search-bar">
          <input
              placeholder="Search"
              className="search-bar"
              value={searchTerm} // 绑定输入框的值到搜索关键词状态
              onChange={(e) => setSearchTerm(e.target.value)} // 监听输入框变化并更新搜索关键词状态
            />
            <button
              className="search-bar-button"
              onClick={handleSearch} // 点击搜索按钮触发搜索功能
              style={{ padding: "0", marginLeft: "10px" }}
            >
              Search
            </button>
          </div>
        </div>

        <div className="nav-bar-right">
          <ProfileButton />
        </div>
      </div>
      {/* <GetAllPins searchResults={searchResults} /> */}
    </nav>
  );
}

export default Navigation;
