import { PlusOutlined } from "@ant-design/icons";
import { Modal, UploadFile } from "antd";
import Upload, { RcFile } from "antd/es/upload";
import { useState } from "react";
import { getBase64 } from "utils/image";
import { storage } from "lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function UploadImage({ setUrl }: { url: string, setUrl: (url: string) => void }) {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    // const [imageFile, setImageFile] = useState<UploadFile>({
    //     url,
    //     name: url || "default.png",
    //     uid: new Date().toString()
    // });

    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    const handleUpload = async (file: RcFile) => {
        const imageRef = ref(storage, `/avatars/${file.name + new Date().toString()}`);
        await uploadBytes(imageRef, file);
        const url = await getDownloadURL(imageRef);
        // setImageFile({ ...imageFile, url, status: "done", name: file.name });
        setUrl(url);
        return url;
    }

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return <>
        <Upload
            action={handleUpload}
            listType="picture-card"
            // fileList={!imageFile.url ? [] : [imageFile]}
            onPreview={handlePreview}
        >
            {uploadButton}
        </Upload>
        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
    </>
}