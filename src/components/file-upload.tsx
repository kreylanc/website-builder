import { UploadDropzone } from "@/lib/uploadthing";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "./ui/button";

type FileUploadProps = {
  apiEndpoint: "agencyLogo" | "avatar" | "subaccountLogo";
  onChange: (url?: string) => void;
  value?: string;
};

const FileUpload = ({ apiEndpoint, onChange, value }: FileUploadProps) => {
  // get the extension of the file
  const type = value?.split(".").pop();

  if (value) {
    return (
      <div className="flex flex-col items-center justify-center">
        {type !== "pdf" ? (
          <div className="relative w-40 h-40">
            <Image
              src={value}
              alt="agency logo"
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="flex items-center pt-2 mt-2 rounded-md bg-background/10">
            <FileIcon />
            <a
              href={value}
              target="_blank"
              rel="noopener_noreferrer"
              className="ml-2 text-blue-500 cursor-pointer hover:underline"
            >
              View PDF
            </a>
          </div>
        )}
        <Button onClick={() => onChange("")} variant="ghost" type="button">
          <X className="h-4 w-4" />
          Remove Logo
        </Button>
      </div>
    );
  }
  return (
    <div className="bg-muted/80 rounded-md">
      <UploadDropzone
        endpoint={apiEndpoint}
        onClientUploadComplete={(res) => {
          console.log("files: " + res);
          onChange(res?.[0].url);
          toast("Upload completed!");
        }}
        onUploadError={(error: Error) => {
          toast("Upload error: " + error);
        }}
        onUploadBegin={(name) => {
          console.log("Uploading: ", name);
        }}
        className="ut-allowed-content:text-muted-foreground ut-label:text-blue-500"
      />
    </div>
  );
};

export default FileUpload;
