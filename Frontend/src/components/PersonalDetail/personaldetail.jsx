import DetailForm from './Detailform';
import ProgressBar from './ProgressBar';
import Step from './Step';
import './detail_style.css';
import React from 'react';

const PersonalDetail=()=>{
    

    return(
        <div className="App">
                   {/* <div className="progress-header"> */}
                       {/* <ProgressBar />
                       <div className="steps">
                          <Step id="personal-details-step" title="Personal Details" active={true} />
                           <Step id="account-details-step" title="Account Details" active={false} />
                           <Step id="final-details-step" title="Final Details" active={false} />
                       </div> */}
                   {/* </div> */}
                   <div className="highlighted-message">
                       <i><b>Your savings journey starts here</b></i><br />
                       Set up your <span className="highlighted-text">Easy access account</span>
                   </div>
                   <hr className="styled-hr" />
                   <div className="form-container">
                       <DetailForm />
                   </div>
               </div>
    );
};
export default PersonalDetail;
