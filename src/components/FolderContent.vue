<template>
    <ion-list>
        <ion-item-sliding v-for="(f, index) in folderContent" :key="index">
            <FolderItem
                :item="f"
                :collectionFolder="collectionFolder"
                :changeCollectionFolder="this.changeCollectionFolder"
                :itemClicked="this.itemClicked"
                :deleteDocument="this.deleteDocument"
                :startCopy="startCopy"
            />
        </ion-item-sliding>
    </ion-list>
</template>

<script>
import { isPlatform, IonItemSliding, IonList } from "@ionic/vue";
import {
    trashOutline,
    documentOutline,
    folderOutline,
    copyOutline,
} from "ionicons/icons";
import { Preferences } from "@capacitor/preferences";
import FolderItem from "./FolderItem.vue";

export default {
    props: ["folderContent", "itemClicked", "deleteDocument", "startCopy"],
    components: {
        IonItemSliding,
        IonList,
        FolderItem,
    },
    data() {
        return {
            // Variables
            ROOT_FOLDER: "my-photo-collections",
            collectionFolder: "",
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
    methods: {
        changeCollectionFolder(entry) {
            Preferences.set({
                key: this.USER_PREFERENCES,
                value: JSON.stringify({
                    ...{ myCollectionFolder: entry },
                }),
            }).then(() => {
                Preferences.get({
                    key: this.USER_PREFERENCES,
                }).then((settingsList) => {
                    const settingsParsed = JSON.parse(settingsList.value);
                    this.collectionFolder =
                        settingsParsed.myCollectionFolder.name;
                });
            });
        },
    },
};
</script>
