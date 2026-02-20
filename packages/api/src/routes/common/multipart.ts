export namespace multipart {
  export const data = <T extends object>(object: T) => {
    const formData = new FormData();
    Object.entries(object).forEach((entry) => {
      const [key, rawValue] = entry;
      const getValue = () => {
        if (rawValue instanceof File || rawValue instanceof Blob) {
          return rawValue;
        }
        if (typeof rawValue === 'object' && rawValue) {
          return JSON.stringify(rawValue);
        }
        return rawValue;
      };
      const value = getValue();
      if (value === undefined) return;
      formData.append(key, value);
    });
    return formData;
  };
}
