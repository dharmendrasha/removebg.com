import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["JPEG", "PNG", "JPG"];

function App() {
  const [file, setFile] = useState(null);
  const [imag, setImg] = useState("");
  const [bgremoveUrl, setBgremoveUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (file) => {
    if (file.length === 0) {
      throw new Error(`No selected file`);
    }

    setLoading(true);

    const selectedFile = file[0];

    setFile(selectedFile);
    const reader = new FileReader();

    reader.onload = function (event) {
      setImg(event.target.result);
    };

    reader.readAsDataURL(selectedFile);

    const form = new FormData();
    form.append("file", selectedFile, selectedFile.name);

    fetch("/api/upload", { body: form, method: "POST" })
      .then(async (res) => {
        const blob = await res.blob();
        const objUrl = URL.createObjectURL(blob);
        setBgremoveUrl(objUrl);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <div className="container wrapper">
        {loading && (
          <>
            <div class="overlay show"></div>
            <div class="spanner show">
              <div class="loader"></div>
              <p>removing background please wait</p>
            </div>
          </>
        )}

        <div className="row">
          <div className="col-md-12">
            <FileUploader
              multiple={true}
              handleChange={handleChange}
              name="file"
              types={fileTypes}
            />
            {imag && (
              <img height={500} width={1200} src={imag} alt={file?.name} />
            )}
            <p>{file ? `File name: ${file?.name}` : "no files uploaded yet"}</p>
          </div>
          <div className="col-md-12">
            {bgremoveUrl && (
              <img
                src={bgremoveUrl}
                height={500}
                width={1200}
                alt="back_ground_removed_image"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
