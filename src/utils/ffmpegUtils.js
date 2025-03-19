import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg/dist/ffmpeg.min.js"; // ⬅️ Perbaikan Import Path

const ffmpeg = createFFmpeg({ log: true });

export const applyFilterToImage = async (imageSrc, filterType) => {
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  const inputFileName = "input.png";
  const outputFileName = "output.png";

  // Konversi imageSrc (data URL) ke format yang bisa diproses oleh FFmpeg
  const response = await fetch(imageSrc);
  const blob = await response.blob();
  const file = new File([blob], inputFileName, { type: "image/png" });

  ffmpeg.FS("writeFile", inputFileName, await fetchFile(file));

  let filterCommand = "";

  // Pilih filter berdasarkan opsi yang dipilih
  switch (filterType) {
    case "grayscale":
      filterCommand = "hue=s=0";
      break;
    case "sepia":
      filterCommand = "colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131";
      break;
    case "brightness":
      filterCommand = "eq=brightness=0.1";
      break;
    case "contrast":
      filterCommand = "eq=contrast=2";
      break;
    case "blur":
      filterCommand = "gblur=sigma=5";
      break;
    default:
      return imageSrc;
  }

  await ffmpeg.run("-i", inputFileName, "-vf", filterCommand, outputFileName);

  // Ambil hasil gambar yang telah diproses
  const data = ffmpeg.FS("readFile", outputFileName);
  const url = URL.createObjectURL(new Blob([data.buffer], { type: "image/png" }));

  return url;
};
