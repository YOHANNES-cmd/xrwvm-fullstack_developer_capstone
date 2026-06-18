import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);

  const params = useParams();
  const id = params.id;
  
  // Clean relative path syntax
  const dealer_url = `/djangoapp/dealer/${id}`;
  const review_url = `/djangoapp/add_review`;
  const carmodels_url = `/djangoapp/get_cars`;

  const postreview = async () => {
    let name = sessionStorage.getItem("firstname") + " " + sessionStorage.getItem("lastname");
    if (!name || name.includes("null") || name.trim() === "") {
      name = sessionStorage.getItem("username");
    }
    
    if (!model || review === "" || date === "" || year === "" || model === "") {
      alert("All details are mandatory");
      return;
    }

    let model_split = model.split(" ");
    let make_chosen = model_split[0];
    let model_chosen = model_split.slice(1).join(" "); // Handles multi-word models like "C-Class" safely

    let jsoninput = JSON.stringify({
      "name": name,
      "dealership": parseInt(id),
      "review": review,
      "purchase": true,
      "purchase_date": date,
      "car_make": make_chosen,
      "car_model": model_chosen,
      "car_year": parseInt(year),
    });

    const res = await fetch(review_url, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: jsoninput,
    });

    const json = await res.json();
    if (json.status === 200) {
        window.location.href = window.location.origin + "/dealer/" + id;
    } else {
        alert("Error posting review. Make sure you are logged in.");
    }
  };

  const get_dealer = async () => {
    try {
      const res = await fetch(dealer_url, { method: "GET" });
      const retobj = await res.json();
      if (retobj.status === 200 && retobj.dealer) {
        // FIXED: Directly save the plain response dictionary
        setDealer(retobj.dealer);
      }
    } catch (e) {
      console.error("Error fetching dealer:", e);
    }
  };

  const get_cars = async () => {
    try {
      const res = await fetch(carmodels_url, { method: "GET" });
      const retobj = await res.json();
      if (retobj.CarModels) {
        setCarmodels(Array.from(retobj.CarModels));
      }
    } catch (e) {
      console.error("Error fetching car choices:", e);
    }
  };

  useEffect(() => {
    get_dealer();
    get_cars();
  }, []);

  return (
    <div className="container mt-5" style={{ maxWidth: '700px', margin: '40px auto' }}>
      <div className="card p-4 shadow-sm border-0 bg-white" style={{ borderRadius: '15px' }}>
        <h2 className="mb-1 text-dark fw-bold" style={{ color: "darkblue" }}>
          Write a Review for: <span className="text-secondary">{dealer.full_name}</span>
        </h2>
        <hr className="mb-4" />

        <div className="mb-3">
          <label htmlFor="reviewText" class="form-label fw-bold text-muted small">YOUR EXPERIENCE</label>
          <textarea id='review' className="form-control" cols='50' rows='5' placeholder="Write your detailed review description here..." onChange={(e) => setReview(e.target.value)} style={{ borderRadius: '8px' }}></textarea>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label fw-bold text-muted small">PURCHASE DATE</label>
            <input type="date" className="form-control" onChange={(e) => setDate(e.target.value)} style={{ borderRadius: '8px' }} />
          </div>
          
          <div className="col-md-6">
            <label className="form-label fw-bold text-muted small">CAR YEAR</label>
            <input type="number" className="form-control" placeholder="YYYY" onChange={(e) => setYear(e.target.value)} max={2026} min={2015} style={{ borderRadius: '8px' }} />
          </div>
        </div>

        <div className="mb-4">
  <label className="form-label fw-bold text-muted small">SELECT CAR VEHICLE MAKE & MODEL</label>
  <select name="cars" id="cars" className="form-select" defaultValue="" onChange={(e) => setModel(e.target.value)} style={{ borderRadius: '8px' }}>
    <option value="" disabled hidden>Choose Car Make and Model</option>
    {carmodels.map((carmodel, idx) => (
        /* FIXED: Using exact Capitalization matching your Django get_cars JSON payload keys */
        <option key={idx} value={carmodel.CarMake + " " + carmodel.CarModel}>
          {carmodel.CarMake} — {carmodel.CarModel}
        </option>
    ))}
  </select>        
</div>


        <div>
          <button className='btn text-white w-100 fw-bold py-2 shadow-sm' onClick={postreview} style={{ backgroundColor: 'darkturquoise', borderRadius: '8px', fontSize: '1.05rem' }}>
            Post Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostReview;
