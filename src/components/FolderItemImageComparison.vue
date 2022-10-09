<template>
    <!-- The actual file/folder item with click event -->
    <ion-item>
        <ion-item @click="itemClicked(item)" style="cursor: pointer">
            <ion-icon
                :icon="item.isFile ? documentOutline : folderOutline"
                slot="start"
            />
            {{ item.name }}
            <!-- Set My Collection folder -->
        </ion-item>
        <ion-item lines="none" slot="end" style="cursor: pointer">
            <ion-checkbox
                v-if="item.name != ROOT_FOLDER && !item.isFile"
                :checked="isChecked"
                :disabled="isDisabled"
                @click="addToCompare(item)"
            ></ion-checkbox>
            <ion-label
                v-if="item.name != ROOT_FOLDER && !item.isFile"
                slot="end"
            >
                Compare With
            </ion-label>
        </ion-item>
    </ion-item>
</template>

<script>
import {
    IonIcon,
    isPlatform,
    IonCheckbox,
    IonItem,
    IonLabel,
} from "@ionic/vue";
import {
    trashOutline,
    documentOutline,
    folderOutline,
    copyOutline,
} from "ionicons/icons";

export default {
    props: [
        "item",
        "collectionFolder",
        "changeCollectionFolder",
        "itemClicked",
        "deleteDocument",
        "startCopy",
        "addToCompare",
    ],
    components: {
        IonIcon,
        IonCheckbox,
        IonItem,
        IonLabel,
    },
    data() {
        return {
            // Variables
            ROOT_FOLDER: "my-photo-collections",
            isChecked: false,
            isDisabled: false,
            // Ionic
            isPlatform,
            // Icons
            trashOutline,
            documentOutline,
            folderOutline,
            copyOutline,
            USER_PREFERENCES: "settings",
        };
    },
};
</script>
