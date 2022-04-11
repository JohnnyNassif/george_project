import React from 'react';
import axios from 'axios';

const Form = () => {
  // a local state to store the currently selected file.
  const [selectedFile, setSelectedFile] = React.useState(null);

  const handleSubmit = async(event) => {
    event.preventDefault()
    const formData = new FormData();
    formData.append("selectedFile", selectedFile);
    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:4000/api/upload",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(response.statusText)

//    axios.post("http://localhost:4000/api/upload", formData, { 
//       // receive two    parameter endpoint url ,form data
//   })
// .then(res => { // then print response status
//     console.log(res.statusText)
//  })

    } catch(error) {
      console.log('error catch')
      console.log(error)
    }
  }

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0])
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileSelect}/>
      <input type="submit" value="Upload File" />
    </form>
  )
};

export default Form;
