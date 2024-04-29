const {getStorage,ref,uploadBytes, uploadBytesResumable,getDownloadURL} = require('firebase/storage')

async function uploadImage(file, quantity,location) {
    const storageFB = getStorage();
    console.log('ana hon')
    
    if (quantity === 'single') {
        const dateTime = Date.now();
        const fileName = `${location}/${dateTime}`
        const storageRef = ref(storageFB, fileName)
        const metadata = {
            contentType: file.type,
        }
        console.log("resumable bytes uploading...")
        await uploadBytesResumable(storageRef, file.buffer, metadata);
        console.log('image upload success')
        const downurl = await getDownloadURL(storageRef)
        return downurl
    }

    if (quantity === 'multiple') {
        for(let i=0; i < file.images.length; i++) {
            const dateTime = Date.now();
            const fileName = `${location}/${dateTime}`
            const storageRef = ref(storageFB, fileName)
            const metadata = {
                contentType: file.images[i].mimetype,
            }

            const saveImage = await Image.create({imageUrl: fileName});
            file.item.imageId.push({_id: saveImage._id});
            await file.item.save();

            await uploadBytesResumable(storageRef, file.images[i].buffer, metadata);

        }
        return
    }

}



const uploadSingleImage = async (req, res,location) => {
  
    const file = {
      type: req.file.mimetype,
      buffer: req.file.buffer,
    };
  
    try {
      console.log('started uploading image...')
      const buildImage = await uploadImage(file, 'single',location);
      console.log(buildImage," build image")
      return( buildImage );
    } catch (err) {
      console.log(err);
    }
  };

module.exports = {uploadSingleImage}