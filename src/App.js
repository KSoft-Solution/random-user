import React, { useState, useEffect } from "react";
import moment from "moment";
import _ from "lodash";
import "./App.scss";
import axios from "./config";
import Pagination from "./hooks/pagination";

const App = () => {
  const [data, setData] = useState([]);
  const [myApi, setMyApi] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchUser, setSearchUser] = useState("");
  const [imageToShow, setImageToShow] = useState("");
  const [lightboxDisplay, setLightBoxDisplay] = useState(false);
  let PageSize = 10;

  const isSearched = (searchUser) => (each) =>
    each.name.first.toLowerCase().includes(searchUser.toLowerCase());

  useEffect(() => {
    const apiData = async () => {
      return await axios
        .get(`/api/?results=${100}&nat=US`)
        .then((response) => {
          if (!_.isNil(response.data)) {
            setData(response.data.results);
            let myApi = renderData(response.data.results);
            setMyApi(myApi);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    apiData();
  }, []);

  const showImage = (image) => {
    setImageToShow(image);
    setLightBoxDisplay(true);
  };

  //hide lightbox
  const hideLightBox = () => {
    setLightBoxDisplay(false);
  };

  const renderData = (data) => {
    return data.map((data) => {
      return (
        <div className="card-container" key={data.id.value}>
          <div className="leftContent">
            <div className="thumbnail">
              <img
                src={data.picture.thumbnail}
                alt="thumbnail"
                onClick={() => showImage(data.picture.large)}
              />
            </div>
            <div className="fullName">
              {data.name.title}. {data.name.first} {data.name.last}
            </div>
            <div className="dob">
              <label className="label" htmlFor="dob">
                DOB
              </label>
              {moment(_.toString(data.dob.date)).format("DD/MM/YYYY")}
            </div>
          </div>
          <div className="rightContent">
            <div className="userInfo">
              <div className="email_name_phone">
                <div className="userName">
                  <div className="label">User Name :</div>
                  <div className="field">{data.login.username}</div>
                </div>
                <div className="email">
                  <div className="label">Email :</div>
                  <div className="field">{data.email}</div>
                </div>
                <div className="phoneNo">
                  <div className="label">Phone No. :</div>
                  <div className="field">
                    {_.toString(data.phone).replace(/[^a-z0-9())]/g, "")}
                  </div>
                </div>
              </div>
            </div>
            <div className="address">
              <div className="add_label">Address :</div>
              <div className="add_dtl">
                {data.location.street.name}, {data.location.city},{" "}
                {data.location.country}, {data.location.postcode}
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  const firstPageIndex = (currentPage - 1) * PageSize;
  const lastPageIndex = firstPageIndex + PageSize;
  const currentPosts = myApi.slice(firstPageIndex, lastPageIndex);

  const handleSearchInput = (event) => {
    setSearchUser(event.target.value);
    const newData = renderData(
      data.filter((item) =>
        item.name.first.toLowerCase().includes(event.target.value)
      )
    );
    setMyApi(newData);
  };

  const Search = ({ onChange }) => {
    return (
      <div className="searchBox">
        <input
          type="text"
          autoFocus={true}
          placeholder="search users"
          onChange={onChange}
          value={searchUser}
        />
      </div>
    );
  };

  return (
    <>
      <Search onChange={handleSearchInput} />
      <div className="posts">{currentPosts}</div>
      <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={myApi.length}
        pageSize={PageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />
      {lightboxDisplay ? (
        <div id="lightbox" onClick={hideLightBox}>
          <img id="lightbox-img" src={imageToShow} alt="largeImg" />
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default App;
