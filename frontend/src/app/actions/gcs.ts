"use server";

import fetchData from "@/lib/fetchData";
import { uploadImgInBucketType } from "@/types/gcsType";

export async function uploadImgInBucket(
  formData: FormData
): Promise<uploadImgInBucketType> {
  const response = await fetchData(
    "/upload-img-in-bucket",
    "POST",
    formData,
    true
  );

  return response;
}
