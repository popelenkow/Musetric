export namespace multipart {
  export const data = <T extends object>(object: T) => {
    const formData = new FormData();
    Object.entries(object).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return formData;
  };
}
