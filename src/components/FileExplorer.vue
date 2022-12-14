<template>
    <ion-header>
        <ion-toolbar :color="copyFile ? 'secondary' : 'primary'">
            <ion-button
                slot="start"
                v-if="currentFolder != '' && currentFolder !== ROOT_FOLDER"
                @click="handleBackButton()"
            >
                <ion-icon :icon="arrowBackCircleOutline" />
            </ion-button>
            <ion-title> {{ currentFolder || "File Explorer" }} </ion-title>
        </ion-toolbar>
    </ion-header>

    <!-- For opening a standard file picker -->
    <input
        hidden
        type="file"
        ref="filepicker"
        @change="fileSelected($event)"
        multiple
    />
    <!-- For opening a directory picker -->
    <input
        hidden
        ref="folderpicker"
        type="file"
        webkitdirectory
        multiple
        @change="folderSelected($event)"
    />

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
        :currentFolder="currentFolder"
        :addToCompare="addToCompare"
        :imageComparisonMode="imageComparisonMode"
        @response="(msg) => (foldersToCompare = msg)"
    />

    <!-- Fab to add files & folders -->
    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button
            v-if="imageComparisonMode"
            @click="compareWithFolders()"
            color="success"
            style="margin-bottom: 15px"
        >
            <ion-icon :icon="checkmark" />
        </ion-fab-button>
        <ion-fab-button
            v-if="imageComparisonMode"
            @click="cancelComparison()"
            color="danger"
            style="margin-bottom: 15px"
        >
            <ion-icon :icon="closeOutline" />
        </ion-fab-button>
        <ion-fab-button>
            <ion-icon :icon="add" />
        </ion-fab-button>
        <ion-fab-list side="top">
            <ion-button
                color="light"
                title="Create folder"
                aria-hidden="true"
                @click="createFolder()"
            >
                <ion-icon :icon="folderOutline" />
            </ion-button>
            <!-- Only workd on web -->
            <ion-button
                v-if="!isHybrid"
                color="light"
                title="Add folder"
                aria-hidden="true"
                @click="addFolder()"
            >
                <ion-icon :icon="fileTrayStackedOutline"></ion-icon>
            </ion-button>
            <ion-button
                color="light"
                title="Add files"
                aria-hidden="true"
                @click="addFiles()"
            >
                <ion-icon :icon="documentOutline" />
            </ion-button>
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
    IonButton,
    IonText,
    isPlatform,
    toastController,
    alertController,
} from "@ionic/vue";
// Plugins
import { Filesystem, Directory } from "@capacitor/filesystem";
import { PreviewAnyFile } from "@ionic-native/preview-any-file";
// Custom components
import FolderContent from "./FolderContent";
// Icons
import {
    add,
    checkmark,
    documentOutline,
    folderOutline,
    arrowBackCircleOutline,
    fileTrayStackedOutline,
    closeOutline,
} from "ionicons/icons";
import router from "@/router/index";

