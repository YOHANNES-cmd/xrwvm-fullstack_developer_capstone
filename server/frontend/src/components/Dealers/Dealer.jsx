import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png";
import neutral_icon from "../assets/neutral.png";
import negative_icon from "../assets/negative.png";
import review_icon from "../assets/reviewbutton.png";

const Dealer = () => {
  const [dealer, setDealer] = useState({});
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [postReview, setPostReview] = useState(<></>);

  const params = useParams();
  const id = params.id;
  
  const dealer_url = `/djangoapp/dealer/${id}`;
  const reviews_url = `/djangoapp/reviews/dealer/${id}`;
  const post_review_path = `/postreview/${id}`;
  
  const get_dealer = async () => {
    try {
      const res = await fetch(dealer_url, { method: "GET" });
      const retobj = await res.json();
      if (retobj.status === 200 && retobj.dealer) {
        setDealer(retobj.dealer);
      }
    } catch (error) {
      console.error("Error fetching dealer details:", error);
    }
  };

  const get_reviews = async () => {
    try {
      const res = await fetch(reviews_url, { method: "GET" });
      const retobj = await res.json();
      if (retobj.status === 200 && retobj.reviews) {
        if (retobj.reviews.length > 0) {
          setReviews(retobj.reviews);
        } else {
          setUnreviewed(true);
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setUnreviewed(true);
    }
  };

  const senti_icon = (sentiment) => {
    let icon = sentiment === "positive" ? positive_icon : sentiment === "negative" ? negative_icon : neutral_icon;
    return icon;
  };

  useEffect(() => {
    get_dealer();
    get_reviews();
    if (sessionStorage.getItem("username")) {
      setPostReview(
        <a href={post_review_path} style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '15px' }}>
          <img src={review_icon} style={{ width: '130px', height: 'auto' }} alt='Write a review' />
        </a>
      );
    }
  }, []);  

  return (
    <div style={{ margin: "30px 50px" }}>
      {/* Dealer Title & Dynamic Review Action Button Placement Layout */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '5px' }}>
        <h1 style={{ color: "#545454", fontWeight: "bold", fontSize: "2.5rem", margin: 0 }}>
          {dealer.full_name}
        </h1>
        {postReview}
      </div>

      {/* Sub-Header Location details label wrapper matching the sample layout text styles */}
      <div style={{ fontSize: "1.15rem", color: "#6c757d", fontWeight: "500", marginBottom: '30px' }}>
        {dealer.city}, {dealer.address} - {dealer.zip}, {dealer.state}
      </div>
      
      {/* Reviews Dynamic Grid Panel wrapper framework */}
      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "25px", marginTop: "20px" }}>
        {reviews.length === 0 && unreviewed === false ? (
          <div style={{ fontSize: '1.1rem', color: '#666' }}>Loading Reviews....</div>
        ) : unreviewed === true || reviews.length === 0 ? (
          <div className="alert alert-info" style={{ width: '100%', borderRadius: '10px' }}>No reviews yet!</div>
        ) : (
          reviews.map((review, idx) => (
            /* Styled card element with matching rounded borders and soft box shadow depths */
            <div key={idx} style={{
              width: "220px",
              minHeight: "240px",
              backgroundColor: "#ffffff",
              border: "1px solid #dcdcdc",
              borderRadius: "15px",
              padding: "20px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative"
            }}>
              {/* Centered Sentiment Emotion indicator icon placement node element */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
                <img src={senti_icon(review.sentiment)} alt="Sentiment" style={{ width: "36px", height: "36px" }} />
              </div>

              {/* Central Review body description container */}
              <div style={{ flexGrow: 1, fontSize: "0.95rem", color: "#212529", lineHeight: "1.4", marginBottom: "20px" }}>
                {review.review}
              </div>

              {/* Lower text block metadata card tracking signatures */}
              <div style={{ fontSize: "0.82rem", color: "#6c757d", fontStyle: "italic", borderTop: "1px solid #eeeeee", paddingTop: "10px", lineHeight: "1.3" }}>
                <div style={{ fontWeight: "bold", color: "#495057" }}>{review.name || "Anonymous User"}</div>
                {review.car_make ? (
                  <div>{review.car_make} {review.car_model}</div>
                ) : (
                  <div style={{ visibility: "hidden" }}>No Car Info</div>
                )}
                {review.car_year ? <div>{review.car_year}</div> : <div style={{ visibility: "hidden" }}>0000</div>}
              </div>
            </div>
          ))
        )}
      </div>  
    </div>
  );
};

export default Dealer;
