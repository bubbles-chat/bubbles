import { AttachmentMessageFlatListItemProps, AttachmentScreenFlatListItemProps } from '@/types/types';
import { createContext, useContext, useState, ReactNode } from 'react';

interface AttachmentsContextProps {
    allAttachments: AttachmentScreenFlatListItemProps[];
    photoAttachments: AttachmentScreenFlatListItemProps[];
    videoAttachments: AttachmentScreenFlatListItemProps[];
    audioAttachments: AttachmentScreenFlatListItemProps[];
    otherAttachments: AttachmentScreenFlatListItemProps[];
    setAllAttachments: React.Dispatch<React.SetStateAction<AttachmentScreenFlatListItemProps[]>>;
    setPhotoAttachments: React.Dispatch<React.SetStateAction<AttachmentScreenFlatListItemProps[]>>;
    setVideoAttachments: React.Dispatch<React.SetStateAction<AttachmentScreenFlatListItemProps[]>>;
    setAudioAttachments: React.Dispatch<React.SetStateAction<AttachmentScreenFlatListItemProps[]>>;
    setOtherAttachments: React.Dispatch<React.SetStateAction<AttachmentScreenFlatListItemProps[]>>;
}

const AttachmentsContext = createContext<AttachmentsContextProps | undefined>(undefined);

export const AttachmentsProvider = ({ children }: { children: ReactNode }) => {
    const [allAttachments, setAllAttachments] = useState<AttachmentScreenFlatListItemProps[]>([]);
    const [photoAttachments, setPhotoAttachments] = useState<AttachmentScreenFlatListItemProps[]>([]);
    const [videoAttachments, setVideoAttachments] = useState<AttachmentScreenFlatListItemProps[]>([]);
    const [audioAttachments, setAudioAttachments] = useState<AttachmentScreenFlatListItemProps[]>([]);
    const [otherAttachments, setOtherAttachments] = useState<AttachmentScreenFlatListItemProps[]>([]);

    return (
        <AttachmentsContext.Provider value={{
            allAttachments,
            photoAttachments,
            videoAttachments,
            audioAttachments,
            otherAttachments,
            setAllAttachments,
            setPhotoAttachments,
            setVideoAttachments,
            setAudioAttachments,
            setOtherAttachments,
        }}>
            {children}
        </AttachmentsContext.Provider>
    );
};

export const useAttachments = () => {
    const context = useContext(AttachmentsContext);
    if (!context) throw new Error("useAttachments must be used within an AttachmentsProvider");
    return context;
};
