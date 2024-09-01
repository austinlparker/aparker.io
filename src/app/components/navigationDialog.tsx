import React from "react";
import { Link, useNavigate } from "@remix-run/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faHome,
} from "@fortawesome/free-solid-svg-icons";

interface NavigationDialogProps {
  previousPost?: string;
  nextPost?: string;
}

export function NavigationDialog({
  previousPost,
  nextPost,
}: NavigationDialogProps) {
  const navigate = useNavigate();

  return (
    <div className="modal-dialog outer-border w-full">
      <div className="inner-border center">
        <div className="modal-contents flex justify-between items-center">
          <button
            onClick={() => previousPost && navigate(previousPost)}
            className="btn"
            disabled={!previousPost}
          >
            <FontAwesomeIcon icon={faChevronLeft} /> Previous
          </button>

          <Link to="/" className="btn">
            <FontAwesomeIcon icon={faHome} />
          </Link>

          <button
            onClick={() => nextPost && navigate(nextPost)}
            className="btn"
            disabled={!nextPost}
          >
            Next <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    </div>
  );
}
