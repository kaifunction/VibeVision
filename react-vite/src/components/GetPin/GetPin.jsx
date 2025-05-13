import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  thunkEditComment,
  thunkGetPin,
  thunkPostComment,
  editComment,
  thunkAddLike,
} from "../../redux/pin";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeletePin from "../DeletePin/DeletePin";
import PinModal from "./PinModal";
import { useModal } from "../../context/Modal";
import DeleteComment from "../DeleteComment/DeleteComment";
import { FaChevronLeft } from "react-icons/fa";
import "./GetPin.css";

const GetPin = () => {
  const { pinId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentId, setCommentId] = useState(-1);
  const [managementButton, setManagementButton] = useState(false);
  const [isManagementButtonVisible, setIsManagementButtonVisible] =
    useState(true);
  const [isEditing, setIsEditing] = useState(false);
  // const []
  const [errors, setErrors] = useState([]);
  const [canLike, setCanLike] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(0);
  const { closeModal } = useModal();
  const currentUser = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(thunkGetPin(pinId));
  }, [dispatch, pinId]);

  const pin = useSelector((state) => state.pins.pins[pinId]);

  useEffect(() => {
    if (pin) {
      setCurrentLikes(pin.likes);
    }
  }, [pin]);

  const likeClick = () => {
    setCanLike(true);
    dispatch(thunkAddLike(pin.id, currentUser)).then((result) => {
      setCurrentLikes((prevLikes) => prevLikes + result);
      setCanLike(false);
    });
  };

  if (!pin)
    return (
      <h1
        style={{
          position: "absolute",
          top: "200px",
          left: "80px",
          color: "#ff2f00",
        }}
      >
        No Data Abailable!
      </h1>
    );
  const userId = pin.user?.id;
  const currentUserId = currentUser?.id;
  const pinImage = pin.pin_link;

  const shouldDisplayButtons = currentUserId && userId === currentUserId;

  const pinComments = Array.isArray(pin?.comments) ? pin.comments : [];

  function toEditPage(e) {
    e.preventDefault();
    navigate(`/pin/${pinId}/edit`);
  }

  const toEditComment = async (commentId, commentText) => {
    const edited = {
      id: commentId,
      comment: commentText,
    };

    const response = await dispatch(thunkEditComment(pinId, edited));
    // console.log("RESPONSE FROM EDIT COMMENT BACK====>", response);
    dispatch(editComment(response));
    setCommentId(-1);
    setIsEditing(false);
    closeModal();
  };

  // Edit Comment button
  const handleEditButtonClick = (comment) => {
    setCommentId(comment.id);
    setCommentText(comment.comment);
    setIsEditing(true);

    // console.log("COMMENTID======>", comment.id);
  };

  // Delete Comment button
  // const handleDeleteButtonClick = (commentId) => {

  // }

  // Back button
  const backToPin = (e) => {
    e.preventDefault();
    setIsManagementButtonVisible(true);
    setManagementButton(false);
    setIsEditing(false);
  };

  // Add Post comment submit button
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    const errors = [];
    if (comment?.length > 255 || comment?.length <= 0)
      errors.push(
        "Comment needs to be less than 255 characters or more than 1 character."
      );

    if (errors?.length > 0) {
      setErrors(errors);
      // const error = errors[0]
      // console.log("ERRORS1======>", error)
      return;
    }

    const newComment = { comment };

    const updatingComments = await dispatch(
      thunkPostComment(pinId, newComment)
    );
    setComment("");
    pinComments.push(updatingComments);
  };
  // console.log("PINCOMMENTS=====>", pinComments)
  // if(pinComments.length === 0) {
  //   setIsManagementButtonVisible(false)
  // }

  // Management button
  const handleManagementButtonClick = () => {
    setManagementButton(!managementButton);
    setIsManagementButtonVisible(false);
  };

  // console.log("PINCOMMENT=====>", pin?.comments.find(comment => comment.user.username === currentUser?.username))
  // console.log("PINCOMMENT2=====>", currentUser?.username)
  const manganmentButtonshow = pin?.comments.find(
    (comment) => comment.user.username === currentUser?.username
  );
  // console.log(typeof manganmentButtonshow)

  return (
    <div className="getPin-container">
      <div className="getPin-left">
        <div className="getPin-text">
          <h4 style={{ margin: "0" }} className="getPin-text-h4">
            Title:{" "}
          </h4>
          <p style={{ marginTop: "10px" }} className="getPin-text-p">
            {pin.title}
          </p>
          <br />
          <h4 style={{ margin: "0" }} className="getPin-text-h4">
            Description:{" "}
          </h4>
          <p style={{ marginTop: "10px" }} className="getPin-text-p">
            {pin.description}
          </p>
        </div>
        <div className="getPin-image">
          <img src={pinImage} alt="Pin image" style={{ width: "300px" }} />
          <button
            style={{
              width: "0px",
              height: "0px",
              marginLeft: "65px",
              transform: "rotate(90deg)",
              opacity: "0.7",
              backgroundColor: "white",
            }}
          >
            <OpenModalMenuItem
              itemText="PIN DETAILS"
              modalComponent={<PinModal pinImage={pinImage} />}
            />
          </button>
        </div>

        {shouldDisplayButtons && (
          <div
            style={{
              display: "flex",
              gap: "20px",
              height: "40px",
              alignItems: "center",
            }}
          >
            <h4 className="getPin-text-h4"> Manage Pin:</h4>
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
                modalComponent={<DeletePin />}
              />
            </button>
          </div>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "60px",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => likeClick()}
            className="getPin-edit-delete-button"
            disabled={canLike}
            style={{
              border: "2px soild #ff2f00",
              borderRadius: "15px",
              padding: "6px 10px",
              width: "80px",
            }}
          >
            Like
          </button>
          <div
            onClick={() => likeClick()}
            disabled={canLike}
            style={{ fontSize: "20px", fontWeight: "bold", color: "#ff2f00" }}
          >
            <i
              className="fa-solid fa-heart"
              style={{
                color: "#ff2f00",
                marginRight: "5px",
                cursor: "pointer",
              }}
            ></i>{" "}
            {currentLikes}
          </div>
        </div>
      </div>
      <div className="getPin-comment-container">
        <h4 className="getPin-text-h4" style={{ marginTop: "0px" }}>
          Add Comment:{" "}
        </h4>
        <div>
          {currentUser ? (
            <form onSubmit={handleSubmit} className="pin-comment-input">
              <textarea
                placeholder="Write a comment for the pin..."
                type="text"
                maxLength="255"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{
                  width: "500px",
                  height: "100px",
                  color: "#000000",
                  backgroundColor: "#d3f71220",
                  borderColor: "#ff00bb20",
                  padding: "10px",
                  borderRadius: "15px",
                }}
              />
              {errors &&
                errors.map((error, i) => (
                  <p
                    key={i}
                    style={{ margin: "0", fontSize: "12px", color: "#ff00bb" }}
                  >
                    {error}
                  </p>
                ))}
              <input
                type="submit"
                style={{
                  cursor: "pointer",
                  width: "130px",
                }}
                className="getPin-edit-delete-button"
              />
            </form>
          ) : (
            <p style={{ margin: "0", fontSize: "12px", color: "#ff00bb" }}>
              Please Log in or sign up first...
            </p>
          )}
        </div>

        <div className="getPin-comment">
          <h4 className="getPin-text-h4">Comments:</h4>
          {isEditing && (
            <>
              <div>
                <textarea
                  placeholder="Edit your comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  style={{
                    width: "500px",
                    height: "40px",
                    color: "#000000",
                    backgroundColor: "#d3f71220",
                    borderColor: "#ff00bb20",
                    padding: "10px",
                  }}
                />
              </div>
              <button
                onClick={() => toEditComment(commentId, commentText)}
                className="getPin-edit-delete-button"
              >
                Submit
              </button>
            </>
          )}

          {Array.isArray(pin.comments) &&
            pin.comments
              ?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map((comment) => (
                <div key={comment.id} style={{ color: "black" }}>
                  <h4>• &nbsp;&nbsp;{comment.comment}</h4>
                  <p>
                    &nbsp;&nbsp;&nbsp;&nbsp;By&nbsp;&nbsp;---&nbsp;
                    <strong>
                      {comment.user?.username
                        ? comment.user.username[0].toUpperCase() +
                          comment.user.username.slice(1)
                        : ""}
                    </strong>
                  </p>
                  <div>
                    {managementButton && comment.user?.id === currentUserId && (
                      <div
                        className="getPin-edit-delete-comment"
                        style={{ gap: "20px" }}
                      >
                        <button
                          onClick={backToPin}
                          className="getPin-edit-delete-button getPin-back"
                        >
                          {" "}
                          <FaChevronLeft />{" "}
                        </button>

                        <button
                          onClick={() => handleEditButtonClick(comment)}
                          className="getPin-edit-delete-button getPin-edit"
                        >
                          Edit Comment
                        </button>
                        <button
                          className="getPin-edit-delete-button getPin-delete"
                          style={{
                            width: "10px",
                            height: "40px",
                            backgroundColor: "white",
                            border: "none",
                          }}
                        >
                          {/* Delete Comment */}
                          <OpenModalMenuItem
                            itemText="Delete Comment"
                            modalComponent={
                              <DeleteComment commentId={comment?.id} />
                            }
                          />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          {/* {console.log('COMMENT MANAGE===>', pinComments)} */}
          {manganmentButtonshow &&
            pinComments?.length !== 0 &&
            isManagementButtonVisible && (
              <button
                onClick={handleManagementButtonClick}
                className="getPin-edit-delete-button"
              >
                Manage Comment
              </button>
            )}
          {Array.isArray(pinComments) && pinComments?.length === 0 && <p>Add Some Comments...</p>}
        </div>
      </div>
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
};

export default GetPin;
