export async function imageFileToDataUrl(
  file: File
): Promise<string> {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      const reader =
        new FileReader();

      reader.onload =
        () => {
          resolve(
            reader.result as string
          );
        };

      reader.onerror =
        reject;

      reader.readAsDataURL(
        file
      );
    }
  );
}

export async function resizeAvatar(
  dataUrl: string,
  size = 256
): Promise<string> {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      const image =
        new Image();

      image.onload =
        () => {
          const canvas =
            document.createElement(
              "canvas"
            );

          canvas.width =
            size;

          canvas.height =
            size;

          const context =
            canvas.getContext(
              "2d"
            );

          if (!context) {
            reject(
              new Error(
                "Impossible de créer le canvas."
              )
            );

            return;
          }

          context.drawImage(
            image,
            0,
            0,
            size,
            size
          );

          resolve(
            canvas.toDataURL(
              "image/jpeg",
              0.85
            )
          );
        };

      image.onerror =
        reject;

      image.src =
        dataUrl;
    }
  );
}