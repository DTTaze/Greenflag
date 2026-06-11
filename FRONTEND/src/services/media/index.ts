import axiosClient from "@/src/services";

export const mediaServices = {
  uploadFile: (file: File): Promise<any> => {
    const form = new FormData();
    form.append("file", file);
    return axiosClient.post("/media/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default mediaServices;
