export const saveBlobFile = (blob: Blob, fileName: string) => {
	const link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = fileName;
	link.click();
	URL.revokeObjectURL(link.href);
	link.remove();
};
