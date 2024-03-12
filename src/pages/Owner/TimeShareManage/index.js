import { useContext, useEffect, useState } from "react";
import "./timeshare-management.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GlobalContext } from "../../../provide";

const sample = {
  timeshareId: 1,
  image:
    "https://vietnamstaytravel.com/wp-content/uploads/2021/08/202108101050-image1.jpg",
  timeshareName: "Ha Long",
  address: "Viet Nam",
  price: 2000,
  detail:
    "Tọa lạc trên con đường vàng Trần Phú, phía trước là vịnh Nha Trang khách sạn PREMIER HAVANA Nha Trang là điểm nhấn độc đáo trong xu hướng nghỉ dưỡng đẳng cấp 5 sao Quốc tế tại Nha Trang nói riêng và tại Việt Nam nói chung. PREMIER HAVANA Nha Trang hiện là khách sạn quốc tế lớn nhất Việt Nam hiện nay với chiều cao 41 tầng và hơn 1.000 phòng lưu trú hướng biển. Khách sạn với đường hầm nối biển duy nhất tại Việt Nam. Từ sảnh khách sạn, Quý khách có thể tản bộ ra bờ biển bằng đường hầm riêng biệt nối liền từ khách sạn - một trong những nét chấm phá độc đáo nhất về thiết kế chỉ có thể tìm thấy ở PREMIER HAVANA Nha Trang.",
  place: "Viet Nam",
};
function TimeShareManagePage() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const userContext = useContext(GlobalContext);
  const { isLogin, userInformation } = userContext;
  const handleFetchData = async () => {
    try {
      const [getTimeShare, getPlace, getTimeShareStatus] = await Promise.all([
        axios.get(
          `/timeshare/GetTimeshareByUserId/${userInformation["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]}`
        ),
        axios.get("/Place/GetAllPlace"),
        axios.get("/TimeshareStatus/GetAllTimeshareStatus"),
      ]);
      if (
        getTimeShare.status === 200 &&
        getTimeShare.data.isSucceed &&
        getTimeShare.data.message === "Timeshares retrieved successfully." &&
        getPlace.status === 200 &&
        getPlace.data.isSucceed &&
        getPlace.data.message === "Place retrived successfully." &&
        getTimeShareStatus.status === 200 &&
        getTimeShareStatus.data.isSucceed &&
        getTimeShareStatus.data.message ===
          "Timeshare status retrived successfully."
      ) {
        let timeshares = getTimeShare.data?.result;
        let places = getPlace.data?.result;
        let timeshareStatuses = getTimeShareStatus.data?.result;
        const mergedObjects = timeshares.map((timeshare) => {
          const place = places.find(
            (place) => place.placeId === timeshare.placeId
          );
          const timeshareStatus = timeshareStatuses.find(
            (status) => status.timeshareStatusId === timeshare.timeshareStatusId
          );

          return {
            ...timeshare,
            place,
            timeshareStatus,
          };
        });
        console.log(mergedObjects);
        setData(mergedObjects);
      } else {
        console.log(1);
        console.log("Can't get time share");
      }
    } catch (err) {
      console.log(2);

      console.log("Can't get time share");
    }
  };

  useEffect(() => {
    handleFetchData();
  }, []);

  return (
    <>
      <div
        className="timeshare-owner-management"
        style={{
          display: "grid",
          gridTemplateColumns: "auto auto",
          justifyContent: "center",
          alignItems: "center",
          gap: "30px",
          marginTop: "2%",
        }}
      >
        {data.map((item, index) => {
          const {
            timeshareId,
            image,
            timeshareName,
            address,
            price,
            detail,
            place,
            timeshareStatusId,
          } = item;
          return (
            <div
              className="member-info-container"
              key={index}
              style={{ padding: "20px 20px 0", minWidth: "500px" }}
            >
              <div className="rental-card-detail">
                <div className="rental-card-header">
                  <div
                    className="resort-image image image-tilt_left hide-for-small-only "
                    style={{
                      backgroundColor: "rgba(0,0,0,0.3)",
                      minWidth: "11rem",
                      minHeight: "11rem",
                      height: "11.214286 rem",
                      width: "11.071429 rem",
                      top: 0,
                      left: 0,
                    }}
                  >
                    <div
                      className="resort-frame-image background-cover"
                      style={{
                        backgroundImage: `url(${image})`,
                        height: "11rem",
                      }}
                    ></div>
                  </div>
                  <div
                    className="timeshare-title"
                    style={{ textAlign: "left", marginLeft: "20px" }}
                  >
                    <h3 className="timeshare-details-title">{timeshareName}</h3>
                    <h5>{price}$</h5>
                    <h4>{detail}</h4>
                    {timeshareStatusId === 2 ? (
                      <button
                        className="owner-management-button"
                        onClick={() =>
                          navigate(`/timeshare-booking/${timeshareId}`)
                        }
                      >
                        SEE THE ORDER
                      </button>
                    ) : timeshareStatusId === 1 ? (
                      <div style={{ backgroundColor: "#feb600" }}>
                        <h4>Waiting for the accept</h4>
                      </div>
                    ) : (
                      <div style={{ backgroundColor: "#f44336" }}>
                        <h4>This is decline from the admin</h4>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default TimeShareManagePage;
