import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Stack,
  Heading,
  Image,
} from "@chakra-ui/react";

import axios from "../axios";

const Form = (props) => {
  const fileRef = useRef();
  const mode = props.mode;
  const [file, setFile] = useState(null);
  const [fileArr, setFileArr] = useState([]); // for multiple images
  const [fileArrUrl, setFileArrUrl] = useState([]); // for multiple images

  console.log("form props: ", props);

  const [formData, setFormData] = useState({
    title: props.title || "",
    description: props.description || "",
    publishedDate: props.published_date || "",
    sourceLink: props.source_link || "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      title: props.title || "",
      description: props.description || "",
      publishedDate: props.published_date || "",
      sourceLink: props.source_link || "",
    });
  }, [props]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleImageUpload = async () => {
    const formData = new FormData();
    for (let i = 0; i < fileArr.length; i++) {
      formData.append("file", fileArr[i]);
    }
    await axios.post(`/media-coverage/image-upload`, formData).then((res) => {
      setFileArrUrl(res.data.path);
      // console.log("res.data: ", res.data);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    setLoading(true);
    // merge all the strings in array fileArr using string
    const Links = fileArrUrl.join(",");
    console.log(Links);
    // console.log(fileArrUrl);

    const { title, description, publishedDate, sourceLink } = formData;

    const reqBody = {
      title,
      description,
      published_date: publishedDate,
      source_link: sourceLink,
      links: Links,
    };

    //localhost:3030/media-coverage/create

    if (mode === "create") {
      await axios.post("/media-coverage/create", reqBody);
    } else if (mode === "edit") {
      await axios.post("/media-coverage/update", { ...reqBody, id: props.id });
    }
    window.location.reload();
  };
  const handleFileSelect = (e) => {
    // Upload multiple images
    setFile(e.target.files);
    console.log("file: ", e.target.files);
  };

  return (
    <Box p={4}>
      <Heading className="mb-7">
        {mode === "create" ? "Create New Media Coverage" : "Update"}
      </Heading>

      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter title"
              required
            />
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              required
            />
          </FormControl>

          <FormControl>
            <FormLabel>Published Date</FormLabel>
            <Input
              type="date"
              name="publishedDate"
              value={formData.publishedDate}
              onChange={handleChange}
              required
            />
          </FormControl>

          <FormControl>
            <FormLabel>Source Link</FormLabel>
            <Input
              type="url"
              name="sourceLink"
              value={formData.sourceLink}
              onChange={handleChange}
              placeholder="Enter source link"
              required
            />
          </FormControl>
          <input
            hidden
            ref={fileRef}
            type="file"
            id="file"
            name="file"
            multiple
            onChange={handleFileSelect}
          />
          {/* Display image seleceted or display select a image */}
          {/* <p className="mb-2">Image</p>
          <p>{file ? file[0].name : "Select a image"}</p>
          <Image
            style={{
              width: "100px",
              height: "100px",
            }}
            src={file ? URL.createObjectURL(file[0]) : ""}
          />
          <Button
            primary
            type="button"
            onClick={() => {
              fileRef.current.click();
            }}
          >
            {file ? `change image` : `select image`}
          </Button> */}
          {/* Upload multiple images */}
          <p className="mb-2">Image</p>
          {/* <p>{file ? fileArr.length : "Select a image"}</p> */}
          <Box display={"flex"} gap={"1rem"}>
            {/* Hover on Image to remove image from array */}

            {fileArr.map((file, index) => (
              <Image
                key={index}
                style={{
                  width: "100px",
                  height: "100px",
                }}
                src={file ? URL.createObjectURL(file) : ""}
                onClick={() => {
                  const newArr = fileArr.filter((f, i) => i !== index);
                  setFileArr(newArr);
                }}
                cursor={"pointer"}
              />
            ))}
          </Box>
          <Box display={"flex"} justifyContent={"center"} gap={"1rem"}>
            <Button
              primary
              type="button"
              onClick={() => {
                fileRef.current.click();
                setFile([...fileArr, ...file]);
              }}
            >
              Select Image
            </Button>

            <Button
              primary
              type="button"
              onClick={() => {
                setFileArr([...fileArr, ...file]);
              }}
            >
              Add Image
            </Button>
            {/* Merge select image and add image button */}

            <Button primary type="button" onClick={handleImageUpload}>
              Upload Image
            </Button>
          </Box>
          <Button type="submit" colorScheme="blue" disabled={loading}>
            Submit
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default Form;
