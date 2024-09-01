import React from "react";
import { Link, useNavigate } from "@remix-run/react";

export function ErrorDialog() {
  const navigate = useNavigate();

  return (
    <div className="alert-box outer-border m-44">
      <div className="inner-border">
        <div className="alert-contents">
          <div className="flex items-center mb-4">
            <img
              src="/bomb.webp"
              alt="Error"
              className="w-8 h-8 mr-3 flex-shrink-0"
            />
            <h1 className="alert-text">
              Well, that wasn't supposed to happen. Something went wrong while
              processing your request.
            </h1>
          </div>
          <div className="flex justify-end space-x-2">
            <button className="btn" onClick={() => navigate(-1)}>
              Go Back
            </button>
            <Link to="/" className="btn">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
