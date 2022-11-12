<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title> My Collection </ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content
            v-if="data.showSlides && data.canvasResults"
            :fullscreen="true"
        >
            <ImageCompareSlides
                :takenImage="data.imgToCompare"
                :canvasResults="data.canvasResults"
                :possibleDuplicatedImages="data.possibleDuplicatedImages"
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

<script setup>
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
import { defineProps, reactive, watchEffect } from "vue";
import { useRouter } from "vue-router";
import ImageCompareSlides from "@/components/ImageCompareSlides.vue";

const router = useRouter();

const props = defineProps(["foldersToCompare"]);

const { photos, takePhoto, deletePhoto, compareImages } = usePhotoGallery();

const data = reactive({
    canvasResults: null,
    possibleDuplicatedImages: null,
    showSlides: false,
    imgToCompare: null,
});

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
    data.imgToCompare = await takePhoto();
    if (data.imgToCompare) {
        await router.push("/tabs/tab3?imageComparison=true");
    }
};

watchEffect(() => {
    if (props.foldersToCompare && data.imgToCompare) {
        const folders = JSON.parse(props.foldersToCompare);
        compareImages(data.imgToCompare, folders).then((results) => {
            // Show slides
            data.canvasResults = results.canvasResults;
            data.possibleDuplicatedImages = results.possibleDuplicatedImages;
            data.showSlides = true;

            // Hide the tabs buttons and camera shutter button
            document.getElementById("tabControl").style.display = "none";
            document.getElementById("cameraBtn").style.display = "none";
        });
        router.replace("/tabs/tab2");
    }
});
</script>
