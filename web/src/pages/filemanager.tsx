import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FileManager } from "@cubone/react-file-manager";
import "@cubone/react-file-manager/dist/style.css";
import FilePreview from "@/components/file-previewer";
import type { FileInfo } from "types";
import { toast } from "sonner";
import { usePasscode } from "@/lib/Passcode";

type FileType = {
  name: string;
  isDirectory: boolean;
  path: string;
  updatedAt?: string;
  size?: number;
};


function App() {
  const [files, setFiles] = useState<FileType[]>([]);
  const [currentPath, setCurrentPath] = useState("/");
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
  const { passcode: PASSCODE } = usePasscode();

  const handleFileListing = useCallback(async (path: string) => {
    const effectivePath = path === "" ? "/" : path;

    try {
      const response = await axios.get("/api/filemanager/list", {
        params: {
          path: effectivePath,
          passcode: PASSCODE,
        },
      });

      const mapped = response.data.payload.map((file: FileInfo) => ({
        name: file.name,
        isDirectory: file.type !== "file",
        path: file.path,
        size: file.size,
      }));

      const urlParam = new URLSearchParams(window.location.search);
      urlParam.set("path", effectivePath);

      const newUrl = window.location.pathname + "?" + urlParam.toString();

      window.history.replaceState({ path: newUrl }, "", newUrl);

      setFiles(mapped);
    } catch (error) {
      toast("Error listing files");
      console.error("Error listing files:", error);
    }
  }, []);

  function handleFileDownload(files: FileType[]) {
    files.forEach((file) => {
      const link = document.createElement("a");
      link.href = `/api/filemanager/download?path=${encodeURIComponent(
        file.path
      )}&passcode=${PASSCODE}`;
      link.download = file.name;
      link.click();
    });
  }

  async function handleFileDelete(files: FileType[]) {
    try {
      await Promise.all(
        files.map((file) =>
          axios.delete("/api/filemanager/unlink", {
            data: { path: file.path, passcode: PASSCODE },
          })
        )
      );

      await handleFileListing(currentPath);

      if (selectedFile && files.some((f) => f.path === selectedFile.path)) {
        setSelectedFile(null);
      }

      toast("Files deleted successfully");
    } catch (error) {
      toast("Error deleting files");
      console.error("Error deleting files:", error);
    }
  }

  async function handleCreateDir(f: string, p: FileType) {
    console.log(p);
    try {
      await axios.post("/api/filemanager/create-dir", {
        path: p ? (p.path ? p.path + "/" + f : f) : f,
        passcode: PASSCODE,
      });
      await handleFileListing(currentPath);
      toast("Directory created successfully");
    } catch (error) {
      toast("Error creating directory");
      console.error("Error creating directory:", error);
    }
  }

  async function handleFilePasting(
    files: FileType[],
    destinationFolder: FileType,
    operationType: "copy" | "move"
  ) {
    try {
      if (operationType == "copy") {
        await Promise.all(
          files.map((file) =>
            axios.post("/api/filemanager/copy", {
              src: file.path,
              dst: destinationFolder
                ? destinationFolder.path
                  ? destinationFolder.path
                  : "/"
                : "/",
              passcode: PASSCODE,
            })
          )
        );
      } else if (operationType == "move") {
        await Promise.all(
          files.map((file) =>
            axios.post("/api/filemanager/move", {
              path: file.path,
              new_dir: destinationFolder
                ? destinationFolder.path
                  ? destinationFolder.path
                  : "/"
                : "/",
              passcode: PASSCODE,
            })
          )
        );
      } else {
        throw new Error("what the freaking is this" + operationType);
      }
      await handleFileListing(currentPath);
    } catch (error) {
      console.error("Error pasting files:", error);
    }
  }

  async function handleFileRename(file: FileType, newName: string) {
    const resp = await axios.post("/api/filemanager/rename", {
      old: file.path,
      new: newName,
      passcode: PASSCODE,
    });
    if (resp.data.status == "success") {
      toast("renamed successful");
    }
    handleFileListing(currentPath);
  }

  useEffect(() => {
    const urlParam = new URLSearchParams(window.location.search);
    const pathFromUrl: string | null = urlParam.get("path");

    const initialPath =
      pathFromUrl === null || pathFromUrl === "" ? "/" : pathFromUrl;

    if (initialPath !== currentPath) {
      setCurrentPath(initialPath);
    } else {
      handleFileListing(initialPath);
    }
  }, []);

  useEffect(() => {
    handleFileListing(currentPath);
  }, [currentPath, handleFileListing]);

  return (
    <div className="flex h-screen ">
      <div
        className={`${
          selectedFile ? "w-1/2" : "w-full"
        } transition-all duration-300 ease-in-out`}
      >
        <FileManager
          collapsibleNav={true}
          defaultNavExpanded={false}
          initialPath={currentPath}
          files={files}
          onDownload={handleFileDownload}
          fileUploadConfig={{
            url: `/api/filemanager/upload?path=${currentPath}&passcode=${PASSCODE}`,
            method: "POST",
            headers: { key: "file", "X-Passcode": PASSCODE },
            formData: { passcode: PASSCODE },
          }}
          onDelete={handleFileDelete}
          onFolderChange={setCurrentPath}
          primaryColor="#3b82f6"
          width="100vw"
          height="100vh"
          onCreateFolder={handleCreateDir}
          onRefresh={() => handleFileListing(currentPath)}
          onRename={handleFileRename}
          onPaste={handleFilePasting}
          filePreviewComponent={(file: FileType) => {
            if (!file.isDirectory) {
              setSelectedFile(file);
              document
                .getElementsByClassName("fm-modal-header")
                .item(0)
                ?.classList.add("hidden");
              return <>close this please</>;
            }
          }}
          layout="list"
          className="bg-gray-950! text-white!"
          onError={(
            error: { type: string; message: string },
            file: FileType
          ) => {
            toast(`${error.message}: ${file.name}`);
          }}
          onFileUploading={() => {
            toast("file uploading");
          }}
          onFileUploaded={() => {
            toast("file uploaded");
          }}
          customActions={[
            {
              key: "string",
              title: "string",
            },
          ]}
        />
      </div>

      {selectedFile && (
        <div className="w-1/2 border-l border-gray-300 shadow-2xl">
          <FilePreview
            file={selectedFile}
            onClose={() => setSelectedFile(null)}
          />
        </div>
      )}
    </div>
  );
}

export default App;
