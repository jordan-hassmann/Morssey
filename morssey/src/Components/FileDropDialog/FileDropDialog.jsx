import './FileDropDialog.scss';

import { useState, useEffect } from 'react';
import FileDrop from '../FileDrop/FileDrop'

const FileDropDialog = ({ open, setOpen, setInput }) => {

   const [error, setError] = useState('');
   const [file, setFile] = useState();

   const uploadFile = () => {
      if (!file) return;
      setFile(file)
      console.log("set file")
      let reader = new FileReader()
      reader.onload = e => {
         setInput(e.target.result)
         setOpen(false)
         setFile(null)
      }
      reader.readAsText(file)
   }

   const closeDialog = () => {
      setFile(null);
      setOpen(false)
   }

   return (  
      <div className="file-drop-dialog">
         { open && (
            <div className="backdrop">
               <div className="card">
                  <FileDrop 
                     selectedFile={ file }
                     setSelectedFile={ setFile }
                     validateFile={ () => true }
                     id={ 'file-drop' }
                     error={ error }
                     setError={ setError }
                  />
                  <div className="file-button-options">
                     <button onClick={ uploadFile } className={ `upload-button ${ !file && 'disabled'}` }>Upload</button>
                     <button className="cancel-upload-button" onClick={ closeDialog }>Cancel</button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
 
export default FileDropDialog;