import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaDownload, FaPlus, FaEdit, FaTrash, FaSync } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const styles = {
  container: {
    maxWidth: 1400,
    margin: '2rem auto',
    padding: '2rem',
    background: '#f4f6f8',
    borderRadius: 12,
    fontFamily: 'Segoe UI, sans-serif',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    marginTop: '2rem',
    padding: '1rem'
  },
  input: {
    padding: '0.6rem 1rem',
    borderRadius: 8,
    border: '1.5px solid #ccc',
    minWidth: 300,
    fontSize: '1rem',
    outlineColor: '#007bff'
  },
  buttons: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap'
  },
  btn: {
    padding: '0.55rem 1.2rem',
    fontSize: '0.95rem',
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  addBtn: { backgroundColor: '#28a745', color: '#fff' },
  editBtn: { backgroundColor: '#ffc107', color: '#222' },
  deleteBtn: { backgroundColor: '#dc3545', color: '#fff' },
  downloadBtn: { backgroundColor: '#007bff', color: '#fff' },
  greenBtn: { backgroundColor: '#17a2b8', color: '#fff' },
  purpleBtn: { backgroundColor: '#6f42c1', color: '#fff' },
  tableWrapper: { overflowX: 'auto' },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
    backgroundColor: '#fff'
  },
  th: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '0.5rem 0.75rem',
    border: '1px solid #ddd',
    fontWeight: 700,
    textAlign: 'center',
    whiteSpace: 'nowrap'
  },
  td: {
    padding: '0.4rem 0.6rem',
    border: '1px solid #eee',
    textAlign: 'center',
    fontSize: '0.9rem',
    color: '#333',
    whiteSpace: 'nowrap'
  },
  rowHighlight: {
    backgroundColor: '#e8f4fd'
  }
};

const expectedKeys = {
  year: 'Year',
  month: 'Month',
  empId: 'EmpID',
  empName: 'EmpName',
  department: 'DEPT',
  designation: 'DESIGNATION',
  dob: 'DOB',
  doj: 'DOJ',
  actualCTCWithoutLOP: 'Actual CTC Without Loss Of Pay',
  lopCTC: 'LOP CTC',
  totalDays: 'Total Days',
  daysWorked: 'Days Worked',
  al: 'AL',
  pl: 'PL',
  blOrMl: 'BL/ML',
  lop: 'LOP',
  daysPaid: 'Days Paid',
  consileSalary: 'CONSILE SALARY',
  basic: 'BASIC',
  hra: 'HRA',
  cca: 'CCA',
  transportAllowance: 'TRP_ALW',
  otherAllowance1: 'O_ALW1',
  lop2: 'LOP2',
  basic3: 'BASIC3',
  hra4: 'HRA4',
  cca5: 'CCA5',
  transportAllowance6: 'TRP_ALW6',
  otherAllowance17: 'O_ALW17',
  grossPay: 'Gross Pay',
  plb: 'PLB',
  pf: 'PF',
  esi: 'ESI',
  pt: 'PT',
  tds: 'TDS',
  gpap: 'GPAP',
  otherDeductions: 'OTH_DEDS',
  netPay: 'NET_PAY',
  pfEmployerShare: 'PF Employer Share',
  esiEmployerShare: 'ESI Employer Share',
  bonus: 'Bonus'
};

const oneDecimalFields = ['totalDays', 'daysWorked', 'al', 'pl', 'blOrMl', 'lop', 'daysPaid'];

const formatValue = (key, val) => {
  if (val === '' || val === null || val === undefined) return '';
  if (key === 'dob' || key === 'doj') {
    const d = new Date(val);
    return !isNaN(d) ? d.toISOString().split('T')[0] : '';
  }
  const num = parseFloat(String(val).replace(/,/g, '').trim());
  return isNaN(num) ? val : (oneDecimalFields.includes(key) ? num.toFixed(1) : Math.round(num));
};

