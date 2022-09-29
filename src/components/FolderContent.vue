<template>
    <ion-list>
        <ion-item-sliding v-for="(f, index) in folderContent" :key="index">
            <!-- The actual file/folder item with click event -->
            <ion-item @click="itemClicked(f)">
                <ion-icon
                    :icon="f.isFile ? documentOutline : folderOutline"
                    slot="start"
                ></ion-icon>
                {{ f.name }}
            </ion-item>

            <!-- The start/end option buttons for all operations -->
            <ion-item-options side="start">
                <ion-item-option @click="deleteDocument(f)" color="danger">
                    <ion-icon :icon="trashOutline" slot="icon-only"></ion-icon>
                </ion-item-option>
            </ion-item-options>

            <ion-item-options side="end">
                <ion-item-option @click="startCopy(f)" color="success">
                    <ion-icon :icon="copyOutline" slot="icon-only"></ion-icon>
                </ion-item-option>
            </ion-item-options>
        </ion-item-sliding>
    </ion-list>
    <ion-list>
        <ion-item-sliding v-for="(f, index) in folderContent" :key="index">
            <!-- The actual file/folder item with click event -->
            <ion-item @click="itemClicked(f)">
                <ion-icon
                    :icon="f.isFile ? documentOutline : folderOutline"
                    slot="start"
                ></ion-icon>
                {{ f.name }}
                <ion-button slot="end" color="light" @click="deleteDocument(f)"
                    ><ion-icon :icon="trashOutline" color="danger" slot="icon-only"></ion-icon
                ></ion-button>
                <ion-button slot="end" color="light" @click="startCopy(f)"
                    ><ion-icon :icon="copyOutline" color="success" slot="icon-only"></ion-icon
                ></ion-button>
            </ion-item>
        </ion-item-sliding>
    </ion-list>
</template>

<script>
import { IonIcon, IonButton } from "@ionic/vue";
import {
    trashOutline,
    documentOutline,
    folderOutline,
    copyOutline,
} from "ionicons/icons";

export default {
    props: {
        folderContent: [],
        itemClicked: Function,
        deleteDocument: Function,
        startCopy: Function,
    },
    components: {
        IonIcon,
        IonButton,
    },
    data() {
        return {
            // Icons
            trashOutline,
            documentOutline,
            folderOutline,
            copyOutline,
        };
    },
};
</script>
