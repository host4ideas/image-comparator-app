<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>My Collection</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">My Collection</ion-title>
                </ion-toolbar>
            </ion-header>
            <ion-grid>
                <ion-row>
                    <ion-col size="6" :key="photo" v-for="photo in photos">
                        <ion-img
                            :src="photo.webviewPath"
                            @click="showActionSheet(photo)"
                        ></ion-img>
                    </ion-col>
                </ion-row>
            </ion-grid>

            <ion-fab vertical="bottom" horizontal="center" slot="fixed">
                <ion-fab-button v-if="settingsExist" @click="takePhoto()">
                    <ion-icon :icon="camera"></ion-icon>
                </ion-fab-button>
            </ion-fab>
        </ion-content>
    </ion-page>
</template>

<script>
import { camera, trash, close } from "ionicons/icons";
import {
    actionSheetController,
    IonPage,
    IonHeader,
    IonFab,
    IonFabButton,
    IonIcon,
    IonToolbar,
    IonTitle,
    IonContent,
    IonImg,
    IonGrid,
    IonRow,
    IonCol,
    alertController,
} from "@ionic/vue";
import { usePhotoGallery } from "@/composables/usePhotoGallery";
import { defineComponent } from "vue";
import { Preferences } from "@capacitor/preferences";

export default defineComponent({
    name: "Tab2",
    components: {
        IonHeader,
        IonFab,
        IonIcon,
        IonFabButton,
        IonToolbar,
        IonTitle,
        IonContent,
        IonPage,
        IonGrid,
        IonRow,
        IonCol,
        IonImg,
    },
    mounted() {
        this.checkCollectionFolder();
    },
    setup() {
        let settingsExist = false;
        let openCV;
        const { photos, takePhoto, deletePhoto } = usePhotoGallery();

        const checkCollectionFolder = async () => {
            // Check if there is a user selected My Collection folder to display
            const settingsList = await Preferences.get({
                key: "settings",
            });

            const settings = JSON.parse(settingsList.value);

            if (settings.myCollectionFolder == null) {
                const alert = await alertController.create({
                    header: "No Collection Folder selected.",
                    message: "Please, check a collection folder to use.",
                    buttons: [
                        {
                            text: "OK",
                            role: "cancel",
                        },
                    ],
                });

                await alert.present();
            } else {
                settingsExist = true;
            }
        };

        const showActionSheet = async (photo) => {
            const actionSheet = await actionSheetController.create({
                header: "Photos",
                buttons: [
                    {
                        text: "Delete",
                        role: "destructive",
                        icon: trash,
                        handler: () => {
                            deletePhoto(photo);
                        },
                    },
                    {
                        text: "Cancel",
                        icon: close,
                        role: "cancel",
                        handler: () => {
                            // Nothing to do, action sheet is automatically closed
                        },
                    },
                ],
            });
            await actionSheet.present();
        };

        return {
            photos,
            takePhoto,
            showActionSheet,
            camera,
            trash,
            close,
            openCV,
            checkCollectionFolder,
            settingsExist,
        };
    },
});
</script>
