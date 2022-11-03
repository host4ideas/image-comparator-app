<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title> My Collection </ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content v-if="showSlides" :fullscreen="true">
            <ImageCompareSlides
                :takenImage="imgToCompare"
                :canvasResults="canvasResults"
                :possibleDuplicatedImages="possibleDuplicatedImages"
            />
        </ion-content>

        <ion-content v-else :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">My Collections </ion-title>
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

            <ion-fab
                id="cameraBtn"
                vertical="bottom"
                horizontal="center"
                slot="fixed"
            >
                <ion-fab-button @click="handlePhoto()">
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
} from "@ionic/vue";
import { usePhotoGallery } from "@/composables/usePhotoGallery";
import { defineComponent, watchEffect, ref } from "vue";
import ImageCompareSlides from "@/components/ImageCompareSlides.vue";
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
        ImageCompareSlides,
    },
    setup(props) {
        const { photos, takePhoto, deletePhoto, compareImages } =
            usePhotoGallery();
        const canvasResults = ref();
        const possibleDuplicatedImages = ref();
        const showSlides = ref(false);
        const imgToCompare = ref();

        async function showActionSheet(photo) {
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
        }

        const handlePhoto = async () => {
            imgToCompare.value = await takePhoto();
            if (imgToCompare.value) {
                await router.push("/tabs/tab3?imageComparison=true");
            }
        };

        watchEffect(() => {
            if (props.foldersToCompare && imgToCompare.value) {
                const folders = JSON.parse(props.foldersToCompare);
                compareImages(imgToCompare.value, folders).then((results) => {
                    // Show slides
                    canvasResults.value = results.canvasResults;
                    possibleDuplicatedImages.value =
                        results.possibleDuplicatedImages;
                    showSlides.value = true;

                    // Hide the tabs buttons and camera shutter button
                    document.getElementById("tabControl").style.display =
                        "none";
                    document.getElementById("cameraBtn").style.display = "none";
                });
                router.replace("/tabs/tab2");
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
            showSlides,
            canvasResults,
            possibleDuplicatedImages,
        };
    },
});
</script>
