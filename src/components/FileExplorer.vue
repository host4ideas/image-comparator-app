<template>
    <ion-header>
        <ion-toolbar [color]="copyFile ? 'secondary' : 'primary'">
            <ion-buttons slot="start" *ngIf="currentFolder != ''">
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
        *ngIf="folderContent.length == 0"
        class="ion-padding ion-text-center"
    >
        <p>No documents found</p>
    </ion-text>

    <ion-list>
        <ion-item-sliding *ngFor="let f of folderContent">
            <!-- The actual file/folder item with click event -->
            <ion-item (click)="itemClicked(f)">
                <ion-icon
                    [name]="f.isFile ? 'document-outline' : 'folder-outline'"
                    slot="start"
                ></ion-icon>
                {{ f.name }}
            </ion-item>

            <!-- The start/end option buttons for all operations -->
            <ion-item-options side="start">
                <ion-item-option (click)="delete(f)" color="danger">
                    <ion-icon name="trash" slot="icon-only"></ion-icon>
                </ion-item-option>
            </ion-item-options>

            <ion-item-options side="end">
                <ion-item-option (click)="startCopy(f)" color="success">
                    Copy
                </ion-item-option>
            </ion-item-options>
        </ion-item-sliding>
    </ion-list>

    <!-- Fab to add files & folders -->
    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button>
            <ion-icon name="add"></ion-icon>
        </ion-fab-button>
        <ion-fab-list side="top">
            <ion-fab-button (click)="createFolder()">
                <ion-icon name="folder"></ion-icon>
            </ion-fab-button>
            <ion-fab-button (click)="addFile()">
                <ion-icon name="document"></ion-icon>
            </ion-fab-button>
        </ion-fab-list>
    </ion-fab>
</template>

<script lang="ts">
import {
    IonHeader,
    IonToolbar,
    IonTitle,
    isPlatform,
    toastController,
    alertController,
    useIonRouter,
} from "@ionic/vue";

import { Filesystem, Directory } from "@capacitor/filesystem";
import { previewAnyFile } from "@ionic-native/preview-any-file";
import WriteBlob from "capacitor-blob-writer";

export default {
    name: "Tab1",
    components: {
        IonHeader,
        IonToolbar,
        IonTitle,
    },
    data() {
        return {
            imgRef: null,
            projectDesc: null,
            folderContent: [],
            currentFolder: "",
            copyFile: null,
            filepicker: null,
            ionRouter: useIonRouter(),
            APP_DIRECTORY: Directory.Documents,
        };
    },
    methods: {
        handleScroll(e) {
            e.preventDefault();
            this.$refs.scroll.scrollTop += e.deltaY;
        },
        ngOnInit() {
            // Not sure if this works
            this.currentFolder =
                this.ionRouter.snapshot.paramMap.get("folder") || "";
            this.loadDocuments();
        },
        async loadDocuments() {
            const folderContent = await Filesystem.readdir({
                directory: this.APP_DIRECTORY,
                path: this.currentFolder,
            });

            // The directory array is just strings
            // We add the information isFile to make life easier
            this.folderContent = folderContent.files.map((file) => {
                return {
                    name: file,
                    isFile: file.includes("."),
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
        async fileSelected($event) {
            const selected = $event.target.files[0];

            await WriteBlob({
                directory: this.APP_DIRECTORY,
                path: `${this.currentFolder}/${selected.name}`,
                blob: selected,
                onFallback(error) {
                    console.error("error: ", error);
                },
            });

            this.loadDocuments();
        },
        async itemClicked(entry) {
            if (this.copyFile) {
                // We can only copy to a folder
                if (entry.isFile) {
                    // Rework this to use Vue's toastController
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
                    const pathToOpen =
                        this.currentFolder != ""
                            ? this.currentFolder + "/" + entry.name
                            : entry.name;
                    const folder = encodeURIComponent(pathToOpen);
                    // this.router.navigateByUrl(`/home/${folder}`);
                    this.ionRouter.navigate(`/home/${folder}`);
                }
            }
        },
        async openFile(entry) {
            if (isPlatform("hybrid")) {
                // Get the URI and use our Cordova plugin for preview
                const fileUri = await Filesystem.getUri({
                    directory: this.APP_DIRECTORY,
                    path: this.currentFolder + "/" + entry.name,
                });

                // Check if this works when using Vue
                previewAnyFile
                    .preview(fileUri.uri)
                    .then((res: any) => console.log(res))
                    .catch((error: any) => console.error(error));
            } else {
                // Browser fallback to download the file
                const file = await Filesystem.readFile({
                    directory: this.APP_DIRECTORY,
                    path: this.currentFolder + "/" + entry.name,
                });

                const blob = this.b64toBlob(file.data, "");
                const blobUrl = URL.createObjectURL(blob);

                const a = document.createElement("a");
                document.body.appendChild(a);
                a.setAttribute("style", "display: none");
                a.href = blobUrl;
                a.download = entry.name;
                a.click();
                window.URL.revokeObjectURL(blobUrl);
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
        async delete(entry) {
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
    },
};
</script>
