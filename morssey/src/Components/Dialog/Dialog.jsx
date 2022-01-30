
import './Dialog.scss';
import { useState, useEffect, useRef } from 'react';

const Dialog = ({ open, setOpen, setInputVal }) => {

   const output = useRef();
   const [startTime, setStartTime] = useState(0);
   const [started, setStarted] = useState(false);

   const handleMouseDown = () => {
      if (started) {
         if (Date.now() - startTime > 1000) {
            output.current.innerHTML = output.current.innerHTML + ' '
         }
      } else setStarted(true);
      setStartTime(Date.now());
   }

   const handleMouseUp = () => {
      const now = Date.now(); 
      const diff = now - startTime;
      console.log(diff);
      if (diff > 500) {
         output.current.innerHTML = output.current.innerHTML + '-'
      } else {
         output.current.innerHTML = output.current.innerHTML + '.'
      }

      setStartTime(Date.now())
   }

   const handleClear = () => {
      output.current.innerHTML = '';
   }

   const handleClose = () => setOpen(false);

   const handleConvert = () => {
      setInputVal(output.current.innerHTML)
      setOpen(false);
   }


   return (  
      <div className="dialog">
         { open && (
            <div className="backdrop">
               <div className="card">
                  <button
                  onMouseUp={ handleMouseUp }
                  onMouseDown={ handleMouseDown } 
                  className='main'>{ started ? 'Press' : 'Press to Start' }</button>
                  <div className="output-conversion">
                     <span ref={ output }></span>
                  </div>
                  <div className="button-options">
                     <button className='confirm' onClick={ handleConvert }>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/></svg>
                        <span>Convert</span>
                     </button>

                     <button className="clear" onClick={ handleClear }>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/></svg>
                        <span>Clear</span>
                     </button>

                     <button className="cancel" onClick={ handleClose }>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/></svg>
                        <span>Cancel</span>
                     </button>
                     
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
 
export default Dialog;