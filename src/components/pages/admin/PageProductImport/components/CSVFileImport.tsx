import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";

type CSVFileImportProps = {
  url: string;
  title: string;
};

const TEST_TOKEN = "eW91cl9naXRodWJfYWNjb3VudF9sb2dpbjpURVNUX1BBU1NXT1JE";

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File | null>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  useEffect(() => {
    localStorage.setItem("authorization_token", TEST_TOKEN);
  }, []);

  const uploadFile = async () => {
    console.log("uploadFile to", url);
    const token = localStorage.getItem("authorization_token");

    const response = await axios({
      method: "GET",
      url,
      headers: {
        Authorization: `Basic ${token}`,
      },
      params: {
        name: encodeURIComponent(file?.name || ""),
      },
    });
    console.log("File to upload: ", file?.name);
    console.log("Uploading to: ", response.data);
    const result = await fetch(response.data, {
      method: "PUT",
      body: file,
    });
    console.log("Result: ", result);
    setFile(null);
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
