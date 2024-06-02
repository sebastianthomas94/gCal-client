import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Calendar = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [eventDate, setEventDate] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endDate, setEndDate] = useState("");

  const [event, setEvent] = useState([]);
  useEffect(() => {
    const data = localStorage.getItem("events");
    console.log(data)
    if(!data){
      return;
    }
    const events = JSON.parse(data);
    setEvent(events);
  }, []); 
  useEffect(() => {
    const events = JSON.stringify(event);
    console.log("new event as string: ",events);
    localStorage.setItem("events", events);
  }, [event]);

  const handleSubmit = async () => {
    if (!title || !description || !endDate || !eventDate) {
      alert("please enter the information");
    }
    const data = {
      summary: title,
      description,
      endTime: new Date(endDate).toISOString(),
      startTime: new Date(eventDate).toISOString(),
    };

    setEvent((prev) => [
      ...prev,
      {
        title: data.summary,
        date: data.startTime.slice(0, 10),
      },
    ]);

    console.log("form data: ", data);
    console.log(`url:${process.env.REACT_APP_API_URL}/event`);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/event`,
        data,
        {
          withCredentials: true, // Important to include cookies
        }
      );
      console.log("Response: ", response.data);

      // Clear the form fields
      setTitle("");
      setDescription("");
      setEndDate("");
      setEventDate("");
      setShowModal(false);
    } catch (error) {
      console.error("Error submitting form: ", error);
      // Handle the error as needed, e.g., display a message to the user
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("loggedIn")) {
      navigate("/login");
    }
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleDateClick = (arg) => {
    setEventDate(arg.dateStr);
    setShowModal(true);
  };

  return (
    <div className="container mx-auto">
      <button
        type="button"
        className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
        onClick={handleLogout}
      >
        Logout
      </button>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        editable={true}
        selectable={true}
        events={event}
        dateClick={handleDateClick}
      />
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>
            <div className="relative bg-white w-96 p-6 rounded-lg">
              <button
                type="button"
                className="absolute top-0 right-0 mt-4 mr-4 text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={() => setShowModal(false)}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Add Event
                </h3>
                <div className="mt-2">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      onChange={(e) => setTitle(e.target.value)}
                      value={title}
                      className="mt-1 p-1 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows="3"
                      className="mt-1 p-1 border border-gray-300 rounded-md"
                    ></textarea>
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      id="endDate"
                      disabled
                      value={eventDate}
                      className="mt-1 p-1 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={endDate}
                      id="endDate"
                      onChange={(e) => setEndDate(e.target.value)}
                      className="mt-1 p-1 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300"
                      onClick={() => {
                        handleSubmit();
                      }}
                    >
                      Add Event
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
