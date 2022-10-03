<template>
    <ion-list v-if="isPlatform('hybrid')">
        <ion-item-sliding v-for="(f, index) in folderContent" :key="index">
            <!-- The actual file/folder item with click event -->
            <ion-item @click="itemClicked(f)">
                <ion-icon
                    :icon="f.isFile ? documentOutline : folderOutline"
                    slot="start"
                />
                {{ f.name }}
            </ion-item>

            <!-- The start/end option buttons for all operations -->
            <ion-item-options side="start">
                <ion-item-option @click="deleteDocument(f)" color="danger">
                    <ion-icon :icon="trashOutline" slot="icon-only" />
                </ion-item-option>
            </ion-item-options>

            <ion-item-options side="end">
                <ion-item-option @click="startCopy(f)" color="success">
                    <ion-icon :icon="copyOutline" slot="icon-only" />
                </ion-item-option>
            </ion-item-options>
        </ion-item-sliding>
    </ion-list>
    <ion-list v-else>
        <ion-item-sliding v-for="(f, index) in folderContent" :key="index">
            <!-- The actual file/folder item with click event -->
            <ion-item>
                <ion-item
                    @click="itemClicked(f)"
                    color="light"
                    style="cursor: pointer"
                >
                    <ion-icon
                        :icon="f.isFile ? documentOutline : folderOutline"
                        slot="start"
                    />
                    {{ f.name }}
                </ion-item>
                <!-- Set My Collection folder -->
                <ion-toggle
                    v-if="f.name != ROOT_FOLDER && !f.isFile"
                    :checked="myCollectionFolder.name == f.name"
                    @click="changeCollectionFolder(f)"
                    slot="end"
                ></ion-toggle>
                <!-- Delete -->
                <ion-button slot="end" color="light" @click="deleteDocument(f)">
                    <ion-icon
                        :icon="trashOutline"
                        color="danger"
                        slot="icon-only"
                    />
                </ion-button>
                <!-- Copy -->
                <ion-button slot="end" color="light" @click="startCopy(f)">
                    <ion-icon
                        :icon="copyOutline"
                        color="success"
                        slot="icon-only"
                    />
                </ion-button>
            </ion-item>
        </ion-item-sliding>
    </ion-list>
</template>

<script>
import {
    IonIcon,
    IonButton,
    isPlatform,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonList,
    IonToggle,
} from "@ionic/vue";
import {
    trashOutline,
    documentOutline,
    folderOutline,
    copyOutline,
} from "ionicons/icons";
import { Preferences } from "@capacitor/preferences";

export default {
    props: ["folderContent", "itemClicked", "deleteDocument", "startCopy"],
    components: {
        IonIcon,
        IonButton,
        IonItem,
        IonItemOption,
        IonItemOptions,
        IonItemSliding,
        IonList,
        IonToggle,
    },
    data() {
        return {
            // Variables
            ROOT_FOLDER: "my-photo-collections",
            myCollectionFolder: {},
            // Icons
            trashOutline,
            documentOutline,
            folderOutline,
            copyOutline,
            isPlatform,
            USER_PREFERENCES: "settings",
        };
    },
    methods: {
        async changeCollectionFolder(entry) {
            const settingsList = await Preferences.get({
                key: this.USER_PREFERENCES,
            });

            await Preferences.set({
                key: this.USER_PREFERENCES,
                value: JSON.stringify({
                    ...{ myCollectionFolder: entry },
                }),
            });
            Preferences.get({
                key: this.USER_PREFERENCES,
            }).then((settingsList) => {
                console.log(settingsList);
            });
            this.collectionFolder = entry;
        },
        mounted() {
            Preferences.get({
                key: this.USER_PREFERENCES,
            }).then((settingsList) => {
                const settings = JSON.parse(settingsList);
                console.log(settings);
                this.collectionFolder = settings.myCollectionFolder;
            });
        },
    },
};
</script>
