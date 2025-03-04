import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import axios from "axios";
import "./HealthIssueForm.css"; // ✅ Import CSS file

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

Subject: Request for Attendance Consideration due to Health Issues

Respected Sir/Madam,

I, ${userData.name}, UID: ${userData.uid}, Roll Number: ${userData.roll},
a student of ${userData.branch}, Year: ${userData.year}, was unable to attend
college from ${formData.from} to ${formData.to} due to health issues.

During this period, I was advised complete rest by my doctor, which
prevented me from attending classes and other academic activities. Despite
my absence, I have been keeping up with my coursework and ensuring that I
stay on track with my studies.

I have attached a medical certificate as proof of my illness for your reference and verification. 
I kindly request you to consider my application and grant me the necessary attendance for the mentioned period.

Thank you for your time and consideration. Looking forward to your positive
response.

Sincerely,
${userData.name}
  `;

  doc.text(applicationText, 20, yOffset, { maxWidth: 170 });
  doc.save(`${title}.pdf`);
};

export default function HealthIssueForm() {
  const [userData, setUserData] = useState({});


 
  // Sending request with Authorization header
 const taketoken=async()=>
 {  const token = localStorage.getItem("cookie");
  
  await axios.get(`${import.meta.env.VITE_FRONT}/user`, {
    withCredentials: true, // ✅ Correct Placement
    headers: { Authorization: `Bearer ${token}` }
  })
  
  .then(response=>
  {
setUserData(response.data.user)
  }
  ).catch(error => console.error("Error:", error));
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
    };
    generatePDF("Application for Attendance Consideration Due to Medical Reasons", formData, userData);
  };

  return (
    <div className="container">
      <h2 className="form-title ">Health Issue Form</h2>
      <form onSubmit={handleDownload} className="form-container">
        <label className="form-label">From:</label>
        <input name="from" type="date" className="form-input" required />

        <label className="form-label">To:</label>
        <input name="to" type="date" className="form-input" required />

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
