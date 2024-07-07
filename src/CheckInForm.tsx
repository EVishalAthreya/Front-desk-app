import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import './App.css'; // Import the updated CSS file

interface Visitor {
  name: string;
  contact: string;
  purpose: string;
  host: string;
  arrival: string;
  image: string; // Add image field
}

interface CheckInFormProps {
  addVisitor: (visitor: Visitor) => void;
}

const CheckInForm: React.FC<CheckInFormProps> = ({ addVisitor }) => {
  const [formData, setFormData] = useState<Visitor>({
    name: '',
    contact: '',
    purpose: '',
    host: '',
    arrival: '',
    image: '' // Initialize image field
  });

  const [notification, setNotification] = useState<string>(''); // State for notification

  const webcamRef = useRef<Webcam>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setFormData({
        ...formData,
        image: imageSrc
      });
      setNotification('Image captured successfully.'); // Set notification after capturing image
      setTimeout(() => {
        setNotification('');
      }, 3000); // Clear notification after 3 seconds
    }
  }, [webcamRef, formData]);

  const getISTDateTime = () => {
    const date = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds (5 hours and 30 minutes)
    const istDate = new Date(date.getTime() + istOffset);

    const year = istDate.getFullYear();
    const month = (`0${istDate.getMonth() + 1}`).slice(-2);
    const day = (`0${istDate.getDate()}`).slice(-2);
    const hours = (`0${istDate.getHours()}`).slice(-2);
    const minutes = (`0${istDate.getMinutes()}`).slice(-2);
    const seconds = (`0${istDate.getSeconds()}`).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const visitorData = { ...formData, arrival: getISTDateTime() };
    addVisitor(visitorData);
    setFormData({
      name: '',
      contact: '',
      purpose: '',
      host: '',
      arrival: '',
      image: '' // Reset image field
    });
  };

  return (
    <form className="check-in-form" onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
      <input type="text" name="contact" placeholder="Contact" value={formData.contact} onChange={handleChange} required />
      <input type="text" name="purpose" placeholder="Purpose" value={formData.purpose} onChange={handleChange} required />
      <input type="text" name="host" placeholder="Host" value={formData.host} onChange={handleChange} required />
      
      {/* Webcam integration */}
      <div className="webcam-container">
        <div className="webcam-preview">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="100%"
          />
        </div>
        <button className="webcam-button" type="button" onClick={capture}>Capture Photo</button>
      </div>

      {/* Notification */}
      {notification && <div className="notification">{notification}</div>}

      <button type="submit">Check In</button>
    </form>
  );
};

export default CheckInForm;
