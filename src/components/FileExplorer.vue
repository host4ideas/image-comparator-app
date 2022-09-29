<template>
    <ion-header>
        <ion-toolbar :color="copyFile ? 'secondary' : 'primary'">
            <ion-buttons slot="start" v-if="currentFolder != ''">
                <ion-back-button></ion-back-button>
            </ion-buttons>
            <ion-title> {{ currentFolder || "File Explorer" }} </ion-title>
        </ion-toolbar>
    </ion-header>

    <!-- For opening a standard file picker -->
    <input hidden type="file" ref="filepicker" @change="fileSelected($event)" />

    <!-- Info if the directory is empty -->
    <ion-text
        color="medium"
        v-if="folderContent.length == 0"
        class="ion-padding ion-text-center"
    >
        <p>No documents found</p>
    </ion-text>

    <FolderContent
        :folderContent="this.folderContent"
        :itemClicked="this.itemClicked"
        :deleteDocument="this.deleteDocument"
        :startCopy="startCopy"
    />

    <!-- Fab to add files & folders -->
    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button>
            <ion-icon :icon="add" />
        </ion-fab-button>
        <ion-fab-list side="top">
            <ion-fab-button @click="createFolder()">
                <ion-icon :icon="folderOutline"></ion-icon>
            </ion-fab-button>
            <ion-fab-button @click="addFile()">
                <ion-icon :icon="documentOutline"></ion-icon>
            </ion-fab-button>
        </ion-fab-list>
    </ion-fab>
</template>

<script>
// Ionic && Vue
import {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonIcon,
    IonFab,
    IonFabButton,
    IonFabList,
    IonButtons,
    isPlatform,
    toastController,
    alertController,
} from "@ionic/vue";
import { useRouter } from "vue-router";
// Plugins
import { Filesystem, Directory } from "@capacitor/filesystem";
import { PreviewAnyFile } from "@ionic-native/preview-any-file";
// Custom components
import FolderContent from "./FolderContent";
// Icons
import { add, documentOutline, folderOutline } from "ionicons/icons";

