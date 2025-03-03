import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import './home.css';
import { Toaster,toast } from "react-hot-toast";
export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="container">
        <button id="btn2"
      onClick={() =>{
        toast.success("Logout Successfully")
        setTimeout(()=>
          {
            localStorage.removeItem("cookie")
            navigate("/login")
          },1000)
      }
         
         } className="button">
       <h1 className="text-black fw-bold"> Logout</h1>
      </button>
      <h2 className="form-title "><h1 className="text-white">Home</h1></h2>
      
     <div className="parent">
     <button onClick={() => navigate("/health-issue")} className="button">
       <h1> Health Issue</h1>
      </button>
      <Toaster/>
      <button onClick={() => navigate("/event-form")} className="button">
       <h1> Event Participation</h1>
      </button>
     </div>
    </div>
  );
}

// Function to generate and download PDF
const generatePDF = (title, data) => {
  const doc = new jsPDF();
  doc.text(title, 20, 20);
  let yOffset = 40;
  Object.keys(data).forEach((key) => {
    doc.text(`${key}: ${data[key]}`, 20, yOffset);
    yOffset += 10;
  });
  doc.save(`${title}.pdf`);
};

// HealthForm Component
export function HealthForm() {
  const handleDownload = (event) => {
    event.preventDefault();
    const formData = {
      From: event.target.from.value,
      To: event.target.to.value,
      "Selected Authority": event.target.authority.value,
    };
    generatePDF("Health Issue Form", formData);
  };

  return (
    <div className="container">
      <h2 className="form-title">Health Issue Form</h2>
      <form onSubmit={handleDownload} className="form-container">
        <label className="form-label">From:</label>
        <input name="from" type="date" className="form-input" required />

        <label className="form-label">To:</label>
        <input name="to" type="date" className="form-input" required />

        <label className="form-label">Select Authority:</label>
        <select name="authority" className="form-input" required>
          <option value="HOD (Manoj Brahme)">HOD (Manoj Brahme)</option>
          <option value="Class Counselor (Shubhangi Chaware)">Class Counselor (Shubhangi Chaware)</option>
        </select>

        <button type="submit" className="submit-button">
          Download PDF
        </button>
      </form>
    </div>
  );
}

// EventForm Component
export function EventForm() {
  const handleDownload = (event) => {
    event.preventDefault();
    const formData = {
      From: event.target.from.value,
      To: event.target.to.value,
      "Event Name": event.target.eventName.value,
      "Event Place": event.target.eventPlace.value,
    };
    generatePDF("Event Participation Form", formData);
  };

  return (
    <div className="container">
      <h2 className="form-title">Event Participation Form</h2>
      <form onSubmit={handleDownload} className="form-container">
        <label className="form-label">From:</label>
        <input name="from" type="date" className="form-input" required />

        <label className="form-label">To:</label>
        <input name="to" type="date" className="form-input" required />

        <label className="form-label">Event Name:</label>
        <input name="eventName" type="text" className="form-input" placeholder="Enter event name" required />

        <label className="form-label">Event Place:</label>
        <input name="eventPlace" type="text" className="form-input" placeholder="Enter event place" required />

        <button type="submit" className="submit-button">
          Download PDF
        </button>
      </form>
    </div>
  );
}
