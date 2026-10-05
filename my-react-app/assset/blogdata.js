import { useEffect, useState } from "react";
import { getBlogs } from "../src/services/blogService";

export const useBlogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await getBlogs();
      setBlogs(res.data);
 
    } catch (error) {
      console.log(error);
    }
  };

  return blogs;
};