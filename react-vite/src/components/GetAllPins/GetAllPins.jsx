import { useDispatch, useSelector } from "react-redux";
import { thunkGetPins } from "../../redux/pin";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSearchResults } from "../../context/SearchContext";
// import Masonry from "react-masonry-css";
import "./GetAllPins.css";

const GetAllPins = () => {
  const dispatch = useDispatch();
  const allPins = useSelector((state) => state.pins.pins);
  const allPinsArray = Object.values(allPins);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // console.log("allPinsArray===>", allPinsArray)
  const { searchResults } = useSearchResults();
  const searchResultsArray = Object.values(searchResults);
  // console.log("searchResultsFROMGETALLPINS====>", searchResults);

  useEffect(() => {
    dispatch(thunkGetPins());
  }, [dispatch]);

  useEffect(() => {
    dispatch(thunkGetPins()).then(() => {
      setIsLoading(false);
    });
  }, [dispatch]);

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

  //  const filteredPins = allPinsArray.filter((pin) => pin.boards.length > 0);

  const uniquePins = allPinsArray.reduce((acc, pin) => {
    const existingPin = acc.find((item) => item.pin_link === pin.pin_link);
    if (!existingPin) {
      acc.push(pin);
    } else if (existingPin.boards?.length === 0) {
      // 如果已存在且boards为空，则不添加当前pin
    } else if (pin.boards?.length > 0) {
      // 如果已存在但boards不为空，则用当前pin替换已存在的pin
      acc[acc.indexOf(existingPin)] = pin;
    }
    return acc;
  }, []);

  return (
    <>
      {isLoading ? (
        <div>
          <h1 className="loading-spinner">Loading...</h1>
        </div>
      ) : (
        <div
          className="allPins-container"
          // style={{display: "flex", flexDirection:"row", width:"100%", flexWrap:"wrap", gap:"20px"}}
        >
          {showScrollButton && (
            <button className="scrollToTopButton" onClick={handleScrollToTop}>
              Back to Top
            </button>
          )}
          {searchResultsArray.length > 0 ? (
          searchResultsArray.map((pin) => (
            <div key={pin.id} className="allPins-eachpin">
              <NavLink key={pin.id} to={`/pin/${pin.id}/`}>
                <img src={pin.pin_link} />
                <div className="pinTitle">{pin.title}</div>
              </NavLink>
            </div>
          ))
        ) : (
          uniquePins.map((pin) => (
            <div key={pin.id} className="allPins-eachpin">
              <NavLink key={pin.id} to={`/pin/${pin.id}/`}>
                <img src={pin.pin_link} />
                <div className="pinTitle">{pin.title}</div>
              </NavLink>
            </div>
          ))
        )}
        </div>
      )}
    </>
  );
  //   const breakpointColumnsObj = {
  //     default: 5, // 默认列数
  //     1100: 4, // 在 1100px 宽度下，显示4列
  //     700: 2, // 在 700px 宽度下，显示2列
  //     500: 1, // 在 500px 宽度下，显示1列
  //   };

  //   return (
  //     <Masonry
  //       breakpointCols={breakpointColumnsObj}
  //       className="my-masonry-grid"
  //       columnClassName="my-masonry-grid_column"
  //       style={{display: "flex", flexDirection:"row", width:"90%", flexWrap:"wrap", gap:"20px"}}
  //     >
  //       {allPinsArray.map((pin) => (
  //         <div key={pin.id} className="allPins-eachpin">
  //           <NavLink key={pin.id} to={`/pin/${pin.id}/`}>
  //             <img
  //               src={pin.pin_link}
  //               style={{ width: "90%" }}
  //               alt={`Pin ${pin.id}`}
  //             />
  //           </NavLink>
  //         </div>
  //       ))}
  //     </Masonry>
  //   );
};

export default GetAllPins;
