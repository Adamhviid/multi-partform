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

    let newFileName = "";

    if (file.fieldname === "cv") {
      newFileName = req.body.name + "-CV-" + uniqueSuffix + "." + extension;
    } else if (file.fieldname === "image") {
      newFileName = req.body.name + "-Image-" + uniqueSuffix + "." + extension;
    } else {
      newFileName = req.body.name + "-" + uniqueSuffix + "-" + originalFilename + "." + extension;
    }
    cb(null, newFileName);
  }
});

const upload = multer({ storage });

app.post("/form", upload.fields([{ name: "image" }, { name: "cv" }]), (req, res) => {
  const { name, email, country } = req.body;
  const imageFile = req.files["image"][0];
  const cvFile = req.files["cv"][0];

  console.log({ name: name, email: email, country: country });
  console.log({ imageFile: imageFile, cvFile: cvFile });

  res.send({ data: req.body, files: req.files });
});

const PORT = 8000;
app.listen(8000, () => console.log("Server is running on port", PORT));
