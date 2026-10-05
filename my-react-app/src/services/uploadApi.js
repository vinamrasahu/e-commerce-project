import API from "./axios";

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await API.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.path;
};

export const uploadFiles = async (files) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  const res = await API.post("/upload-multiple", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.paths;
};  