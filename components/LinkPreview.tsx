import { useState } from "react";

const LinkPreview = () => {

  const [loading, setLoading] = useState(false);

  return (
    <>
      <style jsx>{`
        .loader {
          border: 4px solid #f3f3f3;
          border-radius: 50%;
          border-top: 4px solid #3498db;
          width: 30px;
          height: 30px;
          -webkit-animation: spin 1s linear infinite; /* Safari */
          animation: spin 1s linear infinite;
        }
        /* Safari */
        @-webkit-keyframes spin {
          0% { -webkit-transform: rotate(0deg); }
          100% { -webkit-transform: rotate(360deg); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{display:"inline-block", width:"100%"}}>
        <input style={{display:"inline", width:"80%"}} type="text" name="link" placeholder="https://www.youtube.com/"/>
        <input style={{display:"inline"}} type="submit" value="Preview"/>
      </div>
      <div style={{display:"flex", alignItems:"center", width:"100%", justifyContent:"center", margin:"1rem 0"}}>
        {!loading &&
          <div style={{display:"flex", maxWidth: "300px", flexDirection:"column", backgroundColor:"rgba(0, 0, 0, 0.5)", borderRadius:"5px"}}>
            <h3 style={{padding:"1rem", margin:0}}>Image title</h3>
            <img style={{padding:"1rem",}} src="https://placekitten.com/408/287" alt="Preview image"/>
            <span style={{padding:"1rem"}}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia praesentium debitis voluptatibus cumque, minima voluptate eligendi blanditiis consequuntur quo cum non nulla totam sapiente, tempore quas accusantium maxime commodi neque.</span>
          </div>
        }
        {loading &&
          <div className="loader"></div>
        }
      </div>
    </>
  )
}

export default LinkPreview;