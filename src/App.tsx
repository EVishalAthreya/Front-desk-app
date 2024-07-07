import React, { useState, useEffect } from 'react';
import './App.css';
import CheckInForm from './CheckInForm';
import VisitorLog from './VisitorLog';
import axios from 'axios';

interface Visitor {
  name: string;
  contact: string;
  purpose: string;
  host: string;
  arrival: string;
  image: string; // New field for image data
}

function App() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [notification, setNotification] = useState<string>('');

  const addVisitor = async (visitor: Visitor) => {
    console.log('Adding visitor:', visitor);
    try {
      const response = await axios.post('http://localhost:5000/api/visitors', visitor);
      console.log('Server response:', response.data);
      if (response.status === 201) {
        setVisitors([...visitors, visitor]);
        setNotification(`Notification sent to ${visitor.host}`);
        setTimeout(() => setNotification(''), 3000);
      } else {
        console.error('Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error('There was an error adding the visitor!', error);
    }
  };

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/visitors');
        setVisitors(response.data);
      } catch (error) {
        console.error('There was an error fetching visitors!', error);
      }
    };

    fetchVisitors();
  }, []);

  return (
    <div className="body">
      <div id="container">
        <header>
          <h1>Welcome to the Front Desk</h1>
        </header>
        <main>
          <div className="check-in-section">
            <h2>Check In</h2>
            <CheckInForm addVisitor={addVisitor} />
            {notification && <div className="notification">{notification}</div>}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
