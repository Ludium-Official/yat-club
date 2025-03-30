import axios from "axios";
import { getApiServerHost } from "./getApiHost";

const makeUrl = (url: string) => {
  return `${getApiServerHost()}${url}`;
};

const fetchData = async (
  url: string,
  method = "GET",
  data?: Record<string, unknown>
) => {
  const callUrl = makeUrl(url);
  const params = method.toLowerCase() === "post" ? undefined : data;

  try {
    const result = await axios({
      method,
      url: callUrl,
      data,
      params,
      timeout: 5 * 1000,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": btoa(process.env.NEXT_PUBLIC_SECRET_KEY || ""),
      },
    });

    return result.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default fetchData;
