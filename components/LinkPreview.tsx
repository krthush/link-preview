import { Method } from "axios";
import { useState } from "react";
import api from "../lib/api";

const LinkPreview = () => {

  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const getLinkPreview = async () => {
    setLoaded(false);
    setLoading(true);
    const encodedUrl = encodeURIComponent(link);
    const config = {
      url: `/link-preview?url=${encodedUrl}`,
      method: 'GET' as Method,
    }
    try {
      const res = await api.request(config);
      console.log(res);
      setTitle(res.data.result.siteData.title);
      setDescription(res.data.result.siteData.description);
      setImage(res.data.result.topImage);
      setLoading(false);
      setLoaded(true);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }

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
        <input style={{display:"inline", width:"80%"}} type="text" name="link" placeholder="https://www.youtube.com/" onChange={(e) => setLink(e.target.value)}/>
        <input style={{display:"inline"}} type="submit" value="Preview" onClick={getLinkPreview}/>
      </div>
      <div style={{display:"flex", alignItems:"center", width:"100%", justifyContent:"center", margin:"1rem 0"}}>
        {loaded &&
          <div style={{display:"flex", maxWidth: "300px", flexDirection:"column", backgroundColor:"rgba(0, 0, 0, 0.1)", borderRadius:"5px"}}>
            <h3 style={{padding:"1rem 1rem 0 1rem", margin:0}}>{title}</h3>
            <img style={{padding:"1rem 1rem 0 1rem",}} src={image} alt="Preview image"/>
            <span style={{padding:"1rem"}}>{description}</span>
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