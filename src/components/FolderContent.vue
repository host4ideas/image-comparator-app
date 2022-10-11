<template>
    <ion-list>
        <ion-item-sliding v-for="(f, index) in folderContent" :key="index">
            <FolderItem
                v-if="!imageComparisonMode"
                :item="f"
                :collectionFolder="collectionFolder"
                :changeCollectionFolder="this.changeCollectionFolder"
                :itemClicked="this.itemClicked"
                :deleteDocument="this.deleteDocument"
                :startCopy="startCopy"
            />
            <FolderItemImageComparison
                v-else
                :item="f"
                :itemClicked="this.itemClicked"
                :addToCompare="addToCompare"
                @response="(msg) => foldersToCompare"
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
import FolderItemImageComparison from "./FolderItemImageComparison.vue";

export default {
    props: [
        "folderContent",
        "itemClicked",
        "deleteDocument",
        "startCopy",
        "addToCompare",
        "imageComparisonMode",
    ],
    components: {
        IonItemSliding,
        IonList,
        FolderItem,
        FolderItemImageComparison,
    },
    data() {
        return {
            // Variables
            ROOT_FOLDER: "my-photo-collections",
            collectionFolder: "",
            foldersToCompare: null,
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
                    ...{
                        myCollectionFolder: {
                            name: entry.name,
                            path: this.$route.fullPath + "/" + entry.name,
                        },
                    },
                }),
            }).then(() => {
                Preferences.get({
                    key: this.USER_PREFERENCES,
                }).then((settingsList) => {
                    const settingsParsed = JSON.parse(settingsList.value);
                    this.collectionFolder = settingsParsed.myCollectionFolder;
                });
            });
        },
    },
};
</script>
