import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { thunkGetBoard, getBoard } from "../../redux/board";
import CreateBoardPin from "../CreatePin/CreateBoardPin";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteBoard from "../DeleteBoard/DeleteBoard";
import { thunkPostBoardPins } from "../../redux/board";
// import { addPin } from "../../redux/board";
import { FaChevronLeft } from "react-icons/fa";
import "./GetOneBoard.css";

const GetOneBoard = () => {
  const { boardId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showCreatePin, setShowCreatePin] = useState(false);
  // const [newPin, setNewPin] = useState({});
  const currentUser = useSelector((state) => state.session.user);
  // const board = useSelector((state) => state.boards[boardId]);
  const allPins = useSelector((state) => state.pins.postedBoardPins);
  const [board, setBoard] = useState(useSelector((state) => state.boards[boardId]));
  // console.log("allPinsFROMGETONEBOARD===>", allPins);
  // const allPinsArray = Object.values(allPins);
  // useEffect(() => {
  //   setNewPin(allPins);
  // }, [allPins]);

  const pins = board?.pins;

  // if (!board) return <h1 style={{position: 'absolute', top:'200px', left:'80px', color:'#ff2f00'}}>No Data Abailable!</h1>;
  // console.log("board===>", board);
  // console.log("pins===>", pins);

  useEffect(() => {
    dispatch(thunkGetBoard(boardId)).then((boardData) => {
      setBoard(boardData);
    });
  }, [boardId, dispatch]);
  useEffect(() => {
    // 这里不需要调用 thunkGetBoard，因为在创建新的 Pin 后已经更新了板块信息
    // setBoard(boardData); // 不需要再次设置 board，因为 Redux store 中的数据已经更新
}, [board, allPins.length]); // 添加依赖数组 board，当 board 变化时重新触发 useEffect


  const handleOpenCreatePin = () => {
    setShowCreatePin(true);
  };

  const handleCloseCreatePin = () => {
    setShowCreatePin(false);
  };

  const handlePinCreated = async (pin) => {
    // console.log("New Pin created===>", pin);


    const createPin = await dispatch(thunkPostBoardPins(boardId, pin));
    // console.log("New Pin created AFTER===>", createPin);

    dispatch(getBoard(createPin));
    navigate(`/pin/${pin.id}`);

  };

  function toEditPage(e) {
    e.preventDefault();
    navigate(`/boards/${boardId}/edit`);
  }

  function backToBoards(e) {
    e.preventDefault();
    navigate(`/boards`);
  }

  return (
    <div className="board_page-containers">
      <h1 style={{ padding: "140px 0px 0px 80px" }}>{board?.title} Board</h1>
      <div className="board_page-text" style={{ padding: "0px 0px 0px 80px" }}>
        <h4>Description: {board?.description}</h4>
      </div>
      <button
        onClick={backToBoards}
        className="editBoard-button"
        style={{ margin: "0 20px 0 80px" }}
      >
        <FaChevronLeft />
      </button>
      {currentUser?.id === board?.user.id && (
        <div>
          <button
            onClick={handleOpenCreatePin}
            className="createPin-button"
            style={{ margin: "0 20px 0 80px" }}
          >
            {" "}
            Create Pin{" "}
          </button>
          {showCreatePin && <CreateBoardPin onPinCreated={handlePinCreated} boardId={boardId} onClose={handleCloseCreatePin}/>}
          <button
            onClick={toEditPage}
            className="getPin-edit-delete-button"
            style={{
              border: "2px soild #ff2f00",
              borderRadius: "15px",
              padding: "6px 10px",
            }}
          >
            Edit
          </button>

          <button
            className="getPin-edit-delete-button"
            style={{
              width: "10px",
              height: "40px",
              backgroundColor: "white",
              border: "none",
            }}
          >
            <OpenModalMenuItem
              itemText="Delete"
              modalComponent={<DeleteBoard />}
            />
          </button>
        </div>
      )}

      <div className="allPinsBoard-container">
        <div className="allPinsBoard-BoardPic">
        <img src={board?.board_pic} alt={board?.title} style={{width:'300px', height:'450px', margin:'0 10px 20px 40px', borderRadius:"20px"}}/>
        </div>
        <div className="allPinsBoard-pins">
          <h3 style={{marginRight:'228px'}}>All Pins</h3>
          <div className="allpins">
            {pins?.map((pin) => (
              <div key={pin.id} className="allPins-eachpin">
                <NavLink to={`/pin/${pin.id}`}>
                  <img src={pin.pin_link} alt={pin.title} />
                </NavLink>
                <div className="pinTitle">{pin.title}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default GetOneBoard;
