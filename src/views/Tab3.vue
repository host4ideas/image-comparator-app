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
            <FileExplorer :currentFolder="folder" />
        </ion-content>
    </ion-page>
</template>

<script>
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
} from "@ionic/vue";
import FileExplorer from "@/components/FileExplorer.vue";

export default {
    name: "Tab3",
    components: {
        FileExplorer,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonPage,
    },
    props: {
        folder: String,
    },
};
</script>
