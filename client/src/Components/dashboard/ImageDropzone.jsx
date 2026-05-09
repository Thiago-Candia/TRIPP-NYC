import { useEffect, useMemo } from "react";

const ImageDropzone = ({ files, onFilesSelected, onMoveFile, onRemoveFile }) => {
  const previews = useMemo(
    () =>
      files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [files],
  );

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  return (
    <>
      <label
        className="dropzone"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          onFilesSelected(Array.from(event.dataTransfer.files));
        }}
      >
        <strong>Arrastra imagenes</strong>
        <span> o selecciona archivos para subirlos al producto.</span>
        <input
          className="dropzone__input"
          type="file"
          multiple
          accept="image/*"
          onChange={(event) => onFilesSelected(Array.from(event.target.files || []))}
        />
      </label>

      <div className="preview-grid">
        {previews.map((preview, index) => (
          <div
            className="preview-grid__item"
            key={`${preview.file.name}-${index}`}
            draggable
            onDragStart={(event) => event.dataTransfer.setData("text/plain", String(index))}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              const from = Number(event.dataTransfer.getData("text/plain"));
              onMoveFile(from, index);
            }}
          >
            <img src={preview.url} alt={preview.file.name} loading="lazy" />
            <button type="button" onClick={() => onRemoveFile(index)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default ImageDropzone;
