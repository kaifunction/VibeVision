import { useEffect, useState } from "react";
import { thunkGetBoards } from "../../redux/board";
import { useDispatch, useSelector } from "react-redux";
import "./GetAllBoards.css";
import { NavLink } from "react-router-dom";

const GetAllBoards = () => {
  const dispatch = useDispatch();
  const allBoards = useSelector((state) => state.boards);
  const allBoardsArray = Object.values(allBoards);
  const [isLoading, setIsLoading] = useState(true);
  // console.log("allBoards===>", Object.values(allBoards))
  // console.log("allBoardsArray===>", allBoardsArray);

  useEffect(() => {
    dispatch(thunkGetBoards());
  }, [dispatch]);

// loading Page要等两秒
  // useEffect(() => {
  //   const asyncLoad = () => {
  //     setTimeout(() => {
  //       setIsLoading(false);
  //     }, 2000);
  //   };
  //   asyncLoad();
  // }, []);

//loading Page 按照加载好了的时间来算
  useEffect(() => {
    dispatch(thunkGetBoards()).then(() => {
      setIsLoading(false)
    })
  }, [dispatch]);

  return (
    <>
      {isLoading ? (
        <div>
          <h1 className="loading-spinner">Loading...</h1>
        </div>
      ) : (
          <div>
               <NavLink to="/board-creation-tool">
               <button className="createPin-button" style={{width:'150px', margin:'140px 40px 0px 40px'}}>Create a Board</button>
               </NavLink>

           <div
           className="allBoards-container"
           >
          {allBoardsArray.map((board) => (
               <div key={board.id} className="board-card">
               <NavLink to={`/boards/${board.id}`}>
                <img src={board.board_pic} alt={board.title} />
              <div className="boardTitle">{board.title} Board</div>
              </NavLink>
            </div>
          ))}
          </div>
        </div>
      )}
    </>
  );
};


export default GetAllBoards;
