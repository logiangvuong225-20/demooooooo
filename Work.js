import React, { useState, useEffect } from "react";
import "./Work.css";
import axios from "axios";
import { Link } from "react-router-dom";
const Work = () => {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [des, setDes] = useState("");

  const [filterdata, setFilterdata] = useState([]);
  const [page, setPage] = useState(1);
  const [renderdata, setRenderdata] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [carts, setCarts] = useState([]);
  const [countView, setCountView] = useState(5);

  useEffect(async () => {
    const result = await axios("http://localhost:4000/getposts");

    setData(result.data);
  }, []);

  const submitReview = () => {
    axios.post("http://localhost:4000/insert", { title: title, des: des });

    setData([...data, { title: title, des: des }]);
  };
  const deleteData = (id) => {
    var answer = window.confirm("Ban co chac muon xoa?");
    if (answer) {
      axios.delete(`http://localhost:4000/delete/${id}`);
    } else {
      return;
    }
  };
  const updateData = (id) => {
    axios.put(`http://localhost:4000/update/${id}`, { title: title, des: des });
  };
  const cartData = (id) => {
    axios.post(`http://localhost:4000/addcart/${id}`);
  };
  // add view
  const countViewData = (id) => {
    setCountView(countView + 1);
    // axios.post(`http://localhost:4000/addview/${id}`, { countView: countView });
  };

  useEffect(async () => {
    const result = await axios(`http://localhost:4000/cart`);

    setCarts(result.data);
  }, []);
  useEffect(() => {
    setRenderdata(filterdata.slice((page - 1) * 5, page * 5));
  }, [filterdata, page]);

  useEffect(() => {
    if (keyword === "") {
      setFilterdata(data);
    } else {
      setFilterdata(
        data.filter((d) =>
          d.title.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    }
  }, [data, keyword]);
  const nextPage = () => {
    if (!filterdata[5 * page]) return;
    setPage(page + 1);
  };

  const prevPage = () => {
    if (page === 1) return;
    setPage(page - 1);
  };

  return (
    <div>
      {" "}
      <button> View</button>
      <div className="cart">
        Gio hang:
        <br></br>
        ----------------
        {carts.map((cart) => (
          <div>
            <p> {cart.title}</p>
            <p>-------------</p>
          </div>
        ))}
      </div>
      <div className="formAdd">
        <h2>DEMO</h2>
        <label htmlFor="title">Title:</label>
        <br />
        <input
          type="text"
          id="title"
          name="title"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <br />
        <label htmlFor="body">Body:</label>
        <br />
        <input
          type="text"
          id="body"
          name="body"
          onChange={(e) => {
            setDes(e.target.value);
          }}
        />
        <br />
        <br />
        <button onClick={submitReview}>ADD</button>
      </div>
      <div
        className="search"
        style={{
          width: 500,
        }}
      >
        <h3>Search:</h3>
        <br></br>
        <input
          placeholder="search..."
          type="text"
          className="form-control"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
      <div className="all-item">
        {renderdata.map((d) => (
          <div>
            <Link to={`/detail/${d.id}`} onClick={() => countViewData(d.id)}>
              {" "}
              <h3>{d.title}</h3>
            </Link>
            <p>{d.des}</p>
            <br></br>
            <input
              type="text"
              placeholder="title"
              name="name"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            ></input>{" "}
            <br />
            <br />
            <input
              type="text"
              placeholder="description"
              onChange={(e) => {
                setDes(e.target.value);
              }}
            ></input>
            <br />
            <button
              className="deleteData"
              onClick={() => {
                deleteData(d.id);
              }}
            >
              {" "}
              Delete
            </button>
            <button
              className="update"
              onClick={() => {
                updateData(d.id);
              }}
            >
              Update
            </button>
            <button
              className="update"
              onClick={() => {
                cartData(d.id);
                console.log(d.id);
              }}
            >
              Cart
            </button>
          </div>
        ))}
      </div>
      <div className="d-flex">
        <button className="btn btn-primary mx-2" onClick={prevPage}>
          Prev
        </button>
        <button className="btn btn-primary mx-2" onClick={nextPage}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Work;
