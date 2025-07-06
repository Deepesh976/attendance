import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const containerStyle = {
  maxWidth: '900px',
  margin: '2rem auto',
  padding: '2rem',
  backgroundColor: '#fdfdfd',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  fontFamily: 'Segoe UI, sans-serif',
};

const headingStyle = {
  textAlign: 'center',
  fontSize: '1.8rem',
  fontWeight: 'bold',
  marginBottom: '2rem',
  color: '#333',
};

const formGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1.5rem',
};

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const labelStyle = {
  fontSize: '0.95rem',
  fontWeight: 600,
  marginBottom: '0.3rem',
  color: '#333',
};

const inputStyle = {
  padding: '0.55rem 0.75rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '1rem',
  outlineColor: '#007bff',
};

const submitButton = {
  marginTop: '2rem',
  width: '100%',
  padding: '0.8rem',
  backgroundColor: '#28a745',
  color: '#fff',
  border: 'none',
  fontSize: '1rem',
  fontWeight: 600,
  borderRadius: '6px',
  cursor: 'pointer',
};

const AddEmployeeSalaryInfo = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    year: '', month: '', empId: '', empName: '', dept: '', designation: '',
    dob: '', doj: '', actualCTC: '', lopCTC: '', totalDays: '', daysWorked: '',
    al: '', pl: '', blml: '', lop: '', daysPaid: '', consileSalary: '', basic: '',
    hra: '', cca: '', trpAlw: '', oAlw1: '', lop2: '', basic3: '', hra4: '',
    cca5: '', trpAlw6: '', oAlw17: '', grossPay: '', plb: '', pf: '', esi: '',
    pt: '', tds: '', gpap: '', othDeds: '', netPay: '', pfEmployer: '',
    esiEmployer: '', bonus: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Adding Employee Salary Info:', formData);
    navigate('/'); // or navigate to another route like '/employee-salary-info'
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Add Employee Salary Details</h2>
      <form onSubmit={handleSubmit}>
        <div style={formGrid}>
          {Object.entries(formData).map(([key, value]) => (
            <div style={fieldStyle} key={key}>
              <label style={labelStyle}>
                {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^./, str => str.toUpperCase())}
              </label>
              <input
                style={inputStyle}
                type="text"
                name={key}
                value={value}
                onChange={handleChange}
                required
              />
            </div>
          ))}
        </div>
        <button type="submit" style={submitButton}>Submit</button>
      </form>
    </div>
  );
};

export default AddEmployeeSalaryInfo;
