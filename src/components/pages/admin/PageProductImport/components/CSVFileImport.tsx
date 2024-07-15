import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";
import toast from "react-hot-toast";

type CSVFileImportProps = {
  url: string;
  title: string;
};

const TEST_TOKEN = "eW91cl9naXRodWJfYWNjb3VudF9sb2dpbjpURVNUX1BBU1NXT1JE";

const showToaster = (result: Response) => {
  switch (result.status) {
    case 200:
      toast.success(`Successfully uploaded`);
      break;
    case 401:
      toast.error("Unauthorized");
      break;
    case 403:
      toast.error("Invalid credentials");
    default:
      toast.error("Unknown error");
  }
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File | null>();
  const [token, setToken] = React.useState("");

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
    const authorization_token = localStorage.getItem("authorization_token");

    if (typeof authorization_token === "string") {
      setToken(authorization_token);
    }
  }, []);

  const uploadFile = async () => {
    console.log("uploadFile to", url);

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
    showToaster(result);
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
