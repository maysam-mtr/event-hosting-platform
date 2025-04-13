import { useState } from "react";
import {supabase} from './supabaseClient'

export default function FileUpload(){
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [fileUrl, setFileUrl] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
    }

    const handleUpload = async() => {
        try{
            setUploading(true);

            if(!file){
                alert("please select file to upload!");
                return;
            }

            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            let {data, error} = await supabase.storage
                .from('eventure-imgs/images')
                .upload(filePath, file)


            if(error){
                //console.log(error)
                throw error;
            }


            const {data: url} = await supabase.storage
                .from("eventure-imgs/images")
                .getPublicUrl(filePath) 

            console.log(url.publicUrl)

            setFileUrl(url.publicUrl);

            alert('Uploaded successfully');
        }catch(err){
            alert(`Error uploading file: ${err.message}`)
        }finally{
            setUploading(false);
        }
    }

    return (
        <div>
            <input type="file" onChange={handleFileChange}/>
            <button onClick={handleUpload} disabled={uploading}>Upload</button>
            {fileUrl && (
                <div>
                    <p>File uploaded to: {fileUrl}</p>
                    <img
                        src={fileUrl}
                        alt="Uploaded file"
                        style={{width: '300px', height: 'auto'}}/>
                </div>
            )}
        </div>
    )
}