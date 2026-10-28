
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");

const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    
});

async function uploadFile(file, fileName) {

    const imageFile = await toFile(file, fileName);



    const response = await client.files.upload(
        {
            file: imageFile,
            fileName: fileName
        }
        
    );



    return response;
}

module.exports = { uploadFile };
