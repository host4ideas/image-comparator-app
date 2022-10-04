<template>
    <div v-if="isPlatform('hybrid')">
        <!-- The actual file/folder item with click event -->
        <ion-item @click="itemClicked(item)">
            <ion-icon
                :icon="item.isFile ? documentOutline : folderOutline"
                slot="start"
            />
            {{ item.name }}
        </ion-item>

        <!-- The start/end option buttons for all operations -->
        <ion-item-options side="start">
            <ion-item-option @click="deleteDocument(item)" color="danger">
                <ion-icon :icon="trashOutline" slot="icon-only" />
            </ion-item-option>
        </ion-item-options>

        <ion-item-options side="end">
            <ion-item-option @click="startCopy(item)" color="success">
                <ion-icon :icon="copyOutline" slot="icon-only" />
            </ion-item-option>
        </ion-item-options>
    </div>
    <div v-else>
        <ion-item>
            <ion-item
                @click="itemClicked(item)"
                color="light"
                style="cursor: pointer"
            >
                <ion-icon
                    :icon="item.isFile ? documentOutline : folderOutline"
                    slot="start"
                />
                {{ item.name }}
            </ion-item>
            <!-- Set My Collection folder -->
            <ion-checkbox
                v-if="item.name != ROOT_FOLDER && !item.isFile"
                :checked="isChecked"
                :disabled="isDisabled"
                @click="changeCollectionFolder(item)"
                slot="end"
            ></ion-checkbox>
            <ion-label slot="end">Collection Folder</ion-label>
            <!-- Delete -->
            <ion-button slot="end" color="light" @click="deleteDocument(item)">
                <ion-icon
                    :icon="trashOutline"
                    color="danger"
                    slot="icon-only"
                />
            </ion-button>
            <!-- Copy -->
            <ion-button slot="end" color="light" @click="startCopy(item)">
                <ion-icon
                    :icon="copyOutline"
                    color="success"
                    slot="icon-only"
                />
            </ion-button>
        </ion-item>
    </div>
</template>

<script>
import {
    IonIcon,
    IonButton,
    isPlatform,
    IonItemOption,
    IonItemOptions,
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
import { Preferences } from "@capacitor/preferences";

export default {
    props: [
        "item",
        "collectionFolder",
        "changeCollectionFolder",
        "itemClicked",
        "deleteDocument",
        "startCopy",
    ],
    components: {
        IonIcon,
        IonButton,
        IonItemOption,
        IonItemOptions,
        IonCheckbox,
        IonItem,
        IonLabel,
    },
    data() {
        return {
            // Variables
            ROOT_FOLDER: "my-photo-collections",
            isChecked: false,
            isDisabled: true,
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
    watch: {
        collectionFolder(newCheckedItem) {
            if (newCheckedItem === this.item.name) {
                this.isDisabled = true;
                setTimeout(() => {
                    this.isChecked = true;
                }, 10);
            } else {
                this.isDisabled = false;
                setTimeout(() => {
                    this.isChecked = false;
                }, 10);
            }
        },
    },
    mounted() {
        Preferences.get({
            key: this.USER_PREFERENCES,
        }).then((settingsList) => {
            const settingsParsed = JSON.parse(settingsList.value);
            if (settingsParsed.myCollectionFolder.name === this.item.name) {
                this.isDisabled = true;
                this.isChecked = true;
            } else {
                this.isDisabled = false;
            }
        });
    },
};
</script>
