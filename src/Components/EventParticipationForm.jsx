import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import axios from "axios";
import "./EventParticipationForm.css"; // ✅ Import CSS file

axios.defaults.withCredentials = true;

const generatePDF = (title, formData, userData) => {
  const doc = new jsPDF();
  doc.text(title, 20, 20);
  let yOffset = 40;

  const currentDate = new Date();
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  const formattedDate = `${currentDate.getDate()} ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  const applicationText = `
To,
The ${formData.authority},
St. Vincent Pallotti College
${formattedDate} 

Subject: Request for Permission and Attendance Consideration for Event Participation

Respected Sir/Madam,

I, ${userData.name}, UID: ${userData.uid}, Roll Number: ${userData.roll}, 
a student of ${userData.branch}, Year: ${userData.year}, was unable to attend 
college from ${formData.from} to ${formData.to} as I participated in an external event.

Event Details:
Event Name: ${formData.eventName}
Event Place: ${formData.eventPlace}

I sincerely request you to grant me permission for this event and kindly consider my absence by marking my attendance accordingly. 
I assure you that I will keep up with all academic responsibilities and assignments.

I have also attached necessary proof of my participation in the event for your reference.

Thank you for your consideration.

Sincerely,
${userData.name}
  `;

  doc.text(applicationText, 20, yOffset, { maxWidth: 170 });
  doc.save(`${title}.pdf`);
};

export default function EventParticipationForm() {
  const [userData, setUserData] = useState({});
 
  const token = localStorage.getItem("cookie");
 
  // Sending request with Authorization header
 const taketoken=async()=>
 {
  await axios.get("https://application-1-cqzu.onrender.com/user", {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(response=>
  {
setUserData(response.data.user)
  }
  )
  
  .catch(error => console.error("Error:", error));
 }
 useEffect(()=>
{
  taketoken()
},[])

  const handleDownload = (event) => {
    event.preventDefault();
    const formData = {
      from: event.target.from.value,
      to: event.target.to.value,
      authority: event.target.authority.value,
      eventName: event.target.eventName.value,
      eventPlace: event.target.eventPlace.value,
    };
    generatePDF("Request for Attendance Consideration Due to Event Participation", formData, userData);
  };

  return (
    <div className="container">
      <h2 className="form-title ">Event Participation Form</h2>
      <form onSubmit={handleDownload} className="form-container">
        <label className="form-label">From:</label>
        <input name="from" type="date" className="form-input" required />

        <label className="form-label">To:</label>
        <input name="to" type="date" className="form-input" required />

        <label className="form-label">Event Name:</label>
        <input name="eventName" type="text" className="form-input" placeholder="Enter event name" required />

        <label className="form-label">Event Place:</label>
        <input name="eventPlace" type="text" className="form-input" placeholder="Enter event place" required />

        <label className="form-label">Select Authority:</label>
        <select name="authority" className="form-select" required>
          <option value="HOD (Manoj Brahme)">HOD (Manoj Brahme)</option>
          <option value="Class Counselor (Shubhangi Chaware)">Class Counselor (Shubhangi Chaware)</option>
        </select>

        <button type="submit" className="submit-button">
          Download Application Letter (PDF)
        </button>
      </form>
    </div>
  );
}