const EmployeeSalaryInfo = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const fetchSalaryData = () => {
    fetch('/api/salary')
      .then(res => res.json())
      .then(salaries => {
        setData(salaries);
      })
      .catch(err => {
        console.error('❌ Error loading salary data:', err);
        toast.error('Failed to load salary data.');
      });
  };

  useEffect(() => {
    fetchSalaryData();
  }, []);

  const handleDownload = () => {
    const exportData = data.map(row => {
      const newRow = {};
      Object.keys(expectedKeys).forEach(key => {
        newRow[expectedKeys[key]] = row[key] ?? '';
      });
      return newRow;
    });
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Salary Info');
    XLSX.writeFile(wb, 'salary_info.xlsx');
  };

  const handleDelete = () => {
    if (selected.length === 0) return toast.warn('No employee selected');
    if (!window.confirm(`Delete ${selected.length} employee(s)?`)) return;

    selected.forEach(i => {
      const id = data[i]?._id;
      if (id) {
        fetch(`/api/salary/${id}`, { method: 'DELETE' })
          .then(() => fetchSalaryData());
      }
    });

    toast.success('Selected employee(s) deleted!');
    setSelected([]);
    setSelectAll(false);
  };

  const handleEdit = () => {
    if (selected.length !== 1) return toast.warn('Select exactly one employee to edit');
    const empData = data[selected[0]];
    localStorage.setItem('editEmployee', JSON.stringify(empData));
    navigate(`/edit-employee-salary-info/${empData._id}`);
  };

  const handleRegenerate = () => {
    fetch('/api/salary/generate-from-employee', { method: 'POST' })
      .then(res => res.json())
      .then(() => {
        toast.success('Salary regenerated!');
        setTimeout(fetchSalaryData, 1000);
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to regenerate salary');
      });
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
    } else {
      setSelected(data.map((_, i) => i));
    }
    setSelectAll(!selectAll);
  };

  const toggleSelect = index => {
    setSelected(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const filtered = data.filter(item => {
    const val = search.toLowerCase();
    return (
      item.empName?.toLowerCase().includes(val) ||
      item.empId?.toLowerCase().includes(val) ||
      item.department?.toLowerCase().includes(val)
    );
  });

  return (
    <div style={styles.container}>
      <ToastContainer />
      <div style={styles.topBar}>
        <input
          style={styles.input}
          placeholder="Search by Emp Name, ID, Dept"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div style={styles.buttons}>
          <button style={{ ...styles.btn, ...styles.addBtn }} onClick={() => navigate('/add-employee-salary-info')}>
            <FaPlus /> Add
          </button>
          <button style={{ ...styles.btn, ...styles.editBtn }} onClick={handleEdit}>
            <FaEdit /> Edit
          </button>
          <button style={{ ...styles.btn, ...styles.deleteBtn }} onClick={handleDelete}>
            <FaTrash /> Delete
          </button>
          <button style={{ ...styles.btn, ...styles.downloadBtn }} onClick={handleDownload}>
            <FaDownload /> Download
          </button>
          <button style={{ ...styles.btn, ...styles.greenBtn }} onClick={() => navigate('/input-data')}>
            <FaPlus /> Fixed Data
          </button>
          <button style={{ ...styles.btn, ...styles.purpleBtn }} onClick={handleRegenerate}>
            <FaSync /> Regenerate Salary
          </button>
        </div>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>
                <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
              </th>
              {Object.values(expectedKeys).map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((row, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={selected.includes(i) ? styles.rowHighlight : {}}
                >
                  <td style={styles.td}>
                    <input
                      type="checkbox"
                      checked={selected.includes(i)}
                      onChange={() => toggleSelect(i)}
                    />
                  </td>
                  {Object.keys(expectedKeys).map(k => (
                    <td key={k} style={styles.td}>
                      {formatValue(k, row[k])}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeSalaryInfo; 