export default {
    name: "Tab1",
    components: {
        // Variables
        FolderContent,
        // Ionic
        IonHeader,
        IonToolbar,
        IonTitle,
        IonFab,
        IonFabButton,
        IonFabList,
        IonIcon,
        IonButton,
        IonText,
    },
    props: {
        currentFolder: String,
        isImageComparison: Boolean,
    },
    data() {
        return {
            // Ionic
            isHybrid: isPlatform("hybrid"),
            // Variables
            folderContent: [],
            copyFile: null,
            filepicker: null,
            folderpicker: null,
            foldersToCompare: [],
            imageComparisonMode: this.isImageComparison,
            APP_DIRECTORY: Directory.Documents,
            ROOT_FOLDER: "my-photo-collections",
            USER_PREFERENCES: "settings",
            // Use Vue router
            router: router,
            // Icons
            arrowBackCircleOutline,
            fileTrayStackedOutline,
            documentOutline,
            folderOutline,
            checkmark,
            add,
            closeOutline,
        };
    },
    methods: {
        handleBackButton() {
            /*
                Due to history navigation between tabs is problematic.
                e.g.: /tabs/tab3/test/ -> /tab2/ -> /tabs/tab3/test/ -> tab back button -> undefined folder
            */
            let newPath = "";
            const folders = this.currentFolder.split("/");
            // Check if there is a prev folder from the URL
            if (folders[folders.indexOf(folders[folders.length - 2])]) {
                const openedFolder = folders[folders.length - 1];
                newPath = folders.join("/").replace(`/${openedFolder}`, "");
                newPath = encodeURIComponent(newPath);
                router.replace(newPath);
            } else {
                // If there is not a prev folder, means the root folder
                newPath = `/tabs/tab3/${this.ROOT_FOLDER}`;
                this.$router.replace(newPath);
            }
            newPath = null;
        },
        addToCompare(item) {
            const itemPath = item.uri;

            if (this.foldersToCompare.indexOf(itemPath) < 0) {
                this.foldersToCompare.push(itemPath);
            } else {
                this.foldersToCompare = this.foldersToCompare.filter(
                    (folder) => {
                        return folder != itemPath;
                    }
                );
            }
        },
        async cancelComparison() {
            const alert = await alertController.create({
                header: "Cancel comparison",
                message: "Are you sure do you want to cancel the process?",
                buttons: [
                    {
                        text: "NO",
                        role: "cancel",
                    },
                    {
                        text: "YES",
                        handler: async () => {
                            this.imageComparisonMode = false;
                            this.$router.push("/tabs/tab3");
                        },
                    },
                ],
            });

            await alert.present();
        },
        async compareWithFolders() {
            if (this.foldersToCompare.length > 0) {
                this.imageComparisonMode = false;
                router.replace(
                    `/tabs/tab2?folders=${JSON.stringify(
                        this.foldersToCompare
                    )}`
                );
            } else {
                const alert = await alertController.create({
                    header: "No folders selected",
                    message: "Please specify at least one folder to compare.",
                    buttons: [
                        {
                            text: "OK",
                            role: "cancel",
                        },
                    ],
                });

                await alert.present();
            }
        },
        async loadDocuments() {
            try {
                const folderContent = await Filesystem.readdir({
                    directory: this.APP_DIRECTORY,
                    path: this.currentFolder || "",
                });

                // The directory array is just strings
                // We add the information isFile to make life easier
                this.folderContent = folderContent.files.map((file) => {
                    if (file.type === "directory") {
                        file = {
                            ...file,
                            ...{ isCollectionFolder: false },
                        };
                    }
                    return {
                        name: file.name,
                        isFile: file.type == "file",
                        uri: file.uri.replace("/DOCUMENTS/", ""),
                    };
                });
            } catch (e) {
                console.log("CURRENT FOLDER: " + this.currentFolder);
                console.log(e.message);
                this.$router.back();
                this.loadDocuments();
            }
        },
        async mkdirHelper(path) {
            try {
                await Filesystem.mkdir({
                    directory: this.APP_DIRECTORY,
                    path: path,
                });
                this.loadDocuments();
                return true;
            } catch (error) {
                console.log(error.message);
                return false;
            }
        },
        async createFolder() {
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
                            await this.mkdirHelper(
                                `${this.currentFolder}/${data.name}`
                            );
                        },
                    },
                ],
            });

            await alert.present();
        },
        addFiles() {
            this.$refs.filepicker.click();
        },
        addFolder() {
            this.$refs.folderpicker.click();
        },
        /**
         * Convert File to base64 string
         */
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
            const selected = $event.target.files;

            for (let i = 0; i < selected.length; i++) {
                try {
                    const base64Data = await this.convertBlobToBase64(
                        selected[i]
                    );

                    await Filesystem.writeFile({
                        path: `${this.currentFolder}/${selected[i].name}`,
                        data: base64Data,
                        directory: this.APP_DIRECTORY,
                    });
                } catch (error) {
                    if (error.message === "Maximum call stack size exceeded") {
                        const alert = await alertController.create({
                            header: "Error",
                            message: `File <b><i>${selected[i].name}</i></b> is too big`,
                            buttons: [
                                {
                                    text: "OK",
                                    role: "cancel",
                                },
                            ],
                        });

                        await alert.present();
                        console.log(
                            error.message + " for: " + selected[i].name
                        );
                    }
                }
            }
            // Empty input value
            this.$refs.filepicker.value = "";
            this.$refs.folderpicker.value = "";
            // Reload documents
            this.loadDocuments();
        },
        /**
         * ONLY FOR WEB
         * For each file (event.target.files) and its webkitRelativePath, create its parent folder(s) and insert the file in that folder.
         */
        async folderSelected($event) {
            // Array of all the elements in the folder but not the included folders
            const files = $event.target.files; // FileList
            // Loop all files
            for (const file of files) {
                try {
                    // First check if the file can be processed
                    const base64Data = await this.convertBlobToBase64(file);

                    // Relative paths per file, we'll use this to know what a file's path
                    const relativePaths = file.webkitRelativePath.split("/");
                    // Remove the last element (which should be the file's name)
                    relativePaths.pop();

                    const newPath =
                        this.currentFolder + "/" + relativePaths.join("/");

                    // Try to create the folder
                    await this.mkdirHelper(newPath);

                    if (base64Data) {
                        // Write file
                        await Filesystem.writeFile({
                            path: newPath + "/" + file.name,
                            data: base64Data,
                            directory: this.APP_DIRECTORY,
                        });
                    }
                } catch (error) {
                    console.log(error.message + " For: " + file.name);
                }
            }
            // Empty input value
            this.$refs.filepicker.value = "";
            this.$refs.folderpicker.value = "";
            // Reload documents
            this.loadDocuments();
        },
        async openFile(entry) {
            console.log(entry);

            if (this.isHybrid) {
                console.log("hybrid");
                // Get the URI and use our Cordova plugin for preview
                const fileUri = await Filesystem.getUri({
                    directory: this.APP_DIRECTORY,
                    path: entry.uri,
                });

                PreviewAnyFile.preview(fileUri.uri)
                    .then((res) => console.log(res))
                    .catch((error) => console.error(error));
            } else {
                // Browser fallback to download the file
                const file = await Filesystem.readFile({
                    directory: this.APP_DIRECTORY,
                    path: entry.uri,
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
                    this.$router.push(`/tabs/tab3/${folder}`);
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
        /**
         * Check if the dedicated folders for the app exist in Documents
         */
        async checkRootFolder() {
            try {
                await Filesystem.readdir({
                    directory: this.APP_DIRECTORY,
                    path: this.ROOT_FOLDER,
                });
                console.log("Default folder exists.");
            } catch (error) {
                if (error.message === "Folder does not exist.") {
                    const alert = await alertController.create({
                        header: "Choose root folder",
                        message: `No default folder found. Default folder will be created in: <i>${this.APP_DIRECTORY}/${this.ROOT_FOLDER}</i>.<br/>
                                  If you want to modify your collections, you can do it in the built-in File Explorer or through your smartphone's preferred File Explorer app.`,
                        buttons: [
                            {
                                text: "OK",
                                role: "cancel",
                            },
                        ],
                    });
                    await alert.present();
                    // Create default
                    await this.mkdirHelper(`${this.ROOT_FOLDER}`);
                    console.log(`Default folder created: ${this.ROOT_FOLDER}`);
                }
            }
        },
    },
    watch: {
        currentFolder() {
            this.loadDocuments();
        },
        isImageComparison(newVal) {
            if (newVal === true) {
                this.imageComparisonMode = true;
                this.loadDocuments();
            }
        },
    },
    mounted() {
        this.checkRootFolder().then(() => {
            this.loadDocuments();
        });
    },
};
</script>
