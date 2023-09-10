import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Stack,
  Heading,
} from "@chakra-ui/react";

import axios from "../axios";

const Form = (props) => {
  const mode = props.mode;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    setLoading(true);

    const { title, description, publishedDate, sourceLink } = formData;

    const reqBody = {
      title,
      description,
      published_date: publishedDate,
      source_link: sourceLink,
    };

    //localhost:3030/media-coverage/create

    if (mode === "create") {
      await axios.post("/media-coverage/create", reqBody);
    } else if (mode === "edit") {
      await axios.post("/media-coverage/update", { ...reqBody, id: props.id });
    }
    window.location.reload();
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

          <Button type="submit" colorScheme="blue" disabled={loading}>
            Submit
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default Form;
