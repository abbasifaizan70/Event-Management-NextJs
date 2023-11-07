import { useState, useEffect, useContext } from "react";

import CommentList from "./comment-list";
import NewComment from "./new-comment";
import classes from "./comments.module.css";

import NotificationContext from "../../store/notification-context";

function Comments(props) {
  const { eventId } = props;
  const notficaitonCtx = useContext(NotificationContext);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [isFetchingComment, setIsFetchingComment] = useState(false);

  useEffect(() => {
    if (showComments) {
      setIsFetchingComment(true);
      fetch("/api/comments/" + eventId)
        .then((response) => response.json())
        .then((data) => {
          setIsFetchingComment(false);
          setComments(data.comments);
        });
    }
  }, [showComments]);

  function toggleCommentsHandler() {
    setShowComments((prevStatus) => !prevStatus);
  }

  function addCommentHandler(commentData) {
    notficaitonCtx.showNotification({
      title: "Sending Comment..",
      message: "Your comment is being stored",
      status: "pending",
    });
    fetch(`/api/comments/${eventId}`, {
      method: "POST",
      body: JSON.stringify(commentData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return response.json().then((data) => {
          throw new Error(data.message || "Something went wrong");
        });
      })
      .then((data) =>
        notficaitonCtx.showNotification({
          title: "Success!",
          message: "Successfully Added comment",
          status: "success",
        })
      )
      .catch((error) => {
        notficaitonCtx.showNotification({
          title: "Error!",
          message: error.message || "Something went wrong",
          status: "error",
        });
      });
  }

  return (
    <section className={classes.comments}>
      <button onClick={toggleCommentsHandler}>
        {showComments ? "Hide" : "Show"} Comments
      </button>
      {showComments && <NewComment onAddComment={addCommentHandler} />}
      {showComments && !isFetchingComment && <CommentList items={comments} />}
      {showComments && isFetchingComment && <p>Loading Comments....</p>}
    </section>
  );
}

export default Comments;
