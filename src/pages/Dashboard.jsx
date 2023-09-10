import { Box, Button, Card, Heading, useDisclosure } from "@chakra-ui/react";

import axios from "../axios";
import { useEffect, useState } from "react";
import Form from "../components/Form";

import DeleteConfirmationDialog from "../components/DeleteConfirmationDialog";

function MediaCard(props) {
  const { title, description, published_date, source_link, links, id, onEdit } =
    props;
  let arr = [];
  if (links) {
    console.log(links);
    arr = links.split(",");
  }
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDelete = async () => {
    // Perform the actual deletion here
    // This function will be called when the user confirms the delete action.
    // You can implement your delete logic here.
    // Don't forget to close the dialog after successful deletion.

    onClose();

    await axios.post("/media-coverage/delete", { id });
    window.location.reload();
  };

  function formatDateToYYYYMMDD(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    const year = dateTime.getFullYear();
    const month = String(dateTime.getMonth() + 1).padStart(2, "0"); // Add 1 to month because it's zero-based
    const day = String(dateTime.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <p>{description}</p>
      {arr.length > 0 && (
        <Box className="flex flex-wrap gap-2 mt-4">
          {arr.map((image) => (
            <Box className="w-[200px] h-[200px] overflow-hidden">
              <img
                src={"https://nitjsr.ac.in/backend/" + image}
                alt=""
                className="w-full h-full object-cover"
              />
            </Box>
          ))}
        </Box>
      )}

      <Box className="mt-4 flex gap-3">
        <Button
          color="blue"
          onClick={(e) =>
            onEdit({
              title,
              description,
              published_date: formatDateToYYYYMMDD(published_date),
              source_link,
              id,
            })
          }
        >
          Edit
        </Button>
        <Button colorScheme="red" onClick={onOpen}>
          Delete Item
        </Button>

        <DeleteConfirmationDialog
          isOpen={isOpen}
          onClose={onClose}
          onDelete={handleDelete}
        />
      </Box>
    </Card>
  );
}

export default function Dashboard() {
  const [data, setData] = useState();
  const [images, setImages] = useState([]);
  const [mode, setMode] = useState("unknown");

  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    axios.post("/media-coverage/fetch").then((res) => {
      if (res.status >= 200 && res.status < 300) {
        setData(res.data);
        setImages(res.data.links);
        console.log(res.data);
      }
    });
  }, []);

  let leftSidebar = null;
  if (mode === "create") {
    leftSidebar = (
      <Box className="flex-[2] border-r-2">
        <Form mode="create" />
      </Box>
    );
  } else if (mode === "edit") {
    leftSidebar = (
      <Box className="flex-[2] border-r-2">
        <Form mode="edit" {...selectedMedia} />
      </Box>
    );
  }

  return (
    <Box className="flex p-3 h-screen gap-4">
      {leftSidebar}
      <Box className="flex flex-col gap-3 flex-1 overflow-auto h-full p-3">
        <h1 className="text-3xl font-bold text-center mb-6 flex justify-between">
          <span>Media Coverage</span>
          <Button onClick={(e) => setMode("create")}>New</Button>
        </h1>
        {data &&
          data.map((d) => (
            <>
              <MediaCard
                {...d}
                onEdit={(data) => {
                  console.log(data);
                  setSelectedMedia(data);
                  setMode("edit");
                }}
              />
            </>
          ))}
      </Box>
    </Box>
  );
}
