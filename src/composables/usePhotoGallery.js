import { Capacitor } from "@capacitor/core";
import { ref, onMounted, watch } from "vue";
import { Camera, CameraSource, CameraResultType } from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Preferences } from "@capacitor/preferences";
import { isPlatform, alertController } from "@ionic/vue";

export function usePhotoGallery() {
    const photos = {};
    const PHOTO_STORAGE = "photos";
    const USER_PREFERENCES = "settings";
    const APP_DIRECTORY = Directory.Documents;
    const ROOT_FOLDER = "my-photo-collections";

    const loadSaved = async () => {
        const photoList = await Preferences.get({ key: PHOTO_STORAGE });
        const photosInPreferences = photoList.value
            ? JSON.parse(photoList.value)
            : [];

        // If running on the web...
        if (!isPlatform("hybrid")) {
            for (const photo of photosInPreferences) {
                const file = await Filesystem.readFile({
                    path: photo.filepath,
                    directory: Directory.Data,
                });
                // Web platform only: Load the photo as base64 data
                photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
            }
        }

        photos.value = photosInPreferences;
    };

    const convertBlobToBase64 = (blob) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(blob);
        });

    const takePhoto = async () => {
        const photo = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100,
        });

        let base64Data;

        if (isPlatform("hybrid")) {
            const file = await Filesystem.readFile({
                // eslint-disable-next-line
                path: photo.path,
            });
            base64Data = file.data;
        } else {
            // Fetch the photo, read as a blob, then convert to base64 format
            // eslint-disable-next-line
            const response = await fetch(photo.webPath);
            const blob = await response.blob();
            base64Data = await convertBlobToBase64(blob);
        }

        const img = document.createElement("img");
        document.body.appendChild(img);
        img.src = base64Data;

        /*
            Process image with OpenCV
        */
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const cv = require("../lib/opencv-4.6");

        cv["onRuntimeInitialized"] = async () => {
            console.log("OpenCV.js is ready. Starting process...");

            /*
                Use current My Collection folder
            */
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const imageComparator = require("../composables/imageComparator");

            const folder = Preferences.get({
                key: this.USER_PREFERENCES,
            });

            const folderParsed = JSON.parse(folder.value);
            this.collectionFolder = folderParsed.myCollectionFolder;

            const folderContent = await Filesystem.readdir({
                directory: APP_DIRECTORY,
                path: ROOT_FOLDER,
            });

            // await imageComparator(cv, img, imgInput2);
        };
        img.remove();
    };

    const deletePhoto = async (photo) => {
        // Remove this photo from the Photos reference data array
        photos.value = photos.value.filter(
            (p) => p.filepath !== photo.filepath
        );

        // delete photo file from filesystem
        const filename = photo.filepath.substr(
            photo.filepath.lastIndexOf("/") + 1
        );
        await Filesystem.deleteFile({
            path: filename,
            directory: APP_DIRECTORY,
        });
    };

    const cachePhotos = () => {
        Preferences.set({
            key: PHOTO_STORAGE,
            value: JSON.stringify(photos.value),
        });
    };

    onMounted(loadSaved);

    watch(photos, cachePhotos);

    return {
        photos,
        takePhoto,
        deletePhoto,
    };
}
