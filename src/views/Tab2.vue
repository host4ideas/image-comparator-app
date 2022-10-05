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
                {{ settingsExist }}
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
import { defineComponent, onMounted } from "vue";
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
    setup() {
        let openCV;
        let settingsExist = false;
        const { photos, takePhoto, deletePhoto } = usePhotoGallery();

        onMounted(() => {
            // Check if there is a user selected My Collection folder to display
            Preferences.get({
                key: "settings",
            }).then((settingsList) => {
                const settings = JSON.parse(settingsList.value);

                if (settings.myCollectionFolder == null) {
                    alertController
                        .create({
                            header: "No Collection Folder selected.",
                            message:
                                "Please, check a collection folder to use.",
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
                    console.log("Test");
                    console.log(settingsExist);
                    settingsExist = true;
                    console.log(settingsExist);
                }
            });
        });

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
            settingsExist,
        };
    },
});
</script>
