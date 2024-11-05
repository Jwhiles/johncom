export async function uploadImage(file: File) {
  // 1. Get the presigned URL from your server
  const response = await fetch("/bin/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
    }),
  });

  const { preSignedUrl, publicUrl } = await response.json();
  console.log(preSignedUrl, publicUrl);

  // 2. Upload directly to R2
  await fetch(preSignedUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  // 3. Return the public URL for use in your editor
  return publicUrl;
}
