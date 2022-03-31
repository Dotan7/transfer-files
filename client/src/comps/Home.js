import React, { useState, useEffect, useRef } from "react"
import axios from "axios"
import { MdContentCopy } from "react-icons/md"

function Home() {
  const [files, setFiles] = useState([])
  const [link, setlink] = useState(null)
  const [copyLinkText, setCopyLinkText] = useState("Copy Link")

  const sendFiles = async () => {
    if (files.length === 0) {
      alert("NO FILES TO SEND")
      return
    }
    const formData = new FormData()
    files.forEach((file) => {
      formData.append("files", file)
    })
    const res = await axios.post("/upload_files", formData)
    console.log(17, res.data)
    console.log(files)

    setlink(
      `https://dotdev-files-transfer.herokuapp.com/download_files/${res.data}`
    )
  }

  const copyText = () => {
    console.log("link:", link)
    navigator.clipboard.writeText(link)
    setCopyLinkText("Copied!")
    const gone = setTimeout(() => {
      setCopyLinkText("Copy Link")
      clearTimeout(gone)
    }, 1000)
  }
  return (
    <div className="homeContainer">
      <div className="headLineDiv">
        <span className="headLine">Dot.Dev - Transfer Files Tool</span>
        <br></br>
        <span className="toolHeadLine">
          Upload Images And Get A Link To Download
        </span>
        <br></br>
        <span className="toolTimeHeadLine">
          (The link will expire within 20 minutes)
        </span>
      </div>

      <div className="toolUploadLine">
        <input
          className="inputFile"
          type="file"
          // accept="image/*"
          onChange={(e) => {
            setFiles([...e.target.files])
            console.log(e.target.files)
          }}
          multiple
        ></input>
        <button onClick={() => sendFiles()}>Send</button>
      </div>

      {link && (
        <div className="toolLink">
          <span>{link}</span>
          <div className="copyBtnDiv">
            <MdContentCopy
              className="copyBtnIcon"
              size={24}
              onClick={() => {
                copyText()
              }}
            />
            <span className="copyBtnTag">{copyLinkText}</span>
          </div>
        </div>
      )}

      <div className="filesInfoLine">
        {files.map((file, index) => {
          return (
            <div key={index} className="filesInfoLineSingle">
              <div className="fileNumber">{index + 1}</div>
              <div className="tableFileInfo">
                <div className="tableRow">
                  <div className="tableCol">File Name:</div>
                  <div className="tableCol">{file.name}</div>
                </div>
                <div className="tableRow">
                  <div className="tableCol">File Size:</div>
                  <div className="tableCol">{file.size}</div>
                </div>
                <div className="tableRow">
                  <div className="tableCol">File Type:</div>
                  <div className="tableCol">{file.type}</div>
                </div>
              </div>
              <div className="previewDiv">
                <img
                  src={URL.createObjectURL(file)}
                  className="filePreview"
                ></img>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Home
