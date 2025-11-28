export type GalleryPhoto = {
    id: string;
    filename: string;
    path: string;
    createdAt: Date;
    repairNumber: string;
    stage: "ENTRY" | "EXIT";
    bucketPath: string;
    fileSize: number | null;
    mimeType: string | null;
    technician: string | null;
    comments: string | null;
};
