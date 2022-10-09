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
                    <ion-title size="large">My Collections</ion-title>
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
                <ion-fab-button @click="handlePhoto()">
                    <ion-icon :icon="camera"></ion-icon>
                </ion-fab-button>
            </ion-fab>
        </ion-content>
    </ion-page>
</template>

<script>
import { camera, trash, close, folder } from "ionicons/icons";
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
} from "@ionic/vue";
import { usePhotoGallery } from "@/composables/usePhotoGallery";
import { defineComponent, watchEffect } from "vue";
import router from "@/router/index";

export default defineComponent({
    name: "Tab2",
    props: ["foldersToCompare"],
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
    // watch: {
    //     foldersToCompare(newVal) {
    //         if (newVal) {
    //             const folders = JSON.parse(newVal);
    //             console.log(folders);
    //             console.log(this.imgToCompare);
    //             // const results = await compareImages(imgToCompare, folders);
    //             // console.log(results);
    //         }
    //     },
    // },
    setup(props) {
        const { photos, takePhoto, deletePhoto, compareImages } =
            usePhotoGallery();

        let imgToCompare = null;

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

        const handlePhoto = async () => {
            imgToCompare = await takePhoto();
            console.log(imgToCompare);
            if (imgToCompare) {
                router.push("/tabs/tab3?imageComparison=true");
            }
        };

        watchEffect(() => {
            if (props.foldersToCompare && imgToCompare) {
                const folders = JSON.parse(props.foldersToCompare);
                compareImages(imgToCompare, folders).then((results) => {
                    console.log(results);
                });
            }
        });

        return {
            showActionSheet,
            handlePhoto,
            imgToCompare,
            photos,
            camera,
            trash,
            close,
        };
    },
});
</script>
