<template>
    <ion-page>
        <ion-content>
            <ion-tabs>
                <ion-router-outlet></ion-router-outlet>
                <ion-tab-bar id="tabControl">
                    <!-- <ion-tab-button tab="tab1" href="/tabs/tab1">
                        <ion-icon :icon="triangle"></ion-icon>
                        <ion-label>Tab 1</ion-label>
                    </ion-tab-button> -->

                    <ion-tab-button tab="tab2" href="/tabs/tab2">
                        <ion-icon :icon="images" />
                        <ion-label>My Collection</ion-label>
                    </ion-tab-button>

                    <ion-tab-button tab="tab3" href="/tabs/tab3">
                        <ion-icon :icon="fileTray" />
                        <ion-label>Collections Explorer</ion-label>
                    </ion-tab-button>
                </ion-tab-bar>
            </ion-tabs>
        </ion-content>
    </ion-page>
</template>

<script setup>
import {
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonContent,
    IonLabel,
    IonIcon,
    IonPage,
    IonRouterOutlet,
} from "@ionic/vue";
import { images, fileTray } from "ionicons/icons";
import { Preferences } from "@capacitor/preferences";
import { onMounted } from "vue";

const USER_PREFERENCES = "settings";
let settingsExist = false;

const createSettings = async () => {
    await Preferences.set({
        key: USER_PREFERENCES,
        value: JSON.stringify({
            myCollectionFolder: null,
            showCanvasResult: false,
        }),
    });
};
onMounted(() => {
    // Check if settings exist
    Preferences.get({
        key: USER_PREFERENCES,
    })
        .then((settingsList) => {
            const settings = JSON.parse(settingsList.value);

            if (settings == null) {
                createSettings().then(() => {
                    settingsExist = true;
                });
            } else {
                settingsExist = true;
            }
        })
        .catch((error) => {
            if (
                error.message ===
                "Cannot read properties of undefined (reading 'get')"
            ) {
                createSettings();
            } else {
                console.log(error);
            }
        });
});
</script>
