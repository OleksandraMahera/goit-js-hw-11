import axios from "axios";

const apiKey = "38960521-7c95dc72765cd5ee1793ac79f";

async function fetchImages(query, page) {
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export default fetchImages;
