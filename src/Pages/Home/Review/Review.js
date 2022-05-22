import React from "react";
import { Link } from "react-router-dom";
import useReview from "../../../hooks/useReview";
import "./Review.css";

const Review = () => {
  const [review, setReview] = useReview();

  const clientReview = review.slice(0, 3);

  return (
    <div className="container review-div">
      <h1 className="review-title">Our Client Says</h1>
      <div className="review-card">
        {clientReview.map((client) => {
          const { name, img, rating, desription } = client;
          return (
            <div className="single-reviews">
              <div class="row">
                <div class="col">
                  <div class="card h-100 single-review">
                    <img src={img} alt="" />
                    <div class="card-body">
                      <h4 class="card-title">{name}</h4>
                      <h6 class="card-title">{rating}</h6>
                      <p class="card-text">{desription}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Link to="/allreview" className="review-button w-25 d-block mx-auto">
        SEE MORE..
      </Link>
    </div>
  );
};

export default Review;
