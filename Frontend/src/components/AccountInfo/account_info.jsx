import React, { useState, useEffect ,useCallback} from 'react';
import { useParams, Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import './account_info.css';
import AddTransactionPopup from './add-transaction-popup';
import axios from 'axios';
 import 'jspdf-autotable';


function Account() {
    
    // console.log('Account component is rendering');
    const [activeTab, setActiveTab] = useState('transactions');
    const [transactions, setTransactions] = useState([]);
    const [statements] = useState([
        { id: 1, name: 'Sample Statement ', file: `${import.meta.env.VITE_PUBLIC_URL}/sample-1.pdf` },
        // { id: 2, name: 'Sample Statement 2', file: `${import.meta.env.VITE_PUBLIC_URL}/sample-2.pdf` },
    ]);
    const [showAddTransactionPopup, setShowAddTransactionPopup] = useState(false);
    const [error, setError] = useState(null);
    const [balanceData,  setBalanceData] = useState(null);



    const token = localStorage.getItem('token'); // Get token from localStorage
    console.log('Token:', token); // Debug token value

    useEffect(() => {
        if (activeTab === 'transactions') {
            loadTransactions();
        }
    }, [activeTab,token]);
   
    
const fetchBalance = async () => {
    try {
        if (!token) {
            setError('No token found');
            return;
        }

        const response = await axios.get('http://localhost:3000/api/getBalance', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        setBalanceData(response.data);
        console.log('Balance data:', response.data);
    } catch (err) {
        setError(err.response ? err.response.data.error : 'Error fetching balance');
        console.error('Error fetching balance:', err);
    }
};

useEffect(() => {
    console.log('Loading');
    fetchBalance();
}, [token]);

  useEffect(() => {
    if (transactions) {
      console.log('transaction data has been set:', transactions);
    }
  }, [transactions]);


 // Access balanceData and handle null cases
 const initialBalance = balanceData ? balanceData.customer.initial_balance : 'N/A';
 const balance = balanceData ? balanceData.customer.balance : 'N/A';

 const username=balanceData ? balanceData.customer.username : 'N/A';

const loadTransactions = async () => {
    try {
        if (!token) {
            setError('No token found');
            return;
        }
        const response = await axios.get('http://localhost:3000/api/getBalance', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // Check if response status is in the 200 range
        if (response.status >= 200 && response.status < 300) {
            const transactionData = response.data;
            console.log("djbs:",response.data);
            setTransactions(transactionData.customer.transactions);
        } else {
            console.error('Failed to fetch transaction data');
        }
    } catch (error) {
        console.error('Error fetching transaction data:', error);
        setError('Error fetching transaction data');
    }
};


    const downloadStatement = (statement) => {
        const doc = new jsPDF();

        // Add title or statement info
        doc.text(`Downloaded ${statement.name}`, 20, 20);

        // Prepare table data
        const tableData = transactions.map(transaction => [
            transaction.name || 'N/A',
            transaction.transaction_type || 'N/A',
            transaction.amount || 'N/A',
            transaction.updated_balance || 'N/A'
        ]);

        // Add table to PDF
        doc.autoTable({
            startY: 30,
            head: [['Name', 'Type', 'Amount', 'Remaining Balance']],
            body: tableData
        });

        // Save PDF
        doc.save(`${statement.name}.pdf`);
    };


    const emailStatement = async (statement) => {
        try {
            // Create a new jsPDF instance
            const doc = new jsPDF();
    
            // Add title or statement info
            doc.text(`Downloaded ${statement.name}`, 20, 20);
    
            // Prepare table data
            const tableData = transactions.map(transaction => [
                transaction.name || 'N/A',
                transaction.transaction_type || 'N/A',
                transaction.amount || 'N/A',
                transaction.updated_balance || 'N/A'
            ]);
    
            // Add table to PDF
            doc.autoTable({
                startY: 30,
                head: [['Name', 'Type', 'Amount', 'Remaining Balance']],
                body: tableData
            });
    
            // Convert PDF to Blob
            const pdfBlob = doc.output('blob');
    
            // Prepare form data to send to the backend
            const formData = new FormData();
            formData.append('to', email); // Make sure `email` is available in your component or state
            formData.append('subject', 'Statement PDF');
            formData.append('text', 'Attached is your statement PDF.');
            formData.append('pdfFile', pdfBlob, `${statement.name}.pdf`);
    
            // Send the PDF to the backend for emailing
            const emailResponse = await fetch('http://localhost:3000/send-statement', {
                method: 'POST',
                body: formData
            });
    
            if (emailResponse.ok) {
                alert('Statement emailed successfully!');
            } else {
                console.error('Failed to email statement');
            }
        } catch (error) {
            console.error('Error emailing statement:', error);
        }
    };
    const openTab = (tabName) => {
        setActiveTab(tabName);
    };
    const toggleAddTransactionPopup = () => {
        setShowAddTransactionPopup(!showAddTransactionPopup);
    };

    return (
        <div className='Accountinformation'>
        <div className="Account-container">
            <Link to="/" className="back-link">Back to home screen</Link>
            <div className="Accountheader">
                <div className="Account-name">Welcome <b>{username}</b> </div>
                <div className="Dropdown">
                    <button className="Dropbtn">Account Settings</button>
                    <div className="Dropdown-content">
                        {/* <a href="#">Account Settings</a> */}
                        <Link to="/profile">Profile</Link>
                        {/* <Link to="/personal-details">Personal Details</Link> */}
                         <Link to="/privacysecurity">Privacy & Security</Link>
                        <Link to="/">Log out</Link>
                    </div>
                </div>
            </div>

            <div className="Account-details">
                <div className="Account-summary">
                    <div className="Summary-item">
                        <p>Sort code</p>
                        <p>60-84-56</p>
                    </div>
                    <div className="Summary-item">
                        <p>Account number</p>
                        <p>82918037</p>
                    </div>
                    <div className="Summary-item">
                        <p>Initial balance</p>
                        <p>£{initialBalance}</p>
                    </div>
                    <div className="Summary-item">
                        <p>Updated balance</p>
                        <p>£{balance}</p>
                    </div>
                    <div className="Summary-item">
                        <p>Gross Interest</p>
                        <p>5.04%</p>
                    </div>
                    <div className="Summary-item">
                        <p>AER Interest</p>
                        <p>5.16%</p>
                    </div>
                </div>
            </div>

            <div className="nav-tabs">
                <button className={`tab-link ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => openTab('transactions')}>Transactions</button>
                <button className={`tab-link ${activeTab === 'statements' ? 'active' : ''}`} onClick={() => openTab('statements')}>Statements</button>
            </div>

            {activeTab === 'transactions' && (
                <div id="transactions" className="transactions">
                    <h2>Transactions</h2>
                    <button onClick={toggleAddTransactionPopup} className="add-transaction-button">Add Transaction</button>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Remaining Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                           
                     {transactions && transactions.length > 0 ? (
                    transactions.map((transaction) => (
                        <tr key={transaction._id}>
                            <td>{transaction.name || 'N/A'}</td>
                            <td>{transaction.transaction_type || 'N/A'}</td>
                            <td>{transaction.amount || 'N/A'}</td>
                            <td>{transaction.updated_balance || 'N/A'}</td>
                </tr>
                
            ))
                    )
                    : (
                         <tr>
                        {/* //     <td colSpan="4">No transactions available</td> */}
                         </tr>
                    )}
                
                     </tbody>
                
                    </table>
                </div>
            )}

            {activeTab === 'statements' && (
                <div id="statements" className="statements">
                    <h2>Statements</h2>
                    <div id="statement-content">
                        {statements.map((statement) => (
                            <div key={statement.id} className="statement">
                                <div className="statement-header">
                                    {/* <a href={statement.file} target="_blank" rel="noopener noreferrer">{statement.name}</a> */}
                                    <div rel="noopener noreferrer">{statement.name}</div>
                                    <div className="statement-actions">
                                        <span onClick={() => downloadStatement(statement)}>
                                            <FontAwesomeIcon icon={faDownload} className="action-icon" />
                                        </span> <br></br>
                                        <span onClick={() => emailStatement(statement)}>
                                            <FontAwesomeIcon icon={faEnvelope} className="action-icon" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showAddTransactionPopup && (
                <AddTransactionPopup
                    togglePopup={toggleAddTransactionPopup}
                    // userId={userId}
                    loadTransactions={loadTransactions}
                    fetchBalance={fetchBalance}
                    
                />
            )}
        </div>
        </div>
    );
}

export default Account;
