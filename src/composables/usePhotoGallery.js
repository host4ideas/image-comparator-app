import { onMounted } from "vue";
import { Camera, CameraSource, CameraResultType } from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Preferences } from "@capacitor/preferences";
import { isPlatform, alertController, loadingController } from "@ionic/vue";
import imageComparator from "./imageComparator";

export function usePhotoGallery() {
    const photos = [];
    const USER_PREFERENCES = "settings";
    const APP_DIRECTORY = Directory.Documents;
    const ROOT_FOLDER = "my-photo-collections";
    let openCV = null;

    const loading = loadingController.create({});

    const loadSaved = async (collectionFolder) => {
        // console.log(encodeURIComponent(collectionFolder.name));
        // const folderContent = await Filesystem.readdir({
        //     directory: APP_DIRECTORY,
        //     path: collectionFolder,
        // });
        // for (const file of folderContent) {
        //     console.log(file);
        // }
    };

    const controlLoadingScreen = async (option, message) => {
        const loadingScreen = await loading;
        loadingScreen.message = message;
        if (option === "start") {
            await loadingScreen.present();
        } else {
            await loadingScreen.dismiss();
        }
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

    const checkCollectionFolder = async () => {
        // Check if there is a user selected My Collection folder to display
        let settings = await Preferences.get({ key: USER_PREFERENCES });
        settings = JSON.parse(settings.value);

        if (settings.myCollectionFolder == null) {
            alertController
                .create({
                    header: "No Collection Folder selected.",
                    message: "Please, check a collection folder to show here",
                    buttons: [
                        {
                            text: "OK",
                            role: "cancel",
                        },
                    ],
                })
                .then((alert) => {
                    alert.present();
                });
        } else {
            loadSaved(settings.myCollectionFolder);
        }
    };

    const checkOpenCV = () => {
        controlLoadingScreen("start", "Loading OpenCV...");

        return new Promise((resolve, reject) => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const cv = require("../lib/opencv-4.6");

            // Load OpenCV for first time
            if (!openCV) {
                cv["onRuntimeInitialized"] = () => {
                    console.log(cv);
                    openCV = cv;
                    resolve(controlLoadingScreen("stop"));
                };
            } else {
                resolve(controlLoadingScreen("stop"));
            }
        });
    };

    /**
     * Receives an img element and an array of folders paths
     * @param {HTMLElement} img
     * @param {Array} folders
     */
    const compareImages = async (img1, folders) => {
        const results = [];
        await checkOpenCV();

        const img2 = document.createElement("img");
        document.body.appendChild(img2);
        img2.id = "img2";

        for (const folder of folders) {
            console.log(folder);

            const folderContent = await Filesystem.readdir({
                directory: APP_DIRECTORY,
                path: folder,
            });

            // The directory array is just strings
            // We add the information isFile to make life easier
            folderContent.files.map((file) => {
                if (file.type === "file") {
                    Filesystem.readFile({
                        directory: APP_DIRECTORY,
                        path: folder + "/" + file.name,
                    }).then((base64Data) => {
                        const data = base64Data.data;

                        img2.width = "300";
                        img2.height = "300";
                        img2.src = "data:;base64," + data;

                        if (openCV.Mat) {
                            imageComparator(openCV, img1, img2)
                                .then((result) => {
                                    if (result) {
                                        results.push(file);
                                    }
                                })
                                .catch((err) => console.log(err.message));
                        }
                    });
                }
            });
        }
        return results;
    };

    const takePhoto = async () => {
        try {
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
            img.id = "img1";

            // Delete data to save memory
            base64Data = null;
            return img;
        } catch (e) {
            console.info(e.message);
            return null;
        }
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

    onMounted(() => {
        checkCollectionFolder();
    });

    return {
        photos,
        takePhoto,
        deletePhoto,
        compareImages,
        controlLoadingScreen,
    };
}
