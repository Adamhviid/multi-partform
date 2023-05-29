import express from "express";
import multer from "multer";

const app = express();

app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const filenameParts = file.originalname.split(".");
    if (filenameParts.length <= 1) {
      cb(new Error("File has no extension: " + file.originalname));
    }

    const extension = filenameParts.pop();
    const originalFilename = filenameParts.join(".");
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);

    const newFileName = uniqueSuffix + "___" + originalFilename + "." + extension;

    cb(null, newFileName);
  }
});
const upload = multer({ storage });


app.post("/form", (req, res) => {
  console.log(req.body);
  delete req.body.password;
  res.send({ data: req.body });
});

app.post("/fileform", upload.single("file"), (req, res) => {
  console.log(req.file);
  res.send({ data: req.body })
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log("Server is running in port", PORT));