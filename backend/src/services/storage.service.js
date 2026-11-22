
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");

const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function uploadFile(file, fileName) {
    try {
        const imageFile = await toFile(file, fileName);

        const response = await client.files.upload({
            file: imageFile,
            fileName: fileName,
        });

        if (!response.url) {
            throw new Error("ImageKit did not return a file URL");
        }

        return response;

    } catch (error) {
        console.error("ImageKit upload failed:", error.message);
        throw error;
    }
}

module.exports = { uploadFile };
