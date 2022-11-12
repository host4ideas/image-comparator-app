<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Collections Explorer</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">Collections Explorer</ion-title>
                </ion-toolbar>
            </ion-header>
            <!-- Main content -->
            <FileExplorer
                :currentFolder="props.folder"
                :isImageComparison="props.isImageComparison"
            />
        </ion-content>
    </ion-page>
</template>

<script setup>
import { defineProps } from "vue";
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
} from "@ionic/vue";
import FileExplorer from "@/components/FileExplorer.vue";

const props = defineProps({
    folder: String,
    isImageComparison: Boolean,
});
</script>
