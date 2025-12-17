import {
  X,
  Save,
  Edit2,
  FileText,
  Film,
  Music,
  Download,
  File,
  Image,
  FileCode,
  FileArchive,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { usePasscode } from "@/lib/Passcode";

type FileType = {
  name: string;
  isDirectory: boolean;
  path: string;
  updatedAt?: string;
  size?: number;
};


function FilePreview({
  file,
  onClose,
}: {
  file: FileType;
  onClose: () => void;
}) {
  const [content, setContent] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(true);
  const {passcode} = usePasscode();

  useEffect(() => {
    loadFile();
  }, [file.path]);

  async function loadFile() {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/filemanager/read?path=${encodeURIComponent(
          file.path
        )}&passcode=${passcode}`,
        {
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
          responseType: "blob",
        }
      );

      const ext = getFileExtension(file.name);
      const textExts = [
        "txt",
        "js",
        "jsx",
        "ts",
        "tsx",
        "json",
        "html",
        "css",
        "md",
        "xml",
        "yml",
        "yaml",
        "log",
        "csv",
        "sh",
        "py",
        "java",
        "c",
        "cpp",
        "h",
        "php",
        "rb",
        "go",
        "rs",
        "swift",
        "kt",
        "ktm",
        "kts",
        "ktj",
        "ktx",
        "ktz",
        "ktb",
        "ktc",
        "ktk",
        "ktl",
        "ktm",
        "ktp",
        "kts",
        "ktv",
        "ktw",
        "ktx",
        "ktz",
        "ktb",
        "ktc",
        "ktk",
        "ktl",
        "ktm",
        "ktp",
        "kts",
        "ktv",
        "ktw",
        "ktx",
        "ktz",
        "ktb",
        "ktc",
        "ktk",
        "ktl",
        "ktm",
        "ktp",
        "kts",
        "ktv",
        "ktw",
        "properties",
      ];

      if (textExts.includes(ext)) {
        const text = await response.data.text();
        setContent(text);
        setEditContent(text);
      } else if (
        ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(ext)
      ) {
        setContent(URL.createObjectURL(response.data));
      } else if (["mp4", "webm", "ogg", "mov"].includes(ext)) {
        setContent(URL.createObjectURL(response.data));
      } else if (["mp3", "wav", "ogg", "flac", "m4a"].includes(ext)) {
        setContent(URL.createObjectURL(response.data));
      } else if (ext === "pdf") {
        setContent(URL.createObjectURL(response.data));
      } else {
        setContent("binary");
      }
    } catch (error) {
      console.error("Error loading file:", error);
      setContent("error");
      toast("Failed to load file: " + file.name);
    } finally {
      setLoading(false);
    }
  }

  async function saveFile() {
    try {
      const payload = {
        content: editContent,
        passcode: passcode,
      };

      const response = await axios.post(
        `/api/filemanager/write?path=${encodeURIComponent(file.path)}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );

      if (response.data.status === "success") {
        toast("Successfully saved the file: " + file.name);
        setContent(editContent);
        setIsEditing(false);
      } else {
        toast(
          "Failed to save file: " + (response.data.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error saving file:", error);
      toast("Failed to save file: " + file.name);
    }
  }

  function getFileExtension(fileName: string): string {
    return fileName.split(".").pop()?.toLowerCase() || "";
  }

  function getFileIcon(fileName: string) {
    const ext = getFileExtension(fileName);
    if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(ext))
      return <Image className="w-5 h-5 text-blue-500" />;
    if (["mp4", "webm", "ogg", "avi", "mov"].includes(ext))
      return <Film className="w-5 h-5 text-purple-500" />;
    if (["mp3", "wav", "ogg", "flac", "m4a"].includes(ext))
      return <Music className="w-5 h-5 text-pink-500" />;
    if (["pdf"].includes(ext))
      return <FileText className="w-5 h-5 text-red-500" />;
    if (["zip", "rar", "7z", "tar", "gz"].includes(ext))
      return <FileArchive className="w-5 h-5 text-yellow-600" />;
    if (
      [
        "js",
        "jsx",
        "ts",
        "tsx",
        "json",
        "html",
        "css",
        "py",
        "java",
        "c",
        "cpp",
      ].includes(ext)
    )
      return <FileCode className="w-5 h-5 text-green-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  }

  function isTextFile(fileName: string): boolean {
    const ext = getFileExtension(fileName);
    return [
      "txt",
      "js",
      "jsx",
      "ts",
      "tsx",
      "json",
      "html",
      "css",
      "md",
      "xml",
      "yml",
      "yaml",
      "log",
      "csv",
      "sh",
      "py",
      "java",
      "c",
      "cpp",
      "h",
      "php",
      "rb",
      "go",
      "rs",
      "kt",
      "ktm",
      "ktl",
      "ktc",
      "ktb",
      "ktz",
      "ktw",
      "kts",
      "ktv",
      "ktu",
      "ktp",
      "kto",
      "ktt",
      "ktr",
      "ktx",
      "ktq",
      "kts",
      "ktr",
      "ktt",
      "ktz",
      "properties",
    ].includes(ext);
  }

  async function handleDownload() {
    try {
      const response = await axios.get(
        `/api/filemanager/download?path=${encodeURIComponent(
          file.path
        )}&passcode=${passcode}`,
        {
          responseType: "blob",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );

      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      link.click();
      URL.revokeObjectURL(url);

      toast("Downloaded: " + file.name);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast("Failed to download file");
    }
  }

  function renderContent() {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (content === "error") {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-red-500">
            <X className="w-16 h-16 mx-auto mb-2" />
            <p className="text-lg">Error loading file</p>
          </div>
        </div>
      );
    }

    if (content === "binary") {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            {getFileIcon(file.name)}
            <p className="mt-4 text-lg">Cannot preview this file type</p>
            <p className="text-sm text-gray-400 mt-2">{file.name}</p>
            <button
              onClick={handleDownload}
              className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 mx-auto transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      );
    }

    const ext = getFileExtension(file.name);

    if (isEditing) {
      return (
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full h-full p-6 font-mono text-sm bg-slate-900 text-slate-100 resize-none focus:outline-none"
          spellCheck="false"
        />
      );
    }

    if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(ext)) {
      return (
        <div className="flex items-center justify-center h-full p-8 bg-slate-50">
          <img
            src={content}
            alt={file.name}
            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
          />
        </div>
      );
    }

    if (["mp4", "webm", "ogg", "mov"].includes(ext)) {
      return (
        <div className="flex items-center justify-center h-full p-8 bg-black">
          <video
            src={content}
            controls
            className="max-w-full max-h-full rounded-lg"
          />
        </div>
      );
    }

    if (["mp3", "wav", "ogg", "flac", "m4a"].includes(ext)) {
      return (
        <div className="flex items-center justify-center h-full p-8">
          <div className="text-center">
            <Music className="w-24 h-24 mx-auto mb-6 text-pink-500" />
            <p className="text-lg font-medium text-gray-700 mb-6">
              {file.name}
            </p>
            <audio src={content} controls className="w-full max-w-md" />
          </div>
        </div>
      );
    }

    if (ext === "pdf") {
      return (
        <iframe
          src={content}
          className="w-full h-full border-0"
          title={file.name}
        />
      );
    }

    return (
      <pre className="w-full h-full p-6 overflow-auto font-mono text-sm bg-slate-900 text-slate-100 whitespace-pre-wrap leading-relaxed">
        {content}
      </pre>
    );
  }

  return (
    <div className="w-full h-screen flex-col fixed inset-0 bg-opacity-50 flex bg-gray-950/90 drop-shadow-2xl drop-shadow-gray-950 shadow-2xl shadow-gray-950 z-50">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-3">
          <div>
            <h3
              className="font-semibold flex w-full h-full gap-2 p-4 rounded-lg bg-gray-950 text-gray-100"
              title={file.name}
            >
              {getFileIcon(file.name)}
              {file.name.length > 40
                ? file.name.substring(0, 40) + "..."
                : file.name}
            </h3>
            {file.size && (
              <p className="text-xs text-gray-500 mt-0.5">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isTextFile(file.name) &&
            content !== "binary" &&
            content !== "error" && (
              <>
                {isEditing ? (
                  <>
                    <button
                      onClick={saveFile}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 transition-colors text-sm font-medium"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditContent(content);
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 transition-colors text-sm font-medium"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                )}
              </>
            )}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">{renderContent()}</div>
    </div>
  );
}

export default FilePreview;