export default {
    name: "Tab1",
    components: {
        // Custom
        FolderContent,
        // Ionic
        IonHeader,
        IonToolbar,
        IonTitle,
        IonFab,
        IonFabButton,
        IonFabList,
        IonIcon,
        IonButtons,
    },
    data() {
        return {
            // Variables
            folderContent: [],
            currentFolder: "",
            copyFile: null,
            filepicker: null,
            ionRouter: useRouter(),
            APP_DIRECTORY: Directory.Documents,
            // Icons
            documentOutline,
            folderOutline,
            add,
        };
    },
    methods: {
        handleScroll(e) {
            e.preventDefault();
            this.$refs.scroll.scrollTop += e.deltaY;
        },
        async loadDocuments() {
            const folderContent = await Filesystem.readdir({
                directory: this.APP_DIRECTORY,
                path: this.ionRouter.currentRoute.fullPath.split("/")[3] || "",
            });

            // The directory array is just strings
            // We add the information isFile to make life easier
            this.folderContent = folderContent.files.map((file) => {
                return {
                    name: file.name,
                    isFile: file.type == "file",
                };
            });
        },
        async createFolder() {
            // Rework this to use Vue's alertController
            const alert = await alertController.create({
                header: "Create folder",
                message: "Please specify the name of the new folder",
                inputs: [
                    {
                        name: "name",
                        type: "text",
                        placeholder: "MyDir",
                    },
                ],
                buttons: [
                    {
                        text: "Cancel",
                        role: "cancel",
                    },
                    {
                        text: "Create",
                        handler: async (data) => {
                            await Filesystem.mkdir({
                                directory: this.APP_DIRECTORY,
                                path: `${this.currentFolder}/${data.name}`,
                            });
                            this.loadDocuments();
                        },
                    },
                ],
            });

            await alert.present();
        },
        addFile() {
            this.filepicker.click();
        },
        convertBlobToBase64(blob) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onerror = reject;
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.readAsDataURL(blob);
            });
        },
        async fileSelected($event) {
            const selected = $event.target.files[0];

            const base64Data = await this.convertBlobToBase64(selected);

            await Filesystem.writeFile({
                path: `${this.currentFolder}/${selected.name}`,
                data: base64Data,
                directory: this.APP_DIRECTORY,
            });

            this.loadDocuments();
        },
        async openFile(entry) {
            if (isPlatform("hybrid")) {
                console.log("hybrid");
                // Get the URI and use our Cordova plugin for preview
                const fileUri = await Filesystem.getUri({
                    directory: this.APP_DIRECTORY,
                    path: this.currentFolder + "/" + entry.name,
                });

                PreviewAnyFile.preview(fileUri.uri)
                    .then((res) => console.log(res))
                    .catch((error) => console.error(error));
            } else {
                // Browser fallback to download the file
                const file = await Filesystem.readFile({
                    directory: this.APP_DIRECTORY,
                    path: this.currentFolder + "/" + entry.name,
                });

                const a = document.createElement("a");
                document.body.appendChild(a);
                a.setAttribute("style", "display: none");
                a.href = "data:;base64," + file.data;
                a.download = entry.name;
                a.click();
                a.remove();
            }
        },
        /**
         * Helper for browser download fallback
         * https://betterprogramming.pub/convert-a-base64-url-to-image-file-in-angular-4-5796a19fdc21
         */
        b64toBlob(b64Data, contentType = "", sliceSize = 512) {
            const byteCharacters = atob(b64Data);
            const byteArrays = [];

            for (
                let offset = 0;
                offset < byteCharacters.length;
                offset += sliceSize
            ) {
                const slice = byteCharacters.slice(offset, offset + sliceSize);

                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }

            const blob = new Blob(byteArrays, { type: contentType });
            return blob;
        },
        async itemClicked(entry) {
            if (this.copyFile) {
                // We can only copy to a folder
                if (entry.isFile) {
                    const toast = await toastController.create({
                        message: "Please select a folder for your operation",
                    });
                    await toast.present();
                    return;
                }
                // Finish the ongoing operation
                this.finishCopyFile(entry);
            } else {
                // Open the file or folder
                if (entry.isFile) {
                    this.openFile(entry);
                } else {
                    let pathToOpen;
                    if (this.currentFolder != "") {
                        pathToOpen = this.currentFolder + "/" + entry.name;
                    } else {
                        pathToOpen = entry.name;
                    }
                    const folder = encodeURIComponent(pathToOpen);
                    // this.router.navigateByUrl(`/home/${folder}`);
                    // this.ionRouter.navigate(`/home/${folder}`);
                    this.ionRouter.push(`${folder}`);
                }
            }
        },
        async deleteDocument(entry) {
            if (entry.isFile) {
                await Filesystem.deleteFile({
                    directory: this.APP_DIRECTORY,
                    path: this.currentFolder + "/" + entry.name,
                });
            } else {
                await Filesystem.rmdir({
                    directory: this.APP_DIRECTORY,
                    path: this.currentFolder + "/" + entry.name,
                    recursive: true, // Removes all files as well!
                });
            }
            this.loadDocuments();
        },
        startCopy(file) {
            this.copyFile = file;
        },
        async finishCopyFile(entry) {
            // Make sure we don't have any additional slash in our path
            const current =
                this.currentFolder != "" ? `/${this.currentFolder}` : "";

            const fromUri = await Filesystem.getUri({
                directory: this.APP_DIRECTORY,
                path: `${current}/${this.copyFile.name}`,
            });

            const destUri = await Filesystem.getUri({
                directory: this.APP_DIRECTORY,
                path: `${current}/${entry.name}/${this.copyFile.name}`,
            });

            await Filesystem.copy({
                from: fromUri.uri,
                to: destUri.uri,
            });
            this.copyFile = null;
            this.loadDocuments();
        },
    },
    mounted() {
        this.filepicker = this.$refs.filepicker;
        // Get the current folder from the URL
        this.currentFolder =
            this.ionRouter.currentRoute.fullPath.split("/")[3] || "";
        this.loadDocuments();
    },
};
</script>
