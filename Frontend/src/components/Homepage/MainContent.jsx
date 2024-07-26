
import React from 'react';
import  './styles.css'; // Import your CSS file
import term from  './Terms&Conditions.pdf';
import privacy from './Privacy_Policy.pdf';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const MainContent = () => {
    const handleApplyNowClick = () => {
        // Implement your logic for showing a modal or any action
        console.log('Apply Now clicked');
    };

    const navigate = useNavigate();
  // Function to mark document as viewed
  const markDocumentAsViewed = (documentIndex) => {
    localStorage.setItem(`document${documentIndex}`, 'viewed');
    const tickIcon = document.querySelector(`.tick-icon-${documentIndex}`);
    tickIcon.classList.remove('text-gray-500');
    tickIcon.classList.add('text-green-500');
    checkDocumentsViewed();
  };

  // Function to check if all required documents are viewed
  const checkDocumentsViewed = () => {
    const document1Viewed = localStorage.getItem('document1') === 'viewed';
    const document2Viewed = localStorage.getItem('document2') === 'viewed';
    const startApplicationButton = document.getElementById('startApplication');

    if (document1Viewed) {
      document.querySelector('.tick-icon-1').classList.add('text-green-500');
      document.querySelector('.tick-icon-1').classList.remove('text-gray-500');
    }

    if (document2Viewed) {
      document.querySelector('.tick-icon-2').classList.add('text-green-500');
      document.querySelector('.tick-icon-2').classList.remove('text-gray-500');
    }

    if (document1Viewed && document2Viewed) {
      startApplicationButton.classList.remove('disabled', 'cursor-not-allowed');
      startApplicationButton.disabled = false;
      startApplicationButton.addEventListener('click', () => {
       // window.location.href = "https://www.google.com";
       navigate('/personal-details');
      
      });
    } else {
      startApplicationButton.classList.add('disabled', 'cursor-not-allowed');
      startApplicationButton.disabled = true;
    } 
  };

  // Function to scroll to Important Documents section
  const scrollToDocumentsSection = () => {
    const importantDocumentsSection = document.getElementById('important-documents-section');
    if (importantDocumentsSection) {
      importantDocumentsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToApplication = () => {
    const startApplicationButton = document.getElementById('startApplication');
    if (startApplicationButton) {
        startApplicationButton.scrollIntoView({ behavior: 'smooth' });
    }
};


  // Event listeners to mark documents as viewed
  useEffect(() => {
    document.querySelectorAll('.document-link').forEach(link => {
      const documentIndex = link.getAttribute('data-document-id');
      localStorage.setItem(`document${documentIndex}`, 'unseen');
      link.addEventListener('click', function() {
        const documentId = this.getAttribute('data-document-id');
        markDocumentAsViewed(documentId);
      });
    });

    // Check viewed documents on page load
    checkDocumentsViewed();
  }, []);

 


    return (
        <main className="content">
            <div className="summary-box" style={{ textAlign: 'center' }}>
                <h2>Account Summary</h2>
                <p>
                    The summary box contains the specific terms and conditions for this account and where applicable, <br />these supersede our General Savings Conditions.
                </p>
            </div>

            <div className="features-box">
                <h2>Key Features and Benefits</h2>
                <div className="features-container">
                    <div className="feature">
                        <p>You can deposit any amount between £1 and £200.</p>
                    </div>
                    <div className="feature">
                        <p>You can add to your savings at any time (up to the £200 maximum).</p>
                    </div>
                    <div className="feature">
                        <p>You can withdraw your money without giving us notice.</p>
                    </div>
                    <div className="feature">
                        <p>If your balance falls below £50 your interest rate will reduce to 1.00% AER (0.10% monthly GROSS) until your balance increases to £50 or more.</p>
                    </div>
                    <div className="feature">
                        <p>All payments to and from your OneSavings Bank account must be from a personal current account held in your name with another UK bank/building society.</p>
                    </div>
                </div>
            </div>
             {/* Important Documents Section */}
      <div className="docContainer" id="important-documents-section">
        <h2 className="section-title">Important Documents to Review</h2>
        <p className="section-description">Please open all the important documents given below. You won't be able to apply if you haven't done so.</p>
        <div className="documents-grid">
          {/* PDF 1 */}
          <div className="document-box">
            <svg xmlns="http://www.w3.org/2000/svg" className="tick-icon-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
            <a href={term} target="_blank" className="document-link" data-document-id="1">Terms and Conditions</a>
          </div>
          {/* PDF 2 */}
          <div className="document-box">
            <svg xmlns="http://www.w3.org/2000/svg" className="tick-icon-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
            <a href={privacy} target="_blank"  className="document-link" data-document-id="2">Privacy Policy</a>
          </div>
        </div>
        <div className="apply-button-container">
          <button id="startApplication" className="apply-button disabled" disabled >Start Application</button>
        </div>
      </div>


        </main>
    );
}

export default MainContent;